<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Check, ChevronDown, Search, X } from "lucide-vue-next";
import type { MultiselectProps, SelectOption } from "./types";
import { multiselectConfig } from "./config";
import { useI18n } from "@/shared/composables/useI18n";

const props = withDefaults(defineProps<MultiselectProps>(), {
  variant: "tags-inline",
  size: "md",
  label: "",
  disabled: false,
  placeholder: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const { t } = useI18n();

const rootEl = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref("");

const placeholderText = computed(() => props.placeholder || t("core.multiselect.placeholder"));

const normalizedOptions = computed<SelectOption[]>(() =>
  props.options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt))
);

const filteredOptions = computed(() => {
  if (!searchQuery.value) return normalizedOptions.value;
  const query = searchQuery.value.toLowerCase();
  return normalizedOptions.value.filter((opt) => opt.label.toLowerCase().includes(query));
});

const maxReached = computed(
  () => props.maxItems !== undefined && props.modelValue.length >= props.maxItems
);

const visibleCount = multiselectConfig.wrapVisibleCount;
const overflowCount = computed(() => props.modelValue.length - visibleCount);

const controlClass = computed(() => [
  multiselectConfig.control,
  props.disabled
    ? multiselectConfig.controlStates.disabled
    : multiselectConfig.controlStates.normal,
]);

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const selectItem = (value: string) => {
  if (props.modelValue.includes(value)) {
    emit(
      "update:modelValue",
      props.modelValue.filter((item) => item !== value)
    );
  } else {
    if (maxReached.value) return;
    emit("update:modelValue", [...props.modelValue, value]);
  }
};

const getLabel = (value: string) => {
  const found = normalizedOptions.value.find((opt) => opt.value === value);
  return found ? found.label : value;
};

const handleDocumentClick = (event: MouseEvent) => {
  if (isOpen.value && rootEl.value && !rootEl.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") isOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("keydown", handleDocumentKeydown);
});
</script>

<template>
  <div ref="rootEl" :class="multiselectConfig.wrapper">
    <label v-if="label" :class="multiselectConfig.label">
      {{ label }}
    </label>

    <div class="relative">
      <div :class="controlClass" @click="toggleDropdown">
        <div class="flex flex-wrap gap-1.5 flex-1 min-w-0">
          <span v-if="modelValue.length === 0" :class="multiselectConfig.placeholder">
            {{ placeholderText }}
          </span>

          <template v-if="variant === 'tags-inline'">
            <div v-for="item in modelValue" :key="item" :class="multiselectConfig.tag">
              <span class="truncate">{{ getLabel(item) }}</span>
              <button
                type="button"
                :class="multiselectConfig.tagRemove"
                @click.stop="selectItem(item)"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
          </template>

          <template v-else>
            <div
              v-for="item in modelValue.slice(0, visibleCount)"
              :key="item"
              :class="multiselectConfig.tag"
            >
              <span class="truncate">{{ getLabel(item) }}</span>
              <button
                type="button"
                :class="multiselectConfig.tagRemove"
                @click.stop="selectItem(item)"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
            <div v-if="overflowCount > 0" :class="multiselectConfig.overflowTag">
              {{ t("core.multiselect.more", { count: overflowCount }) }}
            </div>
          </template>
        </div>

        <ChevronDown class="w-4 h-4 text-subtle mr-2 shrink-0" />
      </div>

      <div v-if="isOpen" :class="multiselectConfig.dropdown">
        <div :class="multiselectConfig.dropdownSearch">
          <Search class="w-3.5 h-3.5 text-subtle ml-1.5 mr-2" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('core.multiselect.searchPlaceholder')"
            :class="multiselectConfig.dropdownSearchInput"
            @click.stop
          />
        </div>

        <div class="overflow-y-auto py-1 max-h-48">
          <div v-if="filteredOptions.length === 0" :class="multiselectConfig.empty">
            {{ t("core.multiselect.noOptions") }}
          </div>

          <div v-if="maxReached" :class="multiselectConfig.maxNotice">
            {{ t("core.multiselect.maxReached", { max: maxItems ?? 0 }) }}
          </div>

          <button
            v-for="opt in filteredOptions"
            :key="opt.value"
            type="button"
            :disabled="maxReached && !modelValue.includes(opt.value)"
            :class="[
              multiselectConfig.option.base,
              modelValue.includes(opt.value)
                ? multiselectConfig.option.selected
                : multiselectConfig.option.unselected,
            ]"
            @click="selectItem(opt.value)"
          >
            <div class="flex items-center gap-2">
              <div
                :class="[
                  multiselectConfig.optionBox.base,
                  modelValue.includes(opt.value)
                    ? multiselectConfig.optionBox.checked
                    : multiselectConfig.optionBox.unchecked,
                ]"
              >
                <Check
                  v-if="modelValue.includes(opt.value)"
                  class="w-2.5 h-2.5 text-on-primary stroke-[3.5px]"
                />
              </div>
              <span>{{ opt.label }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
