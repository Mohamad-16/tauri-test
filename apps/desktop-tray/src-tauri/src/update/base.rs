//! `Updater` port (spec 022 T012, contracts/updater.md).

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UpdateInfo {
    pub version: String,
    pub notes: String,
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum UpdateError {
    #[error("update download failed")]
    DownloadFailed,
    /// The applied update crashed on startup — triggers rollback to the
    /// previous version (SC-001/SC-002).
    #[error("updated app crashed on startup")]
    CrashOnStartup,
    /// Updater endpoints/signing keys not provisioned yet.
    #[error("updater not configured")]
    NotConfigured,
}

pub trait Updater: Send + Sync {
    fn check(&self) -> Result<Option<UpdateInfo>, UpdateError>;
    fn download(&self, info: &UpdateInfo) -> Result<(), UpdateError>;
    /// Applies the downloaded update; on `CrashOnStartup` the previous
    /// version must be restored.
    fn apply(&self) -> Result<(), UpdateError>;
}
