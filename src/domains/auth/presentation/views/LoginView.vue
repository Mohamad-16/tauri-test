<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/domains/auth/application/authService";
import { useAuthStore } from "@/domains/auth/stores/authStore";
import { useI18n } from "vue-i18n";
import { themeClasses } from "@/shared/theme/themeClasses";
import EyeClose from "@/assets/images/eye-close.svg";
import EyeOpen from "@/assets/images/eye-open.svg";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const email = ref("admin@fluxbooks.com");
const password = ref("Password@123");

const errorMessage = ref("");
const loading = ref(false);

const isPasswordVisible = ref(false);
const passwordInputType = computed(() =>
  isPasswordVisible.value ? "text" : "password"
);
const eyeIconSrc = computed(() =>
  isPasswordVisible.value ? EyeOpen : EyeClose
);

async function handleLogin(): Promise<void> {
  console.log("CLICKED");

  try {
    loading.value = true;

    console.log("BEFORE LOGIN");

    const user = await authService.login({
      email: email.value,
      password: password.value,
    });

    console.log("AFTER LOGIN");

    authStore.login(user);

    console.log("LOCAL STORAGE:", localStorage.getItem("fluxbooks-auth"));

    await router.push("/dashboard");

    console.log("ROUTER PUSH COMPLETE");
  } catch (error) {
    console.error(error);

    errorMessage.value =
      error instanceof Error ? error.message : "Login failed";
  } finally {
    loading.value = false;
  }
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
  <div
    :class="themeClasses.page"
    class="flex min-h-screen items-center justify-center px-6"
  >
    <div
      :class="themeClasses.card"
      class="w-full max-w-md rounded-3xl border border-slate-200 p-8 shadow-2xl dark:border-slate-800"
    >
      <div class="mb-8">
        <div
          class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white"
        >
          {{ t("login.logo") }}
        </div>

        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          {{ t("login.title") }}
        </h1>

        <p class="mt-2 text-slate-500 dark:text-slate-400">
          {{ t("login.subtitle") }}
        </p>
      </div>

      <!-- keep the remaining form exactly as-is -->
      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm text-slate-500 dark:text-slate-200">
            {{ t("login.email") }}
          </label>

          <input
            v-model="email"
            type="email"
            class="w-full rounded-xl border border-slate-300 bg-slate-200 dark:bg-slate-800  px-4 py-3 dark:text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-500 dark:text-slate-200">
            {{ t("login.password") }}
          </label>

          <div class="relative">
            <input
              v-model="password"
              :type="passwordInputType"
              class="w-full rounded-xl border border-slate-300 bg-slate-200 dark:bg-slate-800  px-4 py-3 pr-12 dark:text-white outline-none focus:border-emerald-500"
            />

            <!-- eye icon -->
            <span>
              <img
                :src="eyeIconSrc"
                alt=""
                class="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer dark:invert dark:brightness-0"
                @click="togglePasswordVisibility"
              />
            </span>
          </div>


        </div>

        <button
          class="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? t("login.signingin") : t("login.signin") }}
        </button>

        <p v-if="errorMessage" class="text-sm text-red-400">
          {{ errorMessage }}
        </p>
      </div>

      <div
        class="flex justify-center mt-8 border-t border-slate-300 pt-4 text-xs text-slate-500 dark:text-slate-400"
      >
        {{ t("login.demo") }}: admin@fluxbooks.com / Password@123
      </div>
    </div>
  </div>
</template>
