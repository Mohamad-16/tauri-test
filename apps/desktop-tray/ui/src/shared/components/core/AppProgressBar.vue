<script setup lang="ts">
import { computed } from "vue";
import { progressBarConfig } from "./config";
import type { ProgressBarProps } from "./types";

const props = withDefaults(defineProps<ProgressBarProps>(), {
  variant: "default",
  progress: 0,
  segmentsCount: 4,
});

const cappedProgress = computed(() => Math.min(100, Math.max(0, props.progress)));

const segments = computed(() => {
  return Array.from({ length: props.segmentsCount }).map((_, index) => {
    const segmentShare = 100 / props.segmentsCount;
    const isFilled = cappedProgress.value >= (index + 1) * segmentShare;
    const isPartiallyFilled = !isFilled && cappedProgress.value > index * segmentShare;

    let fillWidth = "0%";
    if (isFilled) {
      fillWidth = "100%";
    } else if (isPartiallyFilled) {
      const fraction = (cappedProgress.value - index * segmentShare) / segmentShare;
      fillWidth = `${fraction * 100}%`;
    }

    return { index, fillWidth };
  });
});
</script>

<template>
  <div
    :class="progressBarConfig.wrapper"
    role="progressbar"
    :aria-valuenow="cappedProgress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div v-if="variant === 'default'" :class="progressBarConfig.track">
      <div :class="progressBarConfig.fill" :style="{ width: `${cappedProgress}%` }" />
    </div>

    <div v-else :class="progressBarConfig.segmentGap">
      <div v-for="seg in segments" :key="seg.index" :class="progressBarConfig.segmentTrack">
        <div :class="progressBarConfig.segmentFill" :style="{ width: seg.fillWidth }" />
      </div>
    </div>
  </div>
</template>
