export type ConnectivityState = "online" | "offline";

/** Aggregate tray health shown on the status screen. */
export interface TrayStatus {
  connectivity: ConnectivityState;
  appVersion: string;
  lastSyncAt?: string;
}
