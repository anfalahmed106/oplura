import { Section } from "@/components/layout/Section";
import { trustStripIndustries } from "@/lib/trust-strip";

export function TrustStrip() {
  return (
    <Section spacing="sm">
      <p className="mx-auto max-w-3xl text-center text-small text-text-tertiary">
        Trusted by operations-led businesses across a range of industries - built to fit teams of
        any size.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {trustStripIndustries.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex h-20 flex-col items-center justify-center gap-2 rounded-md border border-border bg-bg-elevated text-small text-text-secondary shadow-card"
          >
            <Icon className="h-5 w-5 text-accent-primary" aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
