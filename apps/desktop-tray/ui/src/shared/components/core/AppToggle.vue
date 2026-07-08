<script setup lang="ts">
import { computed } from "vue";
import type { ToggleProps } from "./types";
import { toggleConfig } from "./config";

const props = withDefaults(defineProps<ToggleProps>(), {
  size: "md",
  color: "primary",
  disabled: false,
  label: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const toggle = () => {
  if (props.disabled) return;
  emit("update:modelValue", !props.modelValue);
};

const trackClasses = computed(() => [
  toggleConfig.track,
  toggleConfig.trackSizes[props.size],
  props.modelValue ? toggleConfig.trackOn[props.color] : toggleConfig.trackOff,
]);

const dotClasses = computed(() => [
  toggleConfig.dot,
  toggleConfig.dotSizes[props.size],
  props.modelValue ? toggleConfig.dotOn[props.size] : toggleConfig.dotOff,
]);
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="[toggleConfig.wrapper, disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer']"
    @click="toggle"
  >
    <span :class="trackClasses">
      <span :class="dotClasses" />
    </span>

    <span v-if="label" :class="toggleConfig.label">
      {{ label }}
    </span>
  </button>
</template>
