import dynamic from "next/dynamic";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { primaryCta, secondaryCta } from "@/lib/navigation";
import { HeroSceneFallback } from "@/components/three/HeroSceneFallback";
import { HeroSceneErrorBoundary } from "@/components/three/HeroSceneErrorBoundary";

// 3D relies on WebGL/canvas - load client-only, no SSR attempt.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

export function Hero() {
  return (
    <Section spacing="lg">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="text-h6 uppercase text-accent-primary">Automation / Solutions / Growth</p>
          <h1 className="mt-4 text-h1">
            Custom Software &amp; AI That Eliminates Operational Bottlenecks
          </h1>
          <p className="mt-6 max-w-xl text-body text-text-secondary">
            We design and build secure operational systems, workflow automation, and carefully
            applied AI-enhanced tools - built for construction, logistics, facilities, property,
            and education, and adaptable to operations-led businesses of any size.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={primaryCta.href} size="lg">
              {primaryCta.label}
            </Button>
            <Button href={secondaryCta.href} variant="secondary" size="lg">
              {secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className="hero-visual relative isolate aspect-square w-full max-w-lg justify-self-center lg:max-w-none">
          <div
            aria-hidden="true"
            className="hero-visual-glow absolute inset-0 rounded-full opacity-40 blur-3xl [@media(pointer:coarse)]:blur-xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent-primary) 0%, transparent 65%)",
            }}
          />
          <div className="hero-visual-canvas relative h-full w-full">
            <HeroSceneErrorBoundary>
              <HeroScene />
            </HeroSceneErrorBoundary>
          </div>
        </div>
      </div>
    </Section>
  );
}
