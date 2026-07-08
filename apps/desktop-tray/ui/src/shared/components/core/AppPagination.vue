<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { PaginationProps } from './types'
import { paginationConfig } from './config'
import { useI18n } from '@/shared/composables/useI18n'

const props = withDefaults(defineProps<PaginationProps>(), {
  variant: 'numeric-steps',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const { t } = useI18n()

const setPage = (page: number) => {
  if (page < 1 || page > props.totalPages) return
  emit('update:modelValue', page)
}

const visiblePages = computed<(number | '...')[]>(() => {
  const current = props.modelValue
  const total = props.totalPages

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 3) {
    return [1, 2, 3, '...', total]
  }
  if (current >= total - 2) {
    return [1, '...', total - 2, total - 1, total]
  }
  return [1, '...', current, '...', total]
})
</script>

<template>
  <nav :class="paginationConfig.wrapper">
    <span :class="paginationConfig.metrics">
      {{ t('core.pagination.page') }}
      <span :class="paginationConfig.metricsValue">{{ modelValue }}</span>
      {{ t('core.pagination.of') }}
      <span :class="paginationConfig.metricsValue">{{ totalPages }}</span>
    </span>

    <div class="flex items-center gap-1">
      <template v-if="variant === 'simple-arrows'">
        <button
          type="button"
          :disabled="modelValue === 1"
          :class="[paginationConfig.arrowButton, paginationConfig.arrowSizes[size]]"
          @click="setPage(modelValue - 1)"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
          <span>{{ t('core.pagination.prev') }}</span>
        </button>

        <button
          type="button"
          :disabled="modelValue === totalPages"
          :class="[paginationConfig.arrowButton, paginationConfig.arrowSizes[size]]"
          @click="setPage(modelValue + 1)"
        >
          <span>{{ t('core.pagination.next') }}</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          :disabled="modelValue === 1"
          :class="paginationConfig.iconButton"
          :aria-label="t('core.pagination.prev')"
          @click="setPage(modelValue - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <div class="flex items-center gap-1">
          <template v-for="(p, index) in visiblePages" :key="index">
            <span v-if="p === '...'" :class="paginationConfig.ellipsis">
              ...
            </span>
            <button
              v-else
              type="button"
              :class="[
                paginationConfig.page.base,
                p === modelValue ? paginationConfig.page.active : paginationConfig.page.inactive,
                paginationConfig.pageSizes[size],
              ]"
              @click="setPage(p)"
            >
              {{ p }}
            </button>
          </template>
        </div>

        <button
          type="button"
          :disabled="modelValue === totalPages"
          :class="paginationConfig.iconButton"
          :aria-label="t('core.pagination.next')"
          @click="setPage(modelValue + 1)"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </template>
    </div>
  </nav>
</template>
