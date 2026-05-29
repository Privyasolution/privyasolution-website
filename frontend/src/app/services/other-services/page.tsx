import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import BrochureButton from "@/components/ui/BrochureButton";
import { getPageContent, getStats, getSettings, getField, getCatalogServices } from "@/lib/cms";
import { FALLBACK_CATALOG_SERVICES } from "@/constants/fallback-catalog-services";
import {
  FALLBACK_OTHER_SERVICES_STATS,
  FALLBACK_INDUSTRIES,
  FALLBACK_CAPABILITIES,
} from "@/constants/fallback-other-services";

export const metadata: Metadata = {
  title: "Industrial Weighing Services & Solutions | Privya Solution LLP",
  description:
    "Explore Privya Solution's complete range — checkweighers, crane scales, tank weighing, bagging machines, retail scales, export solutions, and more.",
};

// Static marketing copy — rarely changes; kept in-file intentionally
const WHY_ITEMS = [
  {
    title: "Tamper-Proof Data Integrity",
    desc:  "Every record is immutable, timestamped, and signed — no data loss, no data risk.",
  },
  {
    title: "Universal Device Compatibility",
    desc:  "Works with any digital weighing balance or weighbridge controller through standard interfaces.",
  },
  {
    title: "Real-Time Reporting",
    desc:  "Live dashboards and instant report generation — weight data in seconds, not end-of-shift.",
  },
  {
    title: "Compliance by Design",
    desc:  "Built to meet ALCOA+, 21 CFR Part 11, GxP, and Legal Metrology standards out of the box.",
  },
];

// Responsive grid class for the hero stats bar — adapts to any item count
function statsGridClass(n: number): string {
  if (n <= 2) return "grid-cols-2";
  if (n <= 3) return "grid-cols-3";
  if (n === 4) return "grid-cols-2 sm:grid-cols-4";
  return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function OtherServicesPage() {
  const [content, cmsStats, settings, cmsServices] = await Promise.all([
    getPageContent("other-services"),
    getStats("other-services"),
    getSettings(),
    getCatalogServices(),
  ]);

  // ── Resolved data: CMS wins; fallback takes over when CMS is empty or fails ──
  const services     = cmsServices.length > 0 ? cmsServices : FALLBACK_CATALOG_SERVICES;
  const stats        = cmsStats.length > 0    ? cmsStats    : FALLBACK_OTHER_SERVICES_STATS;

  const industriesRaw  = getField(content, "industries",  "list", "");
  const capabilitiesRaw = getField(content, "capabilities", "list", "");
  const industries  = industriesRaw   ? industriesRaw.split("|").map((i) => i.trim()).filter(Boolean)   : FALLBACK_INDUSTRIES;
  const capabilities = capabilitiesRaw ? capabilitiesRaw.split("|").map((i) => i.trim()).filter(Boolean) : FALLBACK_CAPABILITIES;

  // ── CMS text fields with inline defaults ─────────────────────────────────────
  const heroTag      = getField(content, "hero", "tag",      "Weighing Solutions");
  const heroHeadline = getField(content, "hero", "headline", "Every Weighing Challenge.\nOne Trusted Partner.");
  const heroSubtext  = getField(content, "hero", "subtext",
    "From inline checkweighers to crane scales, tank weighing to export solutions — Privya Solution delivers precision, automation, and compliance across every industrial weighing application."
  );

  const portfolioTag   = getField(content, "portfolio", "tag",   "Our Portfolio");
  const portfolioTitle = getField(content, "portfolio", "title", "End-to-End Weighing & Automation");
  const portfolioDesc  = getField(content, "portfolio", "desc",
    "From lab benchtops to 100-tonne crane scales — every system is precision-engineered, compliance-ready, and backed by our full support team."
  );

  const whyTag   = getField(content, "why_section", "tag",   "Why Choose Us");
  const whyTitle = getField(content, "why_section", "title", "Engineered for Zero-Error\nIndustrial Operations");
  const whyDesc  = getField(content, "why_section", "desc",
    "Every Privya Solution system is built with precision hardware, intelligent software, and compliance at the core — delivering measurable ROI from day one."
  );

  const ctaTag   = getField(content, "cta", "tag",   "Get Started Today");
  const ctaTitle = getField(content, "cta", "title", "Ready to Automate\nYour Operations?");
  const ctaDesc  = getField(content, "cta", "desc",
    "Contact us for a free site assessment and live system demonstration at your facility."
  );

  const phone = settings.phone || "+91-9904095104";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-hero-gradient text-white overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-dot-pattern bg-[size:28px_28px] pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,194,224,0.12) 0%, transparent 70%)",
            transform:  "translate(30%,-30%)",
          }}
        />
        <div className="relative container-max px-4 md:px-8 lg:px-16 flex flex-col items-center text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-cyan mb-4">
            {heroTag}
          </p>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl mb-6">
            {heroHeadline.split("\n").map((line, i) =>
              i === 1 ? (
                <span key={i} className="gradient-text">{line}</span>
              ) : (
                <span key={i}>{line}<br /></span>
              )
            )}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed mb-8">{heroSubtext}</p>

          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto">
            <Link href="/contact" className="btn-primary text-center justify-center">
              Request a Demo <ArrowRight size={16} />
            </Link>
            <BrochureButton label="Download Catalog" variant="outline" />
          </div>

          {/* Responsive stats bar — adapts to any count */}
          <div className={`mt-3 grid ${statsGridClass(stats.length)} gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/10 w-full max-w-2xl`}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center py-5 px-4 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="font-heading font-extrabold text-2xl gradient-text">{s.value}</span>
                <span className="text-xs text-gray-400 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industry tags ─────────────────────────────────────────────────── */}
      <section className="bg-brand-darker border-b border-white/5 py-4">
        <div className="container-max px-4 md:px-8 lg:px-16 flex flex-wrap gap-2 items-center justify-center">
          <span className="text-xs text-gray-500 font-medium mr-2 whitespace-nowrap">
            Industries served:
          </span>
          {industries.map((ind) => (
            <span
              key={ind}
              className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
            >
              {ind}
            </span>
          ))}
        </div>
      </section>

      {/* ── Services grid — CMS data or fallback, always rendered ─────────── */}
      <section className="bg-brand-darker py-20">
        <div className="container-max px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-brand-cyan mb-3">
              {portfolioTag}
            </p>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-3">
              {portfolioTitle}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              {portfolioDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => {
              const specs    = svc.specs
                ? svc.specs.split("|").map((s) => s.trim()).filter(Boolean)
                : [];
              const imageUrl = svc.image_url ||
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80";

              return (
                <article
                  key={svc.slug}
                  id={svc.slug}
                  className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#0D1526]
                             hover:border-brand-cyan/50 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(0,194,224,0.18)]
                             transition-all duration-300 cursor-default"
                >
                  <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden rounded-t-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={`${svc.title} industrial weighing solution`}
                      className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1526] via-[#0D1526]/40 to-transparent" />
                    {svc.badge && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full
                                       bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan backdrop-blur-sm">
                        {svc.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-6 gap-3">
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-cyan transition-colors duration-200 leading-snug">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed flex-1">{svc.description}</p>

                    {specs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {specs.map((spec) => (
                          <span
                            key={spec}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href="/contact"
                      className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-cyan hover:text-white transition-colors group/link"
                    >
                      Get a Quote
                      <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Privya ────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0F1E] py-20 border-t border-white/5">
        <div className="container-max px-4 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-cyan mb-4">
              {whyTag}
            </p>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-5 leading-tight">
              {whyTitle.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < whyTitle.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{whyDesc}</p>
            <ul className="space-y-3 mb-8">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={15} className="text-brand-cyan mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary">
              Talk to an Expert <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {WHY_ITEMS.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-2xl bg-[#0D1526] border border-white/8 hover:border-brand-cyan/30 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #00C2E0, #2B5CE6)" }}
                >
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <h4 className="font-heading font-semibold text-white text-sm mb-1.5">{f.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Customization banner ──────────────────────────────────────────── */}
      <section className="py-5 bg-brand-light border-y border-brand-navy/10">
        <div className="container-max px-4 md:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-brand-navy font-medium">
            🔧 <strong>Customization Available</strong> — We also provide fully customizable weighing
            solutions tailored to your business needs.
          </p>
          <Link href="/contact" className="btn-outline-dark text-xs py-2 px-4 whitespace-nowrap flex-shrink-0">
            Talk to Us
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="relative bg-hero-gradient text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern bg-[size:28px_28px] pointer-events-none" />
        <div className="relative container-max px-4 md:px-8 lg:px-16 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-cyan mb-4">
            {ctaTag}
          </p>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mb-4 leading-tight">
            {ctaTitle.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < ctaTitle.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-gray-300 text-sm mb-8 leading-relaxed">{ctaDesc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-8 py-3.5">
              Get a Free Demo <ArrowRight size={16} />
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 btn-outline px-6 py-3.5 text-sm"
            >
              <Phone size={15} /> {phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
