//! Step definitions shared by all feature files.

use cucumber::{given, then, when, World};
use fluxbooks_lib::credentials::{CredentialError, CredentialStore};
use fluxbooks_lib::testkit::FakeCredentialStore;

#[derive(Debug, Default, World)]
pub struct TrayWorld {
    #[world(skip)]
    pub credentials: FakeCredentialStore,
    pub last_resolve: Option<Result<String, CredentialError>>,
}

#[allow(clippy::needless_pass_by_value)]
#[given(expr = "a stored credential {string}")]
fn stored_credential(world: &mut TrayWorld, credential_ref: String) {
    world
        .credentials
        .store(&credential_ref, "s3cret")
        .expect("store succeeds");
}

#[given("the credential backend is unavailable")]
fn backend_unavailable(world: &mut TrayWorld) {
    *world.credentials.fail_mode.lock().unwrap() = Some(CredentialError::Unavailable);
}
#[allow(clippy::needless_pass_by_value)]
#[given(expr = "credential {string} is revoked")]
fn credential_revoked(world: &mut TrayWorld, credential_ref: String) {
    world
        .credentials
        .revoke(&credential_ref)
        .expect("revoke succeeds");
}

#[allow(clippy::needless_pass_by_value)]
#[when(expr = "a pull run resolves credential {string}")]
fn resolve_credential(world: &mut TrayWorld, credential_ref: String) {
    world.last_resolve = Some(world.credentials.resolve(&credential_ref));
}

#[then("access is denied")]
fn access_denied(world: &mut TrayWorld) {
    let result = world.last_resolve.as_ref().expect("a resolve happened");
    assert!(result.is_err(), "expected deny, got {result:?}");
}
