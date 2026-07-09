import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export function FeaturedCaseStudy() {
  return (
    <Section spacing="lg">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-bg-muted px-8 py-14 text-center">
        <p className="text-h6 uppercase text-accent-primary">Featured case study</p>
        <h2 className="mt-3 text-h2">Real systems, shipped for real teams</h2>
        <div className="mt-8">
          <Button href="/case-studies" size="lg">
            View All Case Studies
          </Button>
        </div>
      </div>
    </Section>
  );
}
