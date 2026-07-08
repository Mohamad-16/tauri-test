//! Mirror of `contracts/notification-message.schema.json`.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Severity {
    Info,
    Warning,
    Error,
}

/// Push notification delivered over the WebSocket channel.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct NotificationMessage {
    pub id: String,
    pub title: String,
    pub body: String,
    pub severity: Severity,
    pub occurred_at: String,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schemas::parse_strict;

    const VALID: &str = r#"{
        "id": "n-1",
        "title": "Pull completed",
        "body": "12 documents fetched",
        "severity": "info",
        "occurred_at": "2026-07-08T10:00:00Z"
    }"#;

    #[test]
    fn round_trips() {
        let parsed: NotificationMessage = parse_strict(VALID).expect("valid payload parses");
        assert_eq!(parsed.severity, Severity::Info);
    }

    #[test]
    fn rejects_unknown_field() {
        let raw = VALID.replace("\"id\"", "\"script\": \"alert(1)\", \"id\"");
        assert!(parse_strict::<NotificationMessage>(&raw).is_err());
    }
}
