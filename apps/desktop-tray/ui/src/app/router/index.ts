import { createRouter, createWebHashHistory } from "vue-router";

import LoginView from "@/domains/auth/presentation/views/LoginView.vue";
import ConnectionsView from "@/domains/connections/presentation/views/ConnectionsView.vue";
import DashboardView from "@/domains/dashboard/presentation/views/DashboardView.vue";
import LogsView from "@/domains/logs/presentation/views/LogsView.vue";
import ScheduleView from "@/domains/schedule/presentation/views/ScheduleView.vue";
import StatusView from "@/domains/status/presentation/views/StatusView.vue";
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
          meta: { titleKey: "nav.dashboard" },
        },
        {
          path: "connections",
          component: ConnectionsView,
          meta: { titleKey: "nav.connections" },
        },
        {
          path: "schedule",
          component: ScheduleView,
          meta: { titleKey: "nav.schedule" },
        },
        {
          path: "status",
          component: StatusView,
          meta: { titleKey: "nav.status" },
        },
        {
          path: "logs",
          component: LogsView,
          meta: { titleKey: "nav.logs" },
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
