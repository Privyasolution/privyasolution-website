import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";
import ServiceCard from "@/components/ui/ServiceCard";
import TestimonialsServer from "@/components/sections/TestimonialsServer";
import ClientsSection from "@/components/sections/ClientsSection";
import BrochureButton from "@/components/ui/BrochureButton";
import Link from "next/link";
import {
  Scale, FlaskConical, CheckSquare, Truck, Anchor, Package,
  ArrowRight, ShieldCheck, Zap, BarChart3, Clock,
} from "lucide-react";
import {
  getSettings, getPageContent, getServices, getField,
  getValueProps, getStats,
} from "@/lib/cms";
import {
  FALLBACK_SERVICES,
  FALLBACK_VALUE_PROPS,
  FALLBACK_HOME_INDUSTRIES,
  FALLBACK_HOME_STATS,
} from "@/constants/fallback-home";

export const metadata: Metadata = {
  title: "Weighbridge & Pharma Weighing Solutions | Privya Solution",
  description: "Advanced weighing scales, pharma weighing solutions, checkweighers & automation systems. Accurate, compliant & audit-ready.",
};

// Icon map for services (slug → Lucide icon)
const iconMap: Record<string, LucideIcon> = {
  "single-entry-weighing":    Truck,
  "double-entry-weighing":    Scale,
  "pharma-industry-services": FlaskConical,
  "other-services":           CheckSquare,
  "crane-scales":             Anchor,
  "bagging-filling":          Package,
};

// Icon map for value props (icon_name string → Lucide icon)
const vpIconMap: Record<string, LucideIcon> = {
  ShieldCheck, Zap, BarChart3, Clock, Scale, Truck, FlaskConical,
};

// Color map for value props (index-based cycling)
const vpColors = [
  { color: "text-brand-cyan",     bg: "bg-brand-cyan/10" },
  { color: "text-brand-electric", bg: "bg-brand-electric/10" },
  { color: "text-brand-blue",     bg: "bg-brand-blue/10" },
  { color: "text-brand-navy",     bg: "bg-brand-navy/10" },
];


export default async function HomePage() {
  const [settings, content, cmsServices, cmsValueProps, cmsStats] = await Promise.all([
    getSettings(),
    getPageContent("home"),
    getServices({ homepage: true }), // only published + show_on_homepage services
    getValueProps(),
    getStats("global"),
  ]);

  // No artificial limits — render all CMS-configured items
  const services   = cmsServices.length > 0 ? cmsServices : FALLBACK_SERVICES;
  const valueProps = cmsValueProps.length > 0 ? cmsValueProps : FALLBACK_VALUE_PROPS;
  const statsData  = cmsStats.length > 0 ? cmsStats : FALLBACK_HOME_STATS;

  // Industries from page_content or fallback
  const industriesRaw = getField(content, "industries", "list", "");
  const industries = industriesRaw
    ? industriesRaw.split("|").map((i) => i.trim()).filter(Boolean)
    : FALLBACK_HOME_INDUSTRIES;

  const heroHeadline     = getField(content, "hero", "headline",    "Precision Weighing. Intelligent Automation. Trusted Compliance.");
  const heroSubheadline  = getField(content, "hero", "subheadline", "From weighbridge automation to pharma-grade weighing systems, Privya Solution delivers accurate, audit-ready, and fully automated weighing solutions for modern industries.");
  const heroImageUrl     = getField(content, "hero", "image_url",   "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80");
  const aboutHeadline    = getField(content, "about_snippet", "headline",    "We Don't Just Provide Machines — We Deliver Intelligent Weighing Ecosystems");
  const aboutDesc        = getField(content, "about_snippet", "description", "Privya Solution is a technology-driven company specializing in advanced weighing solutions, industrial automation, and pharma-grade compliance systems.");
  const aboutImage       = getField(content, "about_snippet", "image_url",   "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80");
  const brochureHeadline = getField(content, "brochure_cta", "headline",    "Get Our Full Product Catalog");
  const brochureDesc     = getField(content, "brochure_cta", "description", "Download the Privya Solution brochure to explore our complete range of weighing and pharma solutions.");

  // Customization banner (CMS-driven, with sensible defaults)
  const customText  = getField(content, "customization_banner", "text",       "We also provide fully customizable weighing solutions tailored to your business needs.");
  const customLabel = getField(content, "customization_banner", "link_label", "Talk to Us");

  // Responsive grid class for stats — adapts to any count
  const statsGridCols =
    statsData.length <= 2 ? "grid-cols-2" :
    statsData.length <= 3 ? "grid-cols-3" :
    "grid-cols-2 sm:grid-cols-4";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name,
    description: "Advanced weighing scales, pharma weighing solutions, checkweighers & automation systems.",
    url: "https://privyasolution.in",
    email: settings.email,
    telephone: settings.phone,
    address: { "@type": "PostalAddress", addressLocality: "Surat", addressRegion: "Gujarat", addressCountry: "IN" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroSection
        headline={heroHeadline}
        subheadline={heroSubheadline}
        imageUrl={heroImageUrl}
        badges={["ALCOA+ Compliant", "GxP Ready", "21 CFR Part 11"]}
      />

      {/* Value Props — fully dynamic from CMS */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="section-tag">Why Privya Solution</p>
            <h2 className="section-title">Built for Accuracy. Designed for Compliance.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((v, i) => {
              const Icon = vpIconMap[v.icon_name] || ShieldCheck;
              const { color, bg } = vpColors[i % vpColors.length];
              return (
                <div key={v.title} className="card p-6 flex flex-col gap-4">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={22} className={color} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-brand-navy text-sm mb-1">{v.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services — fully dynamic, no hardcoded limit, conditional Learn More */}
      <section className="section-padding bg-section-gradient">
        <div className="container-max">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-tag">Our Solutions</p>
              <h2 className="section-title">Weighing Systems for Every Industry</h2>
            </div>
            <Link href="/services/other-services" className="btn-outline-dark text-sm py-2.5 px-5 whitespace-nowrap">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => {
              const Icon = iconMap[s.slug] || Scale;
              return (
                <ServiceCard
                  key={s.slug}
                  title={s.title}
                  description={s.description || ""}
                  href={`/services/${s.slug}`}
                  Icon={Icon}
                  badge={s.badge}
                  hasPage={s.has_page}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries — dynamic from CMS */}
      <section className="section-padding-sm bg-brand-navy">
        <div className="container-max">
          <p className="text-center text-xs font-bold tracking-widest uppercase text-brand-cyan/80 mb-6">Industries We Serve</p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span key={ind} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-gray-200 hover:bg-white/20 transition-colors">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — dynamic from CMS */}
      <TestimonialsServer />

      {/* Our Clients — logo slider, CMS-managed */}
      <ClientsSection />

      {/* About snippet — dynamic from CMS, image is CMS-editable */}
      <section className="section-padding bg-white">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-tag">About Privya Solution</p>
            <h2 className="section-title mb-4">{aboutHeadline}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{aboutDesc}</p>
            {/* Stats — fully dynamic, auto-adjusts columns based on count */}
            <div className={`grid ${statsGridCols} gap-4 mb-8`}>
              {statsData.map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-brand-light border border-brand-navy/10">
                  <p className="font-heading font-bold text-2xl gradient-text">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-outline-dark">
              Learn About Us <ArrowRight size={14} />
            </Link>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-brand-light">
            <img
              src={aboutImage}
              alt="Privya Solution industrial weighing facility"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Customization banner — CMS-driven */}
      <section className="py-5 bg-brand-light border-y border-brand-navy/10">
        <div className="container-max px-4 md:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-brand-navy font-medium">
            🔧 <strong>Customization Available</strong> — {customText}
          </p>
          <Link href="/contact" className="btn-outline-dark text-xs py-2 px-4 whitespace-nowrap flex-shrink-0">
            {customLabel}
          </Link>
        </div>
      </section>

      {/* Brochure CTA — dynamic from CMS */}
      <section className="section-padding bg-hero-gradient text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern bg-[size:28px_28px] pointer-events-none" />
        <div className="relative container-max max-w-2xl">
          <p className="section-tag">Free Download</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">{brochureHeadline}</h2>
          <p className="text-gray-300 mb-8 text-sm">{brochureDesc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto">
            <BrochureButton label="Download Brochure" variant="primary" />
            <Link href="/contact" className="btn-outline text-center justify-center">Request Demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
