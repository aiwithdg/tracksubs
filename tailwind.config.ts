import type { Config } from "tailwindcss";

// Semantic color tokens resolve to CSS variables defined in app/globals.css
// (:root for light, .dark for dark) — components use bg-surface, text-content,
// border-edge, bg-accent, etc. instead of hard-coded Tailwind grays, so the
// whole UI repaints correctly when the theme toggles.
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          input: "var(--bg-input)",
          hover: "var(--bg-hover)",
        },
        content: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          faint: "var(--text-faint)",
        },
        edge: {
          DEFAULT: "var(--border-primary)",
          faint: "var(--border-faint)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
          on: "var(--accent-on)",
        },
        success: { DEFAULT: "var(--success)", soft: "var(--success-soft)" },
        danger: { DEFAULT: "var(--danger)", soft: "var(--danger-soft)" },
        warning: { DEFAULT: "var(--warning)", soft: "var(--warning-soft)" },
        info: { DEFAULT: "var(--info)", soft: "var(--info-soft)" },
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
        popover: "0 8px 32px rgba(0, 0, 0, 0.18)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
