import { defineStore } from "pinia";
import { ref } from "vue";

export interface ActivityItem {
  fileName: string;
  status: string;
  time: string;
}

export const useDashboardStore = defineStore("dashboard", () => {
  const evidenceHealth = ref<number>(96);

  const connectionStatus = ref<string>("Connected");

  const lastSync = ref<string>("2 mins ago");

  const workspaceName = ref<string>("FluxBooks Demo LLC");

  const workspaceId = ref<string>("FB-10001");

  const incomingFiles = ref<number>(24);

  const groupedDocuments = ref<number>(16);

  const readyForReview = ref<number>(8);

  const rejectedFiles = ref<number>(3);

  const reviewBacklog = ref<number>(5);

  const processingQueue = ref<string[]>([
    "Invoice_2044.pdf",
    "Receipt_899.pdf",
    "BankStatement_May.pdf",
  ]);

  const recentActivities = ref<ActivityItem[]>([
    {
      fileName: "Invoice_1001.pdf",
      status: "Grouped Successfully",
      time: "2 mins ago",
    },
    {
      fileName: "Receipt_May.pdf",
      status: "Ready For Review",
      time: "8 mins ago",
    },
    {
      fileName: "Statement_April.pdf",
      status: "Rejected",
      time: "15 mins ago",
    },
    {
      fileName: "Invoice_2044.pdf",
      status: "Processing",
      time: "21 mins ago",
    },
  ]);

  /**
   * Simulate upload action.
   */
  function uploadEvidence(): void {
    console.log("Upload Evidence");
  }

  return {
    evidenceHealth,
    connectionStatus,
    lastSync,
    workspaceName,
    workspaceId,
    incomingFiles,
    groupedDocuments,
    readyForReview,
    rejectedFiles,
    reviewBacklog,
    processingQueue,
    recentActivities,
    uploadEvidence,
  };
});
