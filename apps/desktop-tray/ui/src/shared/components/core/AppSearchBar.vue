<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { Command, RefreshCw, Search, Sparkles } from 'lucide-vue-next'
import type { SearchBarProps, SearchResult } from './types'
import { searchBarConfig } from './config'
import { useI18n } from '@/shared/composables/useI18n'

const props = withDefaults(defineProps<SearchBarProps>(), {
  variant: 'inline-input',
  placeholder: '',
  results: () => [],
  isLoading: false,
})

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'select', item: SearchResult): void
}>()

const { t } = useI18n()
const slots = useSlots()

const query = ref('')
const showPalette = ref(false)
const isDebouncing = ref(false)

const placeholderText = computed(() => props.placeholder || t('core.searchbar.placeholder'))

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(query, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  if (!newQuery) {
    isDebouncing.value = false
    emit('search', '')
    return
  }

  isDebouncing.value = true
  debounceTimeout = setTimeout(() => {
    isDebouncing.value = false
    emit('search', newQuery)
  }, searchBarConfig.debounceMs)
})

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (props.variant === 'command-palette-modal') {
      showPalette.value = !showPalette.value
    }
  }
  if (e.key === 'Escape') {
    showPalette.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (debounceTimeout) clearTimeout(debounceTimeout)
})

const selectResult = (item: SearchResult) => {
  emit('select', item)
  showPalette.value = false
}
</script>

<template>
  <div :class="searchBarConfig.wrapper">
    <!-- 1. Inline input variant -->
    <div v-if="variant === 'inline-input'" class="relative">
      <div :class="searchBarConfig.inputIcon">
        <Search class="w-4 h-4 text-subtle" />
      </div>

      <input
        v-model="query"
        type="text"
        :placeholder="placeholderText"
        :class="searchBarConfig.input"
      >

      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <kbd :class="searchBarConfig.kbd">
          <Command class="w-2.5 h-2.5" />K
        </kbd>
        <div v-if="isLoading || isDebouncing" :class="[searchBarConfig.spinner, 'ml-2']">
          <RefreshCw class="w-3.5 h-3.5" />
        </div>
      </div>
    </div>

    <!-- 2. Command palette modal variant -->
    <div v-else>
      <button
        type="button"
        :class="searchBarConfig.paletteTrigger"
        @click="showPalette = true"
      >
        <div class="flex items-center gap-2.5">
          <Search class="w-4 h-4 text-subtle" />
          <span>{{ placeholderText }}</span>
        </div>
        <kbd :class="searchBarConfig.kbd">
          <Command class="w-2.5 h-2.5" />K
        </kbd>
      </button>

      <div
        v-if="showPalette"
        :class="searchBarConfig.overlay"
        @click.self="showPalette = false"
      >
        <div :class="searchBarConfig.palette">
          <div :class="searchBarConfig.paletteHeader">
            <div class="flex items-center gap-3 flex-1">
              <Search class="w-5 h-5 text-accent shrink-0" />
              <input
                v-model="query"
                type="text"
                :placeholder="placeholderText"
                :class="searchBarConfig.paletteInput"
                autofocus
              >
            </div>

            <div class="flex items-center gap-2">
              <div v-if="isLoading || isDebouncing" :class="searchBarConfig.spinner">
                <RefreshCw class="w-4 h-4" />
              </div>
              <kbd :class="searchBarConfig.kbd">ESC</kbd>
            </div>
          </div>

          <div :class="searchBarConfig.resultsPane">
            <div v-if="results.length === 0 && !isLoading" class="px-4 py-8 text-center">
              <Sparkles class="w-8 h-8 text-accent mx-auto mb-2" />
              <p :class="searchBarConfig.emptyTitle">{{ t('core.searchbar.noResults') }}</p>
              <p :class="searchBarConfig.emptyHint">{{ t('core.searchbar.noResultsHint') }}</p>
            </div>

            <div v-else>
              <button
                v-for="item in results"
                :key="item.id"
                type="button"
                :class="searchBarConfig.result"
                @click="selectResult(item)"
              >
                <div class="space-y-0.5">
                  <div class="flex items-center gap-1.5">
                    <span :class="searchBarConfig.resultCategory">{{ item.category }}</span>
                    <span :class="searchBarConfig.resultTitle">{{ item.title }}</span>
                  </div>
                  <p v-if="item.subtitle" :class="searchBarConfig.resultSubtitle">
                    {{ item.subtitle }}
                  </p>
                </div>
                <div :class="searchBarConfig.resultAction">
                  <span>{{ t('core.searchbar.run') }}</span>
                  <span>&rarr;</span>
                </div>
              </button>
            </div>
          </div>

          <div
            v-if="slots.footer"
            class="bg-surface-muted border-t border-border px-4 py-2 shrink-0"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
