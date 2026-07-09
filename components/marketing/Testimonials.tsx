"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { testimonials } from "@/lib/testimonials";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index] ?? testimonials[0];
  const hasMultiple = testimonials.length > 1;

  const goTo = (next: number) => {
    if (!testimonials.length) return;
    setIndex((next + testimonials.length) % testimonials.length);
  };

  if (!testimonial) return null;

  return (
    <Section spacing="lg">
      <div className="max-w-2xl">
        <p className="text-h6 uppercase text-accent-primary">What clients say</p>
        <h2 className="mt-3 text-h2">Testimonials</h2>
      </div>

      <div className="mt-10 flex items-center gap-4">
        {hasMultiple && (
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous testimonial"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border hover:bg-bg-muted sm:flex"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        <Card className="mx-auto max-w-2xl text-center">
          <Quote className="mx-auto h-8 w-8 text-accent-primary/40" aria-hidden="true" />
          <p className="mt-4 text-h5 font-normal text-text-primary">{testimonial.quote}</p>
          <p className="mt-6 text-body font-semibold">{testimonial.name}</p>
          <p className="text-small text-text-tertiary">{testimonial.location}</p>
        </Card>

        {hasMultiple && (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next testimonial"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border hover:bg-bg-muted sm:flex"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {hasMultiple && (
        <>
          <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
            <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous testimonial" className="p-2">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => goTo(index + 1)} aria-label="Next testimonial" className="p-2">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name + i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full transition-colors duration-fast ease-standard ${
                  i === index ? "bg-accent-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </Section>
  );
}
