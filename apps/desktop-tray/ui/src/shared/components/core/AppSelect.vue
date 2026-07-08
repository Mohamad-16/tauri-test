<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue'
import * as Icons from 'lucide-vue-next'
import { ChevronDown, Search } from 'lucide-vue-next'
import { useI18n } from '@/shared/composables/useI18n'
import type { SelectOption, SelectProps } from './types'
import { selectConfig } from './config'

const props = withDefaults(defineProps<SelectProps>(), {
  variant: 'outline',
  size: 'md',
  label: '',
  disabled: false,
  error: '',
  icon: '',
  placeholder: '',
  customPopper: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()

const isOpen = ref(false)
const searchQuery = ref('')
const rootRef = ref<HTMLElement | null>(null)

const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return normalizedOptions.value
  return normalizedOptions.value.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const selectedLabel = computed(() => {
  const found = normalizedOptions.value.find(opt => opt.value === props.modelValue)
  return found ? found.label : props.modelValue
})

const resolvedPlaceholder = computed(() => props.placeholder || t('core.select.placeholder'))

const iconComponent = computed<Component | null>(() => {
  if (!props.icon) return null
  const iconName = props.icon as keyof typeof Icons
  return iconName in Icons ? (Icons[iconName] as Component) : null
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const closeOnOutsideClick = (e: MouseEvent) => {
  if (isOpen.value && rootRef.value && !rootRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeOnOutsideClick))
onUnmounted(() => document.removeEventListener('click', closeOnOutsideClick))

const selectClasses = computed(() => [
  selectConfig.base,
  selectConfig.sizes[props.size],
  selectConfig.variants[props.variant][props.error ? 'error' : 'normal'],
  props.disabled ? selectConfig.disabled : selectConfig.enabled,
])
</script>

<template>
  <div ref="rootRef" :class="selectConfig.wrapper">
    <label v-if="label" :class="selectConfig.label">
      {{ label }}
    </label>

    <div class="relative">
      <!-- Native select mode -->
      <div v-if="!customPopper" class="relative">
        <select
          :value="modelValue"
          :disabled="disabled"
          :class="['appearance-none pr-10', selectClasses]"
          @input="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
          <option v-if="!modelValue" value="" disabled hidden>
            {{ resolvedPlaceholder }}
          </option>
          <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
          <ChevronDown :class="selectConfig.chevron" />
        </div>
        <div v-if="iconComponent" class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-subtle">
          <component :is="iconComponent" :size="16" />
        </div>
      </div>

      <!-- Custom popper mode -->
      <div v-else class="relative" @keydown.esc="isOpen = false">
        <button
          type="button"
          :disabled="disabled"
          aria-haspopup="listbox"
          :aria-expanded="isOpen"
          :class="[selectClasses, iconComponent ? 'pl-10' : '']"
          @click="toggleDropdown"
        >
          <span class="truncate font-semibold">{{ selectedLabel || resolvedPlaceholder }}</span>
          <ChevronDown :class="[selectConfig.chevron, { 'rotate-180': isOpen }]" />
        </button>

        <div v-if="iconComponent" class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-subtle">
          <component :is="iconComponent" :size="16" />
        </div>

        <div v-if="isOpen" :class="selectConfig.dropdown">
          <div :class="selectConfig.dropdownSearch">
            <Search class="w-3.5 h-3.5 text-subtle ml-1.5 mr-2" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('core.select.searchPlaceholder')"
              :class="selectConfig.dropdownSearchInput"
              @click.stop
            >
          </div>

          <div class="overflow-y-auto py-1 max-h-48" role="listbox">
            <div v-if="filteredOptions.length === 0" :class="selectConfig.empty">
              {{ t('core.select.noOptions') }}
            </div>
            <button
              v-for="opt in filteredOptions"
              :key="opt.value"
              type="button"
              role="option"
              :aria-selected="opt.value === modelValue"
              :class="[
                selectConfig.option.base,
                opt.value === modelValue ? selectConfig.option.selected : selectConfig.option.unselected,
              ]"
              @click="selectOption(opt.value)"
            >
              <span>{{ opt.label }}</span>
              <div v-if="opt.value === modelValue" :class="selectConfig.optionDot" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" :class="selectConfig.error">
      <span>{{ error }}</span>
    </p>
  </div>
</template>
