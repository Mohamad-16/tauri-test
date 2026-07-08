import { THEMES } from './themes'
import type { ThemeMode } from './types'

/**
 * Pushes a theme's tokens onto `<html>` as CSS custom properties.
 * Every Tailwind semantic utility (`bg-surface`, `text-foreground`, ...)
 * resolves against these variables, so this single call re-themes the app.
 */
export function applyTheme(mode: ThemeMode): void {
  const theme = THEMES[mode]
  const root = document.documentElement

  for (const [token, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(`--color-${token}`, value)
  }

  root.dataset.theme = mode
  root.classList.toggle('dark', theme.isDark)
}
