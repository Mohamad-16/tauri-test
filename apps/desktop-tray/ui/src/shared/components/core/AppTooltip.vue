<script setup lang="ts">
import { ref } from "vue";
import { tooltipConfig } from "./config";
import type { TooltipProps } from "./types";

withDefaults(defineProps<TooltipProps>(), {
  position: "top",
});

const isVisible = ref(false);
</script>

<template>
  <div
    :class="tooltipConfig.wrapper"
    @mouseenter="isVisible = true"
    @mouseleave="isVisible = false"
    @focusin="isVisible = true"
    @focusout="isVisible = false"
  >
    <slot />

    <div
      v-if="isVisible"
      role="tooltip"
      :class="[tooltipConfig.body, tooltipConfig.positions[position]]"
    >
      {{ text }}
      <div :class="[tooltipConfig.arrowBase, tooltipConfig.arrows[position]]" />
    </div>
  </div>
</template>
