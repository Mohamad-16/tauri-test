<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useStatusStore } from "@/domains/status/stores/statusStore";
import { AppCard, AppStatusPill } from "@/shared/components/core";
import { useI18n } from "@/shared/composables/useI18n";

const { t } = useI18n();
const statusStore = useStatusStore();
const { status } = storeToRefs(statusStore);
</script>

<template>
  <AppCard variant="bordered">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        {{ t("status.title") }}
      </h3>
      <AppStatusPill
        :type="status.connectivity === 'online' ? 'success' : 'danger'"
        variant="border-only"
        :text="status.connectivity === 'online' ? t('status.online') : t('status.offline')"
      />
    </div>

    <p class="mt-2 text-sm text-muted">
      {{ t("status.description") }}
    </p>

    <p class="mt-4 text-xs text-subtle">{{ t("status.appVersion") }}: {{ status.appVersion }}</p>
  </AppCard>
</template>
