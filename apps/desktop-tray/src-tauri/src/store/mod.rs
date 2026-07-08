//! Local non-secret operational store (rusqlite, spec 022 T007).
//!
//! Holds tray installation metadata, source connections, RPA script versions,
//! scheduled pull runs and the append-only log. **No credential column
//! exists** — credentials live only in the OS keychain, referenced by the
//! opaque `credential_ref` handle.

mod migrations;

use std::path::Path;

use rusqlite::{params, Connection};

#[derive(Debug, thiserror::Error)]
pub enum StoreError {
    #[error("database error: {0}")]
    Db(#[from] rusqlite::Error),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TrayInstallation {
    pub id: String,
    pub device_name: String,
    pub app_version: String,
    pub registered_at: String,
    pub last_seen_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SourceConnection {
    pub id: String,
    pub tray_installation_id: String,
    pub provider: String,
    pub display_name: String,
    pub status: String,
    /// Opaque keychain handle. Never the credential itself.
    pub credential_ref: String,
    pub created_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LogEntry {
    pub id: i64,
    pub ts: String,
    pub level: String,
    pub category: String,
    pub message: String,
    pub context_json: Option<String>,
}

pub struct Store {
    conn: Connection,
}

impl Store {
    /// Opens (creating if absent) the store at `path` and applies any pending
    /// migrations, each inside a transaction that bumps `user_version`.
    pub fn open(path: &Path) -> Result<Self, StoreError> {
        let conn = Connection::open(path)?;
        Self::from_connection(conn)
    }

    /// In-memory store for tests.
    pub fn open_in_memory() -> Result<Self, StoreError> {
        Self::from_connection(Connection::open_in_memory()?)
    }

    fn from_connection(conn: Connection) -> Result<Self, StoreError> {
        conn.pragma_update(None, "foreign_keys", "ON")?;

        let mut store = Self { conn };
        store.migrate()?;
        Ok(store)
    }

    fn migrate(&mut self) -> Result<(), StoreError> {
        let current: usize =
            self.conn
                .query_row("SELECT user_version FROM pragma_user_version", [], |row| {
                    row.get::<_, i64>(0)
                        .map(|v| usize::try_from(v).unwrap_or(0))
                })?;

        for (index, migration) in migrations::MIGRATIONS.iter().enumerate().skip(current) {
            let tx = self.conn.transaction()?;
            tx.execute_batch(migration)?;
            tx.pragma_update(
                None,
                "user_version",
                i64::try_from(index + 1).unwrap_or(i64::MAX),
            )?;
            tx.commit()?;
        }

        Ok(())
    }

    pub fn user_version(&self) -> Result<i64, StoreError> {
        Ok(self
            .conn
            .query_row("SELECT user_version FROM pragma_user_version", [], |row| {
                row.get(0)
            })?)
    }

    /* ---------------------------- tray_installation --------------------------- */

    pub fn upsert_installation(&self, install: &TrayInstallation) -> Result<(), StoreError> {
        self.conn.execute(
            "INSERT INTO tray_installation (id, device_name, app_version, registered_at, last_seen_at)
             VALUES (?1, ?2, ?3, ?4, ?5)
             ON CONFLICT(id) DO UPDATE SET
                device_name = excluded.device_name,
                app_version = excluded.app_version,
                last_seen_at = excluded.last_seen_at",
            params![
                install.id,
                install.device_name,
                install.app_version,
                install.registered_at,
                install.last_seen_at
            ],
        )?;
        Ok(())
    }

    pub fn get_installation(&self, id: &str) -> Result<Option<TrayInstallation>, StoreError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, device_name, app_version, registered_at, last_seen_at
             FROM tray_installation WHERE id = ?1",
        )?;
        let mut rows = stmt.query_map([id], |row| {
            Ok(TrayInstallation {
                id: row.get(0)?,
                device_name: row.get(1)?,
                app_version: row.get(2)?,
                registered_at: row.get(3)?,
                last_seen_at: row.get(4)?,
            })
        })?;
        rows.next().transpose().map_err(StoreError::from)
    }

    /* ---------------------------- source_connection --------------------------- */

    pub fn insert_source_connection(
        &self,
        connection: &SourceConnection,
    ) -> Result<(), StoreError> {
        self.conn.execute(
            "INSERT INTO source_connection
                (id, tray_installation_id, provider, display_name, status, credential_ref, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                connection.id,
                connection.tray_installation_id,
                connection.provider,
                connection.display_name,
                connection.status,
                connection.credential_ref,
                connection.created_at
            ],
        )?;
        Ok(())
    }

    pub fn list_source_connections(&self) -> Result<Vec<SourceConnection>, StoreError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, tray_installation_id, provider, display_name, status, credential_ref, created_at
             FROM source_connection ORDER BY created_at",
        )?;
        let rows = stmt.query_map([], |row| {
            Ok(SourceConnection {
                id: row.get(0)?,
                tray_installation_id: row.get(1)?,
                provider: row.get(2)?,
                display_name: row.get(3)?,
                status: row.get(4)?,
                credential_ref: row.get(5)?,
                created_at: row.get(6)?,
            })
        })?;
        rows.collect::<Result<_, _>>().map_err(StoreError::from)
    }

    /* -------------------------------- log_entry ------------------------------- */

    pub fn insert_log_entry(
        &self,
        ts: &str,
        level: &str,
        category: &str,
        message: &str,
        context_json: Option<&str>,
    ) -> Result<(), StoreError> {
        self.conn.execute(
            "INSERT INTO log_entry (ts, level, category, message, context_json)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![ts, level, category, message, context_json],
        )?;
        Ok(())
    }

    pub fn recent_logs(&self, limit: usize) -> Result<Vec<LogEntry>, StoreError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, ts, level, category, message, context_json
             FROM log_entry ORDER BY id DESC LIMIT ?1",
        )?;
        let rows = stmt.query_map([limit], |row| {
            Ok(LogEntry {
                id: row.get(0)?,
                ts: row.get(1)?,
                level: row.get(2)?,
                category: row.get(3)?,
                message: row.get(4)?,
                context_json: row.get(5)?,
            })
        })?;
        rows.collect::<Result<_, _>>().map_err(StoreError::from)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn store() -> Store {
        Store::open_in_memory().expect("in-memory store opens")
    }

    #[test]
    fn migrations_apply_and_version_bumps() {
        let s = store();
        assert_eq!(
            s.user_version().unwrap(),
            migrations::MIGRATIONS.len() as i64
        );
    }

    #[test]
    fn no_credential_columns_exist() {
        // SC-005 groundwork: the schema must never grow a column that could
        // hold secret material. `credential_ref` (opaque handle) is the only
        // allowed exception.
        let s = store();
        let mut stmt = s
            .conn
            .prepare(
                "SELECT m.name || '.' || p.name
                 FROM sqlite_master m, pragma_table_info(m.name) p
                 WHERE m.type = 'table'",
            )
            .unwrap();
        let columns: Vec<String> = stmt
            .query_map([], |row| row.get(0))
            .unwrap()
            .map(Result::unwrap)
            .collect();

        let forbidden = regex::Regex::new(r"(?i)(password|secret|token|credential)$").unwrap();
        let leaks: Vec<&String> = columns
            .iter()
            .filter(|col| forbidden.is_match(col) && !col.ends_with("credential_ref"))
            .collect();
        assert!(
            leaks.is_empty(),
            "credential-capable columns found: {leaks:?}"
        );
    }

    #[test]
    fn log_entry_is_append_only() {
        let s = store();
        s.insert_log_entry("2026-07-08T10:00:00Z", "info", "test", "hello", None)
            .unwrap();

        let update = s
            .conn
            .execute("UPDATE log_entry SET message = 'tampered'", []);
        assert!(update.is_err(), "UPDATE on log_entry must abort");

        let delete = s.conn.execute("DELETE FROM log_entry", []);
        assert!(delete.is_err(), "DELETE on log_entry must abort");
    }

    #[test]
    fn installation_roundtrip_and_connection_listing() {
        let s = store();
        let install = TrayInstallation {
            id: "tray-1".into(),
            device_name: "dev-laptop".into(),
            app_version: "0.1.0".into(),
            registered_at: "2026-07-08T10:00:00Z".into(),
            last_seen_at: None,
        };
        s.upsert_installation(&install).unwrap();
        assert_eq!(
            s.get_installation("tray-1").unwrap().as_ref(),
            Some(&install)
        );

        s.insert_source_connection(&SourceConnection {
            id: "sc-1".into(),
            tray_installation_id: "tray-1".into(),
            provider: "demo-bank".into(),
            display_name: "Demo Bank".into(),
            status: "active".into(),
            credential_ref: "keychain://com.fluxbooks.tray/sc-1".into(),
            created_at: "2026-07-08T10:01:00Z".into(),
        })
        .unwrap();
        assert_eq!(s.list_source_connections().unwrap().len(), 1);
    }
}
