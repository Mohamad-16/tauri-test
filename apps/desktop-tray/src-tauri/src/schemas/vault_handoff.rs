//! Mirror of `contracts/vault-handoff.schema.json`.

use serde::{Deserialize, Serialize};

/// Short-lived handoff granting this installation access to a vault-held
/// credential. The credential itself never crosses this wire.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultHandoff {
    pub handoff_id: String,
    pub tray_installation_id: String,
    /// Opaque vault reference; resolved only inside the keychain boundary.
    pub vault_ref: String,
    pub scope: Vec<String>,
    /// RFC 3339. Kept as a string — timestamps are never coerced.
    pub issued_at: String,
    pub expires_at: String,
    pub nonce: String,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schemas::parse_strict;

    const VALID: &str = r#"{
        "handoff_id": "h-1",
        "tray_installation_id": "tray-1",
        "vault_ref": "vault://cred/42",
        "scope": ["pull:bank"],
        "issued_at": "2026-07-08T10:00:00Z",
        "expires_at": "2026-07-08T10:05:00Z",
        "nonce": "abcdef1234"
    }"#;

    #[test]
    fn round_trips() {
        let parsed: VaultHandoff = parse_strict(VALID).expect("valid payload parses");
        let json = serde_json::to_string(&parsed).expect("serializes");
        let reparsed: VaultHandoff = parse_strict(&json).expect("round-trips");
        assert_eq!(parsed, reparsed);
    }

    #[test]
    fn rejects_unknown_field() {
        let raw = VALID.replace("\"nonce\"", "\"injected\": true, \"nonce\"");
        assert!(parse_strict::<VaultHandoff>(&raw).is_err());
    }

    #[test]
    fn rejects_missing_field() {
        let raw = VALID.replace(
            "\"nonce\": \"abcdef1234\"",
            "\"nonce\": \"x\", \"extra\": 1",
        );
        assert!(parse_strict::<VaultHandoff>(&raw).is_err());
    }
}
