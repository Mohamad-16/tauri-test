//! WebSocket notification client: native toasts + events to the webview.

use crate::schemas::NotificationMessage;
use futures_util::StreamExt;
use thiserror::Error;
use tokio_tungstenite::{connect_async, tungstenite::Message};

#[derive(Debug, Error)]
pub enum NotifyError {
    #[error("websocket error: {0}")]
    WebSocket(#[from] tokio_tungstenite::tungstenite::Error),

    #[error("invalid utf-8 payload: {0}")]
    InvalidUtf8(#[from] std::string::FromUtf8Error),

    #[error("invalid notification payload: {0}")]
    InvalidPayload(#[from] serde_json::Error),

    #[error("unexpected websocket message type")]
    UnexpectedMessage,
}

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

    let notification = serde_json::from_str::<NotificationMessage>(&text)?;
    Ok(notification)
}

#[cfg(test)]
mod tests {
    use super::*;
    use futures_util::SinkExt;
    use tokio::net::TcpListener;
    use tokio_tungstenite::{accept_async, tungstenite::Message};

    #[tokio::test]
    async fn receives_notification_from_mock_websocket() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();

        let expected = NotificationMessage {
            id: "n-1".to_string(),
            title: "Pull completed".to_string(),
            body: "12 documents fetched".to_string(),
            severity: crate::schemas::Severity::Info,
            occurred_at: "2026-07-08T10:00:00Z".to_string(),
        };

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
}
