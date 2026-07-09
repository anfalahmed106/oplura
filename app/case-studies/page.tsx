import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BackButton } from "@/components/ui/BackButton";
import { CaseStudyCard } from "@/components/marketing/CaseStudyCard";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real systems shipped for real teams, including secure platforms, portals, and workflow automation.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Section spacing="md">
        <Reveal>
          <BackButton fallbackHref="/" className="mb-8" />
          <p className="text-h6 uppercase text-accent-primary">Case studies</p>
          <h1 className="mt-3 text-h1">Real systems, shipped for real teams</h1>
          <p className="mt-4 max-w-2xl text-body text-text-secondary">
            A closer look at what we&apos;ve built, the problem each system solved, and a walkthrough
            of the work in action.
          </p>
        </Reveal>
      </Section>

      <Section spacing="lg" className="pt-0">
        <div className="flex flex-col gap-20">
          {caseStudies.map((study, index) => (
            <Reveal key={study.slug} delay={index === 0 ? 0 : 80}>
              <CaseStudyCard caseStudy={study} />
              {index < caseStudies.length - 1 && (
                <div className="mt-20 h-px w-full bg-border" aria-hidden="true" />
              )}
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
