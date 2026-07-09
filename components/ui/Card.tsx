import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Adds hover elevation — use for clickable/interactive cards only. */
  interactive?: boolean;
};

/**
 * Base surface for services, case studies, and other grouped content.
 * White background, subtle shadow per the design brief. No internal
 * layout is prescribed yet — content phase decides padding/composition
 * beyond the sensible default below.
 */
export function Card({ children, interactive = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-bg-elevated p-6 shadow-card ${
        interactive
          ? "transition-[box-shadow,border-color] duration-base ease-standard hover:border-accent-primary/40 hover:shadow-card-hover"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
