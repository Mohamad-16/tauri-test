import { useI18n as useVueI18n } from "vue-i18n";

/**
 * Project-standard i18n composable.
 *
 * Components import this instead of `vue-i18n` directly so the translation
 * backend stays swappable and the global message schema is the default.
 */
export function useI18n() {
  return useVueI18n({ useScope: "global" });
}
