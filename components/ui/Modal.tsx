"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible label for the dialog, e.g. "Case study walkthrough video". */
  title: string;
  children?: ReactNode;
};

const TRANSITION_MS = 200;

/**
 * Shared modal shell used for case study video walkthroughs and any other
 * dialog content. Behavior: ESC to close, backdrop click to close, focus
 * moved into the dialog on open and returned to the trigger on close,
 * aria-modal + role="dialog" for screen readers.
 *
 * Animation: fades + scales in on open, and stays mounted through a matching
 * exit transition on close (rather than unmounting instantly) so the video
 * player never just pops away.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      setMounted(true);
      // Next tick so the enter transition actually plays from the closed state.
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setVisible(false);
    const timeout = setTimeout(() => {
      setMounted(false);
      triggerRef.current?.focus();
    }, TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (visible) dialogRef.current?.focus();
  }, [visible]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-base ease-standard motion-reduce:transition-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`w-full max-w-2xl rounded-lg bg-bg-elevated shadow-modal outline-none transition-[opacity,transform] duration-base ease-standard motion-reduce:transition-none ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
