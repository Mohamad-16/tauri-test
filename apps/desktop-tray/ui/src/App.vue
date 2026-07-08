<script setup lang="ts">
import { onMounted } from "vue";

import { useLocaleStore } from "@/shared/stores/localeStore";
import { useThemeStore } from "@/shared/stores/themeStore";

const themeStore = useThemeStore();
const localeStore = useLocaleStore();

onMounted((): void => {
  themeStore.initializeTheme();
  localeStore.initializeLocale();
});
</script>

<template>
  <RouterView />
</template>
