"use client";

import { useEffect, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from "react";

export type RevealProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Extra delay in ms before the transition starts, for staggering siblings. */
  delay?: number;
  as?: ElementType;
};

/**
 * Wraps content in a subtle fade + slide-up that plays once when the
 * element scrolls into view. Pure CSS transitions (no animation library) —
 * respects prefers-reduced-motion globally via app/globals.css. Use around
 * Section-level content site-wide for consistent scroll-in motion.
 */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div", ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`transition-[opacity,transform] duration-slow ease-standard motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
