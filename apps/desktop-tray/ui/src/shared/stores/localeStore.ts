import { defineStore } from "pinia";

import { i18n } from "@/shared/localization/i18n";
import {
  DEFAULT_LOCALE,
  getLocaleDefinition,
  isLocaleCode,
  SUPPORTED_LOCALES,
  type LocaleCode,
  type LocaleDefinition,
} from "@/shared/localization/locales";

const STORAGE_KEY = "fluxbooks-language";

interface LocaleState {
  locale: LocaleCode;
}

export const useLocaleStore = defineStore("locale", {
  state: (): LocaleState => ({
    locale: DEFAULT_LOCALE,
  }),

  getters: {
    availableLocales: (): LocaleDefinition[] => SUPPORTED_LOCALES,

    direction: (state) => getLocaleDefinition(state.locale).dir,
  },

  actions: {
    initializeLocale(): void {
      const savedLocale = localStorage.getItem(STORAGE_KEY);

      this.applyLocale(isLocaleCode(savedLocale) ? savedLocale : DEFAULT_LOCALE);
    },

    setLocale(code: LocaleCode): void {
      localStorage.setItem(STORAGE_KEY, code);

      this.applyLocale(code);
    },

    /** Syncs vue-i18n plus the document `lang`/`dir` attributes (RTL for Arabic). */
    applyLocale(code: LocaleCode): void {
      this.locale = code;

      i18n.global.locale.value = code;

      const { dir } = getLocaleDefinition(code);

      document.documentElement.lang = code;
      document.documentElement.dir = dir;
    },
  },
});
