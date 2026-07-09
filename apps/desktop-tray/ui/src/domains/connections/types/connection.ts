export type ConnectionStatus = "active" | "inactive" | "error";

/** Mirrors the `source_connection` row in the tray's local store (no credentials). */
export interface SourceConnection {
  id: string;
  provider: string;
  displayName: string;
  status: ConnectionStatus;
  createdAt: string;
}
