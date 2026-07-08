<script setup lang="ts">
import { computed } from 'vue'
import { User } from 'lucide-vue-next'
import { useI18n } from '@/shared/composables/useI18n'
import { avatarConfig } from './config'
import type { AvatarProps } from './types'

const props = withDefaults(defineProps<AvatarProps>(), {
  imageUrl: '',
  initials: '',
  shape: 'circle',
  size: 'md',
})

const { t } = useI18n()

const sizeClasses = computed(() => avatarConfig.sizes[props.size])
const shapeClasses = computed(() => avatarConfig.shapes[props.shape])
</script>

<template>
  <div :class="[avatarConfig.base, sizeClasses, shapeClasses]">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="t('core.avatar.alt')"
      referrerpolicy="no-referrer"
      class="w-full h-full object-cover"
    >

    <span v-else-if="initials" :class="avatarConfig.initials">
      {{ initials.slice(0, 2) }}
    </span>

    <User v-else :class="avatarConfig.placeholderIcon" />
  </div>
</template>
