"use client";

import { useState } from "react";
import PageFieldsEditor, { type SectionDef } from "./PageFieldsEditor";
import AdminFAQs from "./AdminFAQs";

const SERVICES = [
  { slug: "single-entry-weighing",    label: "Single Entry Weighing" },
  { slug: "double-entry-weighing",    label: "Double Entry Weighing" },
  { slug: "pharma-industry-services", label: "Pharma Industry Services" },
];

const SERVICE_SECTIONS: SectionDef[] = [
  {
    section: "meta",
    label: "SEO / Meta",
    fields: [
      { key: "title",       label: "Meta Title",       maxLength: 60,  hint: "Browser tab title (50–60 chars recommended)" },
      { key: "description", label: "Meta Description", long: true, maxLength: 160, hint: "Search engine snippet (150–160 chars recommended)" },
    ],
  },
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
        hint:  "Leave blank to use the default hero image.",
      },
    ],
  },
  {
    section: "intro",
    label: "Introduction",
    fields: [
      { key: "text", label: "Intro Paragraph", long: true, maxLength: 500 },
    ],
  },
  {
    section: "benefits",
    label: "Benefits / Key Points",
    fields: [
      {
        key:  "list",
        label: "Benefits List",
        long: true,
        hint: "Separate items with | (pipe). Example: Fast processing|Full audit trail|GxP compliant",
      },
    ],
  },
  {
    section: "cta",
    label: "Call-to-Action Section",
    fields: [
      { key: "enabled",        label: "Show CTA Section",    hint: "Set to 'false' to hide this section entirely" },
      { key: "title",          label: "Headline",            maxLength: 80 },
      { key: "description",    label: "Description",         long: true, maxLength: 200 },
      { key: "primary_label",  label: "Primary Button Label",maxLength: 40 },
      { key: "show_brochure",  label: "Show Brochure Button",hint: "Set to 'false' to hide the Download Brochure button" },
      { key: "brochure_label", label: "Brochure Button Label",maxLength: 40 },
    ],
  },
];

type Tab = "text" | "faqs";

export default function AdminServicePages({ apiBase }: { apiBase: string }) {
  const [slug, setSlug] = useState(SERVICES[0].slug);
  const [tab, setTab]   = useState<Tab>("text");

  const currentService = SERVICES.find((s) => s.slug === slug)!;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-brand-navy text-lg">Service Detail Pages</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Edit the text content, SEO metadata, and FAQs for each service detail page.
        </p>
      </div>

      {/* Service selector */}
      <div className="bg-white rounded-2xl shadow-card p-4 mb-5">
        <label className="block text-xs font-semibold text-gray-600 mb-2">Select Service Page</label>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.slug}
              onClick={() => { setSlug(s.slug); setTab("text"); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                slug === s.slug
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-navy hover:text-brand-navy"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          URL: <code className="bg-gray-100 px-1 rounded">/services/{slug}</code>
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
        {(["text", "faqs"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === t ? "bg-white text-brand-navy shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "text" ? "Page Text & SEO" : "FAQs"}
          </button>
        ))}
      </div>

      {/* Tab hint */}
      <p className="text-[11px] text-gray-400 mb-4">
        {tab === "text"
          ? `Editing hero, intro, and benefits text for "${currentService.label}". Leave blank to use site defaults.`
          : `FAQs shown at the bottom of the "${currentService.label}" page.`}
      </p>

      {/* Content — key forces re-mount when slug changes so fields refresh */}
      {tab === "text" && (
        <PageFieldsEditor
          key={`${slug}-text`}
          apiBase={apiBase}
          page={slug}
          sections={SERVICE_SECTIONS}
        />
      )}

      {tab === "faqs" && (
        <AdminFAQs
          key={`${slug}-faqs`}
          apiBase={apiBase}
          fixedPage={slug}
        />
      )}
    </div>
  );
}
