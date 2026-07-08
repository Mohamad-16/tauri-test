import { createRouter, createWebHashHistory } from "vue-router";

import LoginView from "@/domains/auth/presentation/views/LoginView.vue";
import DashboardView from "@/domains/dashboard/presentation/views/DashboardView.vue";
import MainLayout from "@/shared/layouts/MainLayout.vue";

export const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/",
      redirect: () => {
        const authData = localStorage.getItem("fluxbooks-auth");

        return authData === "true" ? "/dashboard" : "/login";
      },
    },

    {
      path: "/login",
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },

    {
      path: "/",
      component: MainLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "dashboard",
          component: DashboardView,
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const hasSession = localStorage.getItem("fluxbooks-auth") === "true";

  if (to.meta.requiresAuth && !hasSession) {
    return "/login";
  }

  if (to.meta.guestOnly && hasSession) {
    return "/dashboard";
  }

  return true;
});
