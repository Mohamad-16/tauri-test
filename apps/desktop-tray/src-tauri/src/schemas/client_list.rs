//! Mirror of `contracts/client-list-sync.schema.json`.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ClientStatus {
    Active,
    Suspended,
    Revoked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AuthorisedClient {
    pub client_id: String,
    pub display_name: String,
    pub status: ClientStatus,
    pub source_connection_ids: Vec<String>,
}

/// Full-revision sync of the clients this installation may pull for.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AuthorisedClientListSync {
    pub sync_id: String,
    pub revision: u64,
    pub generated_at: String,
    pub clients: Vec<AuthorisedClient>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schemas::parse_strict;

    const VALID: &str = r#"{
        "sync_id": "s-1",
        "revision": 3,
        "generated_at": "2026-07-08T10:00:00Z",
        "clients": [{
            "client_id": "c-1",
            "display_name": "Apex Trading LLC",
            "status": "active",
            "source_connection_ids": ["sc-1"]
        }]
    }"#;

    #[test]
    fn round_trips() {
        let parsed: AuthorisedClientListSync = parse_strict(VALID).expect("valid payload parses");
        assert_eq!(parsed.revision, 3);
        assert_eq!(parsed.clients[0].status, ClientStatus::Active);
    }

    #[test]
    fn rejects_string_revision_without_coercion() {
        let raw = VALID.replace("\"revision\": 3", "\"revision\": \"3\"");
        assert!(parse_strict::<AuthorisedClientListSync>(&raw).is_err());
    }

    #[test]
    fn rejects_unknown_nested_field() {
        let raw = VALID.replace("\"client_id\"", "\"admin\": true, \"client_id\"");
        assert!(parse_strict::<AuthorisedClientListSync>(&raw).is_err());
    }
}
