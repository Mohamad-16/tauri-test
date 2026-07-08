//! Append-only audit log and the secret-redaction layer (spec 022 T008).
//!
//! [`AuditLog::append`] is the ONLY write path into `log_entry` (which is
//! itself append-only via sqlite triggers), and every string passes the
//! [`Redactor`] first — so no credential material can reach the log surface
//! (FR-008, SC-005).

mod redactor;

pub use redactor::{Redactor, REDACTED};

use crate::store::{Store, StoreError};

pub struct AuditLog<'a> {
    store: &'a Store,
    redactor: Redactor,
}

impl<'a> AuditLog<'a> {
    pub fn new(store: &'a Store) -> Self {
        Self {
            store,
            redactor: Redactor::standard(),
        }
    }

    /// Appends a redacted entry. There is deliberately no update/delete API.
    pub fn append(
        &self,
        ts: &str,
        level: &str,
        category: &str,
        message: &str,
        context_json: Option<&str>,
    ) -> Result<(), StoreError> {
        let clean_message = self.redactor.redact(message);
        let clean_context = context_json.map(|ctx| self.redactor.redact(ctx));

        self.store.insert_log_entry(
            ts,
            level,
            category,
            &clean_message,
            clean_context.as_deref(),
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn append_redacts_before_persisting() {
        let store = Store::open_in_memory().unwrap();
        let audit = AuditLog::new(&store);

        audit
            .append(
                "2026-07-08T10:00:00Z",
                "error",
                "pull",
                "login failed with password=Hunter2!",
                Some(r#"{"token": "ghp_16C7e42F292c6912E7710c838347Ae178B4a"}"#),
            )
            .unwrap();

        let logs = store.recent_logs(10).unwrap();
        assert_eq!(logs.len(), 1);
        assert!(!logs[0].message.contains("Hunter2"));
        assert!(!logs[0]
            .context_json
            .as_deref()
            .unwrap_or_default()
            .contains("ghp_"));
        assert!(logs[0].message.contains(REDACTED));
    }
}
