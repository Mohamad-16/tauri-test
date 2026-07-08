<script setup lang="ts">
import { watch, onMounted, onUnmounted } from "vue";
import { X } from "lucide-vue-next";
import { drawerConfig } from "./config";
import type { DrawerProps } from "./types";
import { useI18n } from "@/shared/composables/useI18n";

const props = withDefaults(defineProps<DrawerProps>(), {
  anchor: "slide-from-right",
  width: "md",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { t } = useI18n();

function close() {
  emit("update:modelValue", false);
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue) close();
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
  <div v-if="modelValue" :class="drawerConfig.root">
    <div :class="drawerConfig.backdrop" @click="close" />

    <div
      role="dialog"
      aria-modal="true"
      :class="[drawerConfig.panel, drawerConfig.anchors[anchor], drawerConfig.widths[width]]"
    >
      <div :class="drawerConfig.header">
        <h3 v-if="title" :class="drawerConfig.title">
          {{ title }}
        </h3>

        <!-- ml-auto keeps the close button right-aligned when no title is rendered -->
        <button
          type="button"
          :class="[drawerConfig.closeButton, 'ml-auto']"
          :aria-label="t('core.drawer.close')"
          @click="close"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div :class="drawerConfig.body">
        <slot />
      </div>

      <div v-if="$slots.footer" :class="drawerConfig.footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
