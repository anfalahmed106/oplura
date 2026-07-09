# Sitemap / Information Architecture

Source of truth in code: `lib/navigation.ts`.

```
/                       Home
/services               Services
/how-we-work            How We Work
/case-studies           Case Studies (index — lists all entries)
/case-studies/[slug]    Case Studies (individual entry, dynamic route)
/about                  About
/contact                Contact
  #book-a-call            ↳ anchor target for the persistent nav CTA
```

## Persistent elements (present on every route)

- **Navbar** — logo, primary nav (6 items above), theme toggle, "Book a Strategy Call" CTA button (links to `/contact#book-a-call`).
- **Footer** — mirrors primary nav, dark surface.
- **ChatbotSlot** — fixed bottom-right, reserved for the future RAG chatbot. Currently a disabled placeholder button.

## Notes for the content phase

- Case Studies is intentionally a two-route pattern (`index` + `[slug]`) so any number of case studies can be added as data entries without new routes.
- No CMS/data source is wired up yet — the `[slug]` route currently just echoes the slug back.
- `Contact` has a `#book-a-call` anchor already in place so the nav CTA has somewhere real to land, even before the booking form/embed exists.
