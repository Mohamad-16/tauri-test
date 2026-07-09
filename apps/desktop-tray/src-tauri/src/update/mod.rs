//! Self-update port (`Updater`) (spec 022 T012).

pub mod base;
pub mod tauri_updater;

pub use base::{UpdateError, UpdateInfo, Updater};
