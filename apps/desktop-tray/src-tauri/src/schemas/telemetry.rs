//! Mirror of `contracts/telemetry.schema.json`.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TelemetryEventType {
    PullStarted,
    PullCompleted,
    PullFailed,
    UpdateApplied,
    Heartbeat,
}

/// Outbound operational telemetry event. Every payload passes the audit
/// redactor before leaving the device (SC-005).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Telemetry {
    pub event_id: String,
    pub tray_installation_id: String,
    pub app_version: String,
    pub event_type: TelemetryEventType,
    pub occurred_at: String,
    pub attributes: serde_json::Map<String, serde_json::Value>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schemas::parse_strict;

    const VALID: &str = r#"{
        "event_id": "e-1",
        "tray_installation_id": "tray-1",
        "app_version": "0.1.0",
        "event_type": "heartbeat",
        "occurred_at": "2026-07-08T10:00:00Z",
        "attributes": { "uptime_s": 12 }
    }"#;

    #[test]
    fn round_trips() {
        let parsed: Telemetry = parse_strict(VALID).expect("valid payload parses");
        assert_eq!(parsed.event_type, TelemetryEventType::Heartbeat);
    }

    #[test]
    fn rejects_unknown_event_type() {
        let raw = VALID.replace("heartbeat", "self_destruct");
        assert!(parse_strict::<Telemetry>(&raw).is_err());
    }

    #[test]
    fn rejects_unknown_field() {
        let raw = VALID.replace("\"event_id\"", "\"debug\": true, \"event_id\"");
        assert!(parse_strict::<Telemetry>(&raw).is_err());
    }
}
