//! Store smoke: open on disk -> migrate -> write -> reopen -> data + version stable.

use fluxbooks_lib::store::{Store, TrayInstallation};

#[test]
fn store_survives_reopen() {
    let dir = tempfile::tempdir().expect("tempdir");
    let db_path = dir.path().join("fluxbooks.db");

    let expected_version = {
        let store = Store::open(&db_path).expect("first open migrates");
        store
            .upsert_installation(&TrayInstallation {
                id: "tray-1".into(),
                device_name: "ci".into(),
                app_version: "0.1.0".into(),
                registered_at: "2026-07-08T10:00:00Z".into(),
                last_seen_at: None,
            })
            .expect("insert");
        store.user_version().expect("version readable")
    };

    let reopened = Store::open(&db_path).expect("second open is idempotent");
    assert_eq!(reopened.user_version().unwrap(), expected_version);
    assert!(reopened.get_installation("tray-1").unwrap().is_some());
}
