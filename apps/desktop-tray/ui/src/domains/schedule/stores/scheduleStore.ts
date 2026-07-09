import { defineStore } from "pinia";
import { ref } from "vue";

import type { ScheduledPullRun } from "@/domains/schedule/types/schedule";

export const useScheduleStore = defineStore("schedule", () => {
  const runs = ref<ScheduledPullRun[]>([]);
  const isLoading = ref<boolean>(false);

  /** Placeholder until the Tauri scheduler commands land (spec 022, US work). */
  async function loadRuns(): Promise<void> {
    isLoading.value = false;
  }

  return {
    runs,
    isLoading,
    loadRuns,
  };
});
