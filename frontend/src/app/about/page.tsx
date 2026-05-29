import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import Link from "next/link";
import { ArrowRight, Target, Eye, CheckCircle2 } from "lucide-react";
import { getPageContent, getFaqs, getStats, getField, getLeadershipTeam } from "@/lib/cms";
import {
  FALLBACK_ABOUT_STATS,
  FALLBACK_ABOUT_CAPABILITIES,
  FALLBACK_ABOUT_INDUSTRIES,
  FALLBACK_ABOUT_FAQS,
} from "@/constants/fallback-about";

export const metadata: Metadata = {
  title: "About Privya Solution | Weighing Automation Experts",
  description: "Learn about Privya Solution – experts in weighing scales, pharma automation, and industrial weighing systems.",
};

console.log("Rendering AboutPage with CMS content...");

export default async function AboutPage() {
  const [content, cmsFaqs, cmsStats, cmsLeadership] = await Promise.all([
    getPageContent("about"),
    getFaqs("about"),
    getStats("global"),
    getLeadershipTeam(),
  ]);

  const heroStats  = cmsStats.length > 0 ? cmsStats : FALLBACK_ABOUT_STATS;
  // No fallback — section is hidden when no CMS members are added yet
  const leadership = cmsLeadership;

  const faqs = cmsFaqs.length > 0
    ? cmsFaqs.map((f) => ({ question: f.question, answer: f.answer }))
    : FALLBACK_ABOUT_FAQS;

  const heroHeadline    = getField(content, "hero", "headline",    "About Privya Solution");
  const heroSubheadline = getField(content, "hero", "subheadline", "A technology-driven company specializing in advanced weighing solutions, industrial automation, and pharma-grade compliance systems.");
  const missionText     = getField(content, "mission", "text",     "To deliver accurate, automated, and compliant weighing systems that simplify industrial and pharmaceutical operations — eliminating manual errors and enabling complete traceability.");
  const visionText      = getField(content, "vision",  "text",     "To become a globally trusted leader in weighing automation and digital transformation — setting the standard for accuracy, compliance, and innovation.");
  const bodyHeadline    = getField(content, "about_body", "headline",   "Intelligent Weighing Ecosystems Built for the Future");
  const bodyPara1       = getField(content, "about_body", "paragraph1", "Privya Solution is a technology-driven company specializing in advanced weighing solutions, industrial automation, and pharma-grade compliance systems. Our mission is to eliminate manual errors and bring accuracy, traceability, and efficiency to every weighing process.");
  const bodyPara2       = getField(content, "about_body", "paragraph2", "We design and implement intelligent weighing systems that integrate seamlessly with existing infrastructure — ranging from weighbridges and checkweighers to pharma IPQC-enabled weighing platforms. Our solutions are built with compliance at the core, ensuring adherence to global standards like ALCOA+, 21 CFR Part 11, and GxP guidelines.");

  // Capabilities: CMS overridable (pipe-separated list in page_content)
  const capabilitiesRaw = getField(content, "capabilities", "list", "");
  const capabilities = capabilitiesRaw
    ? capabilitiesRaw.split("|").map((c) => c.trim()).filter(Boolean)
    : FALLBACK_ABOUT_CAPABILITIES;

  // Industries: CMS overridable
  const industriesRaw = getField(content, "industries", "list", "");
  const industriesList = industriesRaw
    ? industriesRaw.split("|").map((i) => i.trim()).filter(Boolean)
    : FALLBACK_ABOUT_INDUSTRIES;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Privya Solution LLP",
    description: "Weighing automation and pharma solutions",
    url: "https://privyasolution.com/about",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroSection
        headline={heroHeadline}
        subheadline={heroSubheadline}
        imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=80"
        imageAlt="Privya Solution industrial facility"
        badges={["10+ Years Experience", "500+ Installations", "GxP Compliant"]}
        stats={heroStats}
      />

      {/* Mission & Vision — dynamic */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-5xl">
          <div className="text-center mb-12">
            <p className="section-tag">Our Purpose</p>
            <h2 className="section-title">Mission & Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-navy flex items-center justify-center">
                <Target size={22} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-navy">Our Mission</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{missionText}</p>
            </div>
            <div className="card p-8 flex flex-col gap-4 bg-brand-navy text-white border-0">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <Eye size={22} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl">Our Vision</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About body — dynamic */}
      <section className="section-padding bg-section-gradient">
        <div className="container-max max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="section-tag">Who We Are</p>
            <h2 className="section-title mb-4">{bodyHeadline}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{bodyPara1}</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{bodyPara2}</p>
            <Link href="/contact" className="btn-outline-dark">
              Get in Touch <ArrowRight size={14} />
            </Link>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-brand-navy mb-5">Our Capabilities</h3>
            <ul className="space-y-3">
              {capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-cyan mt-0.5 flex-shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-padding-sm bg-brand-navy">
        <div className="container-max text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-cyan/80 mb-6">Industries We Serve</p>
          <div className="flex flex-wrap justify-center gap-3">
            {industriesList.map((ind) => (
              <span key={ind} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-gray-200 hover:bg-white/20 transition-colors">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Leadership — dynamic from CMS, premium redesign */}
      <LeadershipSection members={leadership} />

      {/* FAQs — dynamic from CMS */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-10">
            <p className="section-tag">FAQs</p>
            <h2 className="section-title">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card p-6">
                <p className="font-semibold text-brand-navy text-sm mb-2">{faq.question}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
