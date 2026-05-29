"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, CheckCircle2, Phone } from "lucide-react";
import BrochureModal from "@/components/ui/BrochureModal";

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaPrimary?:  { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  imageUrl?: string;
  imageAlt?: string;
  badges?: string[];
  stats?: { value: string; label: string }[];
}

const defaultStats = [
  { value: "98%",  label: "Error Reduction" },
  { value: "500+", label: "Installations" },
  { value: "100%", label: "Audit Ready" },
];

export default function HeroSection({
  headline,
  subheadline,
  ctaPrimary   = { label: "Request Demo",      href: "/contact" },
  ctaSecondary = { label: "Download Brochure", href: "#" },
  imageUrl = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80",
  imageAlt = "Industrial weighing solution",
  badges = ["ALCOA+ Compliant", "GxP Ready", "21 CFR Part 11"],
  stats  = defaultStats,
}: HeroProps) {
  const [brochureOpen, setBrochureOpen] = useState(false);
  return (
    <>
    {/* Modal rendered FIRST — outside the overflow-hidden section */}
    <BrochureModal isOpen={brochureOpen} onClose={() => setBrochureOpen(false)} />
    <section className="relative bg-hero-gradient text-white overflow-hidden min-h-[70vh] md:min-h-[88vh] flex flex-col justify-center">

      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
        style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden="true" />

      {/* Dot grid pattern */}
      <div className="absolute inset-0 bg-dot-pattern bg-[size:28px_28px] opacity-100 pointer-events-none" />

      {/* Cyan glow — top right */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,194,224,0.14) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

      {/* Blue glow — bottom left */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(43,92,230,0.14) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <div className="relative container-max section-padding flex flex-col items-center text-center gap-8 z-10">

        {/* Compliance badges */}
        {badges.length > 0 && (
          <motion.div className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {badges.map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/8 border border-brand-cyan/30 text-gray-200 backdrop-blur-sm">
                <CheckCircle2 size={11} className="text-brand-cyan" /> {b}
              </span>
            ))}
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          className="font-heading font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] max-w-5xl"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
        >
          {/* Split on ". " to highlight second sentence in cyan gradient */}
          {headline.includes(". ") ? (
            <>
              {headline.split(". ")[0]}.{" "}
              <span className="gradient-text">{headline.split(". ").slice(1).join(". ")}</span>
            </>
          ) : headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
        >
          {subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}>
          <Link href={ctaPrimary.href} className="btn-primary text-center justify-center">
            {ctaPrimary.label} <ArrowRight size={16} />
          </Link>
          <button onClick={() => setBrochureOpen(true)} className="btn-outline text-center justify-center">
            <Download size={16} /> {ctaSecondary.label}
          </button>
        </motion.div>

        {/* Quick contact */}
        <motion.a href="tel:+919904095104"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-cyan transition-colors"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Phone size={14} className="text-brand-cyan" /> Call us: +91-9904095104
        </motion.a>

        {/* Stats bar */}
        {stats.length > 0 && (
          <motion.div
            className="mt-4 grid grid-cols-3 sm:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/10 w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <span className="font-heading font-black text-2xl gradient-text">{s.value}</span>
                <span className="text-xs text-gray-400 mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
    </>
  );
}
