"use client";

/**
 * Reserved slot for the future RAG chatbot widget.
 *
 * This intentionally does nothing yet: no chat state, no API calls, no
 * message list. It exists so the layout, z-index stacking, and
 * responsive positioning are settled now, and the real widget can be
 * dropped in later without touching app/layout.tsx again.
 *
 * Placement: fixed bottom-right, above all page content, below modals.
 * Swap the button's onClick / content for the real launcher when the
 * chatbot is built.
 */
export function ChatbotSlot() {
  return (
    <div className="fixed bottom-6 right-6 z-30">
      <button
        type="button"
        aria-label="Open chat (coming soon)"
        disabled
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary text-white shadow-card-hover opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* Icon placeholder — replace with chat icon when the widget ships. */}
        <span aria-hidden="true" className="text-h5">
          💬
        </span>
      </button>
    </div>
  );
}
