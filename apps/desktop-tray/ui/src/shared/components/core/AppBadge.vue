<script setup lang="ts">
import { computed } from "vue";
import { badgeConfig } from "./config";
import type { BadgeProps } from "./types";

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: "subtle",
  color: "primary",
  position: "standalone-inline",
});

const variantClasses = computed(() => badgeConfig.variants[props.variant][props.color]);
const positionClasses = computed(() => badgeConfig.positions[props.position]);
</script>

<template>
  <span :class="[badgeConfig.base, variantClasses, positionClasses]">
    <slot />
  </span>
</template>
