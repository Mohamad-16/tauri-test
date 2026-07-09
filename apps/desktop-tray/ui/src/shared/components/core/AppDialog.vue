<script setup lang="ts">
import { watch, onMounted, onUnmounted } from "vue";
import { X } from "lucide-vue-next";
import { dialogConfig } from "./config";
import type { DialogProps } from "./types";
import { useI18n } from "@/shared/composables/useI18n";

const props = withDefaults(defineProps<DialogProps>(), {
  size: "md",
  backdropClickAllowed: true,
  escapeKeyLocked: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { t } = useI18n();

function close() {
  emit("update:modelValue", false);
}

function handleBackdropClick() {
  if (props.backdropClickAllowed) close();
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && !props.escapeKeyLocked && props.modelValue) close();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
});
</script>

<template>
  <div v-if="modelValue" :class="dialogConfig.root">
    <div :class="dialogConfig.backdrop" @click="handleBackdropClick" />

    <div
      role="dialog"
      aria-modal="true"
      :class="[
        dialogConfig.panel,
        size === 'fullscreen' ? dialogConfig.panelFullscreen : dialogConfig.panelRounded,
        dialogConfig.sizes[size],
      ]"
    >
      <div :class="dialogConfig.header">
        <h3 :class="dialogConfig.title">
          {{ title || t("core.dialog.defaultTitle") }}
        </h3>

        <button
          type="button"
          :class="dialogConfig.closeButton"
          :aria-label="t('core.dialog.close')"
          @click="close"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div :class="dialogConfig.body">
        <slot />
      </div>

      <div v-if="$slots.footer" :class="dialogConfig.footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
