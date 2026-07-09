//! WebSocket notification client: native toasts + events to the webview.
//!
//! Runs Rust-side (not in the webview) so notifications keep working while
//! the main window is hidden to the tray.

use futures_util::StreamExt;
use tauri::{AppHandle, Emitter};
use thiserror::Error;
use tokio_tungstenite::{connect_async, tungstenite::Message};

#[cfg(not(target_os = "linux"))]
use tauri_plugin_notification::NotificationExt;

/// Must match the installed `.desktop` file's basename (without the
/// `.desktop` suffix) - see `apps/desktop-tray/src-tauri/tauri.conf.json`
/// bundle config. Without this GNOME can't associate the toast with the
/// app, so it renders as an unmanaged, auto-dismissing banner instead of a
/// real, persistent notification (see docs/dependencies.md).
#[cfg(target_os = "linux")]
const DESKTOP_ENTRY: &str = "FluxBooks";

use crate::audit::Redactor;
use crate::schemas::NotificationMessage;

const DEFAULT_WS_URL: &str = "ws://127.0.0.1:9800/ws";
const EVENT_NAME: &str = "notification://incoming";
const MAX_BACKOFF: std::time::Duration = std::time::Duration::from_secs(60);

#[derive(Debug, Error)]
pub enum NotifyError {
    #[error("websocket error: {0}")]
    WebSocket(#[from] tokio_tungstenite::tungstenite::Error),

    #[error("invalid utf-8 payload: {0}")]
    InvalidUtf8(#[from] std::string::FromUtf8Error),

    #[error("invalid notification payload: {0}")]
    InvalidPayload(#[from] crate::schemas::SchemaError),

    #[error("unexpected websocket message type")]
    UnexpectedMessage,
}

fn ws_url() -> String {
    std::env::var("FLUXBOOKS_WS_URL").unwrap_or_else(|_| DEFAULT_WS_URL.to_string())
}

/// Receives and strictly parses a single frame. Kept standalone (rather than
/// folded into the reconnect loop) so it stays unit-testable against a mock
/// server without needing a live `AppHandle`.
pub async fn receive_notification_once(endpoint: &str) -> Result<NotificationMessage, NotifyError> {
    let (mut ws_stream, _) = connect_async(endpoint).await?;

    let msg = ws_stream
        .next()
        .await
        .ok_or(NotifyError::UnexpectedMessage)??;

    let text = match msg {
        Message::Text(payload) => payload.to_string(),
        Message::Binary(payload) => String::from_utf8(payload.to_vec())?,
        _ => return Err(NotifyError::UnexpectedMessage),
    };

    Ok(crate::schemas::parse_strict(&text)?)
}

/// Spawns the reconnecting WebSocket client. Call once from `run()`'s
/// `.setup()` hook; runs for the lifetime of the app. Exponential backoff on
/// disconnect, capped at [`MAX_BACKOFF`].
pub fn spawn_ws_client(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let redactor = Redactor::standard();
        let mut backoff = std::time::Duration::from_secs(1);

        loop {
            if let Ok((stream, _)) = connect_async(ws_url()).await {
                backoff = std::time::Duration::from_secs(1);
                let (_, mut read) = stream.split();
                while let Some(Ok(msg)) = read.next().await {
                    if let Message::Text(raw) = msg {
                        dispatch(&app, &redactor, raw.as_str());
                    }
                }
            }

            tokio::time::sleep(backoff).await;
            backoff = (backoff * 2).min(MAX_BACKOFF);
        }
    });
}

/// Parses, redacts, then surfaces one frame as a native toast + webview
/// event. Split out from the connect loop so it's unit-testable without a
/// live socket or `AppHandle`.
fn dispatch(app: &AppHandle, redactor: &Redactor, raw: &str) {
    let Ok(message) = crate::schemas::parse_strict::<NotificationMessage>(raw) else {
        // Reject-and-retry: an invalid frame is dropped, never coerced or
        // partially accepted. The connection itself stays open.
        return;
    };

    let clean = redact_message(redactor, message);

    if let Err(e) = show_native(app, &clean.title, &clean.body) {
        eprintln!("[notify] toast failed: {e}");
    }
    let _ = app.emit(EVENT_NAME, clean);
}

/// Tauri command so webview-triggered notifications go through the same
/// Rust path as WebSocket ones (desktop-entry hint + live D-Bus connection).
/// Returns the notification id, or the D-Bus error so the frontend can log it.
#[tauri::command]
pub fn show_notification(app: AppHandle, title: String, body: String) -> Result<String, String> {
    show_native(&app, &title, &body)
}

/// GNOME Shell destroys a notification source - and every notification it
/// owns - the instant the sending D-Bus connection closes, but only for
/// sources attributed to an app (desktop-entry hint / matched appname).
/// `notify-rust` opens a fresh connection per `show()` and dropping the
/// returned handle closes it, so our notifications were deleted microseconds
/// after being accepted (GNOME returned an id, then nothing ever displayed).
/// Keeping the handles alive keeps the connections - and the notifications -
/// alive for the app's lifetime.
#[cfg(target_os = "linux")]
static LIVE_HANDLES: std::sync::Mutex<Vec<notify_rust::NotificationHandle>> =
    std::sync::Mutex::new(Vec::new());

#[cfg(target_os = "linux")]
fn show_native(_app: &AppHandle, title: &str, body: &str) -> Result<String, String> {
    let handle = notify_rust::Notification::new()
        .appname(DESKTOP_ENTRY)
        .summary(title)
        .body(body)
        .icon("fluxbooks")
        .hint(notify_rust::Hint::DesktopEntry(DESKTOP_ENTRY.to_string()))
        .show()
        .map_err(|e| format!("notify-rust/dbus error: {e}"))?;

    let id = handle.id().to_string();
    if let Ok(mut handles) = LIVE_HANDLES.lock() {
        handles.push(handle);
        // Bound the open-connection count; dropping the oldest may let GNOME
        // reap its long-since-read notification, which is acceptable.
        if handles.len() > 64 {
            handles.remove(0);
        }
    }
    Ok(id)
}

#[cfg(not(target_os = "linux"))]
fn show_native(app: &AppHandle, title: &str, body: &str) -> Result<String, String> {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map(|()| "plugin".to_string())
        .map_err(|e| format!("notification plugin error: {e}"))
}

fn redact_message(redactor: &Redactor, message: NotificationMessage) -> NotificationMessage {
    NotificationMessage {
        title: redactor.redact(&message.title),
        body: redactor.redact(&message.body),
        ..message
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schemas::Severity;
    use futures_util::SinkExt;
    use tokio::net::TcpListener;
    use tokio_tungstenite::accept_async;

    fn sample() -> NotificationMessage {
        NotificationMessage {
            id: "n-1".to_string(),
            title: "Pull completed".to_string(),
            body: "12 documents fetched".to_string(),
            severity: Severity::Info,
            occurred_at: "2026-07-08T10:00:00Z".to_string(),
        }
    }

    #[tokio::test]
    async fn receives_notification_from_mock_websocket() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();

        let expected = sample();
        let expected_clone = expected.clone();
        let server = tokio::spawn(async move {
            let (stream, _peer) = listener.accept().await.unwrap();
            let mut ws = accept_async(stream).await.unwrap();

            let payload = serde_json::to_string(&expected_clone).unwrap();
            ws.send(Message::Text(payload.into())).await.unwrap();
            ws.close(None).await.unwrap();
        });

        let endpoint = format!("ws://{addr}");
        let actual = receive_notification_once(&endpoint).await.unwrap();

        assert_eq!(actual, expected);
        server.await.unwrap();
    }

    #[test]
    fn redact_message_scrubs_title_and_body() {
        let redactor = Redactor::standard();
        let mut leaking = sample();
        leaking.body = "token=ghp_16C7e42F292c6912E7710c838347Ae178B4a".to_string();

        let clean = redact_message(&redactor, leaking);
        assert!(!clean.body.contains("ghp_"));
    }

    #[test]
    fn invalid_frame_is_rejected_not_coerced() {
        assert!(
            crate::schemas::parse_strict::<NotificationMessage>(r#"{"unexpected": true}"#).is_err()
        );
    }
}
