//! FluxBooks desktop tray application core.
//!
//! Module layout follows specs/022-desktop-tray-application plan.md (T001).

pub mod audit;
pub mod credentials;
pub mod lifecycle;
pub mod notify;
pub mod platform;
pub mod pull;
pub mod runner;
pub mod schedule;
pub mod schemas;
pub mod scriptlib;
pub mod store;
pub mod telemetry;
pub mod update;

#[cfg(any(test, feature = "testkit"))]
pub mod testkit;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
