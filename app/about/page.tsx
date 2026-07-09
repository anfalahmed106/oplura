import type { Metadata } from "next";
import { Target, Compass, ShieldCheck, Wrench } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { primaryCta } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Oplura exists, what we're building toward, and the approach we take to every operational system we ship.",
};

const APPROACH = [
  {
    icon: Target,
    title: "Process first, software second",
    description:
      "We map how work actually happens before writing a line of code, so the system fits the operation instead of forcing the operation to fit the system.",
  },
  {
    icon: Wrench,
    title: "Built, not assembled",
    description:
      "No page builders or bloated no-code stacks standing in for real engineering. What we ship is built to be maintained and extended for years.",
  },
  {
    icon: ShieldCheck,
    title: "Precision over speed-to-demo",
    description:
      "It's easy to make something look finished. We optimize for it working correctly under real, messy, day-to-day conditions instead.",
  },
  {
    icon: Compass,
    title: "Accountable after launch",
    description:
      "We stay attached to what we build â€” fixing, tuning, and extending it as your operation changes, not disappearing after handover.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section spacing="lg">
        <div className="max-w-2xl">
          <p className="text-h6 uppercase text-accent-primary">About Oplura</p>
          <h1 className="mt-3 text-h1">Software built by people who've sat inside the bottleneck</h1>
        </div>

        <div className="mt-10 max-w-3xl space-y-6 text-body text-text-secondary">
          <p>
            Oplura started from a simple frustration: too many operational teams â€” in construction,
            logistics, and field services â€” were running critical parts of their business through
            spreadsheets, WhatsApp threads, and paper checklists never designed for the job. The
            software that was supposed to help either didn&apos;t fit the work, or cost more to
            configure than to build from scratch.
          </p>
          <p>
            We set out to build the alternative: custom systems built around how a specific team
            actually operates, shipped fast enough to matter, and solid enough to still be running
            years later.
          </p>
          <p>
            Our mission is to remove the operational bottlenecks â€” the manual data entry, the
            duplicate paperwork, the status updates chased over the phone â€” that quietly cost
            operational businesses the most time and money, without adding another tool nobody
            wants to use.
          </p>
        </div>
      </Section>

      <Section dark spacing="lg">
        <div className="max-w-2xl">
          <p className="text-h6 uppercase text-accent-secondary">Why we build this way</p>
          <h2 className="mt-3 text-h2">Enterprise-grade discipline, applied to systems of every size</h2>
          <p className="mt-4 text-body text-text-on-dark-secondary">
            We treat every project â€” whether it&apos;s a single dashboard or a full client portal â€”
            with the same rigor a much larger engineering team would apply.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {APPROACH.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10 text-accent-secondary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-h5 text-text-on-dark">{title}</h3>
                <p className="mt-1 text-small text-text-on-dark-secondary">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="md">
        <div className="flex flex-col items-start gap-6 rounded-lg border border-border bg-bg-elevated p-8 shadow-card md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-h3">Want to see if we're the right fit?</p>
            <p className="mt-2 max-w-xl text-body text-text-secondary">
              Book a short strategy call and we&apos;ll tell you honestly whether a custom system
              makes sense for your operation.
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
