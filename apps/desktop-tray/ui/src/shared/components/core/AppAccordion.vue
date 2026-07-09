<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { accordionConfig } from "./config";
import type { AccordionProps } from "./types";

const props = withDefaults(defineProps<AccordionProps>(), {
  variant: "single-open",
});

const expandedIds = ref<string[]>([]);

function toggleItem(id: string) {
  if (props.variant === "single-open") {
    expandedIds.value = expandedIds.value.includes(id) ? [] : [id];
  } else if (expandedIds.value.includes(id)) {
    expandedIds.value = expandedIds.value.filter((item) => item !== id);
  } else {
    expandedIds.value.push(id);
  }
}

const isExpanded = (id: string) => expandedIds.value.includes(id);
</script>

<template>
  <div :class="accordionConfig.wrapper">
    <div v-for="item in items" :key="item.id" :class="accordionConfig.item">
      <button
        type="button"
        :class="accordionConfig.trigger"
        :aria-expanded="isExpanded(item.id)"
        @click="toggleItem(item.id)"
      >
        <span :class="accordionConfig.title">{{ item.title }}</span>
        <ChevronDown
          :class="[accordionConfig.chevron, { [accordionConfig.chevronOpen]: isExpanded(item.id) }]"
        />
      </button>

      <div v-if="isExpanded(item.id)" :class="accordionConfig.body">
        <slot :name="item.id">
          {{ item.content }}
        </slot>
      </div>
    </div>
  </div>
</template>
