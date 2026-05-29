"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import WeighbridgeScene from "@/components/service-detail/WeighbridgeScene";
import ParcelWeighingScene from "@/components/service-detail/ParcelWeighingScene";

interface Step {
  step: string;
  label: string;
  desc: string;
}

interface Props {
  steps: Step[];
  title: string;
  slug?: string;
}

const stepIcons: Record<string, string> = {
  // Single-entry parcel weighing
  "Parcel Placed":        "📦",
  "Weight Captured":      "📟",
  "Camera Captures":      "📷",
  "Data Validated":       "✅",
  "PDF Generated":        "📄",
  "Record Stored":        "🔒",
  // Double-entry weighing — two-step process
  "Truck Arrives":        "🚛",
  "CCTV Captures Plate":  "📷",
  "1st Weighment":        "📟",
  "Load / Unload":        "📦",
  "CCTV Re-Verifies":     "🔍",
  "2nd Weighment":        "📟",
  "Net Weight & Report":  "📄",
  // Pharma
  "Batch Setup":          "📋",
  "Balance Link":         "📡",
  "Tare & Gross":         "📟",
  "Net Weight":           "🧮",
  "PDF Report":           "📄",
  "Audit Log":            "🔒",
};

export default function ProcessFlow({ steps, title, slug }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isWeighbridge = slug === "double-entry-weighing" || slug === "single-entry-weighing";
  const isParcelWeighing = slug === "single-entry-weighing";

  return (
    <section className="bg-brand-navy text-white overflow-hidden" ref={ref}>

      {/* ── Parcel weighing scene (single-entry only) ─────────────── */}
      {isParcelWeighing && (
        <div className="container-max px-4 md:px-8 lg:px-16 pt-12 pb-0">
          <div className="mb-6">
            <p className="section-tag text-brand-cyan">Live Simulation</p>
            <p className="text-gray-400 text-sm mt-1">
              Parcel placed → Weight auto-captured → Camera triggered → PDF receipt with parcel image + weight data
            </p>
          </div>
          <ParcelWeighingScene />
        </div>
      )}

      {/* ── Truck weighbridge scene (double-entry only) ───────────── */}
      {!isParcelWeighing && isWeighbridge && (
        <div className="container-max px-4 md:px-8 lg:px-16 pt-12 pb-0">
          <div className="mb-6">
            <p className="section-tag text-brand-cyan">Live Simulation</p>
            <p className="text-gray-400 text-sm mt-1">
              1st Weighment (Entry) → Load/Unload → 2nd Weighment (Exit) → Net Weight auto-calculated
            </p>
          </div>
          <WeighbridgeScene />
        </div>
      )}

      {/* ── Horizontal process timeline ──────────────────────────── */}
      <div className="section-padding">
        <div className="container-max">
          <div className="mb-10">
            <p className="section-tag text-brand-cyan">How It Works</p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white">{title}</h2>
            {isWeighbridge && !isParcelWeighing && (
              <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                Every truck goes through <span className="text-brand-cyan font-semibold">two weighments</span> — one at entry and one at exit. The difference gives the exact net material weight with zero manual input.
              </p>
            )}
            {isParcelWeighing && (
              <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                Each parcel is weighed individually. The camera captures the parcel image during weighing, and a PDF receipt with the <span className="text-brand-cyan font-semibold">parcel photo + weight data</span> is generated instantly.
              </p>
            )}
          </div>

          {/* Entry / Exit group labels for double-entry weighing only */}
          {isWeighbridge && !isParcelWeighing && (
            <div className="hidden lg:flex justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg, #00C2E0, #2B5CE6)" }} />
                <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">1st Weighment — Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg, #2B5CE6, #1A1F5E)" }} />
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">2nd Weighment — Exit</span>
              </div>
            </div>
          )}

          {/* Steps — horizontal scroll on mobile, flex row on desktop */}
          <div className="overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible relative">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-6 left-6 right-6 h-0.5 bg-white/8" style={{ zIndex: 0 }}>
              <motion.div
                className="h-full origin-left"
                style={{ background: "linear-gradient(90deg, #00C2E0, #2B5CE6)" }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            {/* Mobile scroll hint */}
            {/* <p className="md:hidden text-[10px] text-gray-500 text-right mb-2 pr-1">← swipe to see all steps →</p> */}
            <div className="flex gap-3 md:gap-0 md:justify-between min-w-max md:min-w-0 relative z-10">
            {steps.map((p, i) => {              // For double-entry only: steps 1-3 = entry (cyan), steps 4-7 = exit (blue)
              const isExitGroup = !isParcelWeighing && isWeighbridge && i >= 3;
              const isFirstOfExitGroup = !isParcelWeighing && isWeighbridge && i === 3;
              return (
                <div key={p.step} className="contents">
                  {/* Divider between entry and exit groups (double-entry only) */}
                  {isFirstOfExitGroup && (
                    <div className="hidden lg:flex flex-col items-center justify-start pt-1 flex-shrink-0 px-1">
                      <div className="w-px h-10 bg-brand-cyan/30" />
                      <span className="text-[8px] font-bold text-brand-cyan/60 uppercase tracking-widest rotate-90 mt-2 whitespace-nowrap">
                        ↓ Exit
                      </span>
                    </div>
                  )}
                  <motion.div
                    className="flex flex-col items-center text-center w-20 sm:w-24 md:w-auto md:flex-1 md:px-2 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.1, ease: "easeOut" }}
                  >
                    <motion.div
                      className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-heading font-black text-sm md:text-base text-white mb-2 md:mb-3 flex-shrink-0 cursor-default"
                      style={{ background: isExitGroup ? "linear-gradient(135deg, #2B5CE6, #1A1F5E)" : "linear-gradient(135deg, #00C2E0, #2B5CE6)" }}
                      whileHover={{ scale: 1.18, boxShadow: "0 0 22px rgba(0,194,224,0.65)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(135deg, #00C2E0, #2B5CE6)" }}
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={inView ? { scale: 1.8, opacity: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                      />
                      <span className="relative z-10">{p.step}</span>
                    </motion.div>
                    <span className="text-base md:text-xl mb-1" role="img" aria-hidden="true">
                      {stepIcons[p.label] || "⚙️"}
                    </span>
                    <p className="font-heading font-semibold text-white text-[10px] md:text-sm mb-0.5 leading-tight">{p.label}</p>
                    <p className="text-[9px] md:text-xs text-gray-400 leading-relaxed max-w-[80px] md:max-w-[120px]">{p.desc}</p>
                  </motion.div>
                </div>
              );
            })}
            </div>
          </div>

          {/* Scroll dots — mobile only */}
          {/* <div className="flex justify-center gap-1.5 mt-3 md:hidden">
            {steps.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
            ))}
          </div> */}

          {/* Net weight equation (double-entry weighbridge only) */}
          {isWeighbridge && !isParcelWeighing && (
            <motion.div
              className="mt-12 rounded-2xl border border-brand-cyan/20 bg-white/5 p-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">1st Weighment (Entry)</p>
                <p className="font-heading font-black text-3xl text-white">12,400 <span className="text-base text-gray-400">kg</span></p>
              </div>
              <div className="text-3xl text-brand-cyan font-black">−</div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">2nd Weighment (Exit)</p>
                <p className="font-heading font-black text-3xl text-white">10,300 <span className="text-base text-gray-400">kg</span></p>
              </div>
              <div className="text-3xl text-brand-cyan font-black">=</div>
              <div className="px-6 py-4 rounded-xl" style={{ background: "linear-gradient(135deg, #00C2E0, #2B5CE6)" }}>
                <p className="text-[10px] text-white/70 uppercase tracking-widest mb-1">Net Material Weight</p>
                <p className="font-heading font-black text-3xl text-white">2,100 <span className="text-base text-white/70">kg</span></p>
                <p className="text-[9px] text-white/60 mt-1">Auto-calculated · Zero manual entry</p>
              </div>
            </motion.div>
          )}

          {/* PDF receipt callout (single-entry parcel weighing only) */}
          {isParcelWeighing && (
            <motion.div
              className="mt-12 rounded-2xl border border-brand-cyan/20 bg-white/5 p-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {/* Parcel image mockup */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-brand-cyan/40"
                  style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #0D1526 100%)" }}>
                  <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Parcel Image</p>
              </div>

              <div className="text-2xl text-brand-cyan font-black">+</div>

              {/* Weight data */}
              <div className="flex flex-col items-center gap-2">
                <div className="px-6 py-4 rounded-xl" style={{ background: "linear-gradient(135deg, #00C2E0, #2B5CE6)" }}>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest mb-1">Weight Data</p>
                  <p className="font-heading font-black text-3xl text-white">5.24 <span className="text-base text-white/70">kg</span></p>
                  <p className="text-[9px] text-white/60 mt-1">Timestamp · Operator ID</p>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Weight + Metadata</p>
              </div>

              <div className="text-2xl text-brand-cyan font-black">=</div>

              {/* PDF receipt */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-xl border-2 border-purple-400/40 p-3 flex flex-col gap-1"
                  style={{ background: "rgba(167,139,250,0.08)" }}>
                  <div className="text-[8px] text-purple-300 font-bold uppercase">📄 PDF Receipt</div>
                  <div className="flex-1 bg-white/5 rounded-lg flex items-center justify-center text-xs text-gray-400">
                    Image + Weight
                  </div>
                  <div className="text-[7px] text-gray-500 text-center">Auto-generated</div>
                </div>
                <p className="text-[10px] text-purple-300 uppercase tracking-widest font-semibold">Complete Record</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
