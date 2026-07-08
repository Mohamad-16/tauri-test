<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { CheckboxProps } from "./types";
import { checkboxConfig } from "./config";

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  size: "md",
  color: "primary",
  disabled: false,
  label: "",
  description: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const checkboxRef = ref<HTMLInputElement | null>(null);

const updateIndeterminate = () => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = props.indeterminate;
  }
};

watch(() => props.indeterminate, updateIndeterminate);
onMounted(updateIndeterminate);

const toggleCheck = () => {
  if (props.disabled) return;
  emit("update:modelValue", !props.modelValue);
};
</script>

<template>
  <div
    :class="[checkboxConfig.wrapper, disabled ? checkboxConfig.disabled : checkboxConfig.enabled]"
    @click="toggleCheck"
  >
    <div class="flex items-center h-5">
      <input
        ref="checkboxRef"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :class="[checkboxConfig.input, checkboxConfig.colors[color], checkboxConfig.sizes[size]]"
        @click.stop
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
    </div>

    <div v-if="label || description" class="space-y-0.5">
      <span v-if="label" :class="checkboxConfig.label">
        {{ label }}
      </span>
      <span v-if="description" :class="checkboxConfig.description">
        {{ description }}
      </span>
    </div>
  </div>
</template>
