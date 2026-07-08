<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { authService } from "@/domains/auth/application/authService";
import { useAuthStore } from "@/domains/auth/stores/authStore";
import { AppButton, AppCard, AppInput } from "@/shared/components/core";
import { useI18n } from "@/shared/composables/useI18n";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const email = ref("admin@fluxbooks.com");
const password = ref("Password@123");

const errorMessage = ref("");
const loading = ref(false);

async function handleLogin(): Promise<void> {
  try {
    loading.value = true;
    errorMessage.value = "";

    const user = await authService.login({
      email: email.value,
      password: password.value,
    });

    authStore.login(user);

    await router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t("login.failed");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
    <div class="w-full max-w-md">
      <AppCard variant="elevated">
        <div class="mb-8">
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-bold text-on-primary"
          >
            {{ t("login.logo") }}
          </div>

          <h1 class="text-3xl font-bold text-foreground">
            {{ t("login.title") }}
          </h1>

          <p class="mt-2 text-muted">
            {{ t("login.subtitle") }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <AppInput
            v-model="email"
            type="email"
            autocomplete="email"
            required
            :label="t('login.email')"
            icon="Mail"
          />

          <AppInput
            v-model="password"
            variant="password"
            autocomplete="current-password"
            required
            :label="t('login.password')"
            icon="Lock"
            :error="errorMessage"
          />

          <AppButton type="submit" block :is-loading="loading">
            {{ loading ? t("login.signingin") : t("login.signin") }}
          </AppButton>
        </form>

        <div class="mt-8 flex justify-center border-t border-border pt-4 text-xs text-subtle">
          {{ t("login.demo") }}: admin@fluxbooks.com / Password@123
        </div>
      </AppCard>
    </div>
  </div>
</template>
