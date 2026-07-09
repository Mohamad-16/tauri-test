//! `tauri-plugin-updater`-backed implementation (skeleton).
//!
//! Returns `NotConfigured` until updater endpoints and signing keys are
//! provisioned (see tauri.conf.json `plugins.updater` stub and README).

use super::base::{UpdateError, UpdateInfo, Updater};

pub struct TauriUpdater;

impl Updater for TauriUpdater {
    fn check(&self) -> Result<Option<UpdateInfo>, UpdateError> {
        Err(UpdateError::NotConfigured)
    }

    fn download(&self, _info: &UpdateInfo) -> Result<(), UpdateError> {
        Err(UpdateError::NotConfigured)
    }

    fn apply(&self) -> Result<(), UpdateError> {
        Err(UpdateError::NotConfigured)
    }
}
