"use client";
// Single-entry parcel weighing animation
// Linear flow: Parcel placed → Weight auto-captured → Camera triggered → Data processed → PDF receipt generated
// Loops every ~10 seconds. No double-entry, no truck, no second weighment.

import { useEffect, useState } from "react";

type Phase =
  | "idle"
  | "parcel-placed"
  | "weight-capture"
  | "camera-trigger"
  | "data-processing"
  | "pdf-generated"
  | "complete";

const PHASE_DURATIONS: Record<Phase, number> = {
  idle:              600,
  "parcel-placed":   1800,
  "weight-capture":  2000,
  "camera-trigger":  1600,
  "data-processing": 1800,
  "pdf-generated":   2400,
  complete:          800,
};

const PHASES: Phase[] = [
  "idle", "parcel-placed", "weight-capture",
  "camera-trigger", "data-processing", "pdf-generated", "complete",
];

const PHASE_INFO: Record<Phase, { step: string; label: string; color: string }> = {
  idle:              { step: "",  label: "Ready for Next Parcel",          color: "#64748B" },
  "parcel-placed":   { step: "1", label: "Parcel Placed on Scale",         color: "#00C2E0" },
  "weight-capture":  { step: "2", label: "Weight Auto-Captured",           color: "#00C2E0" },
  "camera-trigger":  { step: "3", label: "Camera Captures Parcel Image",   color: "#22C55E" },
  "data-processing": { step: "4", label: "Data Processed & Linked",        color: "#F59E0B" },
  "pdf-generated":   { step: "5", label: "PDF Receipt Generated",          color: "#A78BFA" },
  complete:          { step: "✓", label: "Transaction Complete",           color: "#22C55E" },
};

export default function ParcelWeighingScene() {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    function advance() {
      idx = (idx + 1) % PHASES.length;
      setPhase(PHASES[idx]);
      timer = setTimeout(advance, PHASE_DURATIONS[PHASES[idx]]);
    }
    timer = setTimeout(advance, PHASE_DURATIONS["idle"]);
    return () => clearTimeout(timer);
  }, []);

  const info = PHASE_INFO[phase];
  const showParcel    = phase !== "idle";
  const showWeight    = phase === "weight-capture" || phase === "camera-trigger" || phase === "data-processing" || phase === "pdf-generated" || phase === "complete";
  const showFlash     = phase === "camera-trigger";
  const showReceipt   = phase === "pdf-generated" || phase === "complete";
  const showProcessing = phase === "data-processing";
  const progress = (PHASES.indexOf(phase) / (PHASES.length - 1)) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4">
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-white/10 min-h-[260px] sm:min-h-[300px] md:min-h-[340px] select-none"
        style={{ background: "linear-gradient(180deg, #0A0F1E 0%, #0D1526 100%)"}}
      >
      {/* Grid floor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,194,224,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,224,0.3) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        transform: "rotateX(55deg) translateY(35%) scale(2)",
        // transformOrigin: "bottom center",
      }} />

      {/* Camera flash overlay */}
      {showFlash && (
        <div className="absolute inset-0 z-30 pointer-events-none animate-ping"
          style={{ background: "rgba(255,255,255,0.08)", animationDuration: "0.3s", animationIterationCount: "2" }} />
      )}

      {/* ── Main scene ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-4 px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-16">

        {/* Scale platform */}
        <div className="flex flex-col items-center gap-2">
          {/* Parcel on scale */}
          <div className="relative h-[70px] w-[80px] sm:h-[80px] sm:w-[100px]">
            {/* Parcel */}
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md rounded-lg transition-all duration-500" ${
                  showParcel ? "w-12 h-10 opacity-100" : "w-0 h-0 opacity-0"}`}
              style={{
                // width: showParcel ? "56px" : "0px",
                // height: showParcel ? "48px" : "0px",
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                boxShadow: showParcel ? "0 0 12px rgba(245,158,11,0.4)" : "none",
                opacity: showParcel ? 1 : 0,
                overflow: "hidden",
              }}
            >
              {/* Parcel tape lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-amber-900/40" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-0.5 bg-amber-900/40" />
              </div>
            </div>
          </div>

          {/* Scale body */}
          <div className="relative w-[100px] sm:w-[110px] md:w-[120px]" >
            {/* Scale platform */}
            <div className="rounded-t-lg w-[100px] sm:w-[110px] md:w-[120px] h-[8px] sm:h-[7px] md:h-[8px]" style={{
              // width: "120px", height: "8px",
              background: "linear-gradient(180deg, #2B5CE6 0%, #1A1F5E 100%)",
              border: "1px solid rgba(0,194,224,0.5)",
              boxShadow: showWeight ? "0 0 16px rgba(0,194,224,0.5)" : "none",
              transition: "box-shadow 0.4s",
            }} />
            {/* Scale display */}
            <div className="rounded-b-xl w-[100px] sm:w-[110px] md:w-[120px] h-[80px] sm:h-[70px] md:h-[80px]" style={{
              // width: "120px", height: "80px",
              background: "linear-gradient(135deg, #1E3A5F 0%, #0D1526 100%)",
              border: `1px solid ${showWeight ? "#00C2E0" : "rgba(255,255,255,0.1)"}`,
              transition: "border-color 0.4s",
            }}>
              <div className="flex flex-col items-center justify-center h-full gap-0.5">
                <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">WEIGHT</div>
                <div
                  className="font-mono font-black text-lg transition-all duration-500"
                  style={{ color: showWeight ? "#00C2E0" : "#334155" }}
                >
                  {showWeight ? "5.24 kg" : "0.00 kg"}
                </div>
                {showWeight && (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] md:text-[12px] text-green-400">STABLE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest">Weighing Scale</p>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 shrink">
          <div className="text-brand-cyan/40 rotate-[-360deg] md:rotate-[-360deg] rotate-[360deg] transition-transform duration-300 arrow text-xl sm:text-2xl md:text-3xl">→</div>
        </div>

        {/* Camera */}
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 shrink">
          <div className="relative">
            {/* Camera body */}
            <div className="rounded-xl flex items-center justify-center mt-6 mb-10 w-[56px] h-[44px] sm:w-[64px] sm:h-[50px] md:w-[72px] md:h-[56px]" style={{
              // width: "72px", height: "56px",
              background: "linear-gradient(135deg, #1E3A5F 0%, #0D1526 100%)",
              border: `1.5px solid ${showFlash ? "#22C55E" : "rgba(255,255,255,0.15)"}`,
              boxShadow: showFlash ? "0 0 20px rgba(34,197,94,0.6)" : "none",
              transition: "all 0.3s",
            }}>
              {/* Lens */}
              <div className="rounded-full flex items-center justify-center w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px]" style={{
                // width: "32px", height: "32px",
                background: "#060D1A",
                border: `2px solid ${showFlash ? "#22C55E" : "rgba(0,194,224,0.4)"}`,
              }}>
                <div className="rounded-full w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] md:w-[16px] md:h-[16px]" style={{
                  // width: "16px", height: "16px",
                  background: showFlash ? "rgba(34,197,94,0.6)" : "rgba(0,194,224,0.2)",
                  transition: "background 0.2s",
                }} />
              </div>
            </div>
            {/* Flash indicator */}
            {showFlash && (
              <div className="absolute top-6 right-0 translate-x-1/4 -translate-y-1/4 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400 animate-ping" />
            )}
            {/* Captured image preview */}
            {(phase === "data-processing" || showReceipt) && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-xl overflow-hidden0 w-[56px] h-[44px] sm:w-[64px] sm:h-[50px] md:w-[72px] md:h-[52px]"
                style={{ 
                // width: "72px", height: "52px", 
                border: "1px solid rgba(0,194,224,0.4)", background: "#1E3A5F" }}>
                <div className="w-full h-full flex items-center justify-center text-[18px] sm:text-[22px] md:text-[28px] leading-none">📦</div>
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-6">Camera</p>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 shrink">
          <div className="text-brand-cyan/40 rotate-[-360deg] md:rotate-[-360deg] rotate-[360deg] transition-transform duration-300 arrow text-xl sm:text-2xl md:text-3xl">→</div>
        </div>

        {/* Processing / Receipt */}
        <div className="flex flex-col items-center gap-1 shrink">
          {showProcessing && !showReceipt && (
            <div className="rounded-xl flex flex-col gap-2 items-center justify-center w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]" style={{
              // width: "150px",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
            }}>
              <div className="text-xl">⚙️</div>
              <div className="text-[11px] text-amber-400 font-semibold text-center">Processing Data...</div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {showReceipt && (
            <div className="rounded-xl overflow-hidden w-[110px] sm:w-[130px] md:w-[150px]" style={{
              // width: "150px",
              background: "rgba(13,21,38,0.95)",
              border: "1.5px solid rgba(167,139,250,0.5)",
              boxShadow: "0 0 20px rgba(167,139,250,0.2)",
            }}>
              {/* Receipt header */}
              <div className="px-2 py-1.5" style={{ background: "rgba(167,139,250,0.15)" }}>
                <div className="text-[11px] text-purple-300 font-bold uppercase tracking-wider">📄 PDF Receipt</div>
              </div>
              {/* Parcel image in receipt */}
              <div className="mx-2 mt-1.5 rounded-md overflow-hidden" style={{
                height: "36px", background: "#1E3A5F",
                border: "1px solid rgba(0,194,224,0.3)",
              }}>
                <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
              </div>
              {/* Weight data */}
              <div className="px-2 py-1.5 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-[11px] text-gray-400">Weight</span>
                  <span className="text-[11px] text-brand-cyan font-mono font-bold">5.24 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-gray-400">Time</span>
                  <span className="text-[11px] text-gray-300 font-mono">09:14:32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-gray-400">Status</span>
                  <span className="text-[11px] text-green-400 font-semibold">✓ Done</span>
                </div>
              </div>
            </div>
          )}

          {!showProcessing && !showReceipt && (
            <div className="rounded-xl flex items-center justify-center w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]" style={{
              // width: "150px", height: "150px",
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}>
              <span className="text-gray-600 text-xs">Awaiting...</span>
            </div>
          )}
          <p className="text-[11px] text-gray-500 uppercase tracking-widest">Receipt</p>
        </div>
      </div>

      {/* ── Phase indicator bar ─────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 flex items-center gap-2.5 z-20">
        {info.step && (
          <div className="shrink w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: `linear-gradient(135deg, ${info.color}, #2B5CE6)` }}>
            {info.step}
          </div>
        )}
        <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, #00C2E0, ${info.color})` }} />
        </div>
        <span className="text-[12px] font-semibold truncate max-w-[120px] sm:max-w-none" style={{ color: info.color }}>
          {info.label}
        </span>
      </div>

      {/* ── Bottom label ────────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 sm:gap-4 md:gap-6 px-2 z-10">
        {["Place Parcel", "Auto Weight", "Camera Snap", "Process", "PDF Receipt"].map((l, i) => (
          <div key={l} className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: PHASES.indexOf(phase) > i ? "#00C2E0" : "rgba(255,255,255,0.15)" }} />
            <span className="text-[10px] text-gray-500 hidden md:block">{l}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
