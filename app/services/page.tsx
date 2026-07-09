import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ServicesDetailGrid } from "@/components/marketing/ServicesDetailGrid";
import { primaryCta } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Operational dashboards, document automation, mobile field tools, client portals, AI add-ons, and secure system improvements built around how your team works.",
};

export default function ServicesPage() {
  return (
    <>
      <Section spacing="lg">
        <div className="max-w-2xl">
          <p className="text-h6 uppercase text-accent-primary">What we build</p>
          <h1 className="mt-3 text-h1">Services built around how your team actually works</h1>
          <p className="mt-4 text-body text-text-secondary">
            Every system starts with your real process, not a template. The core services below can
            stand alone or combine into a complete operational platform.
          </p>
        </div>

        <ServicesDetailGrid />
      </Section>

      <Section spacing="md">
        <div className="flex flex-col items-start gap-6 rounded-lg border border-border bg-bg-elevated p-8 shadow-card md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-h3">
              <Sparkles className="mr-2 inline h-6 w-6 text-accent-primary" aria-hidden="true" />
              Not sure which fits your operation?
            </p>
            <p className="mt-2 max-w-xl text-body text-text-secondary">
              Book a strategy call and we&apos;ll map your workflow to the right combination of systems.
            </p>
          </div>
          <Button href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
        </div>
      </Section>
    </>
  );
}
