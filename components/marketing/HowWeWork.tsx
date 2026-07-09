import { Section } from "@/components/layout/Section";

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "We map your current workflow and find exactly where time and money leak out.",
  },
  {
    number: "02",
    title: "Design",
    description: "We plan the system around your team's real process, not a generic template.",
  },
  {
    number: "03",
    title: "Build",
    description: "We build and ship in focused stages, so you see progress early and often.",
  },
  {
    number: "04",
    title: "Support",
    description: "We stay on after launch — fixing, tuning, and extending as your needs change.",
  },
];

export function HowWeWork() {
  return (
    <Section spacing="lg">
      <div className="max-w-2xl">
        <p className="text-h6 uppercase text-accent-primary">How we work</p>
        <h2 className="mt-3 text-h2">A straightforward path from problem to shipped system</h2>
      </div>

      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.number} className="relative">
            <span className="text-h2 font-bold text-accent-primary/25">{step.number}</span>
            <h3 className="mt-2 text-h5">{step.title}</h3>
            <p className="mt-2 text-small text-text-secondary">{step.description}</p>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute right-[-1rem] top-3 hidden h-px w-8 bg-border lg:block"
              />
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
