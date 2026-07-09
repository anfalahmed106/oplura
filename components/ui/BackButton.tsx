"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export function BackButton({ fallbackHref = "/", label = "Back", className = "" }: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-small font-medium text-text-secondary transition-colors duration-fast ease-standard hover:text-text-primary ${className}`}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
