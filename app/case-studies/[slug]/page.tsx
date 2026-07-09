import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { BackButton } from "@/components/ui/BackButton";
import { CaseStudyCard } from "@/components/marketing/CaseStudyCard";
import { caseStudies } from "@/lib/case-studies";

type CaseStudyPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const study = caseStudies.find((item) => item.slug === params.slug);

  if (!study) {
    return {
      title: "Case Study",
    };
  }

  return {
    title: study.title,
    description: study.summary,
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = caseStudies.find((item) => item.slug === params.slug);

  if (!study) notFound();

  return (
    <Section spacing="lg">
      <BackButton fallbackHref="/case-studies" className="mb-8" />
      <CaseStudyCard caseStudy={study} />
    </Section>
  );
}
