//! `CredentialStore` port (spec 022 T009, contracts/credential-store.md).

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum CredentialError {
    #[error("credential not found")]
    NotFound,
    /// Backend unreachable/locked. Callers MUST treat this as deny
    /// (fail-closed) — never fall back to cached or default credentials.
    #[error("credential backend unavailable")]
    Unavailable,
}

pub trait CredentialStore: Send + Sync {
    fn store(&self, credential_ref: &str, secret: &str) -> Result<(), CredentialError>;
    fn resolve(&self, credential_ref: &str) -> Result<String, CredentialError>;
    fn revoke(&self, credential_ref: &str) -> Result<(), CredentialError>;
}
