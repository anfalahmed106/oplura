"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { CaseStudy } from "@/lib/case-studies";

export type CaseStudyCardProps = {
  caseStudy: CaseStudy;
};

/**
 * Device-mockup frame with a static thumbnail + centered play button.
 * Clicking opens the shared Modal with an embedded video player. Below,
 * a small grid of supporting screenshots with captions. Fully driven by
 * the `caseStudy` prop, so add more entries in lib/case-studies.ts and
 * render another <CaseStudyCard /> without component changes.
 */
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10">
        <div>
          <p className="text-h6 uppercase text-accent-primary">
            {caseStudy.industry} / {caseStudy.client}
          </p>
          <h3 className="mt-3 text-h3">{caseStudy.title}</h3>
          <div className="mt-4 space-y-3 text-body text-text-secondary">
            <p>{caseStudy.summary}</p>
            {expanded && <p>{caseStudy.fullDetail}</p>}
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-4 text-small font-medium text-accent-primary hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-card">
            <div className="flex items-center gap-1.5 border-b border-border bg-bg-muted px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative block aspect-video w-full"
              aria-label={`Watch full walkthrough: ${caseStudy.title}`}
            >
              <Image
                src={caseStudy.thumbnailImage}
                alt={`${caseStudy.title} product preview`}
                fill
                unoptimized
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-base ease-standard group-hover:bg-black/40">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-text-primary shadow-modal transition-transform duration-base ease-standard group-hover:scale-105">
                  <Play className="h-6 w-6 translate-x-0.5" aria-hidden="true" fill="currentColor" />
                </span>
              </span>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-3 py-1 text-small text-white">
                Watch Full Walkthrough
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {caseStudy.screenshots.map((shot) => (
          <Card key={shot.src + shot.caption} interactive className="group overflow-hidden p-0">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={shot.src}
                alt={shot.caption}
                fill
                unoptimized
                className="object-cover transition-transform duration-slow ease-standard group-hover:scale-105"
              />
            </div>
            <p className="p-3 text-small text-text-secondary">{shot.caption}</p>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`${caseStudy.title} walkthrough video`}>
        <div className="aspect-video w-full">
          <iframe
            src={caseStudy.videoUrl}
            title={`${caseStudy.title} walkthrough`}
            className="h-full w-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </div>
  );
}
