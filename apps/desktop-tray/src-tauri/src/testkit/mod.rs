//! In-memory fakes for the four ports (spec 022 T009–T012).
//!
//! Compiled only with `--features testkit` (or in unit tests) — never in
//! release builds. Each fake is fully functional and carries an injection
//! knob so tests can force the failure modes named in the contracts.

use std::collections::HashMap;
use std::sync::Mutex;

use crate::credentials::{CredentialError, CredentialStore};
use crate::runner::{RunContext, RunError, RunOutcome, ScriptRunner};
use crate::scriptlib::{Script, ScriptLibError, ScriptLibrary, ScriptRef};
use crate::update::{UpdateError, UpdateInfo, Updater};

/* ------------------------------ credentials ------------------------------ */

#[derive(Debug, Default)]
pub struct FakeCredentialStore {
    secrets: Mutex<HashMap<String, String>>,
    /// When set, every operation fails with this error (fail-closed check).
    pub fail_mode: Mutex<Option<CredentialError>>,
}

impl FakeCredentialStore {
    fn check_fail(&self) -> Result<(), CredentialError> {
        match self.fail_mode.lock().expect("fail_mode lock").clone() {
            Some(err) => Err(err),
            None => Ok(()),
        }
    }
}

impl CredentialStore for FakeCredentialStore {
    fn store(&self, credential_ref: &str, secret: &str) -> Result<(), CredentialError> {
        self.check_fail()?;
        self.secrets
            .lock()
            .expect("secrets lock")
            .insert(credential_ref.to_string(), secret.to_string());
        Ok(())
    }

    fn resolve(&self, credential_ref: &str) -> Result<String, CredentialError> {
        self.check_fail()?;
        self.secrets
            .lock()
            .expect("secrets lock")
            .get(credential_ref)
            .cloned()
            .ok_or(CredentialError::NotFound)
    }

    fn revoke(&self, credential_ref: &str) -> Result<(), CredentialError> {
        self.check_fail()?;
        self.secrets
            .lock()
            .expect("secrets lock")
            .remove(credential_ref)
            .map(|_| ())
            .ok_or(CredentialError::NotFound)
    }
}

/* ------------------------------- scriptlib ------------------------------- */

#[derive(Default)]
pub struct FakeScriptLibrary {
    scripts: Mutex<HashMap<String, Script>>,
    /// Serve an older/staler version than published.
    pub inject_stale: Mutex<bool>,
    /// Serve content whose hash does not match the expectation.
    pub inject_hash_mismatch: Mutex<bool>,
}

impl ScriptLibrary for FakeScriptLibrary {
    fn publish(&self, script: Script) -> Result<ScriptRef, ScriptLibError> {
        let script_ref = ScriptRef {
            id: script.id.clone(),
            version: script.version.clone(),
        };
        self.scripts
            .lock()
            .expect("scripts lock")
            .insert(script.id.clone(), script);
        Ok(script_ref)
    }

    fn fetch(&self, id: &str, expected_hash: &str) -> Result<Script, ScriptLibError> {
        if *self.inject_stale.lock().expect("stale lock") {
            return Err(ScriptLibError::Stale);
        }

        let script = self
            .scripts
            .lock()
            .expect("scripts lock")
            .get(id)
            .cloned()
            .ok_or(ScriptLibError::NotFound)?;

        let mismatch_injected = *self.inject_hash_mismatch.lock().expect("mismatch lock");
        if mismatch_injected || script.integrity_hash != expected_hash {
            return Err(ScriptLibError::IntegrityMismatch);
        }

        Ok(script)
    }
}

/* --------------------------------- runner -------------------------------- */

#[derive(Default)]
pub struct FakeScriptRunner {
    /// FIFO of scripted outcomes; empty queue = success with 0 documents.
    pub outcomes: Mutex<Vec<Result<RunOutcome, RunError>>>,
}

impl ScriptRunner for FakeScriptRunner {
    fn run(&self, _script: &Script, _ctx: &RunContext) -> Result<RunOutcome, RunError> {
        let mut queue = self.outcomes.lock().expect("outcomes lock");
        if queue.is_empty() {
            Ok(RunOutcome {
                documents_fetched: 0,
            })
        } else {
            queue.remove(0)
        }
    }
}

/* -------------------------------- updater -------------------------------- */

#[derive(Default)]
pub struct FakeUpdater {
    pub available: Mutex<Option<UpdateInfo>>,
    pub fail_download: Mutex<bool>,
    pub crash_on_startup: Mutex<bool>,
    pub applied: Mutex<Option<String>>,
}

impl Updater for FakeUpdater {
    fn check(&self) -> Result<Option<UpdateInfo>, UpdateError> {
        Ok(self.available.lock().expect("available lock").clone())
    }

    fn download(&self, _info: &UpdateInfo) -> Result<(), UpdateError> {
        if *self.fail_download.lock().expect("fail_download lock") {
            return Err(UpdateError::DownloadFailed);
        }
        Ok(())
    }

    fn apply(&self) -> Result<(), UpdateError> {
        if *self.crash_on_startup.lock().expect("crash lock") {
            // Roll back: previous version stays applied.
            return Err(UpdateError::CrashOnStartup);
        }
        let version = self.available.lock().expect("available lock").clone();
        *self.applied.lock().expect("applied lock") = version.map(|info| info.version);
        Ok(())
    }
}

/* ---------------------------------- tests --------------------------------- */

#[cfg(test)]
mod tests {
    use super::*;

    fn script() -> Script {
        Script {
            id: "s-1".into(),
            name: "demo-bank-pull".into(),
            version: "1.0.0".into(),
            integrity_hash: "hash-1".into(),
            body: "// rpa".into(),
        }
    }

    #[test]
    fn credential_store_roundtrip_and_fail_closed() {
        let store = FakeCredentialStore::default();
        store.store("ref-1", "s3cret").unwrap();
        assert_eq!(store.resolve("ref-1").unwrap(), "s3cret");

        // Backend outage: resolve must deny even though the secret exists.
        *store.fail_mode.lock().unwrap() = Some(CredentialError::Unavailable);
        assert_eq!(store.resolve("ref-1"), Err(CredentialError::Unavailable));

        // Revoked credentials stay revoked (fail-closed after revoke).
        *store.fail_mode.lock().unwrap() = None;
        store.revoke("ref-1").unwrap();
        assert_eq!(store.resolve("ref-1"), Err(CredentialError::NotFound));
    }

    #[test]
    fn script_library_verifies_integrity_and_staleness() {
        let lib = FakeScriptLibrary::default();
        lib.publish(script()).unwrap();

        assert!(lib.fetch("s-1", "hash-1").is_ok());
        assert_eq!(
            lib.fetch("s-1", "other-hash"),
            Err(ScriptLibError::IntegrityMismatch)
        );

        *lib.inject_hash_mismatch.lock().unwrap() = true;
        assert_eq!(
            lib.fetch("s-1", "hash-1"),
            Err(ScriptLibError::IntegrityMismatch)
        );

        *lib.inject_hash_mismatch.lock().unwrap() = false;
        *lib.inject_stale.lock().unwrap() = true;
        assert_eq!(lib.fetch("s-1", "hash-1"), Err(ScriptLibError::Stale));
    }

    #[test]
    fn runner_replays_scripted_outcomes() {
        let runner = FakeScriptRunner::default();
        *runner.outcomes.lock().unwrap() = vec![
            Err(RunError::Captcha),
            Err(RunError::NetworkOutage),
            Ok(RunOutcome {
                documents_fetched: 12,
            }),
        ];

        let ctx = RunContext {
            source_connection_id: "sc-1".into(),
            credential_ref: "ref-1".into(),
        };
        assert_eq!(runner.run(&script(), &ctx), Err(RunError::Captcha));
        assert_eq!(runner.run(&script(), &ctx), Err(RunError::NetworkOutage));
        assert_eq!(runner.run(&script(), &ctx).unwrap().documents_fetched, 12);
    }

    #[test]
    fn updater_injects_download_fail_and_crash_rollback() {
        let updater = FakeUpdater::default();
        let info = UpdateInfo {
            version: "0.2.0".into(),
            notes: String::new(),
        };
        *updater.available.lock().unwrap() = Some(info.clone());

        *updater.fail_download.lock().unwrap() = true;
        assert_eq!(updater.download(&info), Err(UpdateError::DownloadFailed));

        *updater.fail_download.lock().unwrap() = false;
        updater.download(&info).unwrap();

        *updater.crash_on_startup.lock().unwrap() = true;
        assert_eq!(updater.apply(), Err(UpdateError::CrashOnStartup));
        assert_eq!(
            *updater.applied.lock().unwrap(),
            None,
            "rollback keeps previous version"
        );

        *updater.crash_on_startup.lock().unwrap() = false;
        updater.apply().unwrap();
        assert_eq!(updater.applied.lock().unwrap().as_deref(), Some("0.2.0"));
    }
}
