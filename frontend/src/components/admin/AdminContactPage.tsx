"use client";

import PageFieldsEditor, { type SectionDef } from "./PageFieldsEditor";

const CONTACT_SECTIONS: SectionDef[] = [
  {
    section: "hero",
    label: "Hero Section",
    fields: [
      { key: "headline",    label: "Headline" },
      { key: "subheadline", label: "Subheadline", long: true },
    ],
  },
];

export default function AdminContactPage({ apiBase }: { apiBase: string }) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-brand-navy text-lg">Contact Page</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage the contact page hero text. To update the company phone number, email address, or
          physical address — go to <strong>Site Settings</strong>.
        </p>
      </div>

      <PageFieldsEditor apiBase={apiBase} page="contact" sections={CONTACT_SECTIONS} />
    </div>
  );
}
