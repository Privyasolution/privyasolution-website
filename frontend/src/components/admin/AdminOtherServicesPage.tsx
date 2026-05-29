"use client";

import { useState } from "react";
import PageFieldsEditor, { type SectionDef } from "./PageFieldsEditor";
import AdminStats from "./AdminStats";
import AdminCatalogServices from "./AdminCatalogServices";

type Tab = "content" | "stats" | "cards";

const OTHER_SERVICES_SECTIONS: SectionDef[] = [
  {
    section: "hero",
    label: "Hero Section",
    fields: [
      { key: "tag",      label: "Tag (small text above headline)" },
      {
        key: "headline",
        label: "Headline",
        hint: 'Use \\n to create a line break, e.g. "Every Weighing Challenge.\\nOne Trusted Partner."',
      },
      { key: "subtext", label: "Subtext", long: true },
    ],
  },
  {
    section: "portfolio",
    label: "Portfolio Section",
    fields: [
      { key: "tag",   label: "Section Tag" },
      { key: "title", label: "Section Title" },
      { key: "desc",  label: "Section Description", long: true },
    ],
  },
  {
    section: "industries",
    label: "Industries Bar",
    fields: [
      {
        key: "list",
        label: "Industries (pipe-separated)",
        long: true,
        hint: 'e.g. Pharmaceuticals|Steel & Metal|Cement|Food & FMCG|Chemical|Logistics',
      },
    ],
  },
  {
    section: "why_section",
    label: "Why Choose Us",
    fields: [
      { key: "tag",   label: "Section Tag" },
      {
        key: "title",
        label: "Section Title",
        hint: 'Use \\n for a line break, e.g. "Engineered for Zero-Error\\nIndustrial Operations"',
      },
      { key: "desc",  label: "Description", long: true },
    ],
  },
  {
    section: "capabilities",
    label: "Capabilities List",
    fields: [
      {
        key: "list",
        label: "Capabilities (pipe-separated)",
        long: true,
        hint: 'e.g. Seamless ERP integration via REST API|PDF and Excel reports|On-site installation and training',
      },
    ],
  },
  {
    section: "cta",
    label: "CTA Banner",
    fields: [
      { key: "tag",   label: "Tag" },
      {
        key: "title",
        label: "Title",
        hint: 'Use \\n for a line break, e.g. "Ready to Automate\\nYour Operations?"',
      },
      { key: "desc",  label: "Description", long: true },
    ],
  },
];

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "content", label: "Page Text",     hint: "Hero, portfolio section, industries, why section, capabilities, CTA" },
  { id: "cards",   label: "Service Cards", hint: "Manage the service cards shown in the grid — upload images, edit specs, reorder" },
  { id: "stats",   label: "Stats",         hint: "Numbers in the hero bar (e.g. 13+ Solution Types, 500+ Installations)" },
];

export default function AdminOtherServicesPage({ apiBase }: { apiBase: string }) {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-brand-navy text-lg">Other Services Page</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage content for the full services catalog at{" "}
          <code className="text-brand-cyan font-mono text-[11px]">/services/other-services</code>.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === id
                ? "bg-white text-brand-navy shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mb-4">
        {TABS.find((t) => t.id === tab)?.hint}
      </p>

      {tab === "content" && (
        <PageFieldsEditor apiBase={apiBase} page="other-services" sections={OTHER_SERVICES_SECTIONS} />
      )}
      {tab === "cards" && <AdminCatalogServices apiBase={apiBase} />}
      {tab === "stats" && <AdminStats apiBase={apiBase} fixedPage="other-services" />}
    </div>
  );
}
