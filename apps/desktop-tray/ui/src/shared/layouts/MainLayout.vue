<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

import { useAuthStore } from "@/domains/auth/stores/authStore";
import {
  AppButton,
  AppNavbar,
  AppSelect,
  AppSidebar,
  AppStatusPill,
  type SelectOption,
} from "@/shared/components/core";
import { useI18n } from "@/shared/composables/useI18n";
import { showNotification } from "@/shared/infrastructure/tauri/notificationService";
import { useLocaleStore } from "@/shared/stores/localeStore";
import { useThemeStore } from "@/shared/stores/themeStore";
import { isLocaleCode } from "@/shared/localization/locales";
import { isThemeMode } from "@/shared/theme";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const localeStore = useLocaleStore();

const isSidebarOpen = ref(true);

interface NavItem {
  to: string;
  labelKey: string;
}

const navItems: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.dashboard" },
  { to: "/connections", labelKey: "nav.connections" },
  { to: "/schedule", labelKey: "nav.schedule" },
  { to: "/status", labelKey: "nav.status" },
  { to: "/logs", labelKey: "nav.logs" },
];

const pageTitle = computed(() =>
  t(typeof route.meta.titleKey === "string" ? route.meta.titleKey : "nav.dashboard")
);

const themeOptions = computed<SelectOption[]>(() =>
  themeStore.availableThemes.map((mode) => ({
    value: mode,
    label: t(`theme.${mode}`),
  }))
);

const languageOptions = computed<SelectOption[]>(() =>
  localeStore.availableLocales.map((locale) => ({
    value: locale.code,
    label: locale.label,
  }))
);

function changeTheme(mode: string): void {
  if (isThemeMode(mode)) {
    themeStore.setTheme(mode);
  }
}

function changeLanguage(code: string): void {
  if (isLocaleCode(code)) {
    localeStore.setLocale(code);
  }
}

function logout(): void {
  authStore.logout();
  localStorage.removeItem("fluxbooks-auth");

  router.push("/login");
}

async function testNotification(): Promise<void> {
  await showNotification(t("common.appName"), t("common.test"));
}
</script>

<template>
  <div class="flex h-screen bg-background text-foreground">
    <AppSidebar v-model="isSidebarOpen" layout-style="collapsible">
      <template #header-title>
        <span class="text-lg font-bold text-primary">
          {{ t("common.appName") }}
        </span>
      </template>

      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        active-class="bg-primary/10 !text-primary"
      >
        {{ t(item.labelKey) }}
      </RouterLink>

      <template #footer>
        <p class="text-xs font-medium text-subtle">
          {{ t("common.tagline") }}
        </p>
      </template>
    </AppSidebar>

    <div class="flex min-w-0 flex-1 flex-col">
      <AppNavbar fixation="static" alignment="split-ends">
        <template #brand>
          <h2 class="text-sm font-bold uppercase tracking-wider text-foreground">
            {{ pageTitle }}
          </h2>
        </template>

        <template #actions>
          <AppStatusPill type="success" :text="t('common.connected')" variant="border-only" />

          <div class="w-32">
            <AppSelect
              :model-value="localeStore.locale"
              :options="languageOptions"
              size="sm"
              :aria-label="t('language.label')"
              @update:model-value="changeLanguage"
            />
          </div>

          <div class="w-32">
            <AppSelect
              :model-value="themeStore.theme"
              :options="themeOptions"
              size="sm"
              :aria-label="t('theme.label')"
              @update:model-value="changeTheme"
            />
          </div>

          <AppButton variant="ghost" size="sm" icon="Bell" @click="testNotification">
            {{ t("common.test") }}
          </AppButton>

          <AppButton variant="danger" size="sm" icon="LogOut" @click="logout">
            {{ t("common.logout") }}
          </AppButton>
        </template>
      </AppNavbar>

      <main class="flex-1 overflow-auto bg-background p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
