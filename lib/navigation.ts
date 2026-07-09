/**
 * Site-wide information architecture.
 *
 * Navbar, Footer, and any future breadcrumb/sitemap component should all
 * read from this file rather than hardcoding hrefs, so the IA only has one
 * place to change.
 */

export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Persistent nav CTA — kept separate from primaryNav since it renders as a button, not a link. */
export const primaryCta: NavItem = {
  label: "Book a Strategy Call",
  href: "/contact#book-a-call",
};

/** Secondary CTA used alongside primaryCta (e.g. hero, homepage). */
export const secondaryCta: NavItem = {
  label: "See Our Work",
  href: "/case-studies",
};

/** WhatsApp deep link — prefilled message, no phone number rendered as visible text anywhere. */
export const whatsappHref =
  "https://wa.me/447340001191?text=Hi%20Oplura%2C%20I%27d%20like%20to%20discuss%20a%20project.";

/** Secondary/footer-only links can be added here later without touching the Navbar. */
export const footerNav: NavItem[] = [...primaryNav];
