<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { storeToRefs } from "pinia";

import { useDashboardStore } from "@/domains/dashboard/stores/dashboardStore";
import {
  AppBadge,
  AppButton,
  AppCard,
  AppDataTable,
  AppInput,
  AppProgressBar,
  AppSelect,
  type BadgeColor,
  type SelectOption,
  type TableColumn,
} from "@/shared/components/core";
import { useI18n } from "@/shared/composables/useI18n";
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

/* ------------------------------ pipeline ------------------------------ */

const pipelineStages = computed(() => {
  const total = Math.max(incomingFiles.value, 1);

  return [
    { key: "incoming", label: t("dashboard.incoming"), count: incomingFiles.value },
    { key: "grouped", label: t("dashboard.grouped"), count: groupedDocuments.value },
    { key: "review", label: t("dashboard.review"), count: readyForReview.value },
    { key: "rejected", label: t("dashboard.rejected"), count: rejectedFiles.value },
  ].map((stage) => ({
    ...stage,
    progress: Math.round((stage.count / total) * 100),
  }));
});

/* --------------------------- clients (mock CRUD) --------------------------- */

const clients = ref<FirmClient[]>([...mockFirmClients]);
const activeStatusFilter = ref<string>("All");

const filteredClients = computed(() => {
  if (activeStatusFilter.value === "All") return clients.value;
  return clients.value.filter(
    (client) => client.status === activeStatusFilter.value
  );
});

const statusFilterOptions = computed<SelectOption[]>(() => [
  { value: "All", label: t("dashboard.clients.filters.all") },
  { value: "Active", label: t("dashboard.clients.statuses.active") },
  { value: "Invited", label: t("dashboard.clients.statuses.invited") },
  { value: "Suspended", label: t("dashboard.clients.statuses.suspended") },
]);

const roleOptions = computed<SelectOption[]>(() => [
  { value: "Firm Admin", label: t("dashboard.clients.roles.firmAdmin") },
  { value: "Client Admin", label: t("dashboard.clients.roles.clientAdmin") },
  { value: "Client User", label: t("dashboard.clients.roles.clientUser") },
]);

const rightsOptions = computed<SelectOption[]>(() => [
  { value: "Full", label: t("dashboard.clients.rights.full") },
  { value: "Read", label: t("dashboard.clients.rights.read") },
]);

const statusOptions = computed<SelectOption[]>(() =>
  statusFilterOptions.value.slice(1)
);

const clientColumns = computed<TableColumn[]>(() => [
  { key: "name", label: t("dashboard.clients.columns.name") },
  { key: "email", label: t("dashboard.clients.columns.email") },
  { key: "role", label: t("dashboard.clients.columns.role") },
  { key: "rights", label: t("dashboard.clients.columns.rights") },
  { key: "status", label: t("dashboard.clients.columns.status") },
  { key: "createdAt", label: t("dashboard.clients.columns.createdAt") },
  { key: "actions", label: t("dashboard.clients.columns.actions") },
]);

const statusBadgeColors: Record<FirmClient["status"], BadgeColor> = {
  Active: "success",
  Invited: "primary",
  Suspended: "danger",
};

function statusLabel(status: FirmClient["status"]): string {
  return t(`dashboard.clients.statuses.${status.toLowerCase()}`);
}

function roleLabel(role: string): string {
  const option = roleOptions.value.find((item) => item.value === role);
  return option ? option.label : role;
}

function rightsLabel(rights: FirmClient["rights"]): string {
  return rights === "Full"
    ? t("dashboard.clients.rights.full")
    : t("dashboard.clients.rights.read");
}

const clientForm = reactive<FirmClient>({
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
    const index = clients.value.findIndex(
      (client) => client.id === clientForm.id
    );
    if (index !== -1) clients.value[index] = { ...clientForm };
  } else {
    clients.value.unshift({ ...clientForm });
  }

  openCreateClient();
}

function deleteClient(id: string): void {
  clients.value = clients.value.filter((client) => client.id !== id);
}
</script>

<template>
  <div class="space-y-6">
    <!-- SYSTEM STATUS -->
    <div class="grid gap-4 lg:grid-cols-3">
      <AppCard variant="elevated">
        <h3 class="text-sm font-medium text-muted">
          {{ t("dashboard.evidenceHealth") }}
        </h3>

        <p class="mt-4 text-5xl font-bold text-primary">{{ evidenceHealth }}%</p>

        <p class="mt-2 text-sm text-muted">
          {{ t("dashboard.successfullyProcessedEvidence") }}
        </p>
      </AppCard>

      <AppCard variant="elevated">
        <h3 class="text-sm font-medium text-muted">
          {{ t("dashboard.connectionStatus") }}
        </h3>

        <p class="mt-4 text-xl font-semibold text-primary">
          {{ connectionStatus }}
        </p>

        <p class="mt-2 text-sm text-muted">
          {{ t("dashboard.lastSync", { time: lastSync }) }}
        </p>
      </AppCard>

      <AppCard variant="elevated">
        <h3 class="text-sm font-medium text-muted">
          {{ t("dashboard.workspace") }}
        </h3>

        <p class="mt-4 text-lg font-semibold">{{ workspaceName }}</p>

        <p class="mt-2 text-sm text-muted">{{ workspaceId }}</p>
      </AppCard>
    </div>

    <!-- KPI -->
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AppCard>
        <h3 class="text-sm text-muted">{{ t("dashboard.incomingFiles") }}</h3>
        <p class="mt-3 text-4xl font-bold">{{ incomingFiles }}</p>
      </AppCard>

      <AppCard>
        <h3 class="text-sm text-muted">{{ t("dashboard.groupedDocuments") }}</h3>
        <p class="mt-3 text-4xl font-bold">{{ groupedDocuments }}</p>
      </AppCard>

      <AppCard>
        <h3 class="text-sm text-muted">{{ t("dashboard.readyForReview") }}</h3>
        <p class="mt-3 text-4xl font-bold text-primary">{{ readyForReview }}</p>
      </AppCard>

      <AppCard>
        <h3 class="text-sm text-muted">{{ t("dashboard.rejectedFiles") }}</h3>
        <p class="mt-3 text-4xl font-bold text-danger">{{ rejectedFiles }}</p>
      </AppCard>
    </div>

    <!-- UPLOAD + PIPELINE -->
    <div class="grid gap-4 lg:grid-cols-2">
      <AppCard variant="bordered">
        <h3 class="text-lg font-semibold">{{ t("dashboard.uploadEvidence") }}</h3>

        <p class="mt-2 text-sm text-muted">
          {{ t("dashboard.uploadDescription") }}
        </p>

        <AppButton class="mt-6" icon="UploadCloud" @click="uploadEvidence">
          {{ t("dashboard.uploadFiles") }}
        </AppButton>
      </AppCard>

      <AppCard variant="bordered">
        <h3 class="mb-5 text-lg font-semibold">
          {{ t("dashboard.processingPipeline") }}
        </h3>

        <div class="space-y-4">
          <div v-for="stage in pipelineStages" :key="stage.key">
            <div class="mb-1 flex justify-between text-sm">
              <span>{{ stage.label }}</span>
              <span class="font-semibold">{{ stage.count }}</span>
            </div>

            <AppProgressBar :progress="stage.progress" />
          </div>
        </div>
      </AppCard>
    </div>

    <!-- ACTIVITY + QUEUE -->
    <div class="grid gap-4 lg:grid-cols-2">
      <AppCard variant="bordered" class="!p-0 overflow-hidden">
        <div class="border-b border-border p-5">
          <h3 class="font-semibold">{{ t("dashboard.recentActivity") }}</h3>
        </div>

        <div
          v-for="activity in recentActivities"
          :key="activity.fileName"
          class="border-b border-border p-4 last:border-b-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ activity.fileName }}</p>
              <p class="text-sm text-muted">{{ activity.status }}</p>
            </div>

            <span class="text-xs text-subtle">{{ activity.time }}</span>
          </div>
        </div>
      </AppCard>

      <AppCard variant="bordered">
        <h3 class="font-semibold">{{ t("dashboard.processingQueue") }}</h3>

        <div class="mt-5 space-y-3">
          <div
            v-for="file in processingQueue"
            :key="file"
            class="rounded-xl bg-surface-muted p-4 text-sm font-medium"
          >
            {{ file }}
          </div>
        </div>
      </AppCard>
    </div>

    <!-- REVIEW BACKLOG -->
    <AppCard>
      <h3 class="text-sm text-muted">{{ t("dashboard.reviewBacklog") }}</h3>

      <p class="mt-3 text-5xl font-bold text-warning">{{ reviewBacklog }}</p>

      <p class="mt-2 text-sm text-muted">{{ t("dashboard.documentBacklog") }}</p>
    </AppCard>

    <!-- FIRM ADMIN -> CLIENTS (mock CRUD) -->
    <AppCard variant="bordered">
      <div
        class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold">
            {{ t("dashboard.clients.title") }}
          </h3>
          <p class="mt-1 text-sm text-muted">
            {{ t("dashboard.clients.subtitle") }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <div class="w-40">
            <AppSelect
              v-model="activeStatusFilter"
              :options="statusFilterOptions"
              size="sm"
            />
          </div>

          <AppButton size="sm" icon="Plus" @click="openCreateClient">
            {{ t("dashboard.clients.add") }}
          </AppButton>
        </div>
      </div>

      <div class="mt-6">
        <AppDataTable
          :columns="clientColumns"
          :items="filteredClients"
          density="compact"
        >
          <template #cell(role)="{ item }">
            <span class="text-sm">{{ roleLabel(String(item.role)) }}</span>
          </template>

          <template #cell(rights)="{ item }">
            <span class="text-sm">
              {{ rightsLabel(item.rights as FirmClient["rights"]) }}
            </span>
          </template>

          <template #cell(status)="{ item }">
            <AppBadge
              variant="subtle"
              :color="statusBadgeColors[item.status as FirmClient['status']]"
            >
              {{ statusLabel(item.status as FirmClient["status"]) }}
            </AppBadge>
          </template>

          <template #cell(actions)="{ item }">
            <div class="flex items-center gap-2">
              <AppButton
                variant="outline"
                size="sm"
                @click.stop="openEditClient(item as FirmClient)"
              >
                {{ t("dashboard.clients.editAction") }}
              </AppButton>

              <AppButton
                variant="danger"
                size="sm"
                @click.stop="deleteClient(String(item.id))"
              >
                {{ t("dashboard.clients.deleteAction") }}
              </AppButton>
            </div>
          </template>
        </AppDataTable>
      </div>

      <!-- Inline form -->
      <div v-if="isClientFormVisible" class="mt-6">
        <AppCard>
          <div
            class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h4 class="text-sm font-semibold text-foreground">
                {{
                  isEditingClient
                    ? t("dashboard.clients.edit")
                    : t("dashboard.clients.add")
                }}
              </h4>
              <p class="mt-1 text-xs text-subtle">
                {{ t("dashboard.clients.formHint") }}
              </p>
            </div>

            <div class="flex gap-2">
              <AppButton variant="secondary" size="sm" @click="openCreateClient">
                {{ t("dashboard.clients.reset") }}
              </AppButton>

              <AppButton size="sm" icon="Save" @click="saveClient">
                {{ t("dashboard.clients.save") }}
              </AppButton>
            </div>
          </div>

          <div class="mt-4 grid gap-4 md:grid-cols-4">
            <AppInput
              v-model="clientForm.name"
              :label="t('dashboard.clients.fields.name')"
              :placeholder="t('dashboard.clients.fields.namePlaceholder')"
            />

            <AppInput
              v-model="clientForm.email"
              type="email"
              :label="t('dashboard.clients.fields.email')"
              :placeholder="t('dashboard.clients.fields.emailPlaceholder')"
            />

            <AppSelect
              v-model="clientForm.role"
              :options="roleOptions"
              :label="t('dashboard.clients.fields.role')"
            />

            <AppSelect
              v-model="clientForm.rights"
              :options="rightsOptions"
              :label="t('dashboard.clients.fields.rights')"
            />
          </div>

          <div class="mt-4 grid gap-4 md:grid-cols-3">
            <AppSelect
              v-model="clientForm.status"
              :options="statusOptions"
              :label="t('dashboard.clients.fields.status')"
            />

            <AppInput
              v-model="clientForm.createdAt"
              type="date"
              :label="t('dashboard.clients.fields.createdAt')"
            />

            <div class="flex items-end pb-3">
              <div class="text-xs text-subtle">
                {{ t("dashboard.clients.fields.id") }}:
                <span class="font-mono text-foreground">{{ clientForm.id }}</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </AppCard>
  </div>
</template>
