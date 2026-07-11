"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { primaryNav, primaryCta } from "@/lib/navigation";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 h-[--header-height] border-b border-border bg-bg/95 backdrop-blur [@media(pointer:coarse)]:backdrop-blur-none">
      <div className="mx-auto flex h-full w-full max-w-container items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Oplura home">
          <Image
            src="/logo-light.png"
            alt="Oplura"
            width={132}
            height={132}
            priority
            className="theme-logo-light h-10 w-auto object-contain"
            sizes="132px"
          />
          <Image
            src="/logo-dark.png"
            alt="Oplura"
            width={132}
            height={132}
            priority
            className="theme-logo-dark h-10 w-auto object-contain"
            sizes="132px"
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-2">
            {primaryNav.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "rounded-full bg-bg-muted px-4 py-2 text-small font-medium text-text-primary"
                        : "rounded-full px-4 py-2 text-small text-text-secondary hover:text-text-primary"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-small hover:bg-bg-muted"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <Button href={primaryCta.href} size="sm">
            {primaryCta.label}
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-small hover:bg-bg-muted"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-border bg-bg md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-body text-text-primary hover:bg-bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Button href={primaryCta.href} className="w-full" onClick={() => setMobileOpen(false)}>
                {primaryCta.label}
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
