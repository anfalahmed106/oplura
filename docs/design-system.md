# Oplura Design System — Reference

Tokens live in `styles/tokens.css` (CSS custom properties, themed via
`[data-theme]`) and are exposed as Tailwind utilities via `tailwind.config.ts`.
Never hardcode a hex value or px size in a component — use the Tailwind
class (`bg-accent-primary`, `text-h3`, `p-6`, etc.) or the CSS var directly.

## Color

| Token | Light | Dark | Tailwind class |
|---|---|---|---|
| Background | `#F8FAFC` | `#0F172A` | `bg-bg` |
| Elevated (cards) | `#FFFFFF` | `#16213A` | `bg-bg-elevated` |
| Dark section band | `#0F172A` | `#0B1220` | `bg-bg-section-dark` |
| Text primary | `#111827` | `#F8FAFC` | `text-text-primary` |
| Text secondary | `#4B5563` | `#CBD5E1` | `text-text-secondary` |
| Border | `#E5E7EB` | `#1E293B` | `border-border` |
| Primary accent | `#2563EB` | `#3B82F6` | `bg-accent-primary` / `text-accent-primary` |
| Secondary accent | `#06B6D4` | `#22D3EE` | `bg-accent-secondary` / `text-accent-secondary` |
| Success | `#10B981` | `#34D399` | `text-success` |

Dark-mode accent values are brightened one step from their light-mode
counterparts (e.g. `#2563EB` â†’ `#3B82F6`) to hold AA contrast against the
`#0F172A` surface — same brand color, adjusted for the darker backdrop.

## Typography

Family: **Inter** (via `next/font/google`, variable `--font-inter`), chosen
over Geist for this phase to avoid an extra dependency; swap to the `geist`
package later if the exact Vercel face is wanted. One family across display
and body, per the enterprise/precise-not-hype brief.

| Level | Size | Line height | Weight | Tailwind class |
|---|---|---|---|---|
| H1 | 48px / 3rem | 1.1 | 700 | `text-h1` |
| H2 | 36px / 2.25rem | 1.15 | 700 | `text-h2` |
| H3 | 28px / 1.75rem | 1.25 | 600 | `text-h3` |
| H4 | 22px / 1.375rem | 1.3 | 600 | `text-h4` |
| H5 | 18px / 1.125rem | 1.4 | 600 | `text-h5` |
| H6 (eyebrow/label) | 15px / 0.9375rem | 1.4 | 600, +0.04em tracking | `text-h6` |
| Body | 16px / 1rem | 1.6 | 400 | `text-body` |
| Small | 14px / 0.875rem | 1.5 | 400 | `text-small` |
| Button | 15px / 0.9375rem | 1 | 600 | `text-button` |

## Spacing

4px base grid, exposed both as Tailwind's default spacing scale (already
4px-based) and as named tokens in `styles/tokens.css` for raw CSS use:
`--space-1` (4px) through `--space-32` (128px).

## Elevation & radius

- Card shadow: `shadow-card` â†’ `0 1px 3px rgba(0,0,0,0.06)` (light) /
  stronger in dark mode for visibility against the dark surface.
- Hover shadow: `shadow-card-hover` (used on `<Card interactive />`).
- Radius: `rounded-sm` (6px) / `rounded-md` (10px) / `rounded-lg` (16px).

## Dark mode

Attribute-based (`data-theme="dark"` on `<html>`), toggled client-side via
`lib/theme.tsx` (`ThemeProvider` / `useTheme`). Persisted to
`localStorage` under `oplura-theme`; falls back to OS preference on first
visit. An inline script in `app/layout.tsx` sets the attribute before
first paint to avoid a light/dark flash.

## Accessibility floor (already in place)

- Visible `:focus-visible` ring on every interactive element (`app/globals.css`).
- `prefers-reduced-motion` respected globally.
- Skip-to-content link at the top of `app/layout.tsx`.
- Semantic landmarks: `<header>`, `<nav aria-label="...">`, `<main>`, `<footer>`.
- Modal (`components/ui/Modal.tsx`) traps focus, closes on `Escape`, returns
  focus to its trigger, and uses `role="dialog"` + `aria-modal`.
