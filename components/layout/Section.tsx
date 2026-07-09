import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Renders on the dark surface (--color-bg-section-dark) for deliberate contrast bands. */
  dark?: boolean;
  /** Vertical padding size; "lg" is the default for full page sections. */
  spacing?: "sm" | "md" | "lg";
  /** Escape hatch for full-bleed sections that shouldn't get the max-width container. */
  constrained?: boolean;
  as?: ElementType;
};

const spacingClasses = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
};

/**
 * Every page section should be wrapped in this rather than raw <section>
 * tags, so vertical rhythm and container width stay consistent site-wide.
 * No content/composition decisions live here — just spacing and surface.
 */
export function Section({
  children,
  dark = false,
  spacing = "lg",
  constrained = true,
  as: Tag = "section",
  className = "",
  ...props
}: SectionProps) {
  return (
    <Tag
      className={`${dark ? "bg-bg-section-dark text-text-on-dark" : "bg-transparent"} ${spacingClasses[spacing]} ${className}`}
      {...props}
    >
      {constrained ? (
        <div className="mx-auto w-full max-w-container px-4 md:px-8">{children}</div>
      ) : (
        children
      )}
    </Tag>
  );
}
