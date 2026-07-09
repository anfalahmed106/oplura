"use client";

import { useState, type ComponentType } from "react";
import {
  FileText,
  ImageIcon,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  Users,
  type LucideProps,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

type ServiceDetail = {
  icon: ComponentType<LucideProps>;
  title: string;
  summary: string;
  detail: string;
};

const SERVICES: ServiceDetail[] = [
  {
    icon: LayoutDashboard,
    title: "Operational Dashboards & CRUD Systems",
    summary: "Custom internal tools for tracking jobs, assets, inventory, records, and live workflows.",
    detail:
      "Built around how your team already works, these systems replace scattered spreadsheets and manual status chasing with structured records, permissions, and practical reporting.",
  },
  {
    icon: FileText,
    title: "Document Automation",
    summary: "Auto-generated quotes, PDFs, invoices, and operational paperwork from your own data.",
    detail:
      "We remove repetitive formatting and retyping by turning form entries and internal records into consistent documents your team can review, export, and send.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Field Tools",
    summary: "Timesheets, site diaries, checklists, logs, and mobile workflows for teams away from a desk.",
    detail:
      "Field teams can submit updates from phones while office staff get structured data back in one place, reducing missed messages and duplicated admin.",
  },
  {
    icon: Users,
    title: "Client & Contractor Portals",
    summary: "Secure self-service spaces for clients, contractors, staff, and partners.",
    detail:
      "Portals reduce routine update requests by giving approved users controlled access to statuses, documents, submissions, and shared workflow steps.",
  },
  {
    icon: ImageIcon,
    title: "AI Add-Ons",
    summary: "OCR, voice-to-text logging, drafted reports, image analysis, and smart suggestions.",
    detail:
      "AI is added only where it saves time or reduces error. We keep it attached to clear business workflows instead of using it as a novelty feature.",
  },
  {
    icon: ShieldCheck,
    title: "Secure System Improvements",
    summary: "Access control, safer data handling, structured workflows, and audit trails where relevant.",
    detail:
      "For business-critical tools, we design sensible permission boundaries, validation, logging, and safer operational flows from the start.",
  },
];

function ServiceDetailCard({ service }: { service: ServiceDetail }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;

  return (
    <Card className="flex h-full flex-col">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-bg-muted text-accent-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-h5">{service.title}</h2>
      <div className="mt-2 flex-1 space-y-3 text-small text-text-secondary">
        <p>{service.summary}</p>
        {expanded && <p>{service.detail}</p>}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="mt-4 self-start text-small font-medium text-accent-primary hover:underline"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </Card>
  );
}

export function ServicesDetailGrid() {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service) => (
        <ServiceDetailCard key={service.title} service={service} />
      ))}
    </div>
  );
}
