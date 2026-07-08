//! Serde models for the wire contracts (spec 022 T006).
//!
//! Every model mirrors a JSON Schema in `apps/desktop-tray/contracts/` and is
//! parsed with [`parse_strict`]: unknown fields and type mismatches are hard
//! errors. Callers treat `Err` as reject-and-retry — payloads are never
//! coerced or partially accepted.

mod client_list;
mod notification;
mod telemetry;
mod vault_handoff;

pub use client_list::{AuthorisedClient, AuthorisedClientListSync, ClientStatus};
pub use notification::{NotificationMessage, Severity};
pub use telemetry::{Telemetry, TelemetryEventType};
pub use vault_handoff::VaultHandoff;

#[derive(Debug, thiserror::Error)]
pub enum SchemaError {
    #[error("payload rejected: {0}")]
    Rejected(#[from] serde_json::Error),
}

/// Strictly parse a wire payload. Any deviation from the contract
/// (unknown field, wrong type, missing field) rejects the whole message.
pub fn parse_strict<T: serde::de::DeserializeOwned>(raw: &str) -> Result<T, SchemaError> {
    Ok(serde_json::from_str(raw)?)
}
