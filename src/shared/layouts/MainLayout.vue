<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/domains/auth/stores/authStore";
import { useThemeStore } from "@/shared/stores/themeStore";
import { showNotification } from "@/shared/infrastructure/tauri/notificationService";
import { useI18n } from "vue-i18n";
import { themeClasses } from "@/shared/theme/themeClasses";

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

function changeLanguage(language: string): void {
  locale.value = language;
  localStorage.setItem("fluxbooks-language", language);
}

function logout(): void {
  authStore.logout();
  localStorage.removeItem("fluxbooks-auth");

  router.push("/login");
}
async function testNotification(): Promise<void> {
  await showNotification("FluxBooks Test", "MANUAL BUTTON CLICK", "https://encrypted-tbn0.gscltatic.com/images?q=tbn:ANd9GcRMWEsAQBJZt3vranfFF4D9GEmNQ77oBSxy_dsq_XLNFMuD9TlQhJ9FTBAJ&s=10");
}
</script>

<template>
  <div :class="themeClasses.page" class="flex h-screen">
    <aside :class="themeClasses.sidebar" class="w-64 border-r">
      <div class="border-b border-slate-200 p-6 dark:border-slate-800">
        <h1 class="text-xl font-bold text-emerald-600">FluxBooks</h1>

        <p class="text-xs text-slate-500 dark:text-slate-400">Client Tray</p>
      </div>

      <nav class="p-4">
        <RouterLink
          to="/dashboard"
          class="flex rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {{ t("common.dashboard") }}
        </RouterLink>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col">
      <header
        class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <h2 class="font-semibold">{{ t("common.dashboard") }}</h2>
        </div>

        <div class="flex items-center gap-3">
          <select
            class="rounded-lg border px-2 py-2 dark:bg-slate-800"
            :value="locale"
            @change="changeLanguage(($event.target as HTMLSelectElement).value)"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="fr">FR</option>
          </select>
          <button
            class="rounded-xl bg-blue-300 px-3 py-2 dark:bg-blue-300 dark:text-white"
            @click="testNotification"
          >
            {{ t("common.test") }}
          </button>
          <span
            class="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600"
          >
            {{ t("common.connected") }}
          </span>

          <button
            class="rounded-lg border border-none px-3 py-2 cursor-pointer"
            @click="themeStore.toggleTheme()"
          >
            {{ themeStore.theme === "dark" ? "☀" : "🌙" }}
          </button>

          <button
            :class="themeClasses.dangerButton"
            class="rounded-lg px-3 py-2"
            @click="logout"
          >
            {{ t("common.logout") }}
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
