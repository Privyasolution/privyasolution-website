import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import HeroSection from "@/components/sections/HeroSection";
import ProcessFlow from "@/components/service-detail/ProcessFlow";
import PharmaProcessFlow from "@/components/service-detail/PharmaProcessFlow";
import ComplianceCarousel from "@/components/service-detail/ComplianceCarousel";
import ServiceCTA from "@/components/sections/ServiceCTA";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { getPageContent, getFaqs, getStats, getSettings, getField } from "@/lib/cms";

// ── Static template data ───────────────────────────────────────────────────────
// This holds the visual/structural data (specs table, process flow steps,
// comparison lists, hero images) that is part of the page template design.
// Text content (hero headline, intro, benefits, FAQs) is CMS-driven with
// these as fallbacks when the CMS has no data yet.

type ServiceTemplate = {
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSub: string;
  heroImage: string;
  heroImageAlt: string;
  intro: string;
  defaultBenefits: string[];
  specs?: { label: string; value: string }[];
  defaultFaqs: { q: string; a: string }[];
  comparison?: { manual: string[]; smart: string[] };
  process?: { step: string; label: string; desc: string }[];
};

const SERVICE_TEMPLATES: Record<string, ServiceTemplate> = {
  "single-entry-weighing": {
    metaTitle: "Single Entry Parcel Weighing System | Camera + Weight + PDF Receipt | Privya Solution",
    metaDescription: "Weigh each parcel individually, capture its image via camera, and auto-generate a PDF receipt showing the parcel photo with weight data — all in one seamless transaction.",
    heroHeadline: "Weigh It. Capture It. Receipt It.",
    heroSub: "Every parcel is weighed individually, photographed by the integrated camera, and a PDF receipt is instantly generated — showing the parcel image alongside the recorded weight data.",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80",
    heroImageAlt: "Parcel being weighed on a precision scale with camera capture",
    intro: "The Single Entry Parcel Weighing System by Privya Solution measures the weight of each parcel individually using a precision weighing scale. For every parcel processed, the system automatically generates a receipt showing the recorded weight. Alongside capturing the weight, an integrated camera records the entire weighing process — photographing the parcel as it is weighed. The final PDF receipt includes both the parcel image and the complete weighing data, giving you a fully documented, tamper-proof record for every single transaction. Ideal for courier hubs, logistics centres, warehouses, and dispatch operations where individual parcel accountability is critical.",
    defaultBenefits: [
      "Individual parcel weighing — each parcel measured separately with precision",
      "Integrated camera captures parcel image during the weighing process",
      "PDF receipt auto-generated with parcel photo + weight data in one document",
      "Zero manual data entry — weight captured directly from the scale",
      "Tamper-proof record — image + weight + timestamp stored together",
      "Instant receipt printing or digital delivery",
      "Searchable transaction history — find any parcel record by date, weight, or ID",
      "Role-based access control with activity monitoring",
      "Integrates with courier, WMS, and ERP systems via API",
      "99.9% system uptime & reliability",
    ],
    specs: [
      { label: "Weighing Method",   value: "Individual parcel — one weight per transaction" },
      { label: "Camera",            value: "Integrated — captures parcel image during weighing" },
      { label: "PDF Receipt",       value: "Parcel image + weight + timestamp + operator ID" },
      { label: "Scale Interface",   value: "RS232 / RS485 / TCP-IP / USB" },
      { label: "Connectivity",      value: "LAN / Wi-Fi" },
      { label: "Report Formats",    value: "PDF (with image) / Excel / Local print" },
      { label: "System Uptime",     value: "99.9%" },
      { label: "Access Control",    value: "Role-based, multi-level" },
    ],
    comparison: {
      manual: [
        "Manual weight reading and recording",
        "No parcel image captured",
        "Paper receipt — easy to lose or alter",
        "No proof of parcel condition at weighing",
        "Slow — operator writes each entry",
        "No searchable transaction history",
      ],
      smart: [
        "Auto weight capture directly from scale",
        "Camera captures parcel image during weighing",
        "PDF receipt with photo + weight — tamper-proof",
        "Visual proof of parcel condition at time of weighing",
        "Fast — receipt generated in seconds",
        "Full searchable digital transaction history",
      ],
    },
    process: [
      { step: "1", label: "Parcel Placed",   desc: "Parcel placed on the weighing scale platform" },
      { step: "2", label: "Weight Captured", desc: "Scale reads and records the exact parcel weight automatically" },
      { step: "3", label: "Camera Captures", desc: "Integrated camera photographs the parcel during weighing" },
      { step: "4", label: "Data Validated",  desc: "Weight and image data validated and linked to the transaction" },
      { step: "5", label: "PDF Generated",   desc: "Receipt auto-generated — parcel image + weight + timestamp in one PDF" },
      { step: "6", label: "Record Stored",   desc: "Complete transaction record saved — searchable and tamper-proof" },
    ],
    defaultFaqs: [
      { q: "How does the camera integration work?", a: "An integrated camera is positioned above or beside the weighing scale. When a parcel is placed on the scale, the camera automatically captures a photograph of the parcel. This image is then embedded directly into the PDF receipt alongside the weight data." },
      { q: "What does the PDF receipt include?", a: "The PDF receipt includes the parcel photograph taken during weighing, the recorded weight, date and time of the transaction, operator ID, and any additional reference fields (such as parcel ID, customer name, or destination) configured for your operation." },
      { q: "Can we search for past parcel records?", a: "Yes — all transactions are stored in a searchable database. You can retrieve any parcel record by date, weight range, parcel ID, or operator." },
      { q: "Does it work with our existing weighing scales?", a: "Yes — the system connects to most digital weighing scales via RS232, RS485, TCP-IP, or USB. Our team will confirm compatibility during the site assessment." },
      { q: "Can it integrate with our courier or WMS software?", a: "Yes — the system supports REST API integration with courier platforms, warehouse management systems (WMS), and ERP software for seamless data flow." },
      { q: "Is the parcel image stored securely?", a: "Yes — all images and transaction data are stored in an encrypted, tamper-proof database with role-based access control. Records cannot be altered after creation." },
    ],
  },

  "double-entry-weighing": {
    metaTitle: "Double Entry Weighing System | ANPR & Audit-Ready | Privya Solution",
    metaDescription: "Fully automated dual-weighment platform with CCTV ANPR, fraud prevention, 99.5% accuracy, and complete audit trail.",
    heroHeadline: "Intelligent Dual-Weighment Platform",
    heroSub: "Two-step automated weighment — truck weighed on entry, then again on exit. Net material weight calculated instantly with zero manual input and a tamper-proof audit trail.",
    heroImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=80",
    heroImageAlt: "Double entry weighbridge with ANPR CCTV system",
    intro: "The Double Entry Weighing System performs two weighments for every truck transaction. Step 1: When the truck enters the weighbridge, the CCTV camera automatically captures the vehicle number plate and the weighbridge records the first (gross/entry) weight. Step 2: When the same truck exits after loading or unloading, the camera re-verifies the plate and the weighbridge records the second (tare/exit) weight. The system then auto-calculates the net material weight (Entry Weight − Exit Weight) — with zero manual input, complete vehicle traceability, and a tamper-proof audit trail for every transaction.",
    defaultBenefits: [
      "99.5% ANPR accuracy — works in all lighting & weather conditions",
      "85% faster operations vs. manual weighment",
      "100% audit traceability — tamper-proof for every transaction",
      "99.9% system uptime & reliability",
      "Dual weighment automation — gross & tare auto-calculated",
      "AI-powered CCTV ANPR — no operator input needed",
      "Fraud prevention — flags mismatches & duplicate entries",
      "Full audit trail — securely logs every transaction",
      "Real-time PDF/Excel reports — instant dispatch slips",
      "Role-based access control with activity monitoring",
    ],
    specs: [
      { label: "ANPR Accuracy",  value: "99.5% — all lighting & weather" },
      { label: "Connectivity",   value: "LAN / Wi-Fi · RS232 / 485" },
      { label: "Report Formats", value: "PDF / Excel — instant generation" },
      { label: "Access Control", value: "Role-based, multi-level" },
    ],
    process: [
      { step: "1", label: "Truck Arrives",       desc: "Truck enters the weighbridge gate for first weighment" },
      { step: "2", label: "CCTV Captures Plate", desc: "Camera auto-reads vehicle number plate — 99.5% accuracy or manual vehicle entry" },
      { step: "3", label: "1st Weighment",       desc: "Entry gross weight recorded on weighbridge platform" },
      { step: "4", label: "Load / Unload",       desc: "Truck loads or unloads material at the facility" },
      { step: "5", label: "CCTV Re-Verifies",    desc: "Camera re-captures plate on exit — vehicle identity confirmed" },
      { step: "6", label: "2nd Weighment",       desc: "Exit tare weight recorded — same vehicle, same bridge" },
      { step: "7", label: "Net Weight & Report", desc: "Net = Entry Weight − Exit Weight, auto-calculated. PDF slip generated instantly." },
    ],
    defaultFaqs: [
      { q: "How does dual weighment work?", a: "Entry gross weight (12,400 kg) minus exit tare weight (10,300 kg) = net material weight (2,100 kg) — auto-calculated, zero manual entry." },
      { q: "Is ANPR accurate in bad weather?", a: "Yes — our AI-powered CCTV ANPR achieves 99.5% accuracy in all lighting and weather conditions." },
      { q: "Can it prevent fraud?", a: "Yes — the system links entry and exit records by plate number and flags any mismatches or duplicate entries instantly." },
      { q: "What reports are generated?", a: "Instant PDF/Excel dispatch slips, daily/weekly/monthly movement reports, and full audit trail logs." },
      { q: "Which industries use this?", a: "Cement, steel, mining, logistics & transport, chemical, agriculture, manufacturing, warehousing, pharma, and FMCG." },
    ],
  },

  "pharma-industry-services": {
    metaTitle: "Pharma Weighing Solutions | ALCOA+ & GxP Ready | Privya Solution",
    metaDescription: "Pharma-grade weighing automation with IPQC, ALCOA+ audit trail, 21 CFR Part 11, and GxP compliance. Stage-wise digital dispensing.",
    heroHeadline: "Accurate. Traceable. Inspection-Ready.",
    heroSub: "A fully digital platform automating stage-wise weighing in pharmaceutical manufacturing — eliminating manual errors, ensuring ALCOA+ data integrity, and generating IPQC-validated, audit-ready records from day one.",
    heroImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1400&q=80",
    heroImageAlt: "Pharma weighing balance integration system",
    intro: "Privya Solution delivers pharma-grade automation that boosts accuracy, ensures IPQC compliance, and protects data integrity at every manufacturing stage — moving teams from error-prone manual workflows to fully digital, traceable, inspection-ready operations. Our Weighing Balance Integration System is Pharmaceutical Grade · GxP Compliant · IPQC & Audit Ready.",
    defaultBenefits: [
      "98% reduction in manual weighing errors",
      "65% faster weighing vs. manual process",
      "100% traceability & audit readiness",
      "99.5% system uptime & reliability",
      "IPQC enabled — in-process quality control at every dispensing stage",
      "ALCOA+ compliant — full data integrity standards",
      "21 CFR Part 11 — electronic records & signatures",
      "GxP Ready — good practice guidelines",
      "LAN/Wi-Fi balance auto-detection & assignment",
      "Immutable timestamped audit log stored securely",
      "Auto-generated PDF weigh slips & Weight Recording Sheets",
      "Role-based access with secure database",
    ],
    specs: [
      { label: "Compliance",    value: "ALCOA+, GxP, 21 CFR Part 11" },
      { label: "IPQC",          value: "Real-time in-process quality checks" },
      { label: "Balance Types", value: "Analytical, Precision" },
      { label: "Connectivity",  value: "LAN / Wi-Fi · RS232 / TCP/IP" },
      { label: "Integration",   value: "FastAPI backend" },
      { label: "Database",      value: "Immutable audit log · Encrypted" },
      { label: "Reports",       value: "PDF Weigh Slip · Weight Recording Sheet" },
    ],
    comparison: {
      manual: [
        "Paper logbook entries",
        "Human weight calculation",
        "Paper-only audit trail",
        "High risk of human error",
        "Slow dispensing process",
        "No IPQC / Part 11 compliance",
      ],
      smart: [
        "Live weight auto-capture",
        "Auto tolerance & IPQC check",
        "Digital ALCOA+ audit trail",
        "Error-free auto operations",
        "65% faster processing",
        "IPQC + 21 CFR Part 11",
      ],
    },
    process: [
      { step: "1", label: "Batch Setup",  desc: "Product, stage & material master loaded into system" },
      { step: "2", label: "Balance Link", desc: "LAN/Wi-Fi balance auto-detected & assigned" },
      { step: "3", label: "Tare & Gross", desc: "Live weight captured; tolerance check applied instantly" },
      { step: "4", label: "Net Weight",   desc: "Auto calculated; out-of-spec flagged immediately" },
      { step: "5", label: "PDF Report",   desc: "Weigh slip & Weight Recording Sheet auto-generated" },
      { step: "6", label: "Audit Log",    desc: "Immutable timestamped log stored securely" },
    ],
    defaultFaqs: [
      { q: "What is ALCOA+?", a: "ALCOA+ is the pharma data integrity framework: Attributable, Legible, Contemporaneous, Original, Accurate — plus Complete, Consistent, Enduring, Available." },
      { q: "Is the system audit-ready?", a: "Yes — all records are electronically signed, timestamped, and stored in an immutable, encrypted database." },
      { q: "What is IPQC?", a: "In-Process Quality Control — real-time dispensing checks that flag out-of-spec batches instantly at every stage." },
      { q: "Do you provide validation docs?", a: "Yes — full IQ/OQ/PQ protocols and DQ documentation are available." },
      { q: "How does balance connectivity work?", a: "Balances connect via LAN or Wi-Fi and are auto-detected by the system — no manual configuration needed per session." },
    ],
  },
};

// ── Static params (build-time slug list) ─────────────────────────────────────
export async function generateStaticParams() {
  return Object.keys(SERVICE_TEMPLATES).map((slug) => ({ slug }));
}

// ── Dynamic metadata — CMS first, template fallback ──────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const template = SERVICE_TEMPLATES[params.slug];
  if (!template) return {};

  const content = await getPageContent(params.slug);
  return {
    title:       getField(content, "meta", "title",       template.metaTitle),
    description: getField(content, "meta", "description", template.metaDescription),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  if (params.slug === "other-services") redirect("/services/other-services");

  const template = SERVICE_TEMPLATES[params.slug];
  if (!template) notFound();

  // Fetch CMS data in parallel — all have graceful fallbacks
  const [content, cmsFaqs, cmsStats, settings] = await Promise.all([
    getPageContent(params.slug),
    getFaqs(params.slug),
    getStats(params.slug),
    getSettings(),
  ]);

  // Hero text — CMS or template fallback
  const heroHeadline = getField(content, "hero", "headline",    template.heroHeadline);
  const heroSub      = getField(content, "hero", "subheadline", template.heroSub);
  const heroImageUrl = getField(content, "hero", "image_url",   template.heroImage);
  const introText    = getField(content, "intro", "text",       template.intro);

  // Benefits — pipe-separated CMS list or template array
  const benefitsRaw = getField(content, "benefits", "list", "");
  const benefits    = benefitsRaw
    ? benefitsRaw.split("|").map((b) => b.trim()).filter(Boolean)
    : template.defaultBenefits;

  // FAQs — CMS rows or template array
  const faqs = cmsFaqs.length > 0
    ? cmsFaqs.map((f) => ({ q: f.question, a: f.answer }))
    : template.defaultFaqs;

  // Stats — CMS rows (empty = no stats bar in hero)
  const heroStats = cmsStats.map((s) => ({ value: s.value, label: s.label }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: getField(content, "meta", "title", template.metaTitle),
    description: getField(content, "meta", "description", template.metaDescription),
    provider: { "@type": "Organization", name: "Privya Solution LLP" },
    url: `https://privyasolution.com/services/${params.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        headline={heroHeadline}
        subheadline={heroSub}
        imageUrl={heroImageUrl}
        imageAlt={template.heroImageAlt}
        badges={[]}
        stats={heroStats}
      />

      {/* Intro */}
      <section className="section-padding-sm bg-white border-b border-gray-100">
        <div className="container-max max-w-3xl text-center">
          <p className="text-gray-500 text-base leading-relaxed">{introText}</p>
          {params.slug === "single-entry-weighing" && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["ANPR Enabled", "99.5% Accuracy", "PDF & Excel Reports", "ERP Integration", "99.9% Uptime"].map(
                (b) => (
                  <span key={b} className="badge-cyan text-xs">
                    {b}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Process flow */}
      {template.process &&
        (params.slug === "pharma-industry-services" ? (
          <PharmaProcessFlow />
        ) : (
          <ProcessFlow
            steps={template.process}
            title={
              params.slug === "single-entry-weighing"
                ? "Step-by-Step Operation"
                : "The Dual Weighment Process"
            }
            slug={params.slug}
          />
        ))}

      {/* Manual vs Smart comparison */}
      {template.comparison && (
        <section className="section-padding bg-section-gradient">
          <div className="container-max max-w-4xl">
            <p className="section-tag text-center w-full">Why Go Digital</p>
            <h2 className="font-heading font-bold text-2xl text-brand-navy mb-8 text-center">
              Manual vs. Smart Digital Weighing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-6">
                <p className="font-heading font-bold text-red-600 mb-4 flex items-center gap-2">
                  <X size={16} /> Manual Method
                </p>
                <ul className="space-y-2.5">
                  {template.comparison.manual.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                      <X size={14} className="mt-0.5 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border-2 border-green-100 bg-green-50 p-6">
                <p className="font-heading font-bold text-green-700 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Smart Digital System
                </p>
                <ul className="space-y-2.5">
                  {template.comparison.smart.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Compliance carousel — pharma only */}
      {params.slug === "pharma-industry-services" && <ComplianceCarousel />}

      {/* Benefits + Specs */}
      <section className="section-padding bg-white">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="section-tag">Key Benefits</p>
            <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
              Why Choose This System
            </h2>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-cyan mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {template.specs && (
            <div>
              <p className="section-tag">Specifications</p>
              <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                Technical Specifications
              </h2>
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                {template.specs.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <span className="w-2/5 px-5 py-3.5 font-semibold text-brand-navy border-r border-gray-200">
                      {s.label}
                    </span>
                    <span className="w-3/5 px-5 py-3.5 text-gray-600">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQs — dynamic from CMS with template fallback */}
      <section className="section-padding bg-section-gradient">
        <div className="container-max max-w-3xl">
          <p className="section-tag w-full text-center">FAQs</p>
          <h2 className="font-heading font-bold text-center text-2xl text-brand-navy mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card p-6">
                <p className="font-semibold text-brand-navy text-sm mb-2">{faq.q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization banner */}
      <section className="py-5 bg-brand-light border-y border-brand-navy/10">
        <div className="container-max px-4 md:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-brand-navy font-medium">
            🔧 <strong>Customization Available</strong> — We also provide fully customizable
            weighing solutions tailored to your business needs.
          </p>
          <Link
            href="/contact"
            className="btn-outline-dark text-xs py-2 px-4 whitespace-nowrap flex-shrink-0"
          >
            Talk to Us
          </Link>
        </div>
      </section>

      {/* CTA */}
      <ServiceCTA content={content} settings={settings} />
    </>
  );
}
