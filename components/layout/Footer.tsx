import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, Music2 } from "lucide-react";
import { footerNav } from "@/lib/navigation";
import { Section } from "@/components/layout/Section";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";

// Placeholder contact email; swap for the real inbox in the content phase.
const CONTACT_EMAIL = "hello@oplura.co";

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591382381441" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/oplura.system?igsh=MTk5eTY0aTF6ZjR1" },
  { icon: Music2, label: "TikTok", href: "https://www.tiktok.com/@oplura_" },
];

export function Footer() {
  return (
    <Section as="footer" dark spacing="md">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href="/"
            aria-label="Oplura home"
            className="inline-flex overflow-hidden rounded-md bg-white shadow-card transition-opacity duration-fast ease-standard hover:opacity-90"
          >
            <Image
              src="/logo-light.png"
              alt="Oplura"
              width={132}
              height={132}
              className="theme-logo-light h-24 w-auto object-contain"
              sizes="132px"
            />
            <Image
              src="/logo-dark.png"
              alt="Oplura"
              width={132}
              height={132}
              className="theme-logo-dark h-24 w-auto object-contain"
              sizes="132px"
            />
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 flex items-center gap-2 text-small text-text-on-dark-secondary hover:text-text-on-dark"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 md:flex-row md:gap-8">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-small text-text-on-dark-secondary hover:text-text-on-dark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <WhatsAppButton variant="on-dark" />
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border-on-dark text-text-on-dark-secondary hover:bg-white/10 hover:text-text-on-dark"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-border-on-dark pt-6 text-small text-text-on-dark-secondary md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Oplura. All rights reserved.</p>
      </div>
    </Section>
  );
}
