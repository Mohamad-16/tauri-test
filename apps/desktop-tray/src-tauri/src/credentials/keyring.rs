//! OS-keychain implementation of the `CredentialStore` port.

use super::base::{CredentialError, CredentialStore};

const SERVICE: &str = "com.fluxbooks.tray";

/// Real keychain-backed store. Every backend error maps to `Unavailable`
/// so callers stay fail-closed.
pub struct KeyringCredentialStore;

impl KeyringCredentialStore {
    fn entry(credential_ref: &str) -> Result<keyring::Entry, CredentialError> {
        keyring::Entry::new(SERVICE, credential_ref).map_err(|_| CredentialError::Unavailable)
    }
}

impl CredentialStore for KeyringCredentialStore {
    fn store(&self, credential_ref: &str, secret: &str) -> Result<(), CredentialError> {
        Self::entry(credential_ref)?
            .set_password(secret)
            .map_err(|_| CredentialError::Unavailable)
    }

    fn resolve(&self, credential_ref: &str) -> Result<String, CredentialError> {
        Self::entry(credential_ref)?
            .get_password()
            .map_err(|err| match err {
                keyring::Error::NoEntry => CredentialError::NotFound,
                _ => CredentialError::Unavailable,
            })
    }

    fn revoke(&self, credential_ref: &str) -> Result<(), CredentialError> {
        Self::entry(credential_ref)?
            .delete_credential()
            .map_err(|err| match err {
                keyring::Error::NoEntry => CredentialError::NotFound,
                _ => CredentialError::Unavailable,
            })
    }
}
