"use client";

import { useState } from "react";
import PageFieldsEditor, { type SectionDef } from "./PageFieldsEditor";
import AdminStats from "./AdminStats";

type Tab = "content" | "stats";

const ABOUT_SECTIONS: SectionDef[] = [
  {
    section: "hero",
    label: "Hero Section",
    fields: [
      { key: "headline",    label: "Headline" },
      { key: "subheadline", label: "Subheadline", long: true },
    ],
  },
  {
    section: "mission",
    label: "Mission",
    fields: [
      { key: "text", label: "Mission Text", long: true },
    ],
  },
  {
    section: "vision",
    label: "Vision",
    fields: [
      { key: "text", label: "Vision Text", long: true },
    ],
  },
  {
    section: "about_body",
    label: "About Body",
    fields: [
      { key: "headline",   label: "Section Headline" },
      { key: "paragraph1", label: "Paragraph 1", long: true },
      { key: "paragraph2", label: "Paragraph 2", long: true },
    ],
  },
  {
    section: "capabilities",
    label: "Capabilities",
    fields: [
      {
        key: "list",
        label: "Capabilities (pipe-separated)",
        long: true,
        hint: 'e.g. ERP integration|ISO certified|24/7 AMC support',
      },
    ],
  },
  {
    section: "industries",
    label: "Industries Served",
    fields: [
      {
        key: "list",
        label: "Industries (pipe-separated)",
        long: true,
        hint: 'e.g. Pharmaceuticals|Steel & Metal|Cement|Logistics',
      },
    ],
  },
];

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "content", label: "Page Text", hint: "Hero, mission, vision, body copy, capabilities, industries" },
  { id: "stats",   label: "Stats",     hint: "Numbers shown on the About page" },
];

export default function AdminAboutPage({ apiBase }: { apiBase: string }) {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-brand-navy text-lg">About Page</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage the company story, mission, vision, and key capabilities.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
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

      {tab === "content" && <PageFieldsEditor apiBase={apiBase} page="about" sections={ABOUT_SECTIONS} />}
      {tab === "stats"   && <AdminStats apiBase={apiBase} fixedPage="about" />}
    </div>
  );
}
