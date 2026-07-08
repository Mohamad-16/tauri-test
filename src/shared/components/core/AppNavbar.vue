<script setup lang="ts">
import { navbarConfig } from './config'
import type { NavbarProps } from './types'

withDefaults(defineProps<NavbarProps>(), {
  fixation: 'static',
  alignment: 'split-ends',
})
</script>

<template>
  <header :class="[navbarConfig.base, navbarConfig.fixations[fixation]]">
    <div :class="[navbarConfig.inner, navbarConfig.alignments[alignment]]">
      <!-- Ordering utilities below are structural (slot placement per alignment), not themable -->
      <div
        :class="[navbarConfig.brand, alignment === 'centered-brand' ? 'justify-self-center order-2' : '']"
      >
        <slot name="brand" />
      </div>

      <div
        :class="[
          navbarConfig.links,
          alignment === 'centered-brand' ? 'justify-self-start order-1' : '',
          alignment === 'left-aligned-links' ? 'flex-1' : '',
        ]"
      >
        <slot name="links" />
      </div>

      <div
        :class="[navbarConfig.actions, alignment === 'centered-brand' ? 'justify-self-end order-3' : '']"
      >
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
