//! Embedded, versioned schema migrations (applied via `PRAGMA user_version`).
//!
//! Constitution note: **no credential material is ever stored here** — the
//! only credential-adjacent column is the opaque `credential_ref` keychain
//! handle on `source_connection` (see the guard test in `store/mod.rs`).

pub const MIGRATIONS: &[&str] = &[
    // V1 — initial data model (spec 022 data-model.md)
    r"
    CREATE TABLE tray_installation (
        id            TEXT PRIMARY KEY,
        device_name   TEXT NOT NULL,
        app_version   TEXT NOT NULL,
        registered_at TEXT NOT NULL,
        last_seen_at  TEXT
    );

    CREATE TABLE source_connection (
        id                   TEXT PRIMARY KEY,
        tray_installation_id TEXT NOT NULL REFERENCES tray_installation(id),
        provider             TEXT NOT NULL,
        display_name         TEXT NOT NULL,
        status               TEXT NOT NULL DEFAULT 'inactive',
        credential_ref       TEXT NOT NULL,
        created_at           TEXT NOT NULL
    );

    CREATE TABLE rpa_script (
        id             TEXT PRIMARY KEY,
        name           TEXT NOT NULL,
        version        TEXT NOT NULL,
        integrity_hash TEXT NOT NULL,
        fetched_at     TEXT NOT NULL
    );

    CREATE TABLE scheduled_pull_run (
        id                   TEXT PRIMARY KEY,
        source_connection_id TEXT NOT NULL REFERENCES source_connection(id),
        rpa_script_id        TEXT REFERENCES rpa_script(id),
        cron_expr            TEXT NOT NULL,
        next_run_at          TEXT,
        last_run_at          TEXT,
        last_status          TEXT,
        retry_count          INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE log_entry (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        ts           TEXT NOT NULL,
        level        TEXT NOT NULL,
        category     TEXT NOT NULL,
        message      TEXT NOT NULL,
        context_json TEXT
    );

    -- log_entry is append-only (FR-008): reject mutation at the engine level.
    CREATE TRIGGER log_entry_no_update BEFORE UPDATE ON log_entry
    BEGIN
        SELECT RAISE(ABORT, 'log_entry is append-only');
    END;

    CREATE TRIGGER log_entry_no_delete BEFORE DELETE ON log_entry
    BEGIN
        SELECT RAISE(ABORT, 'log_entry is append-only');
    END;
    ",
];
