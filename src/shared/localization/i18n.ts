import { createI18n } from "vue-i18n";

import { DEFAULT_LOCALE, isLocaleCode } from "./locales";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fr from "./locales/fr.json";

const savedLocale = localStorage.getItem("fluxbooks-language");

export const i18n = createI18n({
  legacy: false,
  locale: isLocaleCode(savedLocale) ? savedLocale : DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    ar,
    fr,
  },
});
