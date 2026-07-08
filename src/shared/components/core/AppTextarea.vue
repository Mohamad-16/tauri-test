<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from '@/shared/composables/useI18n'
import type { TextareaProps } from './types'
import { textareaConfig } from './config'

const props = withDefaults(defineProps<TextareaProps>(), {
  variant: 'fixed-height',
  label: '',
  placeholder: '',
  disabled: false,
  error: '',
  // 0 means "no limit": counter hidden, limit never exceeded.
  characterLimit: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const adjustHeight = () => {
  if (props.variant === 'auto-grow' && textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    adjustHeight()
  },
)

onMounted(adjustHeight)

const charCount = computed(() => props.modelValue.length)
const hasLimit = computed(() => props.characterLimit > 0)
const isLimitExceeded = computed(() => hasLimit.value && charCount.value > props.characterLimit)

const errorText = computed(() => {
  if (props.error) return props.error
  if (isLimitExceeded.value) return t('core.textarea.limitExceeded')
  return ''
})

const textareaClasses = computed(() => [
  textareaConfig.base,
  props.disabled
    ? textareaConfig.states.disabled
    : errorText.value
      ? textareaConfig.states.error
      : textareaConfig.states.normal,
])

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div :class="textareaConfig.wrapper">
    <div :class="textareaConfig.header">
      <label v-if="label" :class="textareaConfig.label">
        {{ label }}
      </label>
      <span
        v-if="hasLimit"
        class="text-[10px] font-bold"
        :class="isLimitExceeded ? textareaConfig.counter.exceeded : textareaConfig.counter.normal"
      >
        {{ charCount }}/{{ characterLimit }}
      </span>
    </div>

    <div class="relative">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="textareaConfig.rows[variant]"
        :class="textareaClasses"
        @input="handleInput"
      />
    </div>

    <p v-if="errorText" :class="textareaConfig.error">
      {{ errorText }}
    </p>
  </div>
</template>
