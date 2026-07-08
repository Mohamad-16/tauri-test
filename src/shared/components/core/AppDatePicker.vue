<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { DatePickerPreset, DatePickerProps, DateRange } from './types'
import { datePickerConfig } from './config'
import { useI18n } from '@/shared/composables/useI18n'

const props = withDefaults(defineProps<DatePickerProps>(), {
  variant: 'single-date',
  label: '',
  disabled: false,
  presets: () => [],
  lockedNotice: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | DateRange): void
}>()

const { t } = useI18n()

const rootEl = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const isRange = computed(() => props.variant === 'date-range')

const rangeValue = computed<DateRange>(() =>
  typeof props.modelValue === 'object' && props.modelValue !== null
    ? props.modelValue
    : { start: '', end: '' },
)
const singleValue = computed(() =>
  typeof props.modelValue === 'string' ? props.modelValue : '',
)

/* --------------------------------- view state -------------------------------- */

// Local string math only — no Date -> ISO conversions, so no timezone drift.
const pad = (n: number) => String(n).padStart(2, '0')
const toDateString = (year: number, monthIndex: number, day: number) =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`

function anchorViewDate(): { year: number, month: number } {
  const anchor = isRange.value ? rangeValue.value.start : singleValue.value
  if (anchor && anchor.length >= 7) {
    const year = Number(anchor.slice(0, 4))
    const month = Number(anchor.slice(5, 7)) - 1
    if (!Number.isNaN(year) && month >= 0 && month <= 11) return { year, month }
  }
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() }
}

const initialView = anchorViewDate()
const viewYear = ref(initialView.year)
const viewMonth = ref(initialView.month)

watch(isOpen, (open) => {
  if (!open) return
  const view = anchorViewDate()
  viewYear.value = view.year
  viewMonth.value = view.month
})

/* -------------------------------- calendar grid ------------------------------- */

const monthNames = computed(() => t('core.datepicker.months').split(','))
const weekdays = computed(() => t('core.datepicker.weekdays').split(','))

const monthTitle = computed(() => `${monthNames.value[viewMonth.value] ?? ''} ${viewYear.value}`)

// Monday-first: JS getDay() is Sunday=0, shift so Monday=0.
const leadingOffset = computed(
  () => (new Date(viewYear.value, viewMonth.value, 1).getDay() + 6) % 7,
)

const calendarDays = computed(() => {
  const count = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  return Array.from({ length: count }, (_, i) => toDateString(viewYear.value, viewMonth.value, i + 1))
})

const isDayDisabled = (date: string) =>
  Boolean((props.minDate && date < props.minDate) || (props.maxDate && date > props.maxDate))

/* ------------------------------- month navigation ----------------------------- */

const goToMonth = (delta: number) => {
  const target = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = target.getFullYear()
  viewMonth.value = target.getMonth()
}

const prevDisabled = computed(() => {
  if (!props.minDate) return false
  const lastOfPrev = new Date(viewYear.value, viewMonth.value, 0)
  return toDateString(lastOfPrev.getFullYear(), lastOfPrev.getMonth(), lastOfPrev.getDate()) < props.minDate
})

const nextDisabled = computed(() => {
  if (!props.maxDate) return false
  const firstOfNext = new Date(viewYear.value, viewMonth.value + 1, 1)
  return toDateString(firstOfNext.getFullYear(), firstOfNext.getMonth(), 1) > props.maxDate
})

/* --------------------------------- selection ---------------------------------- */

const selectDate = (date: string) => {
  if (isRange.value) {
    const { start, end } = rangeValue.value
    if (!start || (start && end)) {
      emit('update:modelValue', { start: date, end: '' })
    } else {
      if (date < start) {
        emit('update:modelValue', { start: date, end: start })
      } else {
        emit('update:modelValue', { start, end: date })
      }
      isOpen.value = false
    }
  } else {
    emit('update:modelValue', date)
    isOpen.value = false
  }
}

const isSelected = (date: string) => {
  if (isRange.value) {
    return rangeValue.value.start === date || rangeValue.value.end === date
  }
  return singleValue.value === date
}

const isInRange = (date: string) => {
  if (!isRange.value) return false
  const { start, end } = rangeValue.value
  return Boolean(start && end && date > start && date < end)
}

const dayClass = (date: string) => [
  datePickerConfig.day.base,
  isDayDisabled(date)
    ? datePickerConfig.day.disabled
    : isSelected(date)
      ? datePickerConfig.day.selected
      : isInRange(date)
        ? datePickerConfig.day.inRange
        : datePickerConfig.day.normal,
]

const applyPreset = (preset: DatePickerPreset) => {
  emit('update:modelValue', preset.value)
  isOpen.value = false
}

/* ---------------------------------- display ----------------------------------- */

const formattedValue = computed(() => {
  if (isRange.value) {
    const { start, end } = rangeValue.value
    if (!start || !end) return t('core.datepicker.selectRange')
    return `${start} ${t('core.datepicker.rangeSeparator')} ${end}`
  }
  return singleValue.value || t('core.datepicker.selectDate')
})

const triggerClass = computed(() => [
  datePickerConfig.trigger,
  props.disabled
    ? datePickerConfig.triggerStates.disabled
    : datePickerConfig.triggerStates.normal,
])

/* ------------------------------ dismiss handling ------------------------------ */

const handleDocumentClick = (event: MouseEvent) => {
  if (isOpen.value && rootEl.value && !rootEl.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
  <div ref="rootEl" :class="datePickerConfig.wrapper">
    <label v-if="label" :class="datePickerConfig.label">
      {{ label }}
    </label>

    <div class="relative">
      <button
        type="button"
        :disabled="disabled"
        :class="triggerClass"
        @click="isOpen = !isOpen"
      >
        <span class="truncate">{{ formattedValue }}</span>
        <CalendarIcon class="w-4 h-4 text-subtle shrink-0" />
      </button>

      <div v-if="isOpen" :class="datePickerConfig.popover">
        <div :class="datePickerConfig.header">
          <button
            type="button"
            :class="datePickerConfig.navButton"
            :disabled="prevDisabled"
            :aria-label="t('core.datepicker.prevMonth')"
            @click="goToMonth(-1)"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span :class="datePickerConfig.monthLabel">{{ monthTitle }}</span>
          <button
            type="button"
            :class="datePickerConfig.navButton"
            :disabled="nextDisabled"
            :aria-label="t('core.datepicker.nextMonth')"
            @click="goToMonth(1)"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <div v-if="presets.length > 0" class="grid grid-cols-2 gap-2 mb-3">
          <button
            v-for="preset in presets"
            :key="preset.label"
            type="button"
            :class="datePickerConfig.preset"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </button>
        </div>

        <div v-if="lockedNotice" :class="datePickerConfig.lockedNotice">
          {{ t('core.datepicker.periodLocked') }}
        </div>

        <div :class="datePickerConfig.weekday">
          <span v-for="day in weekdays" :key="day">{{ day }}</span>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <span v-for="n in leadingOffset" :key="`offset-${n}`" />
          <button
            v-for="date in calendarDays"
            :key="date"
            type="button"
            :disabled="isDayDisabled(date)"
            :class="dayClass(date)"
            @click="selectDate(date)"
          >
            {{ Number(date.slice(8, 10)) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
