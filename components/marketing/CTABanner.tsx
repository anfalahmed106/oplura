import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { primaryCta } from "@/lib/navigation";

export type CTABannerProps = {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Full-width conversion banner, dark surface by default for visual
 * separation from surrounding content. Drop into any page. Copy props
 * default to placeholders — real copy comes in the content phase.
 */
export function CTABanner({
  heading = "[CTA heading placeholder]",
  subheading = "[CTA supporting line placeholder]",
  ctaLabel = primaryCta.label,
  ctaHref = primaryCta.href,
}: CTABannerProps) {
  return (
    <Section dark spacing="md">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-h3">{heading}</p>
          <p className="mt-2 text-body text-text-on-dark-secondary">{subheading}</p>
        </div>
        <Button href={ctaHref} size="lg">
          {ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
