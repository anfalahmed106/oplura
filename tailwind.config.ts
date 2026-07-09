import type { Config } from "tailwindcss";

/**
 * Tailwind is configured as a thin utility layer over the token system in
 * styles/tokens.css. Every color/spacing/type value here reads from a CSS
 * variable so the light/dark theme swap (via [data-theme]) needs no
 * duplicate Tailwind config and no JS re-render.
 */
const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-elevated": "var(--color-bg-elevated)",
        "bg-section-dark": "var(--color-bg-section-dark)",
        "bg-muted": "var(--color-bg-muted)",

        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "text-on-dark": "var(--color-text-on-dark)",
        "text-on-dark-secondary": "var(--color-text-on-dark-secondary)",
        "text-inverse": "var(--color-text-inverse)",

        border: "var(--color-border)",
        "border-on-dark": "var(--color-border-on-dark)",

        "accent-primary": "var(--color-accent-primary)",
        "accent-primary-hover": "var(--color-accent-primary-hover)",
        "accent-secondary": "var(--color-accent-secondary)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        "focus-ring": "var(--color-focus-ring)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        h1: [
          "var(--text-h1-size)",
          { lineHeight: "var(--text-h1-leading)", fontWeight: "var(--text-h1-weight)", letterSpacing: "var(--text-h1-tracking)" },
        ],
        h2: [
          "var(--text-h2-size)",
          { lineHeight: "var(--text-h2-leading)", fontWeight: "var(--text-h2-weight)", letterSpacing: "var(--text-h2-tracking)" },
        ],
        h3: [
          "var(--text-h3-size)",
          { lineHeight: "var(--text-h3-leading)", fontWeight: "var(--text-h3-weight)", letterSpacing: "var(--text-h3-tracking)" },
        ],
        h4: [
          "var(--text-h4-size)",
          { lineHeight: "var(--text-h4-leading)", fontWeight: "var(--text-h4-weight)", letterSpacing: "var(--text-h4-tracking)" },
        ],
        h5: [
          "var(--text-h5-size)",
          { lineHeight: "var(--text-h5-leading)", fontWeight: "var(--text-h5-weight)", letterSpacing: "var(--text-h5-tracking)" },
        ],
        h6: [
          "var(--text-h6-size)",
          { lineHeight: "var(--text-h6-leading)", fontWeight: "var(--text-h6-weight)", letterSpacing: "var(--text-h6-tracking)" },
        ],
        body: [
          "var(--text-body-size)",
          { lineHeight: "var(--text-body-leading)", fontWeight: "var(--text-body-weight)" },
        ],
        small: [
          "var(--text-small-size)",
          { lineHeight: "var(--text-small-leading)", fontWeight: "var(--text-small-weight)" },
        ],
        button: [
          "var(--text-button-size)",
          { lineHeight: "var(--text-button-leading)", fontWeight: "var(--text-button-weight)", letterSpacing: "var(--text-button-tracking)" },
        ],
      },
      spacing: {
        // Extends (does not replace) Tailwind's default 4px-based scale with
        // named tokens for use in components that want semantic names.
        "0": "var(--space-0)",
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
        "24": "var(--space-24)",
        "32": "var(--space-32)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        modal: "var(--shadow-modal)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
