"use client";

import { useState } from "react";
import PageFieldsEditor, { type SectionDef } from "./PageFieldsEditor";
import AdminValueProps from "./AdminValueProps";
import AdminStats from "./AdminStats";

type Tab = "content" | "value-props" | "stats";

const HOME_SECTIONS: SectionDef[] = [
  {
    section: "hero",
    label: "Hero Section",
    fields: [
      { key: "headline",    label: "Headline",    maxLength: 120 },
      { key: "subheadline", label: "Subheadline", long: true, maxLength: 300 },
      {
        key:   "image_url",
        label: "Background Image",
        image: true,
        hint:  "Used as a subtle background overlay. Leave blank to use the default.",
      },
    ],
  },
  {
    section: "industries",
    label: "Industries Bar",
    fields: [
      {
        key:  "list",
        label: "Industries (pipe-separated)",
        long: true,
        hint: 'e.g. Pharmaceuticals|Steel & Metal|Cement|Food & FMCG|Chemical|Logistics',
      },
    ],
  },
  {
    section: "about_snippet",
    label: "About Snippet",
    fields: [
      { key: "headline",    label: "Headline",    maxLength: 150 },
      { key: "description", label: "Description", long: true, maxLength: 500 },
      {
        key:   "image_url",
        label: "Section Image",
        image: true,
        hint:  "Leave blank to keep the default image.",
      },
    ],
  },
  {
    section: "brochure_cta",
    label: "Brochure CTA",
    fields: [
      { key: "headline",    label: "Headline",    maxLength: 120 },
      { key: "description", label: "Description", long: true, maxLength: 300 },
    ],
  },
  {
    section: "customization_banner",
    label: "Customization Banner",
    fields: [
      {
        key:   "text",
        label: "Banner Text",
        long:  true,
        maxLength: 250,
        hint:  "The sentence shown after \"Customization Available —\"",
      },
      {
        key:   "link_label",
        label: "Button Label",
        maxLength: 30,
      },
    ],
  },
];

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "content",     label: "Page Text",   hint: "Hero, industries, about snippet, brochure CTA, customization banner" },
  { id: "value-props", label: "Value Props", hint: "The feature cards below the hero section" },
  { id: "stats",       label: "Stats",       hint: "Numbers shown in the About section — add as many as you need" },
];

export default function AdminHomePage({ apiBase }: { apiBase: string }) {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-brand-navy text-lg">Home Page</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage all content on the homepage — text, images, feature cards, and statistics.
        </p>
      </div>

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

      {tab === "content"     && <PageFieldsEditor apiBase={apiBase} page="home" sections={HOME_SECTIONS} />}
      {tab === "value-props" && <AdminValueProps apiBase={apiBase} />}
      {tab === "stats"       && <AdminStats apiBase={apiBase} fixedPage="global" />}
    </div>
  );
}
