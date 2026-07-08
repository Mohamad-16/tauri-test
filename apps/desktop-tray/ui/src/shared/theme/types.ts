/**
 * Theme contracts for the FluxBooks design system.
 *
 * A theme is a full set of semantic color tokens expressed as `"R G B"`
 * channel triplets. Tailwind maps each token to a utility family
 * (`bg-surface`, `text-foreground`, ...) via `rgb(var(--color-*) / <alpha>)`,
 * so swapping the variables re-skins every component, layout and page.
 */

export type ThemeMode = 'light' | 'dark' | 'custom'

export interface ThemeTokens {
  /** App shell background. */
  background: string
  /** Default panel/card background. */
  surface: string
  /** Slightly recessed surface (table heads, wells, disabled fields). */
  'surface-muted': string
  /** Hovered surface. */
  'surface-hover': string

  /** Primary text. */
  foreground: string
  /** Secondary text. */
  muted: string
  /** Tertiary/hint text, placeholders. */
  subtle: string

  /** Hairline borders and dividers. */
  border: string
  /** Emphasized borders (inputs, outline buttons). */
  'border-strong': string

  /** Brand action color. */
  primary: string
  'primary-hover': string
  /** Text/icon color rendered on top of `primary` (and solid status fills). */
  'on-primary': string

  /** Neutral secondary action color. */
  secondary: string
  'secondary-hover': string
  'on-secondary': string

  /** High-contrast inverted block (sidebar rail, tooltips, OCR canvas). */
  inverse: string
  'inverse-foreground': string

  /** Links, highlights, command-palette accents. */
  accent: string

  success: string
  warning: string
  danger: string
  info: string

  /** Modal/drawer backdrop tint. */
  overlay: string
}

export interface ThemeDefinition {
  mode: ThemeMode
  /**
   * Whether Tailwind `dark:` variants should also activate for this theme
   * (kept for escape hatches; core components rely on tokens alone).
   */
  isDark: boolean
  tokens: ThemeTokens
}
