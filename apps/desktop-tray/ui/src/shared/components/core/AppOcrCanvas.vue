<script setup lang="ts">
import { computed, ref } from "vue";
import { ZoomIn, ZoomOut, RefreshCw, Eye, Layers } from "lucide-vue-next";
import { ocrCanvasConfig } from "./config";
import type { OcrCanvasProps } from "./types";
import { useI18n } from "@/shared/composables/useI18n";

const props = withDefaults(defineProps<OcrCanvasProps>(), {
  boxes: () => [],
});

const { t } = useI18n();

const zoomLevel = ref(1);
const showBoxes = ref(true);
const hoveredBox = ref<string | null>(null);

const { min, max, step } = ocrCanvasConfig.zoom;

function handleZoomIn() {
  zoomLevel.value = Math.min(max, zoomLevel.value + step);
}

function handleZoomOut() {
  zoomLevel.value = Math.max(min, zoomLevel.value - step);
}

function resetZoom() {
  zoomLevel.value = 1;
}

const matchedName = computed(
  () => props.boxes.find((box) => box.id === hoveredBox.value)?.name ?? ""
);
</script>

<template>
  <div :class="ocrCanvasConfig.wrapper">
    <div :class="ocrCanvasConfig.toolbar">
      <span v-if="title" :class="ocrCanvasConfig.toolbarTitle">{{ title }}</span>

      <div class="flex items-center gap-1">
        <button
          type="button"
          :class="ocrCanvasConfig.toolButton"
          :title="t('core.ocr.zoomOut')"
          :aria-label="t('core.ocr.zoomOut')"
          @click="handleZoomOut"
        >
          <ZoomOut class="w-4 h-4" />
        </button>

        <span :class="ocrCanvasConfig.zoomLabel">{{ Math.round(zoomLevel * 100) }}%</span>

        <button
          type="button"
          :class="ocrCanvasConfig.toolButton"
          :title="t('core.ocr.zoomIn')"
          :aria-label="t('core.ocr.zoomIn')"
          @click="handleZoomIn"
        >
          <ZoomIn class="w-4 h-4" />
        </button>

        <button
          type="button"
          :class="ocrCanvasConfig.toolButton"
          :title="t('core.ocr.resetZoom')"
          :aria-label="t('core.ocr.resetZoom')"
          @click="resetZoom"
        >
          <RefreshCw class="w-4 h-4" />
        </button>

        <button
          type="button"
          :class="[
            ocrCanvasConfig.layersButton.base,
            showBoxes ? ocrCanvasConfig.layersButton.on : ocrCanvasConfig.layersButton.off,
          ]"
          @click="showBoxes = !showBoxes"
        >
          <Layers class="w-3.5 h-3.5" />
          <span>{{ showBoxes ? t("core.ocr.boxesOn") : t("core.ocr.boxesOff") }}</span>
        </button>
      </div>
    </div>

    <div :class="ocrCanvasConfig.stage">
      <div :class="ocrCanvasConfig.document" :style="{ transform: `scale(${zoomLevel})` }">
        <slot />

        <div v-if="showBoxes" class="absolute inset-0">
          <button
            v-for="box in boxes"
            :key="box.id"
            type="button"
            :class="[
              ocrCanvasConfig.box.base,
              hoveredBox === box.id ? ocrCanvasConfig.box.active : ocrCanvasConfig.box.idle,
            ]"
            :style="{ left: box.x, top: box.y, width: box.width, height: box.height }"
            @mouseenter="hoveredBox = box.id"
            @mouseleave="hoveredBox = null"
            @focus="hoveredBox = box.id"
            @blur="hoveredBox = null"
          >
            <span v-if="hoveredBox === box.id" :class="ocrCanvasConfig.boxLabel">
              {{ box.name }}: {{ box.text }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div :class="ocrCanvasConfig.footer">
      <div class="flex items-center gap-1.5">
        <Eye class="w-3.5 h-3.5" />
        <span>{{ t("core.ocr.hoverHint") }}</span>
      </div>
      <div v-if="hoveredBox" :class="ocrCanvasConfig.matched">
        {{ t("core.ocr.matched", { name: matchedName }) }}
      </div>
    </div>
  </div>
</template>
