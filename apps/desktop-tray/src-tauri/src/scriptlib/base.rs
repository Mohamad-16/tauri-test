//! `ScriptLibrary` port (spec 022 T010, contracts/script-library.md).

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ScriptRef {
    pub id: String,
    pub version: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Script {
    pub id: String,
    pub name: String,
    pub version: String,
    pub integrity_hash: String,
    pub body: String,
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum ScriptLibError {
    #[error("script not found")]
    NotFound,
    /// The library served an older version than the one published.
    #[error("stale script version served")]
    Stale,
    /// Downloaded content does not match the expected integrity hash.
    /// Callers MUST discard the script.
    #[error("integrity hash mismatch")]
    IntegrityMismatch,
    #[error("library unavailable")]
    Unavailable,
}

pub trait ScriptLibrary: Send + Sync {
    fn publish(&self, script: Script) -> Result<ScriptRef, ScriptLibError>;
    /// Fetch a script, verifying it against `expected_hash`.
    fn fetch(&self, id: &str, expected_hash: &str) -> Result<Script, ScriptLibError>;
}
