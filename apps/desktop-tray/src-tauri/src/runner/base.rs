//! `ScriptRunner` port (spec 022 T011, contracts/script-runner.md).

use crate::scriptlib::Script;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RunContext {
    pub source_connection_id: String,
    /// Opaque keychain handle resolved by the runner at execution time.
    pub credential_ref: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RunOutcome {
    pub documents_fetched: u32,
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum RunError {
    /// Portal presented a CAPTCHA — requires human intervention, not retry.
    #[error("captcha challenge encountered")]
    Captcha,
    /// Transient connectivity failure — eligible for scheduled retry.
    #[error("network outage")]
    NetworkOutage,
    #[error("script failed: {0}")]
    ScriptFailure(String),
}

pub trait ScriptRunner: Send + Sync {
    fn run(&self, script: &Script, ctx: &RunContext) -> Result<RunOutcome, RunError>;
}
