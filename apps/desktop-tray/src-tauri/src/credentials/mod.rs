//! Credential storage port (`CredentialStore`): OS keychain only, fail-closed (spec 022 T009).

pub mod base;
pub mod keyring;

pub use base::{CredentialError, CredentialStore};
