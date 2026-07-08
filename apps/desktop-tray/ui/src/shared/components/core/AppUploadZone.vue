<script setup lang="ts">
import { computed, ref } from "vue";
import { CheckCircle, FileText, RefreshCw, UploadCloud } from "lucide-vue-next";
import type { UploadZoneProps } from "./types";
import { uploadZoneConfig } from "./config";
import { useI18n } from "@/shared/composables/useI18n";

withDefaults(defineProps<UploadZoneProps>(), {
  accept: ".csv,.xlsx,.pdf",
  multiple: false,
  processing: false,
});

const emit = defineEmits<{
  (e: "files-selected", files: FileList): void;
}>();

const { t } = useI18n();

const isDragOver = ref(false);
const selectedFiles = ref<{ name: string; size: number }[]>([]);

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    recordFiles(e.dataTransfer.files);
  }
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    recordFiles(target.files);
  }
};

const recordFiles = (files: FileList) => {
  selectedFiles.value = Array.from(files).map((file) => ({
    name: file.name,
    size: file.size,
  }));
  emit("files-selected", files);
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const zoneClass = computed(() => [
  uploadZoneConfig.zone,
  isDragOver.value ? uploadZoneConfig.zoneStates.dragOver : uploadZoneConfig.zoneStates.idle,
]);
</script>

<template>
  <div :class="uploadZoneConfig.wrapper">
    <div
      :class="zoneClass"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="absolute inset-0 opacity-0 cursor-pointer"
        :disabled="processing"
        @change="handleFileSelect"
      />

      <!-- Processing state (externally controlled via the `processing` prop) -->
      <div v-if="processing" class="flex flex-col items-center gap-3 animate-fade-in py-4">
        <div :class="uploadZoneConfig.iconWrap.processing">
          <RefreshCw class="w-8 h-8" />
        </div>
        <p :class="uploadZoneConfig.processingTitle">
          {{ t("core.upload.processing") }}
        </p>
        <p :class="uploadZoneConfig.processingHint">
          {{ t("core.upload.processingHint") }}
        </p>
      </div>

      <!-- Idle state -->
      <div v-else-if="selectedFiles.length === 0" class="flex flex-col items-center gap-3 py-4">
        <div
          :class="isDragOver ? uploadZoneConfig.iconWrap.dragOver : uploadZoneConfig.iconWrap.idle"
        >
          <UploadCloud class="w-7 h-7" />
        </div>

        <div>
          <p :class="uploadZoneConfig.title">
            {{ t("core.upload.dropTitle") }}
          </p>
          <p :class="uploadZoneConfig.hint">
            {{ t("core.upload.dropHint", { accept }) }}
          </p>
        </div>
      </div>

      <!-- Complete state -->
      <div v-else class="flex flex-col items-center gap-3 w-full">
        <div :class="uploadZoneConfig.iconWrap.success">
          <CheckCircle class="w-7 h-7" />
        </div>

        <div :class="uploadZoneConfig.completeTitle">
          {{ t("core.upload.complete") }}
        </div>

        <div class="w-full max-w-xs space-y-2.5 mt-2">
          <div v-for="file in selectedFiles" :key="file.name" :class="uploadZoneConfig.fileRow">
            <FileText class="w-4 h-4 text-primary shrink-0" />
            <div class="flex-1 min-w-0">
              <p :class="uploadZoneConfig.fileName">
                {{ file.name }}
              </p>
              <p :class="uploadZoneConfig.fileSize">
                {{ formatSize(file.size) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
