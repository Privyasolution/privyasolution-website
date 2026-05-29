import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import BrochureButton from "@/components/ui/BrochureButton";
import { getField } from "@/lib/cms";
import type { PageContent, SiteSettings } from "@/lib/cms";

interface Props {
  content: PageContent;
  settings: SiteSettings;
}

export default function ServiceCTA({ content, settings }: Props) {
  const enabled = getField(content, "cta", "enabled", "true");
  if (enabled === "false") return null;

  const title         = getField(content, "cta", "title",          "Ready to Get Started?");
  const description   = getField(content, "cta", "description",    "Contact us for a free site assessment and live system demonstration.");
  const primaryLabel  = getField(content, "cta", "primary_label",  "Request Demo");
  const showBrochure  = getField(content, "cta", "show_brochure",  "true") !== "false";
  const brochureLabel = getField(content, "cta", "brochure_label", "Download Brochure");

  const phone = settings.phone || "+91-9904095104";
  const email = settings.email || "privyasolution@gmail.com";

  return (
    <section className="section-padding bg-hero-gradient text-white relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot-pattern bg-[size:28px_28px] pointer-events-none" />
      {/* Radial glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,194,224,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative container-max max-w-2xl text-center">
        {/* Eyebrow */}
        <p className="section-tag">Get Started Today</p>

        {/* Headline */}
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 leading-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
          {description}
        </p>

        {/* CTA buttons — stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
          <Link
            href="/contact"
            className="btn-primary w-full sm:w-auto justify-center"
          >
            {primaryLabel} <ArrowRight size={15} />
          </Link>
          {showBrochure && (
            <BrochureButton
              label={brochureLabel}
              variant="outline"
              className="w-full sm:w-auto"
            />
          )}
        </div>

        {/* Contact strip */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
          <a
            href={`tel:${phone.replace(/[\s-]/g, "")}`}
            className="flex items-center gap-2 hover:text-brand-cyan transition-colors"
          >
            <Phone size={14} className="text-brand-cyan flex-shrink-0" />
            {phone}
          </a>
          <span className="hidden sm:block text-white/20">|</span>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:text-brand-cyan transition-colors"
          >
            <Mail size={14} className="text-brand-cyan flex-shrink-0" />
            {email}
          </a>
        </div>
      </div>
    </section>
  );
}
