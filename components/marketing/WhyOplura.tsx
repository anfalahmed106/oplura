import { ShieldCheck, Layers, Sparkles, LifeBuoy, DollarSign, Zap } from "lucide-react";
import { Section } from "@/components/layout/Section";

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: "Not template-based",
    description: "Every system is built for your actual process â€” nothing off-the-shelf and repurposed.",
  },
  {
    icon: Layers,
    title: "Industry-specific systems",
    description: "We build for the realities of construction, logistics, and education, not generic SaaS.",
  },
  {
    icon: Sparkles,
    title: "AI only where it adds value",
    description: "No AI for its own sake â€” it goes in only where it genuinely saves time or reduces error.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing support",
    description: "We stay involved after launch, fixing, tuning, and extending as your needs evolve.",
  },
  {
    icon: DollarSign,
    title: "Transparent pricing",
    description: "Clear scope and cost up front â€” no surprise invoices or vague retainers.",
  },
  {
    icon: Zap,
    title: "Fast turnaround",
    description: "Focused builds and short feedback loops get you a working system quickly.",
  },
];

export function WhyOplura() {
  return (
    <Section dark spacing="lg">
      <div className="max-w-2xl">
        <p className="text-h6 uppercase text-accent-secondary">Why Oplura</p>
        <h2 className="mt-3 text-h2">Built for your operation, not a demo</h2>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {DIFFERENTIATORS.map(({ icon: Icon, title, description }) => (
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
  );
}
