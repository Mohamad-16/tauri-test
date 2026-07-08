<script setup lang="ts">
import { computed, type Component } from 'vue'
import * as Icons from 'lucide-vue-next'
import { useI18n } from '@/shared/composables/useI18n'
import { statusPillConfig } from './config'
import type { StatusPillProps } from './types'

const props = withDefaults(defineProps<StatusPillProps>(), {
  variant: 'solid-fill',
  text: '',
})

const { t } = useI18n()

const pillClasses = computed(() => statusPillConfig.variants[props.variant][props.type])

const iconComponent = computed(() => {
  const iconName = statusPillConfig.icons[props.type] as keyof typeof Icons
  return iconName in Icons ? (Icons[iconName] as Component) : (Icons.HelpCircle as Component)
})

const label = computed(() => props.text || t(`core.statusPill.${props.type}`))
</script>

<template>
  <span :class="[statusPillConfig.base, pillClasses]">
    <component :is="iconComponent" class="w-3.5 h-3.5 shrink-0" />
    <span>{{ label }}</span>
  </span>
</template>
