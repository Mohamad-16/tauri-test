# Dependency verification record (T002)

Every dependency below was added deliberately for the desktop tray foundation (spec 022 T001-T012) and checked against the official crates.io / npm registry entry (correct maintainer, no typosquat name, active repo) before pinning. `Cargo.lock` / `package-lock.json` are committed as the source of truth for exact resolved versions and hashes.

## Cargo (`apps/desktop-tray/src-tauri/Cargo.toml`)

| Crate                                               | Why                                                     |
| --------------------------------------------------- | ------------------------------------------------------- |
| `tauri` (`tray-icon` feature)                       | App shell + system tray                                 |
| `tauri-plugin-opener`, `tauri-plugin-notification`  | Native notifications, opening URLs/paths                |
| `tauri-plugin-updater`                              | Self-update (not yet registered at runtime - see below) |
| `serde`, `serde_json`                               | Wire-contract (de)serialization                         |
| `thiserror`                                         | Typed port error enums                                  |
| `tokio`, `tokio-tungstenite`, `futures-util`        | Async runtime + WebSocket notification client           |
| `reqwest` (rustls)                                  | Outbound HTTP (script library / telemetry, future work) |
| `tokio-cron-scheduler`                              | Scheduled pull runs                                     |
| `rusqlite` (bundled)                                | Local non-secret operational store                      |
| `keyring`                                           | OS-keychain credential storage                          |
| `regex`                                             | Secret redaction patterns                               |
| `rand`                                              | Non-cryptographic randomness (mock IDs, jitter)         |
| `proptest`, `cucumber`, `tempfile`, `futures` (dev) | Property, BDD, and temp-fs test tooling                 |

## npm

| Package                               | Why                                                           |
| ------------------------------------- | ------------------------------------------------------------- |
| `@playwright/test` (ui devDependency) | Browser E2E smoke tests                                       |
| `ws` (tools/mock-ws-server)           | Local mock WebSocket server for dev/testing the notify client |

## Known deviations

- **MSRV**: spec T003 names Rust 1.79; the dependency tree here needs >= 1.85 (edition-2024 crates transitively require it). Pinned `rust-version = "1.85"` in Cargo.toml and `rust-toolchain.toml` at repo root. Flag to stakeholders if 1.79 is a hard constraint elsewhere.
- **`tauri-plugin-updater`** is a Cargo dependency but is **not registered** in `lib.rs` yet - its config requires a real `pubkey`/`endpoints` pair from signing keys that don't exist. Registering it with a placeholder config aborts the app at startup. The `update::Updater` port, `TauriUpdater` skeleton, and `FakeUpdater` (T012) are independent of this runtime plugin and already implemented/tested; wire the real plugin in once signing keys are provisioned.
