# Oplura â€” Project README

**Stack:** Next.js 14 (App Router) Â· TypeScript (strict) Â· Tailwind CSS Â· Three.js / React Three Fiber

**Phases completed so far:**
- Phase 1 â€” Architecture & design system (tokens, layout shell, primitives)
- Phase 2 â€” Homepage (all 9 sections, 3D model, case study card, WhatsApp CTA, footer)
- Phase 3 â€” Services, About, and Contact pages (content + working contact form)
- Phase 4 â€” Case Studies index page + site-wide micro-animations (scroll reveal, modal transitions, hover states, hero pointer response)

---

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (passes strict TS + lint clean)
```

---

## How the project was built

### Phase 1 â€” Architecture (pre-existing, not written by homepage AI)
Created the full project scaffold: Next.js App Router setup, Tailwind wired to CSS-variable token system, dark/light theme switching, all layout shell components (Navbar, Footer, Section), all UI primitives (Button, Card, Modal), the CTABanner marketing component, the ChatbotSlot placeholder, all route page stubs, and the design-system + sitemap docs.

### Phase 2 â€” Homepage (written by homepage AI, built on top of Phase 1 without modifying any existing component APIs)
Added all homepage section components, the 3D model (TypeScript port of the client-supplied GeodesicSphere.jsx), WhatsApp button, case study data + card, and extended Footer and navigation.ts additively (no breaking changes to existing exports).

### Phase 3 â€” Services, About, Contact (written by content AI, built on top of Phases 1â€“2 without modifying any existing component APIs)
Replaced the three scaffold pages (`app/services/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`) with full content, reusing `Section`, `Card`, `Button`, and `WhatsAppButton` exactly as they already existed â€” no props added, no component files edited. Also added one new component, `components/contact/ContactForm.tsx`, for the contact form's validation logic. No changes to `lib/navigation.ts`, tokens, or any Phase 1/2 component.

**What each page now contains:**
- **Services** (`app/services/page.tsx`) â€” 4 core service categories in a card grid, a dark band listing 5 AI add-ons (OCR, voice-to-text, AI-drafted reports, image analysis, smart suggestions), and a closing CTA card.
- **About** (`app/about/page.tsx`) â€” founding story, mission, and a dark "Why we build this way" section with 4 approach points.
- **Contact** (`app/contact/page.tsx`) â€” 3-card row (Book a Call / Email / WhatsApp) followed by a full contact form.
- **Contact form** (`components/contact/ContactForm.tsx`) â€” new client component. Fields: Full Name*, Business Email*, Phone Number*, Company Name, Industry/Business Type*, "What are you looking to automate?" (optional), Estimated Company Size (optional). Client-side validation only (required fields + email/phone format) â€” **does not submit anywhere yet**, see "Still needs doing" below.

### Phase 4 â€” Case Studies index + micro-animations (written by this AI, built on top of Phases 1â€“3 without renaming or removing any existing component, prop, or file)

**1. Case Studies index page is now live** â€” `app/case-studies/page.tsx` was a scaffold ("content pending"); it now maps over every entry in `lib/case-studies.ts` and renders a `CaseStudyCard` per entry, separated by a divider. **The existing `CaseStudyCard` component was already fully built in Phase 2** (device-mockup frame, static screenshot, centered â–¶ "Watch Full Walkthrough" button, Modal-embedded video via `videoUrl`, 2â€“3 captioned supporting screenshots) â€” this phase reused it as-is on the index page and only lightly refined its hover states (see below). **Scaling rule unchanged and reconfirmed: adding a new case study is one object added to the `caseStudies` array in `lib/case-studies.ts` â€” no component or layout edits required, ever.**

**2. New component â€” scroll-reveal:**
- `components/ui/Reveal.tsx` (new file) â€” a small client component that fades + slides content up into place the first time it scrolls into view, using `IntersectionObserver` and CSS transitions only (no animation library added, keeps bundle size unchanged). Respects `prefers-reduced-motion` via the existing global reset in `app/globals.css`. Applied around every homepage section below the Hero (`app/page.tsx`) and around the hero copy + each entry on the new Case Studies page. Not yet applied to `app/services/page.tsx`, `app/about/page.tsx`, or `app/contact/page.tsx` â€” see "Still needs doing" below if you want it site-wide.

**3. Modal open/close transition:**
- `components/ui/Modal.tsx` (edited) â€” same public API (`open`, `onClose`, `title`, `children`), same accessibility behavior (ESC, backdrop click, focus trap/return, `aria-modal`/`role="dialog"`). Added: fade + scale transition on open, and the dialog now stays mounted through a matching ~200ms exit transition on close instead of unmounting instantly, so the video player never just pops away.

**4. Hover states, accent-only:**
- `components/ui/Card.tsx` (edited) â€” the existing `interactive` prop now also adds a subtle accent-colored border on hover, alongside the pre-existing shadow lift. No new props; no change for cards that don't pass `interactive`.
- `components/marketing/CaseStudyCard.tsx` (edited) â€” supporting screenshots now scale in slightly on hover inside their card. Everything else (layout, props, the `CaseStudy` type it consumes) is unchanged.

**5. Hero 3D model â€” pointer response:**
- `components/three/HeroScene.tsx` (edited) â€” now tracks pointer position over the canvas in a `ref` (no re-renders) and passes it down as a new optional `pointer` prop.
- `components/three/GeodesicSphere.tsx` (edited) â€” accepts the new optional `pointer` prop. Kept its existing slow 24-second auto-rotation exactly as it was, and layered a subtle eased tilt toward the cursor on top of it (`rotation.x` / `rotation.z`) when a pointer is present. Sphere behaves exactly as before if `pointer` is omitted, so nothing else that imports `GeodesicSphere` needs to change.

**Files touched this phase (full list):**
- New: `components/ui/Reveal.tsx`
- Edited: `app/case-studies/page.tsx`, `app/page.tsx`, `components/marketing/CaseStudyCard.tsx`, `components/ui/Modal.tsx`, `components/ui/Card.tsx`, `components/three/HeroScene.tsx`, `components/three/GeodesicSphere.tsx`
- Untouched: everything else, including `lib/case-studies.ts`, `lib/navigation.ts`, all tokens, and every Phase 1â€“3 page/component not listed above.



---

## Complete file map

### Config & root

| File | What it does |
|---|---|
| `package.json` | Dependencies: next 14, react 18, three ^0.160, @react-three/fiber ^8.15, @react-three/drei ^9.92, lucide-react ^0.383 |
| `tailwind.config.ts` | Maps every Tailwind utility to a CSS var from tokens.css â€” never hardcode hex/px |
| `tsconfig.json` | Strict TS, path alias `@/*` â†’ `./` |
| `next.config.mjs` | reactStrictMode: true |
| `postcss.config.mjs` | tailwindcss + autoprefixer |
| `.eslintrc.json` | next/core-web-vitals |
| `.gitignore` | Standard Next.js ignores |

---

### `styles/`

| File | What it does |
|---|---|
| `styles/tokens.css` | Single source of truth for all design tokens as CSS custom properties. Light defaults in `:root`, dark overrides in `[data-theme="dark"]`. All colors, type scale, spacing, radius, shadow, motion, container width live here. |

---

### `app/`

| File | What it does |
|---|---|
| `app/layout.tsx` | Root layout. Loads Inter via next/font/google (`--font-inter`), wraps app in ThemeProvider, renders Navbar + Footer + ChatbotSlot around `<main>`. Includes inline no-flash script that sets `data-theme` before first paint. |
| `app/globals.css` | Imports tokens.css, sets Tailwind layers, body base styles, `prefers-reduced-motion` reset, `:focus-visible` ring, heading color defaults. |
| `app/page.tsx` | Homepage. Imports and renders all 9 section components in order (see Homepage section order below). |
| `app/services/page.tsx` | **Done (Phase 3).** 4 service category cards + dark AI add-ons band + closing CTA. |
| `app/how-we-work/page.tsx` | How We Work page â€” scaffold, content pending. |
| `app/case-studies/page.tsx` | **Done (Phase 4).** Full index â€” maps over `lib/case-studies.ts` and renders a `CaseStudyCard` per entry, with a divider between entries and scroll-reveal on the hero copy + each card. |
| `app/case-studies/[slug]/page.tsx` | Individual case study â€” dynamic route, still a scaffold, content pending (not in scope for Phase 4, which only covered the index page). |
| `app/about/page.tsx` | **Done (Phase 3).** Founding story, mission, dark "why we build this way" band, closing CTA. |
| `app/contact/page.tsx` | **Done (Phase 3).** 3-card contact options row + full contact form. Has `id="book-a-call"` section that the global nav CTA (`primaryCta` in `lib/navigation.ts`) scrolls to, and an inner `id="contact-form"` anchor the "Book a Strategy Call" card links to. |

---

### `components/layout/`

| File | What it does |
|---|---|
| `components/layout/Section.tsx` | **Always use this instead of raw `<section>`.** Handles vertical rhythm (py-16/py-24 default), max-width container (1200px), and dark surface band. Props: `dark`, `spacing` (sm/md/lg), `constrained`, `as`. |
| `components/layout/Navbar.tsx` | Sticky header. Oplura logo asset via `next/image`, primary nav from `lib/navigation.ts`, theme toggle (ðŸŒ™/â˜€ï¸), "Book a Strategy Call" CTA button. Mobile: hamburger disclosure menu. |
| `components/layout/Footer.tsx` | Dark-surface footer. Wordmark + tagline, contact email placeholder (`hello@oplura.co`), nav links from `lib/navigation.ts`, WhatsApp icon button (no visible phone number), social links for Facebook, Instagram, TikTok, plus WhatsApp. |

---

### `components/ui/`

| File | What it does |
|---|---|
| `components/ui/Button.tsx` | Renders `<Link>` when `href` provided, otherwise `<button>`. Variants: `primary` / `secondary` / `ghost`. Sizes: `sm` / `md` / `lg`. |
| `components/ui/Card.tsx` | Elevated surface: white bg, border, shadow. Pass `interactive` for hover shadow lift **+ accent-colored border on hover (Phase 4)**. |
| `components/ui/Modal.tsx` | Portal modal. ESC closes, backdrop click closes, focus trapped inside, returns focus to trigger on close. `aria-modal` + `role="dialog"`. **Phase 4: now fades/scales in on open and plays a matching ~200ms exit transition before unmounting on close**, instead of appearing/disappearing instantly. Same props/API as before. Used by `CaseStudyCard` to play walkthrough videos. |
| `components/ui/Reveal.tsx` | **New (Phase 4).** Client component â€” fades + slides its `children` up into place the first time they scroll into view (`IntersectionObserver` + CSS transitions, no library). Props: `delay` (ms, for staggering siblings), `as` (element tag, default `div`). Respects `prefers-reduced-motion`. Wrap any section-level content with it for the site's scroll-in effect. |

---

### `components/contact/` â€” Contact page (Phase 3)

| File | What it does |
|---|---|
| `components/contact/ContactForm.tsx` | Client component (`"use client"`) rendering the full contact form used on `app/contact/page.tsx`. Owns its own state (`useState`) and validation â€” required-field checks plus regex checks on email and phone. Shows inline error text under each invalid field and a success message in place of the form after a valid submit. **Does not call any API or send an email yet** â€” see "Still needs doing" below for what to wire up. |

---

### `components/three/` â€” 3D model

| File | What it does |
|---|---|
| `components/three/GeodesicSphere.tsx` | **The 3D model.** Truncated-icosahedron wireframe sphere (60 nodes, 90 rods). Matte graphite body (`#1F2937`), enterprise-blue connections (`#2563EB`), ice-cyan highlights (`#38BDF8`). Slow single-axis auto-rotation (360Â° / 24s), unchanged since Phase 2. Transparent background â€” works in both light and dark mode without change. TypeScript port of the original `GeodesicSphere.jsx` supplied by the client. Props: `radius`, `scale`, `rotationSpeed`, `colors`, `nodeRadiusRatio`, `rodRadiusRatio`, `environmentPreset`, `autoRotate`, **`pointer` (new, Phase 4, optional)** â€” a `MutableRefObject<{x,y}>` of normalized cursor position; when present, layers a subtle eased tilt on top of the auto-rotation. Omitting it (or not passing a prop at all) behaves exactly as it did before Phase 4. |
| `components/three/HeroScene.tsx` | Canvas wrapper. Mounts GeodesicSphere inside a transparent `@react-three/fiber` `<Canvas>`. **Always import this, not GeodesicSphere directly.** **Phase 4: tracks pointer position over the canvas in a ref (no re-renders) and passes it to GeodesicSphere as the new `pointer` prop.** |
| `components/three/HeroSceneFallback.tsx` | Pulse skeleton shown while HeroScene loads (used by next/dynamic loading state). |

**3D render chain:**
```
app/page.tsx
  â†’ components/marketing/Hero.tsx
    â†’ next/dynamic (ssr:false) â†’ components/three/HeroScene.tsx
      â†’ components/three/GeodesicSphere.tsx
```

---

### `components/marketing/` â€” Homepage sections

| File | Homepage section | What it does |
|---|---|---|
| `components/marketing/Hero.tsx` | Section 1 | Headline, subheadline, two CTAs ("Book a Strategy Call" primary + "See Our Work" secondary), 3D sphere visual slot with ambient glow behind it. Loads HeroScene via `next/dynamic` (ssr:false). |
| `components/marketing/TrustStrip.tsx` | Section 2 | Credibility line + 5 placeholder client logo slots. Replace with real logos. |
| `components/marketing/ServicesGrid.tsx` | Section 3 | 4 service cards (Custom Operational Systems, Workflow Automation, AI-Enhanced Tools, Client/Contractor Portals). Each links to `/services`. |
| `components/marketing/HowWeWork.tsx` | Section 4 | 4-step process: 01 Discover â†’ 02 Design â†’ 03 Build â†’ 04 Support. |
| `components/marketing/FeaturedCaseStudy.tsx` | Section 5 | Renders a `CaseStudyCard` for the first entry in `lib/case-studies.ts` (homepage teaser only â€” see `app/case-studies/page.tsx` for the full index, added Phase 4). Add entries to the data file â€” no component changes needed. |
| `components/marketing/CaseStudyCard.tsx` | (used by Section 5 + the Case Studies index page) | Reusable card driven entirely by the `CaseStudy` data type. Device mockup frame with static screenshot + â–¶ play button that opens Modal with embedded video player. Below: 2â€“3 supporting screenshots with captions. **Phase 4: supporting screenshots now scale in slightly on hover; everything else unchanged.** |
| `components/marketing/WhyOplura.tsx` | Section 6 | Dark band, 6 differentiators with icons. |
| `components/marketing/Testimonials.tsx` | Section 7 | Client-side carousel, dot indicators, prev/next arrows. 3 placeholder quotes â€” replace with real client copy. |
| `components/marketing/FinalCtaBanner.tsx` | Section 8 | Dark band, "Book a Strategy Call" primary button + WhatsApp icon button side by side. Phone number never visible as text. |
| `components/marketing/WhatsAppButton.tsx` | (used by Section 8 + Footer) | Icon-only WhatsApp link. `href` = `wa.me` deep link with prefilled message. Phone number lives only inside the href â€” never rendered as text anywhere. Props: `variant` (on-light / on-dark). |
| `components/marketing/CTABanner.tsx` | (generic, reusable) | Original architecture-phase generic CTA banner. Use `FinalCtaBanner` for the homepage closing section which needs the WhatsApp button alongside. |

---

### `components/chatbot/`

| File | What it does |
|---|---|
| `components/chatbot/ChatbotSlot.tsx` | Fixed bottom-right placeholder button. Wire the RAG chatbot widget here when ready â€” `app/layout.tsx` does not need to change. |

---

### `lib/`

| File | What it does |
|---|---|
| `lib/navigation.ts` | **Single source of truth for all nav links and shared hrefs.** Exports: `primaryNav` (6 items), `primaryCta` ("Book a Strategy Call" â†’ `/contact#book-a-call`), `secondaryCta` ("See Our Work" â†’ `/case-studies`), `whatsappHref` (full wa.me URL with prefilled message â€” phone number only lives here), `footerNav`. Edit hrefs here, never in components directly. |
| `lib/case-studies.ts` | Case study data source. `caseStudies` array â€” add entries here to grow the Featured Case Study section and eventually the Case Studies index page. Each entry: `slug`, `client`, `industry`, `title`, `summary`, `mockupImage`, `videoUrl` (YouTube/Vimeo embed URL), `screenshots[]` (src + caption). |
| `lib/theme.tsx` | `ThemeProvider` + `useTheme()` hook. Attribute-based dark mode (`data-theme="dark"` on `<html>`). Persists to `localStorage` under `oplura-theme`. Falls back to OS preference (`prefers-color-scheme`) on first visit. |

---

### `public/`

| File | What it does |
|---|---|
| `public/logo-light.png` / `public/logo-dark.png` | Oplura logo variants used in the navbar, footer, favicon, and social preview metadata. |
| `public/images/case-studies/dispatch-dashboard.svg` | Placeholder screenshot â€” replace with real product screenshot. |
| `public/images/case-studies/mobile-driver-app.svg` | Placeholder screenshot â€” replace with real product screenshot. |
| `public/images/case-studies/client-portal.svg` | Placeholder screenshot â€” replace with real product screenshot. |

---

### `docs/`

| File | What it does |
|---|---|
| `docs/design-system.md` | Token reference tables: colors, type scale, spacing, elevation, dark mode, accessibility floor. |
| `docs/sitemap.md` | IA reference â€” all routes and persistent elements. |
| `docs/3d-source/GeodesicSphere.jsx` | Original 3D model JSX file supplied by client. Reference only â€” runtime version is `components/three/GeodesicSphere.tsx`. |
| `docs/3d-source/App.jsx` | Original App.jsx wrapper supplied by client. Reference only. |
| `docs/3d-source/geodesic-sphere-preview.html` | Standalone HTML preview of the sphere â€” open directly in browser, no build step needed. Useful for checking sphere appearance without running the Next.js app. |

---

## Key conventions (must follow in all future phases)

- **Tokens only** â€” never hardcode hex or px anywhere. Use Tailwind classes (`bg-accent-primary`, `text-h2`, `p-6`, `shadow-card`) or CSS vars (`var(--color-accent-primary)`) directly.
- **Section wrapper** â€” always `<Section>` from `components/layout/Section.tsx`, never raw `<section>`. Pass `dark` for a dark band, `spacing` for rhythm control.
- **Nav/hrefs** â€” all links and shared URLs live in `lib/navigation.ts`. Edit there only.
- **WhatsApp rule** â€” phone number must never appear as visible text anywhere on the page. Always route through `<WhatsAppButton />`. The number lives only in `whatsappHref` in `lib/navigation.ts`.
- **Case studies** â€” add data to `lib/case-studies.ts`. No component changes needed.
- **3D model entry point** â€” `components/three/HeroScene.tsx` (always dynamically imported, `ssr:false`). Never import `GeodesicSphere.tsx` directly into a page or layout.
- **Theme** â€” toggle via `useTheme()` from `lib/theme.tsx`. The no-flash inline script in `app/layout.tsx` sets `data-theme` before first paint â€” do not remove it.
- **Chatbot** â€” wire RAG widget into `components/chatbot/ChatbotSlot.tsx` only. Do not touch `app/layout.tsx` for this.
- **New marketing components** â€” add to `components/marketing/`. Import into `app/page.tsx` or the relevant route page. Do not embed section logic directly in page files.
- **Scroll-in animation** â€” wrap new section-level content in `<Reveal>` from `components/ui/Reveal.tsx` for the standard fade/slide-up-on-scroll effect. Don't build one-off IntersectionObserver logic per component.
- **Hover states stay accent-only** â€” when adding hover treatment to a new card/button, use the existing accent tokens (`accent-primary`/`accent-secondary`) the way `Card.tsx` and `Button.tsx` already do. Don't introduce new hover colors outside that palette.
- **Modal** â€” reuse `components/ui/Modal.tsx` as-is for any new dialog/video-player need; it already handles open/close transitions, focus, and ESC/backdrop dismissal. Don't build a second modal component.
- **GeodesicSphere's `pointer` prop is optional** â€” any future scene that mounts `GeodesicSphere` directly (bypassing `HeroScene`) will get the old static-tilt-free behavior unless it also wires up and passes a pointer ref.

---

## Things to swap in before launch

| What | Where |
|---|---|
| Real video embed URL | `lib/case-studies.ts` â†’ `videoUrl` field (replace `YOUR_VIDEO_URL_HERE`) |
| Real case study screenshots | `public/images/case-studies/` â€” replace the 3 SVG placeholders |
| Real client logos | `components/marketing/TrustStrip.tsx` â€” replace the 5 placeholder `<div>` slots |
| Real testimonial quotes | `components/marketing/Testimonials.tsx` â†’ `TESTIMONIALS` array |
| Real contact email (footer) | `components/layout/Footer.tsx` â†’ `CONTACT_EMAIL` constant |
| Real contact email (Contact page) | `app/contact/page.tsx` â†’ `CONTACT_EMAIL` constant (currently `hello@oplura.co` â€” same placeholder as the footer, kept as a separate constant deliberately so either can change independently) |
| Real social profile URLs | `components/layout/Footer.tsx` â†’ `SOCIALS` array |
| Logo in Navbar | Complete: `components/layout/Navbar.tsx` uses `/logo-light.png` and `/logo-dark.png` with `next/image`. |
| Contact form submission | `components/contact/ContactForm.tsx` â†’ `handleSubmit()` â€” currently only validates and shows a success message locally. Needs an API route (or a service like Formspree/Resend) wired into the `if (Object.keys(nextErrors).length === 0)` branch before this goes live, or submissions are lost. |

---

## Still needs doing (not in scope for Phase 4)

- **Contact form backend** â€” see table above. No data currently leaves the browser.
- **How We Work page** (`app/how-we-work/page.tsx`) â€” still a scaffold.
- **Case Studies detail page** (`app/case-studies/[slug]/page.tsx`) â€” still a scaffold. The index page (`app/case-studies/page.tsx`) is done as of Phase 4; each `CaseStudyCard` on it is not yet a link to a detail route.
- **RAG chatbot** â€” `components/chatbot/ChatbotSlot.tsx` is still a placeholder button with nothing wired up.
- **Reveal not yet applied to** `app/services/page.tsx`, `app/about/page.tsx`, or `app/contact/page.tsx` â€” only the homepage and Case Studies page got the scroll-reveal treatment in Phase 4. Wrap their existing sections in `<Reveal>` to extend it, no other changes needed.
- Everything already listed in "Things to swap in before launch" above (logos, screenshots, testimonials, emails, socials, and now real `videoUrl` links per case study).

---

## Verifying this build

Dependencies could not be installed/built in the environment this phase was produced in (no network access), so the Phase 4 changes were reviewed by hand rather than compiled. **Before handing this off further or deploying, run:**

```bash
npm install
npm run build   # confirms strict TS + lint still pass clean
npm run dev      # spot-check /case-studies, the homepage scroll-in, and the hero on hover
```