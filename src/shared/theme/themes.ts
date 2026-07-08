import type { ThemeDefinition, ThemeMode } from './types'

/**
 * The three built-in themes. Adding another theme = adding an entry here
 * (plus its `ThemeMode` union member); no component ever changes.
 *
 * All values are `"R G B"` channel triplets so Tailwind opacity modifiers
 * (`bg-primary/10`) keep working.
 */
export const THEMES: Record<ThemeMode, ThemeDefinition> = {
  light: {
    mode: 'light',
    isDark: false,
    tokens: {
      background: '241 245 249',
      surface: '255 255 255',
      'surface-muted': '241 245 249',
      'surface-hover': '248 250 252',

      foreground: '15 23 42',
      muted: '71 85 105',
      subtle: '148 163 184',

      border: '226 232 240',
      'border-strong': '203 213 225',

      primary: '5 150 105',
      'primary-hover': '4 120 87',
      'on-primary': '255 255 255',

      secondary: '226 232 240',
      'secondary-hover': '203 213 225',
      'on-secondary': '30 41 59',

      inverse: '15 23 42',
      'inverse-foreground': '241 245 249',

      accent: '99 102 241',

      success: '16 185 129',
      warning: '217 119 6',
      danger: '239 68 68',
      info: '59 130 246',

      overlay: '2 6 23',
    },
  },

  dark: {
    mode: 'dark',
    isDark: true,
    tokens: {
      background: '2 6 23',
      surface: '15 23 42',
      'surface-muted': '30 41 59',
      'surface-hover': '51 65 85',

      foreground: '241 245 249',
      muted: '203 213 225',
      subtle: '100 116 139',

      border: '30 41 59',
      'border-strong': '51 65 85',

      primary: '16 185 129',
      'primary-hover': '52 211 153',
      'on-primary': '2 6 23',

      secondary: '30 41 59',
      'secondary-hover': '51 65 85',
      'on-secondary': '241 245 249',

      /*
       * In dark mode `inverse` must NOT flip to light: the sidebar rail,
       * tooltips and OCR chrome should stay dark. It sits slightly above
       * `surface` for elevation instead.
       */
      inverse: '30 41 59',
      'inverse-foreground': '241 245 249',

      accent: '129 140 248',

      success: '52 211 153',
      warning: '251 191 36',
      danger: '248 113 113',
      info: '96 165 250',

      overlay: '2 6 23',
    },
  },

  /** FluxBooks brand theme: warm paper background with a violet action color. */
  custom: {
    mode: 'custom',
    isDark: false,
    tokens: {
      background: '245 243 238',
      surface: '255 254 251',
      'surface-muted': '240 236 228',
      'surface-hover': '249 246 240',

      foreground: '41 37 36',
      muted: '87 83 78',
      subtle: '168 162 158',

      border: '231 225 213',
      'border-strong': '214 205 189',

      primary: '124 58 237',
      'primary-hover': '109 40 217',
      'on-primary': '255 255 255',

      secondary: '237 232 222',
      'secondary-hover': '224 217 203',
      'on-secondary': '68 64 60',

      inverse: '41 37 36',
      'inverse-foreground': '245 243 238',

      accent: '217 70 239',

      success: '22 163 74',
      warning: '202 138 4',
      danger: '220 38 38',
      info: '2 132 199',

      overlay: '41 37 36',
    },
  },
}

export const THEME_MODES = Object.keys(THEMES) as ThemeMode[]

export const DEFAULT_THEME: ThemeMode = 'light'

export const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && THEME_MODES.includes(value as ThemeMode)
