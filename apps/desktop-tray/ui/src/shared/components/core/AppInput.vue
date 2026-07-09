<script setup lang="ts">
import { computed, ref, useId, type Component } from "vue";
import * as Icons from "lucide-vue-next";
import { useI18n } from "@/shared/composables/useI18n";
import type { InputProps } from "./types";
import { inputConfig } from "./config";

const props = withDefaults(defineProps<InputProps>(), {
  variant: "default",
  label: "",
  placeholder: "",
  modelValue: "",
  error: "",
  icon: "",
  disabled: false,
  type: "text",
  id: "",
  autocomplete: "",
  required: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { t } = useI18n();

const showPassword = ref(false);
const fallbackId = useId();
const inputId = computed(() => props.id || fallbackId);

const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const inputType = computed(() => {
  if (props.variant === "password") {
    return showPassword.value ? "text" : "password";
  }
  if (props.variant === "search") {
    return "text";
  }
  return props.type;
});

const resolvedIconName = computed(() => {
  if (props.variant === "search" && !props.icon) {
    return "Search";
  }
  return props.icon;
});

const iconComponent = computed<Component | null>(() => {
  if (!resolvedIconName.value) return null;
  const iconName = resolvedIconName.value as keyof typeof Icons;
  return iconName in Icons ? (Icons[iconName] as Component) : null;
});

const passwordToggleIcon = computed<Component>(() => {
  return showPassword.value ? (Icons.EyeOff as Component) : (Icons.Eye as Component);
});

const inputClasses = computed(() => [
  inputConfig.base,
  props.error ? inputConfig.states.error : inputConfig.states.normal,
  iconComponent.value ? inputConfig.paddings.withIcon : inputConfig.paddings.plain,
  props.variant === "password" ? inputConfig.paddings.withToggle : inputConfig.paddings.plainRight,
]);
</script>

<template>
  <div :class="inputConfig.wrapper">
    <label v-if="label" :for="inputId" :class="inputConfig.label">
      {{ label }}
    </label>

    <div class="relative group w-full">
      <div v-if="iconComponent" :class="inputConfig.iconWrap">
        <component :is="iconComponent" :size="16" />
      </div>

      <input
        :id="inputId"
        :disabled="disabled"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete || undefined"
        :required="required"
        :class="inputClasses"
        @input="handleInputChange"
      />

      <button
        v-if="variant === 'password'"
        type="button"
        :disabled="disabled"
        :aria-pressed="showPassword"
        :class="inputConfig.passwordToggle"
        @click="showPassword = !showPassword"
      >
        <component :is="passwordToggleIcon" :size="16" aria-hidden="true" />
        <span class="sr-only">{{ t("core.input.togglePassword") }}</span>
      </button>
    </div>

    <p v-if="error" :class="inputConfig.error">
      <span :class="inputConfig.errorDot" />
      {{ error }}
    </p>
  </div>
</template>
