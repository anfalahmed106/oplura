import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";
import { primaryCta } from "@/lib/navigation";

export type FinalCtaBannerProps = {
  heading?: string;
  subheading?: string;
};

/**
 * Closing conversion band: primary "Book a Strategy Call" button plus a
 * WhatsApp icon button. The WhatsApp link (with prefilled message) lives
 * only inside WhatsAppButton's href — the phone number is never rendered
 * as visible text here or anywhere else on the page.
 */
export function FinalCtaBanner({
  heading = "Ready to remove the bottleneck?",
  subheading = "Book a free strategy call and we'll map out where automation and custom software can save your team the most time.",
}: FinalCtaBannerProps) {
  return (
    <Section dark spacing="md">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-h3">{heading}</p>
          <p className="mt-2 max-w-xl text-body text-text-on-dark-secondary">{subheading}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
          <WhatsAppButton variant="on-dark" />
        </div>
      </div>
    </Section>
  );
}
