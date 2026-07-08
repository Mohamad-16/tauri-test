<script setup lang="ts">
import type { RadioProps } from './types'
import { radioConfig } from './config'

const props = withDefaults(defineProps<RadioProps>(), {
  size: 'md',
  color: 'primary',
  layout: 'vertical-stack',
  disabled: false,
  label: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectOption = (val: string) => {
  if (props.disabled) return
  emit('update:modelValue', val)
}
</script>

<template>
  <div :class="radioConfig.wrapper">
    <label v-if="label" :class="radioConfig.groupLabel">
      {{ label }}
    </label>

    <div :class="radioConfig.layouts[layout]">
      <div
        v-for="opt in options"
        :key="opt.value"
        :class="[
          radioConfig.option.base,
          disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
          modelValue === opt.value ? radioConfig.option.selected : radioConfig.option.unselected,
        ]"
        @click="selectOption(opt.value)"
      >
        <div class="flex items-center h-5">
          <input
            type="radio"
            :name="name"
            :value="opt.value"
            :checked="modelValue === opt.value"
            :disabled="disabled"
            :class="[
              radioConfig.input,
              radioConfig.colors[color],
              radioConfig.sizes[size],
            ]"
            @change="emit('update:modelValue', opt.value)"
          >
        </div>

        <div class="space-y-0.5">
          <span
            class="text-xs font-bold block"
            :class="modelValue === opt.value ? radioConfig.optionLabel.selected : radioConfig.optionLabel.unselected"
          >
            {{ opt.label }}
          </span>
          <span v-if="opt.description" :class="radioConfig.optionDescription">
            {{ opt.description }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
