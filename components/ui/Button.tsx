import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md text-button transition-colors duration-fast ease-standard disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent-primary text-white hover:bg-accent-primary-hover",
  secondary:
    "bg-transparent text-text-primary border border-border hover:border-accent-primary",
  ghost: "bg-transparent text-text-primary hover:bg-bg-muted",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-5",
  lg: "h-12 px-6",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Renders a <Link> when `href` is provided, otherwise a native <button>.
 * Keeps semantics correct (navigation vs. action) without callers having
 * to choose the element themselves — placeholder styling only for now.
 */
export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
