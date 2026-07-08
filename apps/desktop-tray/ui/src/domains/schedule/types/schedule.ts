export type PullRunStatus = "success" | "failed" | "running" | "pending";

/** Mirrors the `scheduled_pull_run` row in the tray's local store. */
export interface ScheduledPullRun {
  id: string;
  sourceConnectionId: string;
  cronExpr: string;
  nextRunAt?: string;
  lastRunAt?: string;
  lastStatus?: PullRunStatus;
  retryCount: number;
}
