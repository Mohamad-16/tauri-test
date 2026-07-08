<script setup lang="ts">
import { AppCard, AppStatusPill } from "@/shared/components/core";
import { useI18n } from "@/shared/composables/useI18n";

const { t } = useI18n();
</script>

<template>
  <AppCard variant="bordered">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ t("connections.title") }}</h3>
      <AppStatusPill type="neutral" variant="dashed-border" :text="t('common.comingSoon')" />
    </div>

    <p class="mt-2 text-sm text-muted">{{ t("connections.description") }}</p>
  </AppCard>
</template>
