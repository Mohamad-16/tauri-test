<script setup lang="ts">
import { computed, type Component } from "vue";
import * as Icons from "lucide-vue-next";
import { iconConfig } from "./config";
import type { IconProps } from "./types";

const props = withDefaults(defineProps<IconProps>(), {
  size: iconConfig.defaultSize,
  colorClass: iconConfig.defaultColorClass,
});

const iconComponent = computed(() => {
  const iconName = props.name as keyof typeof Icons;
  if (iconName in Icons) return Icons[iconName] as Component;
  return Icons[iconConfig.fallbackIcon as keyof typeof Icons] as Component;
});

const normalizedSize = computed(() => {
  return typeof props.size === "number"
    ? props.size
    : Number.parseInt(props.size, 10) || iconConfig.defaultSize;
});
</script>

<template>
  <component :is="iconComponent" :size="normalizedSize" :class="[iconConfig.base, colorClass]" />
</template>
