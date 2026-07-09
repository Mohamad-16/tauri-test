import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "../types/auth";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref<boolean>(false);

  const user = ref<User | null>(null);

  function login(authenticatedUser: User): void {
    isAuthenticated.value = true;
    user.value = authenticatedUser;

    localStorage.setItem("fluxbooks-auth", "true");
  }

  function logout(): void {
    isAuthenticated.value = false;
    user.value = null;

    localStorage.removeItem("fluxbooks-auth");
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
});
