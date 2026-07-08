import { defineStore } from "pinia";
import { ref } from "vue";

import type { TrayStatus } from "@/domains/status/types/status";

export const useStatusStore = defineStore("status", () => {
  const status = ref<TrayStatus>({
    connectivity: "online",
    appVersion: "0.1.0",
  });

  /** Placeholder until the Tauri status commands land (spec 022, US work). */
  async function refreshStatus(): Promise<void> {
    // no-op skeleton
  }

  return {
    status,
    refreshStatus,
  };
});
