import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { HowWeWork } from "@/components/marketing/HowWeWork";
import { FeaturedCaseStudy } from "@/components/marketing/FeaturedCaseStudy";
import { WhyOplura } from "@/components/marketing/WhyOplura";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FinalCtaBanner } from "@/components/marketing/FinalCtaBanner";
import { Reveal } from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <>
      {/* Hero renders immediately, above the fold — no scroll-reveal delay */}
      <Hero />
      <Reveal>
        <TrustStrip />
      </Reveal>
      <Reveal>
        <ServicesGrid />
      </Reveal>
      <Reveal>
        <HowWeWork />
      </Reveal>
      <Reveal>
        <FeaturedCaseStudy />
      </Reveal>
      <Reveal>
        <WhyOplura />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <FinalCtaBanner />
      </Reveal>
    </>
  );
}
