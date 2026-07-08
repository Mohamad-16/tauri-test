<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight, ChevronRight, Slash } from "lucide-vue-next";
import { useI18n } from "@/shared/composables/useI18n";
import { breadcrumbConfig } from "./config";
import type { BreadcrumbItem, BreadcrumbProps } from "./types";

interface VisibleBreadcrumbItem extends BreadcrumbItem {
  isCollapsedPlaceholder: boolean;
  index: number;
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: "chevron",
  collapsedMobile: true,
});

const { t } = useI18n();

// Static imports mapped by the config's icon names keep tree-shaking intact.
const separatorComponents = {
  [breadcrumbConfig.separatorIcons.chevron]: ChevronRight,
  [breadcrumbConfig.separatorIcons.slash]: Slash,
  [breadcrumbConfig.separatorIcons.arrow]: ArrowRight,
};

const separatorComponent = computed(() => {
  const iconName = breadcrumbConfig.separatorIcons[props.separator];
  return separatorComponents[iconName] ?? ChevronRight;
});

const visibleItems = computed<VisibleBreadcrumbItem[]>(() => {
  if (props.items.length <= 2 || !props.collapsedMobile) {
    return props.items.map((item, idx) => ({ ...item, isCollapsedPlaceholder: false, index: idx }));
  }

  // Collapse middle items into a single ellipsis placeholder.
  const first: VisibleBreadcrumbItem = {
    ...props.items[0]!,
    isCollapsedPlaceholder: false,
    index: 0,
  };
  const last: VisibleBreadcrumbItem = {
    ...props.items[props.items.length - 1]!,
    isCollapsedPlaceholder: false,
    index: props.items.length - 1,
  };
  const placeholder: VisibleBreadcrumbItem = {
    label: "...",
    isCollapsedPlaceholder: true,
    index: 1,
  };

  return [first, placeholder, last];
});
</script>

<template>
  <nav :class="breadcrumbConfig.wrapper" :aria-label="t('core.breadcrumb.label')">
    <ol :class="breadcrumbConfig.list">
      <li v-for="(item, idx) in visibleItems" :key="item.index" :class="breadcrumbConfig.item">
        <div v-if="item.isCollapsedPlaceholder" :class="breadcrumbConfig.ellipsis">...</div>
        <a
          v-else-if="idx < visibleItems.length - 1 && item.href"
          :href="item.href"
          :class="breadcrumbConfig.link"
        >
          {{ item.label }}
        </a>
        <span v-else :class="breadcrumbConfig.current">
          {{ item.label }}
        </span>

        <component
          :is="separatorComponent"
          v-if="idx < visibleItems.length - 1"
          :class="breadcrumbConfig.separator"
        />
      </li>
    </ol>
  </nav>
</template>
