import plugin from "tailwindcss/plugin";

/**
 * Maps a semantic token to its CSS variable (set by `shared/theme/applyTheme`),
 * keeping Tailwind opacity modifiers (`bg-primary/10`) functional.
 */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: token("background"),
        surface: {
          DEFAULT: token("surface"),
          muted: token("surface-muted"),
          hover: token("surface-hover"),
        },
        foreground: token("foreground"),
        muted: token("muted"),
        subtle: token("subtle"),
        border: {
          DEFAULT: token("border"),
          strong: token("border-strong"),
        },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
        },
        "on-primary": token("on-primary"),
        secondary: {
          DEFAULT: token("secondary"),
          hover: token("secondary-hover"),
        },
        "on-secondary": token("on-secondary"),
        inverse: {
          DEFAULT: token("inverse"),
          foreground: token("inverse-foreground"),
        },
        accent: token("accent"),
        success: token("success"),
        warning: token("warning"),
        danger: token("danger"),
        info: token("info"),
        overlay: token("overlay"),
      },
      borderColor: {
        DEFAULT: token("border"),
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-up": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-left": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-right": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
        "scale-up": "scale-up 0.15s ease-out",
        "slide-left": "slide-left 0.25s ease-out",
        "slide-right": "slide-right 0.25s ease-out",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "scrollbar-color": "rgb(var(--color-border-strong)) rgb(var(--color-surface-muted))",
        },
      });
    }),
  ],
};
