<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Cloud, CloudLightning, Database, Wifi, WifiOff } from 'lucide-vue-next'
import { offlineQueueConfig } from './config'
import type { OfflineQueueProps } from './types'
import { useI18n } from '@/shared/composables/useI18n'

const props = withDefaults(defineProps<OfflineQueueProps>(), {
  pendingCount: 0,
})

const { t } = useI18n()

// Static map resolving offlineQueueConfig.statuses[*].iconName to components.
const statusIcons: Record<string, Component> = { Cloud, CloudLightning, Database }

const statusConfig = computed(() => offlineQueueConfig.statuses[props.status])
const statusIcon = computed<Component>(() => statusIcons[statusConfig.value.iconName] ?? Cloud)

const isOffline = computed(() => props.status === 'local-cache-warning')

const title = computed(() => {
  if (props.status === 'pending-upload') return t('core.offlineQueue.pendingTitle')
  if (props.status === 'local-cache-warning') return t('core.offlineQueue.cacheTitle')
  return t('core.offlineQueue.clearTitle')
})

const body = computed(() => {
  if (props.status === 'pending-upload') {
    return t('core.offlineQueue.pendingBody', { count: props.pendingCount })
  }
  if (props.status === 'local-cache-warning') {
    return t('core.offlineQueue.cacheBody', { count: props.pendingCount })
  }
  return t('core.offlineQueue.clearBody')
})
</script>

<template>
  <div :class="[offlineQueueConfig.base, statusConfig.container]">
    <div :class="[offlineQueueConfig.iconWrap, statusConfig.icon]">
      <component :is="statusIcon" class="w-5 h-5 shrink-0" />
    </div>

    <div class="space-y-0.5">
      <div class="flex items-center gap-1.5">
        <span :class="offlineQueueConfig.title">{{ title }}</span>
        <div
          :class="[
            offlineQueueConfig.connectionPill,
            isOffline ? offlineQueueConfig.connection.offline : offlineQueueConfig.connection.online,
          ]"
        >
          <WifiOff v-if="isOffline" class="w-3 h-3" />
          <Wifi v-else class="w-3 h-3" />
          <span>{{ isOffline ? t('core.offlineQueue.offlineLabel') : t('core.offlineQueue.onlineLabel') }}</span>
        </div>
      </div>
      <p :class="offlineQueueConfig.body">
        {{ body }}
      </p>
    </div>
  </div>
</template>
