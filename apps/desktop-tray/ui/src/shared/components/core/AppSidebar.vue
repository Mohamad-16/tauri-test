<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, Menu } from "lucide-vue-next";
import { sidebarConfig } from "./config";
import type { SidebarProps } from "./types";
import { useI18n } from "@/shared/composables/useI18n";

const props = withDefaults(defineProps<SidebarProps>(), {
  layoutStyle: "collapsible",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { t } = useI18n();

function toggle() {
  emit("update:modelValue", !props.modelValue);
}

const widthClasses = computed(() => {
  if (props.layoutStyle === "mini-icon-rail") return sidebarConfig.widths.mini;
  if (props.layoutStyle === "collapsible") {
    return props.modelValue ? sidebarConfig.widths.expanded : sidebarConfig.widths.collapsed;
  }
  return props.modelValue ? sidebarConfig.widths.expanded : sidebarConfig.widths.mini;
});
</script>

<template>
  <aside :class="[widthClasses, sidebarConfig.base]">
    <div :class="sidebarConfig.header">
      <div
        v-if="layoutStyle !== 'mini-icon-rail' && (modelValue || layoutStyle === 'full-rail')"
        class="flex items-center gap-2"
      >
        <slot name="header-title" />
      </div>

      <button
        v-if="layoutStyle === 'collapsible' || layoutStyle === 'full-rail'"
        type="button"
        :class="sidebarConfig.toggle"
        :aria-label="t('core.sidebar.toggle')"
        @click="toggle"
      >
        <ChevronLeft v-if="modelValue" class="w-4 h-4" />
        <Menu v-else class="w-4 h-4" />
      </button>
    </div>

    <div :class="sidebarConfig.body">
      <slot />
    </div>

    <div :class="sidebarConfig.footer">
      <slot name="footer" />
    </div>
  </aside>
</template>
