export type LocaleCode = "en" | "ar" | "fr";

export type TextDirection = "ltr" | "rtl";

export interface LocaleDefinition {
  code: LocaleCode;
  /** Native-language display name, shown in the language switcher. */
  label: string;
  dir: TextDirection;
}

export const SUPPORTED_LOCALES: LocaleDefinition[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "fr", label: "Français", dir: "ltr" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";

export const isLocaleCode = (value: unknown): value is LocaleCode =>
  typeof value === "string" && SUPPORTED_LOCALES.some((locale) => locale.code === value);

export const getLocaleDefinition = (code: LocaleCode): LocaleDefinition =>
  SUPPORTED_LOCALES.find((locale) => locale.code === code) ?? SUPPORTED_LOCALES[0];
