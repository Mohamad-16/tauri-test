import { defineStore } from "pinia";

import {
  applyTheme,
  DEFAULT_THEME,
  isThemeMode,
  THEME_MODES,
  type ThemeMode,
} from "@/shared/theme";

const STORAGE_KEY = "fluxbooks-theme";

interface ThemeState {
  theme: ThemeMode;
}

export const useThemeStore = defineStore("theme", {
  state: (): ThemeState => ({
    theme: DEFAULT_THEME,
  }),

  getters: {
    availableThemes: (): ThemeMode[] => THEME_MODES,
  },

  actions: {
    initializeTheme(): void {
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      this.theme = isThemeMode(savedTheme) ? savedTheme : DEFAULT_THEME;

      applyTheme(this.theme);
    },

    setTheme(mode: ThemeMode): void {
      this.theme = mode;

      localStorage.setItem(STORAGE_KEY, mode);

      applyTheme(mode);
    },

    /** Cycles light -> dark -> custom -> light. */
    cycleTheme(): void {
      const currentIndex = THEME_MODES.indexOf(this.theme);
      const nextTheme = THEME_MODES[(currentIndex + 1) % THEME_MODES.length];

      this.setTheme(nextTheme);
    },
  },
});
