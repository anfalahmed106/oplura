import Link from "next/link";
import { Cog, Workflow, Sparkles, Users, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";

const SERVICES = [
  {
    icon: Cog,
    title: "Custom Operational Systems",
    description: "Purpose-built software that fits how your team actually works.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Remove repetitive manual steps and free your team for higher-value work.",
  },
  {
    icon: Sparkles,
    title: "AI-Enhanced Tools",
    description: "AI applied only where it genuinely saves time or reduces error.",
  },
  {
    icon: Users,
    title: "Client/Contractor Portals",
    description: "Self-serve access for clients and contractors, without extra admin load.",
  },
];

export function ServicesGrid() {
  return (
    <Section spacing="lg">
      <div className="max-w-2xl">
        <p className="text-h6 uppercase text-accent-primary">What we build</p>
        <h2 className="mt-3 text-h2">Software that removes the bottleneck, not adds to it</h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, description }) => (
          <Link key={title} href="/services" className="group block">
            <Card interactive className="flex h-full flex-col">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-bg-muted text-accent-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-h5">{title}</h3>
              <p className="mt-2 flex-1 text-small text-text-secondary">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-small font-medium text-accent-primary">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
