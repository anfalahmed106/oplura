import type { Metadata } from "next";
import { PhoneCall, Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/contact/ContactForm";
import { whatsappHref } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a strategy call, email us, or message us on WhatsApp to discuss your project.",
};

const CONTACT_EMAIL = "hello@oplura.co";

export default function ContactPage() {
  return (
    <>
      <Section spacing="lg">
        <div className="max-w-2xl">
          <p className="text-h6 uppercase text-accent-primary">Contact</p>
          <h1 className="mt-3 text-h1">Let&apos;s talk about your operation</h1>
          <p className="mt-4 text-body text-text-secondary">
            Pick whatever&apos;s easiest — a call, email, or WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card interactive className="flex flex-col items-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-bg-muted text-accent-primary">
              <PhoneCall className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-h5">Book a Strategy Call</h2>
            <p className="mt-2 flex-1 text-small text-text-secondary">
              Get on a short call to walk through your workflow and where automation fits.
            </p>
            <a
              href="#contact-form"
              className="mt-4 inline-flex items-center gap-1 text-small font-medium text-accent-primary"
            >
              Fill out the form below
            </a>
          </Card>

          <Card className="flex flex-col items-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-bg-muted text-accent-primary">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-h5">Email Us</h2>
            <p className="mt-2 flex-1 text-small text-text-secondary">
              Prefer email? Reach us directly and we&apos;ll respond within one business day.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-1 text-small font-medium text-accent-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </Card>

          <Card className="flex flex-col items-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-bg-muted text-accent-primary">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-h5">Chat on WhatsApp</h2>
            <p className="mt-2 flex-1 text-small text-text-secondary">
              Message us directly for a quick, informal conversation about your project.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              title="Chat with us on WhatsApp"
              className="mt-4 flex h-11 w-11 items-center justify-center rounded-md border border-border text-text-primary transition-colors duration-fast ease-standard hover:bg-bg-muted"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </a>
          </Card>
        </div>
      </Section>

      <Section spacing="lg" id="book-a-call">
        <div className="mx-auto max-w-2xl" id="contact-form">
          <h2 className="text-h2">Tell us about your project</h2>
          <p className="mt-3 text-body text-text-secondary">
            A few details up front means our first call is useful, not a discovery session.
          </p>

          <div className="mt-8 rounded-lg border border-border bg-bg-elevated p-6 shadow-card sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
