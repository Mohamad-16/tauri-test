import { randomUUID } from "node:crypto";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT ?? 9800);

const wss = new WebSocketServer({ port: PORT, path: "/ws" });

function validMessage() {
  return {
    id: randomUUID(),
    title: "Pull completed",
    body: `${Math.floor(Math.random() * 20) + 1} documents fetched`,
    severity: "info",
    occurred_at: new Date().toISOString(),
  };
}

// Deliberately violates the contract (unknown field) to exercise the
// tray's reject-and-retry path on first connect.
const invalidMessage = {
  id: "invalid-1",
  title: "This should be rejected",
  body: "unknown_field breaks deny_unknown_fields",
  severity: "info",
  occurred_at: new Date().toISOString(),
  unknown_field: true,
};

wss.on("connection", (socket) => {
  console.log("[mock-ws] tray connected");
  socket.send(JSON.stringify(invalidMessage));

  const interval = setInterval(() => {
    socket.send(JSON.stringify(validMessage()));
  }, 10_000);

  socket.on("close", () => {
    console.log("[mock-ws] tray disconnected");
    clearInterval(interval);
  });
});

process.stdin.setEncoding("utf8");
process.stdin.on("data", (line) => {
  const body = line.trim();
  if (!body) return;
  const message = { ...validMessage(), body };
  for (const client of wss.clients) {
    client.send(JSON.stringify(message));
  }
});

console.log(`[mock-ws] listening on ws://127.0.0.1:${PORT}/ws`);
console.log("[mock-ws] type a line + Enter to broadcast it as a notification body");
