<script setup lang="ts">
import { computed } from "vue";
import { cardConfig } from "./config";
import type { CardProps } from "./types";

const props = withDefaults(defineProps<CardProps>(), {
  variant: "default",
  selected: false,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

const classes = computed(() => [
  cardConfig.base,
  cardConfig.variants[props.variant],
  props.variant === "selectable"
    ? props.selected
      ? cardConfig.selectable.selected
      : cardConfig.selectable.unselected
    : "",
]);
</script>

<template>
  <div :class="classes" @click="emit('click')">
    <slot />
  </div>
</template>
