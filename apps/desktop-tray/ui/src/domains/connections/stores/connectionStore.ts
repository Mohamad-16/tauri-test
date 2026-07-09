import { defineStore } from "pinia";
import { ref } from "vue";

import type { SourceConnection } from "@/domains/connections/types/connection";

export const useConnectionStore = defineStore("connections", () => {
  const connections = ref<SourceConnection[]>([]);
  const isLoading = ref<boolean>(false);

  /** Placeholder until the Tauri store commands land (spec 022, US work). */
  async function loadConnections(): Promise<void> {
    isLoading.value = false;
  }

  return {
    connections,
    isLoading,
    loadConnections,
  };
});
