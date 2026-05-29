"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Stage data ────────────────────────────────────────────────────────────────
const stages = [
  {
    id: 1,
    label: "Batch Setup",
    short: "Product, stage & material master loaded into system",
    icon: "📋",
    color: "#00C2E0",
    detail: "Operator selects batch number, product, stage, and material from master data. System validates against approved specifications before proceeding.",
    metric: { label: "Batch No.", value: "WIS-2025-0042" },
  },
  {
    id: 2,
    label: "Balance Link",
    short: "LAN/Wi-Fi balance auto-detected & assigned",
    icon: "📡",
    color: "#2B5CE6",
    detail: "System auto-discovers calibrated balances on the network. Device ID, calibration status, and last verification date are confirmed before linking.",
    metric: { label: "Device", value: "BAL-003 ✓" },
  },
  {
    id: 3,
    label: "Tare & Gross",
    short: "Live weight captured; tolerance check applied instantly",
    icon: "📟",
    color: "#00C2E0",
    detail: "Container tare weight is captured first. Gross weight streams live from the balance. System applies ±tolerance check in real time.",
    metric: { label: "Gross", value: "5.48 kg" },
  },
  {
    id: 4,
    label: "Net Weight",
    short: "Auto calculated; out-of-spec flagged immediately",
    icon: "🧮",
    color: "#2B5CE6",
    detail: "Net = Gross − Tare. Calculated automatically with zero manual input. Out-of-spec results trigger an immediate alert and block progression.",
    metric: { label: "Net", value: "5.24 kg ✓" },
  },
  {
    id: 5,
    label: "PDF Report",
    short: "Weigh slip & Weight Recording Sheet auto-generated",
    icon: "📄",
    color: "#00C2E0",
    detail: "System auto-generates a GMP-compliant Weigh Slip and Weight Recording Sheet (WRS) with operator ID, timestamp, and electronic signature.",
    metric: { label: "Report", value: "Auto-generated" },
  },
  {
    id: 6,
    label: "Audit Log",
    short: "Immutable timestamped log stored securely",
    icon: "🔒",
    color: "#2B5CE6",
    detail: "Every action is written to an immutable, encrypted audit trail. ALCOA+ compliant — Attributable, Legible, Contemporaneous, Original, Accurate.",
    metric: { label: "Trail", value: "ALCOA+ ✓" },
  },
];

const dashboardRows = [
  { label: "Batch No.",      value: "WIS-2025-0042", status: null },
  { label: "Tolerance/IPQC", value: "PASS ± 0.02%",  status: "pass" },
  { label: "Audit Trail",    value: "Active",         status: "active" },
];

export default function PharmaProcessFlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-brand-navy text-white overflow-hidden" ref={ref}>
      <div className="section-padding px-4 sm:px-6 lg:px-8">
        <div className="container-max mx-auto max-w-7xl text-center">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="section-tag text-brand-cyan">How It Works</p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white">
              Stage-Wise Weighing Process
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              A fully digital, ALCOA+-compliant workflow — from batch setup to immutable audit log.
            </p>
          </motion.div>

          {/* ── Two-column: 3D scene + stage cards ─────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start mb-10 md:mb-12">

            {/* Left: 3D Lab Scene */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PharmaLabScene activeStage={active} inView={inView} />
            </motion.div>

            {/* Right: Stage cards */}
            <div className="space-y-2.5">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
                >
                  <StageCard
                    stage={stage}
                    isActive={active === stage.id}
                    onClick={() => setActive(active === stage.id ? null : stage.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Horizontal timeline with scroll dots ────────────────── */}
          <div className="relative">
            {/* Animated connecting line — desktop only */}
            <div
              className="hidden lg:block absolute top-6 left-6 right-6 h-0.5 bg-white/8"
              style={{ zIndex: 0 }}
            >
              <motion.div
                className="h-full origin-left"
                style={{ background: "linear-gradient(90deg, #00C2E0, #2B5CE6)" }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Mobile scroll hint */}
            {/* <p className="lg:hidden text-[10px] text-gray-500 text-right mb-2 pr-1">← swipe →</p> */}

            {/* Scrollable row */}
            <div className="overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible">
              <div className="flex gap-3 lg:gap-0 lg:justify-between min-w-max lg:min-w-0 relative z-10">
                {stages.map((s, i) => (
                  <motion.button
                    key={s.id}
                    onClick={() => setActive(active === s.id ? null : s.id)}
                    className="flex flex-col items-center text-center w-20 sm:w-24 lg:w-auto lg:flex-1 lg:px-2 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.45, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  >
                    <motion.div
                      className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-heading font-black text-sm lg:text-base text-white mb-2 lg:mb-3 flex-shrink-0"
                      style={{
                        background: active === s.id
                          ? `linear-gradient(135deg, ${s.color}, #2B5CE6)`
                          : "linear-gradient(135deg, #00C2E0, #2B5CE6)",
                        boxShadow: active === s.id ? `0 0 22px ${s.color}80` : "none",
                      }}
                      whileHover={{ scale: 1.18, boxShadow: "0 0 22px rgba(0,194,224,0.65)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(135deg, #00C2E0, #2B5CE6)" }}
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={inView ? { scale: 1.8, opacity: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                      />
                      <span className="relative z-10">{s.id}</span>
                    </motion.div>
                    <span className="text-base lg:text-xl mb-1" role="img" aria-hidden="true">{s.icon}</span>
                    <p className={`font-heading font-semibold text-[10px] lg:text-sm mb-0.5 leading-tight transition-colors ${
                      active === s.id ? "text-brand-cyan" : "text-white"
                    }`}>
                      {s.label}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Scroll dots indicator — mobile only */}
            {/* <div className="flex justify-center gap-1.5 mt-3 lg:hidden">
              {stages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(active === s.id ? null : s.id)}
                  className={`rounded-full transition-all duration-200 ${
                    active === s.id ? "w-4 h-2 bg-brand-cyan" : "w-2 h-2 bg-white/20"
                  }`}
                  aria-label={`Stage ${s.id}: ${s.label}`}
                />
              ))}
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Stage Card ────────────────────────────────────────────────────────────────
function StageCard({
  stage, isActive, onClick,
}: {
  stage: typeof stages[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden
        ${isActive
          ? "border-brand-cyan/60 bg-white/8 shadow-[0_0_20px_rgba(0,194,224,0.15)]"
          : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
        }`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Step number */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-sm text-white flex-shrink-0 transition-all duration-300"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${stage.color}, #2B5CE6)`
              : "linear-gradient(135deg, #00C2E0, #2B5CE6)",
            boxShadow: isActive ? `0 0 16px ${stage.color}60` : "none",
          }}
        >
          {stage.id}
        </div>

        {/* Icon + label */}
        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
          <span className="text-xl flex-shrink-0">{stage.icon}</span>
          <div className="min-w-0">
            <p className={`font-heading font-semibold text-sm transition-colors ${isActive ? "text-brand-cyan" : "text-white"}`}>
              {stage.label}
            </p>
            <p className="text-xs text-gray-400 truncate">{stage.short}</p>
          </div>
        </div>

        {/* Metric pill */}
        <div className="flex-shrink-0 hidden sm:block">
          <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
            {stage.metric.value}
          </span>
        </div>

        {/* Chevron */}
        <div className={`flex-shrink-0 text-gray-500 text-xs transition-transform duration-200 ${isActive ? "rotate-180 text-brand-cyan" : ""}`}>
          ▾
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/8">
              <p className="text-xs text-gray-300 leading-relaxed mt-3">{stage.detail}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stage.color }} />
                <span className="text-[10px] font-semibold" style={{ color: stage.color }}>
                  {stage.metric.label}: {stage.metric.value}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ── 3D Pharma Lab Scene ───────────────────────────────────────────────────────
function PharmaLabScene({ activeStage, inView }: { activeStage: number | null; inView: boolean }) {
  const isWeighing = activeStage === 3 || activeStage === 4;
  const isReport   = activeStage === 5;
  const isAudit    = activeStage === 6;
  const isBalance  = activeStage === 2 || isWeighing;

  return (
    <div
      className="relative rounded-3xl overflow-hidden w-full"
      style={{
        background: "linear-gradient(135deg, #060D1A 0%, #0D1526 60%, #111E35 100%)",
        border: "1px solid rgba(0,194,224,0.15)",
        minHeight: "380px",
      }}
    >
      {/* Grid floor */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "linear-gradient(rgba(0,194,224,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,224,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          transform: "rotateX(60deg) translateY(30%) scale(2)",
          transformOrigin: "bottom center",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(0,194,224,0.07) 0%, transparent 70%)" }} />

      {/* ── Lab bench ─────────────────────────────────────────────── */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2" style={{ perspective: "600px" }}>
        <div style={{ transform: "rotateX(12deg)", transformStyle: "preserve-3d" }}>
          <div className="relative rounded-xl" style={{
            width: "min(90vw, 300px)", height: "10px",
            background: "linear-gradient(180deg, #1E3A5F 0%, #0D1526 100%)",
            boxShadow: "0 0 24px rgba(0,194,224,0.18)",
            border: "1px solid rgba(0,194,224,0.2)",
          }} />
          <div style={{
            width: "300px", height: "36px",
            background: "linear-gradient(180deg, #0D1526 0%, #060D1A 100%)",
            borderLeft: "1px solid rgba(0,194,224,0.1)",
            borderRight: "1px solid rgba(0,194,224,0.1)",
            borderBottom: "1px solid rgba(0,194,224,0.1)",
            borderRadius: "0 0 8px 8px",
          }} />
        </div>
      </div>

      {/* ── Analytical Balance ─────────────────────────────────────── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2" style={{ perspective: "600px" }}>
        <motion.div
          style={{ transform: "rotateX(8deg)", transformStyle: "preserve-3d" }}
          animate={isBalance ? { filter: "drop-shadow(0 0 14px #00C2E0)" } : { filter: "none" }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative mx-auto" style={{ width: "110px" }}>
            {/* Base body */}
            <div className="rounded-xl mx-auto" style={{
              width: "min(28vw, 110px)", height: "65px",
              background: "linear-gradient(135deg, #1E3A5F 0%, #0D1526 100%)",
              border: `1px solid ${isBalance ? "#00C2E0" : "rgba(255,255,255,0.1)"}`,
              boxShadow: isBalance ? "0 0 18px rgba(0,194,224,0.4)" : "none",
              transition: "all 0.4s",
              position: "relative",
            }}>
              {/* Display screen */}
              <div className="absolute top-2 left-2 right-2 rounded-lg flex flex-col items-center justify-center"
                style={{ height: "36px", background: "#060D1A", border: "1px solid rgba(0,194,224,0.3)" }}>
                <div className="text-[7px] text-gray-500 uppercase tracking-wider">NET WEIGHT</div>
                <motion.div
                  className="font-mono font-black text-sm"
                  style={{ color: "#00C2E0" }}
                  animate={isWeighing ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                  transition={{ duration: 0.8, repeat: isWeighing ? Infinity : 0 }}
                >
                  {activeStage === 4 ? "5.24 kg" : activeStage === 3 ? "5.48 kg" : "0.00 kg"}
                </motion.div>
              </div>
              {/* LED */}
              <div className="absolute bottom-2 right-2">
                <motion.div className="w-2 h-2 rounded-full"
                  style={{ background: isBalance ? "#00C2E0" : "#334155" }}
                  animate={isBalance ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }} />
              </div>
            </div>

            {/* Weighing pan */}
            <motion.div className="mx-auto rounded-full" style={{
              width: "72px", height: "7px",
              background: "linear-gradient(180deg, #2B5CE6 0%, #1A1F5E 100%)",
              border: "1px solid rgba(0,194,224,0.4)",
              marginTop: "-2px",
            }}
              animate={isWeighing ? { y: [0, 2, 0] } : { y: 0 }}
              transition={{ duration: 1.5, repeat: isWeighing ? Infinity : 0, ease: "easeInOut" }}
            />

            {/* Sample on pan */}
            <AnimatePresence>
              {(isWeighing || activeStage === 4) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2"
                >
                  <div className="rounded-sm" style={{
                    width: "26px", height: "20px",
                    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 0 8px rgba(245,158,11,0.4)",
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ── Live Dashboard ─────────────────────────────────────────── */}
      <div className="absolute top-3 right-3 w-[150px] sm:w-[180px] md:w-60">
        <div className="rounded-xl p-3" style={{
          background: "rgba(13,21,38,0.95)",
          border: "1px solid rgba(0,194,224,0.3)",
        }}>
          <div className="text-[11px] text-brand-cyan font-bold uppercase tracking-widest mb-2">
            Live Dashboard
          </div>
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[
              { l: "TARE",  v: activeStage && activeStage >= 3 ? "0.24" : "—" },
              { l: "GROSS", v: activeStage && activeStage >= 3 ? "5.48" : "—" },
              { l: "NET",   v: activeStage && activeStage >= 4 ? "5.24" : "—", hi: true },
            ].map(({ l, v, hi }) => (
              <div key={l} className="text-center p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-[10px] text-gray-400 uppercase">{l}</div>
                <div className={`font-mono font-black text-[12px] ${hi ? "text-brand-cyan" : "text-white"}`}>{v}</div>
              </div>
            ))}
          </div>
          {dashboardRows.map(({ label, value, status }) => (
            <div key={label} className="flex justify-between items-center py-0.5 border-b border-white/5 last:border-0">
              <span className="text-[10px] text-gray-400">{label}</span>
              <span className={`text-[10px] font-semibold font-mono ${
                status === "pass" ? "text-green-400" : status === "active" ? "text-brand-cyan" : "text-gray-300"
              }`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Compliance badges ──────────────────────────────────────── */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        {["21 CFR Part 11", "ALCOA+", "GxP Ready", "IPQC"].map((badge, i) => (
          <motion.div key={badge}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="text-[10px] sm:text-[11px] md:text-[12px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,194,224,0.12)", border: "1px solid rgba(0,194,224,0.3)", color: "#00C2E0" }}
          >
            {badge}
          </motion.div>
        ))}
      </div>

      {/* ── Report popup ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isReport && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-4 left-4 w-40 rounded-xl p-3"
            style={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(167,139,250,0.4)" }}
          >
            <div className="text-[11px] text-purple-300 font-bold uppercase tracking-widest mb-2">📄 PDF Generated</div>
            {[["Weigh Slip", "✓ Auto"], ["WRS Report", "✓ Auto"], ["e-Signature", "✓ Applied"]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-0.5">
                <span className="text-[10px] text-gray-400">{l}</span>
                <span className="text-[10px] text-green-400 font-semibold">{v}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Audit trail popup ──────────────────────────────────────── */}
      <AnimatePresence>
        {isAudit && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-4 w-50 rounded-xl p-3"
            style={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(0,194,224,0.3)" }}
          >
            <div className="text-[12px] text-brand-cyan font-bold uppercase tracking-widest mb-2">🔒 Audit Trail</div>
            {["Batch setup — 09:14:02", "Balance linked — 09:14:18", "Tare captured — 09:15:03", "Net weight — 09:15:31", "Report generated — 09:15:45"].map((entry, i) => (
              <motion.div key={entry}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-1.5 py-0.5"
              >
                <div className="w-1 h-1 rounded-full bg-brand-cyan flex-shrink-0" />
                <span className="text-[11px] text-gray-300 font-mono">{entry}</span>
              </motion.div>
            ))}
            <div className="mt-2 flex items-center gap-1">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400"
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
              <span className="text-[11px] text-green-400 font-semibold">ALCOA+ Compliant</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt */}
      <AnimatePresence>
        {!activeStage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-[14px] text-gray-400 animate-pulse">Click a stage to explore →</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
