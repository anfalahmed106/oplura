import { MessageCircle, Phone } from "lucide-react";
import { whatsappHref } from "@/lib/navigation";

export type WhatsAppButtonProps = {
  variant?: "on-light" | "on-dark";
  className?: string;
};

/**
 * Icon-only WhatsApp entry point. Href carries the phone number + prefilled
 * message; the number itself must never appear as visible text on the page,
 * so this component only ever renders an icon + accessible label.
 */
export function WhatsAppButton({ variant = "on-light", className = "" }: WhatsAppButtonProps) {
  const styles =
    variant === "on-dark"
      ? "border-border-on-dark text-text-on-dark hover:bg-white/10"
      : "border-border text-text-primary hover:bg-bg-muted";

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className={`flex h-11 w-11 items-center justify-center rounded-md border transition-colors duration-fast ease-standard ${styles} ${className}`}
    >
      <span className="relative h-5 w-5" aria-hidden="true">
        <MessageCircle className="absolute inset-0 h-5 w-5" />
        <Phone className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2" />
      </span>
    </a>
  );
}
