<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDashboardStore } from "@/domains/dashboard/stores/dashboardStore";
import { useI18n } from "vue-i18n";
import { themeClasses } from "@/shared/theme/themeClasses";
import { mockFirmClients, type FirmClient } from "./clients-mock";

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const {
  evidenceHealth,
  connectionStatus,
  lastSync,
  workspaceName,
  workspaceId,
  incomingFiles,
  groupedDocuments,
  readyForReview,
  rejectedFiles,
  reviewBacklog,
  processingQueue,
  recentActivities,
} = storeToRefs(dashboardStore);

function uploadEvidence(): void {
  dashboardStore.uploadEvidence();
}

const clients = ref<FirmClient[]>([...mockFirmClients]);
const activeStatusFilter = ref<string>("All");

const filteredClients = computed(() => {
  if (activeStatusFilter.value === "All") return clients.value;
  return clients.value.filter((c: FirmClient) => c.status === activeStatusFilter.value);
});

const clientForm = reactive<{
  id: string;
  name: string;
  email: string;
  role: string;
  status: FirmClient["status"];
  rights: FirmClient["rights"];
  createdAt: string;
}>({
  id: "",
  name: "",
  email: "",
  role: "Client Admin",
  status: "Invited",
  rights: "Read",
  createdAt: "",
});

const isEditingClient = ref(false);
const isClientFormVisible = ref(false);

function openCreateClient(): void {
  isEditingClient.value = false;
  isClientFormVisible.value = true;
  Object.assign(clientForm, {
    id: `CL-${Math.floor(10000 + Math.random() * 89999)}`,
    name: "",
    email: "",
    role: "Client Admin",
    status: "Invited",
    rights: "Read",
    createdAt: new Date().toISOString().slice(0, 10),
  });
}

function openEditClient(client: FirmClient): void {
  isEditingClient.value = true;
  isClientFormVisible.value = true;
  Object.assign(clientForm, client);
}

function saveClient(): void {
  if (!clientForm.name.trim() || !clientForm.email.trim()) return;

  if (isEditingClient.value) {
    const idx = clients.value.findIndex((c: FirmClient) => c.id === clientForm.id);
    if (idx !== -1) clients.value[idx] = { ...clientForm } as FirmClient;
  } else {
    clients.value.unshift({ ...clientForm } as FirmClient);
  }


  openCreateClient();
}

function deleteClient(id: string): void {
  clients.value = clients.value.filter((c: FirmClient) => c.id !== id);
}

function roleLabel(role: string): string {
  return role;
}

function rightsLabel(rights: FirmClient["rights"]): string {
  return rights === "Full" ? "Full access" : "Read-only";
}

// init: don't show form until user clicks Add/Edit
isClientFormVisible.value = false;
</script>

<template>
  <div class="space-y-6">
    <!-- SYSTEM STATUS -->
    <div class="grid gap-4 lg:grid-cols-3">
      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-sm font-medium text-slate-500">
          {{ t("dashboard.evidenceHealth") }}
        </h3>

        <p class="mt-4 text-5xl font-bold text-emerald-600">
          {{ evidenceHealth }}%
        </p>

        <p class="mt-2 text-sm text-slate-500">
          {{ t("dashboard.successfullyProcessedEvidence") }}
        </p>
      </div>

      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-sm font-medium text-slate-500">
          {{ t("dashboard.connectionStatus") }}
        </h3>

        <p class="mt-4 text-xl font-semibold text-emerald-600">
          {{ connectionStatus }}
        </p>

        <p class="mt-2 text-sm text-slate-500">Last Sync: {{ lastSync }}</p>
      </div>

      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-sm font-medium text-slate-500">
          {{ t("dashboard.workspace") }}
        </h3>

        <p class="mt-4 text-lg font-semibold">
          {{ workspaceName }}
        </p>

        <p class="mt-2 text-sm text-slate-500">
          {{ workspaceId }}
        </p>
      </div>
    </div>

    <!-- KPI -->

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-sm text-slate-500">
          {{ t("dashboard.incomingFiles") }}
        </h3>

        <p class="mt-3 text-4xl font-bold">
          {{ incomingFiles }}
        </p>
      </div>

      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-sm text-slate-500">
          {{ t("dashboard.groupedDocuments") }}
        </h3>

        <p class="mt-3 text-4xl font-bold">
          {{ groupedDocuments }}
        </p>
      </div>

      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-sm text-slate-500">
          {{ t("dashboard.readyForReview") }}
        </h3>

        <p class="mt-3 text-4xl font-bold text-emerald-600">
          {{ readyForReview }}
        </p>
      </div>

      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-sm text-slate-500">
          {{ t("dashboard.rejectedFiles") }}
        </h3>

        <p class="mt-3 text-4xl font-bold text-red-500">
          {{ rejectedFiles }}
        </p>
      </div>
    </div>

    <!-- UPLOAD + PIPELINE -->

    <div class="grid gap-4 lg:grid-cols-2">
      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="text-lg font-semibold">
          {{ t("dashboard.uploadEvidence") }}
        </h3>

        <p class="mt-2 text-sm text-slate-500">
          {{ t("dashboard.uploadDescription") }}
        </p>

        <button
          class="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-white"
          @click="uploadEvidence"
        >
          {{ t("dashboard.uploadFiles") }}
        </button>
      </div>

      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="mb-5 text-lg font-semibold">
          {{ t("dashboard.processingPipeline") }}
        </h3>

        <div class="space-y-4">
          <div>
            <div class="mb-1 flex justify-between">
              <span>
                {{ t("dashboard.incoming") }}
              </span>
              <span>{{ incomingFiles }}</span>
            </div>

            <div class="h-2 rounded bg-slate-200">
              <div class="h-2 w-full rounded bg-blue-500"></div>
            </div>
          </div>

          <div>
            <div class="mb-1 flex justify-between">
              <span>
                {{ t("dashboard.grouped") }}
              </span>
              <span>{{ groupedDocuments }}</span>
            </div>

            <div class="h-2 rounded bg-slate-200">
              <div class="h-2 w-8/12 rounded bg-indigo-500"></div>
            </div>
          </div>

          <div>
            <div class="mb-1 flex justify-between">
              <span>
                {{ t("dashboard.readyForReview") }}
              </span>
              <span>{{ readyForReview }}</span>
            </div>

            <div class="h-2 rounded bg-slate-200">
              <div class="h-2 w-4/12 rounded bg-emerald-500"></div>
            </div>
          </div>

          <div>
            <div class="mb-1 flex justify-between">
              <span>
                {{ t("dashboard.rejected") }}
              </span>
              <span>{{ rejectedFiles }}</span>
            </div>

            <div class="h-2 rounded bg-slate-200">
              <div class="h-2 w-2/12 rounded bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ACTIVITY + QUEUE -->

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
        <div class="border-b border-slate-200 p-5">
          <h3 class="font-semibold">{{ t("dashboard.recentActivity") }}</h3>
        </div>

        <div
          v-for="activity in recentActivities"
          :key="activity.fileName"
          class="border-b border-slate-100 p-4 last:border-b-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">
                {{ activity.fileName }}
              </p>

              <p class="text-sm text-slate-500">
                {{ activity.status }}
              </p>
            </div>

            <span class="text-xs text-slate-500">
              {{ activity.time }}
            </span>
          </div>
        </div>
      </div>

      <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
        <h3 class="font-semibold">{{ t("dashboard.processingQueue") }}</h3>

        <div class="mt-5 space-y-3">
          <div
            v-for="file in processingQueue"
            :key="file"
            class="rounded-xl bg-slate-100 dark:bg-slate-700 p-4"
          >
            {{ file }}
          </div>
        </div>
      </div>
    </div>

    <!-- REVIEW BACKLOG -->

    <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
      <h3 class="text-sm text-slate-500">{{ t("dashboard.reviewBacklog") }}</h3>

      <p class="mt-3 text-5xl font-bold text-amber-600">
        {{ reviewBacklog }}
      </p>

      <p class="mt-2 text-sm text-slate-500">
        {{ t("dashboard.documentBacklog") }}
      </p>
    </div>

    <!-- FIRM USER -> CLIENTS (Mock CRUD table) -->

    <div :class="themeClasses.card" class="rounded-2xl p-6 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-lg font-semibold">Firm Admin → Clients</h3>
          <p class="mt-1 text-sm text-slate-500">Manage firm users and their client access.</p>
        </div>

        <div class="flex items-center gap-2">
          <select
            v-model="activeStatusFilter"
            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Suspended">Suspended</option>
          </select>

          <button
            class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            @click="openCreateClient"
          >
            + Add Client
          </button>
        </div>
      </div>

      <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900">
              <tr class="text-slate-600 dark:text-slate-300">
                <th class="px-4 py-3 font-semibold">Client</th>
                <th class="px-4 py-3 font-semibold">Email</th>
                <th class="px-4 py-3 font-semibold">Role</th>
                <th class="px-4 py-3 font-semibold">Rights</th>
                <th class="px-4 py-3 font-semibold">Status</th>
                <th class="px-4 py-3 font-semibold">Created</th>
                <th class="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="filteredClients.length === 0" class="border-t border-slate-200 dark:border-slate-800">
                <td colspan="7" class="px-4 py-6 text-center text-slate-500">
                  No clients found.
                </td>
              </tr>

              <tr
                v-for="client in filteredClients"
                :key="client.id"
                class="border-t border-slate-200 dark:border-slate-800"
              >
                <td class="px-4 py-3 font-medium">{{ client.name }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ client.email }}</td>
                <td class="px-4 py-3">{{ roleLabel(client.role) }}</td>
                <td class="px-4 py-3">{{ rightsLabel(client.rights) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                    :class="
                      client.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : client.status === 'Invited'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-red-50 text-red-700'
                    "
                  >
                    {{ client.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ client.createdAt }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      class="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      @click="openEditClient(client)"
                    >
                      Edit
                    </button>
                    <button
                      class="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                      @click="deleteClient(client.id)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inline form -->
      <div v-if="isClientFormVisible" class="mt-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {{ isEditingClient ? 'Edit Client' : 'Add Client' }}
              </h4>
              <p class="mt-1 text-xs text-slate-500">Mock CRUD for Firm Admin.</p>
            </div>
            <div class="flex gap-2">
              <button
                class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                @click="openCreateClient"
              >
                Reset
              </button>
              <button
                class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                @click="saveClient"
              >
                Save
              </button>
            </div>
          </div>

          <div class="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Client Name</label>
              <input
                v-model="clientForm.name"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
                placeholder="e.g. Apex Trading LLC"
              />
            </div>

            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Email</label>
              <input
                v-model="clientForm.email"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
                placeholder="client@company.com"
              />
            </div>

            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Role</label>
              <select
                v-model="clientForm.role"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
              >
                <option value="Firm Admin">Firm Admin</option>
                <option value="Client Admin">Client Admin</option>
                <option value="Client User">Client User</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Rights</label>
              <select
                v-model="clientForm.rights"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
              >
                <option value="Full">Full</option>
                <option value="Read">Read</option>
              </select>
            </div>
          </div>

          <div class="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Status</label>
              <select
                v-model="clientForm.status"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
              >
                <option value="Active">Active</option>
                <option value="Invited">Invited</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Created</label>
              <input
                v-model="clientForm.createdAt"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>

            <div class="flex items-end">
              <div class="text-xs text-slate-500">
                ID: <span class="font-mono text-slate-700 dark:text-slate-200">{{ clientForm.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

