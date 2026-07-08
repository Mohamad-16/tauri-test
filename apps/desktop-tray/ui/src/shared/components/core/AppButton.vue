<script setup lang="ts">
import { computed, type Component } from 'vue'
import * as Icons from 'lucide-vue-next'
import type { ButtonProps } from './types'
import { buttonConfig } from './config'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: buttonConfig.defaults.variant,
  size: buttonConfig.defaults.size,
  isLoading: false,
  disabled: false,
  icon: '',
  iconPosition: buttonConfig.defaults.iconPosition,
  type: buttonConfig.defaults.type,
  block: false,
})

const iconComponent = computed<Component | null>(() => {
  if (!props.icon) return null
  const iconName = props.icon as keyof typeof Icons
  return iconName in Icons ? (Icons[iconName] as Component) : null
})

const iconSize = computed(() => buttonConfig.iconSizes[props.size])

const buttonClasses = computed(() => [
  buttonConfig.base,
  buttonConfig.variants[props.variant],
  buttonConfig.sizes[props.size],
  props.block ? buttonConfig.block : '',
])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :class="buttonClasses"
  >
    <div
      v-if="isLoading"
      :class="[
        'border-2 border-current border-t-transparent rounded-full animate-spin shrink-0',
        buttonConfig.spinnerSizes[size],
      ]"
    />

    <component
      :is="iconComponent"
      v-if="!isLoading && iconComponent && iconPosition === 'left'"
      :size="iconSize"
      class="shrink-0"
    />

    <span class="inline-flex items-center justify-center">
      <slot />
    </span>

    <component
      :is="iconComponent"
      v-if="!isLoading && iconComponent && iconPosition === 'right'"
      :size="iconSize"
      class="shrink-0"
    />
  </button>
</template>
