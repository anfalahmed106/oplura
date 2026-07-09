import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { CaseStudyCard } from "@/components/marketing/CaseStudyCard";
import { caseStudies } from "@/lib/case-studies";

export function FeaturedCaseStudy() {
  const featured = caseStudies.slice(0, 1);

  return (
    <Section spacing="lg">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-h6 uppercase text-accent-primary">Featured case study</p>
          <h2 className="mt-3 text-h2">Real systems, shipped for real teams</h2>
        </div>
        <Link href="/case-studies" className="text-small font-medium text-accent-primary hover:underline">
          View all case studies →
        </Link>
      </div>

      <div className="mt-12 flex flex-col gap-16">
        {featured.map((study) => (
          <CaseStudyCard key={study.slug} caseStudy={study} />
        ))}
      </div>
    </Section>
  );
}
