"use client";
// Full dual-weighment workflow animation — CSS/SVG looping scene
// Sequence: truck enters → CCTV scans → weighs (gross) → loads/unloads → exits → tare weight → report
// No branding on truck. Loops every ~12 seconds.

import { useEffect, useState, useRef } from "react";

type Phase =
  | "idle"
  | "entry-approach"   // truck drives in from left
  | "entry-weigh"      // truck on bridge, weight shown
  | "cctv-scan"        // CCTV beam sweeps, plate captured
  | "load-unload"      // cargo animation
  | "exit-approach"    // truck drives to exit bridge
  | "exit-weigh"       // tare weight shown
  | "report"           // report generated, net weight shown
  | "exit-leave";      // truck drives off right

const PHASE_DURATIONS: Record<Phase, number> = {
  idle:            800,
  "entry-approach": 2200,
  "entry-weigh":   1800,
  "cctv-scan":     1600,
  "load-unload":   2000,
  "exit-approach": 1800,
  "exit-weigh":    1600,
  "report":        2000,
  "exit-leave":    1800,
};

const PHASES: Phase[] = [
  "idle", "entry-approach", "entry-weigh", "cctv-scan",
  "load-unload", "exit-approach", "exit-weigh", "report", "exit-leave",
];

const PHASE_LABELS: Record<Phase, { step: string; label: string; color: string }> = {
  idle:             { step: "",  label: "Awaiting Vehicle",                color: "#64748B" },
  "entry-approach": { step: "1", label: "Truck Arrives at Entry Gate",     color: "#00C2E0" },
  "entry-weigh":    { step: "2", label: "1st Weighment — Entry Weight",    color: "#00C2E0" },
  "cctv-scan":      { step: "3", label: "CCTV Captures Plate (Entry)",     color: "#22C55E" },
  "load-unload":    { step: "4", label: "Load / Unload at Facility",       color: "#F59E0B" },
  "exit-approach":  { step: "5", label: "Truck Returns to Exit Gate",      color: "#00C2E0" },
  "exit-weigh":     { step: "6", label: "2nd Weighment — Exit Weight",     color: "#00C2E0" },
  report:           { step: "7", label: "Net Weight = Entry − Exit",       color: "#A78BFA" },
  "exit-leave":     { step: "8", label: "Report Generated & Audit Saved",  color: "#22C55E" },
};

export default function WeighbridgeScene() {
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

  const showGrossWeight  = phase === "entry-weigh" || phase === "cctv-scan";
  const showTareWeight   = phase === "exit-weigh"  || phase === "report";
  const showCctvBeam     = phase === "cctv-scan"   || phase === "entry-weigh";
  const showLoadAnim     = phase === "load-unload";
  const showReport       = phase === "report";
  const showNetCalc      = phase === "report";
  const plateVerified    = phase === "cctv-scan" || phase === "load-unload" || phase === "exit-approach" || phase === "exit-weigh" || phase === "report" || phase === "exit-leave";

  const info = PHASE_LABELS[phase];

  // Responsive: fill container on desktop, scale down on mobile
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerW, setContainerW] = useState(700);
  const SCENE_NATIVE = 700; // native design width

  useEffect(() => {
    function update() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setContainerW(w);
      // Only scale down if narrower than native; on desktop use full width
      setScale(w < SCENE_NATIVE ? w / SCENE_NATIVE : 1);
    }
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // On desktop (containerW >= SCENE_NATIVE): scene fills container width
  // On mobile  (containerW <  SCENE_NATIVE): scene is 700px but scaled down
  const sceneWidth  = containerW >= SCENE_NATIVE ? containerW : SCENE_NATIVE;
  const sceneHeight = 320;
  const displayH    = Math.round(sceneHeight * scale);

  // Recalculate truck positions proportionally when scene is wider than native
  const ratio = sceneWidth / SCENE_NATIVE;
  const scaledTruckX = (() => {
    const base = (() => {
      switch (phase) {
        case "idle":            return -200;
        case "entry-approach":  return 120;
        case "entry-weigh":     return 120;
        case "cctv-scan":       return 120;
        case "load-unload":     return 340;
        case "exit-approach":   return 560;
        case "exit-weigh":      return 560;
        case "report":          return 560;
        case "exit-leave":      return 900;
        default:                return -200;
      }
    })();
    return base === -200 ? -200 : Math.round(base * ratio);
  })();

  // Scale element positions proportionally
  const pos = (x: number) => Math.round(x * ratio);

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-2xl"
      style={{ height: `${displayH}px` }}>
      <div
        className="relative overflow-hidden border border-white/10 select-none rounded-2xl"
        style={{
          background: "linear-gradient(180deg, #0A0F1E 0%, #0D1526 100%)",
          width: `${sceneWidth}px`,
          height: `${sceneHeight}px`,
          transformOrigin: "top left",
          transform: scale < 1 ? `scale(${scale})` : "none",
        }}
      >
      {/* ── Sky / background ─────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {/* Stars */}
        {[...Array(18)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              top: `${8 + (i * 13) % 35}%`,
              left: `${(i * 17 + 5) % 95}%`,
              opacity: 0.3 + (i % 4) * 0.1,
            }} />
        ))}
      </div>

      {/* ── Ground / road ────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(180deg, #0D1526 0%, #060D1A 100%)" }}>
        {/* Road surface */}
        <div className="absolute top-4 left-0 right-0 h-12 bg-[#111827]" />
        {/* Lane dashes */}
        <div className="absolute top-9 left-0 right-0 flex gap-6 px-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-10 h-1 rounded-full bg-white/15" />
          ))}
        </div>
      </div>

      {/* ── Entry weighbridge ────────────────────────────────────────── */}
      <Bridge x={pos(80)} label="ENTRY" glowing={showGrossWeight} />

      {/* ── Loading bay ──────────────────────────────────────────────── */}
      <LoadingBay x={pos(310)} active={showLoadAnim} />

      {/* ── Exit weighbridge ─────────────────────────────────────────── */}
      <Bridge x={pos(520)} label="EXIT" glowing={showTareWeight} />

      {/* ── CCTV poles ───────────────────────────────────────────────── */}
      <CctvPole x={pos(60)}  scanning={showCctvBeam} direction="right" />
      <CctvPole x={pos(500)} scanning={phase === "exit-approach" || phase === "exit-weigh"} direction="left" />

      {/* ── Truck ────────────────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          bottom: "52px",
          left: `${scaledTruckX}px`,
          transition: `left ${
            phase === "entry-approach" ? "2.2s" :
            phase === "exit-approach"  ? "1.8s" :
            phase === "exit-leave"     ? "1.8s" : "0.4s"
          } cubic-bezier(0.25,0.46,0.45,0.94)`,
          zIndex: 10,
        }}
      >
        <TruckSVG loaded={phase !== "load-unload" && phase !== "exit-approach" && phase !== "exit-weigh" && phase !== "report" && phase !== "exit-leave"} />
      </div>

      {/* ── Weight displays ──────────────────────────────────────────── */}
      {showGrossWeight && (
        <WeightDisplay x={pos(80)} label="1ST WEIGHMENT — ENTRY" value="28,400 kg" color="#00C2E0" />
      )}
      {showTareWeight && (
        <WeightDisplay x={pos(490)} label="2ND WEIGHMENT — EXIT" value="12,300 kg" color="#00C2E0" />
      )}

      {/* ── Plate display ────────────────────────────────────────────── */}
      <PlateDisplay verified={plateVerified} />

      {/* ── Report popup ─────────────────────────────────────────────── */}
      {showReport && <ReportPopup />}

      {/* ── Phase indicator bar ──────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-20">
        {info.step && (
          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: `linear-gradient(135deg, ${info.color}, #2B5CE6)` }}>
            {info.step}
          </div>
        )}
        <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden min-w-0">
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(PHASES.indexOf(phase) / (PHASES.length - 1)) * 100}%`,
              background: `linear-gradient(90deg, #00C2E0, ${info.color})`,
            }} />
        </div>
        <span className="text-[10px] font-semibold whitespace-nowrap truncate max-w-[140px] sm:max-w-none" style={{ color: info.color }}>
          {info.label}
        </span>
      </div>

      {/* ── Net weight callout ───────────────────────────────────────── */}
      {showNetCalc && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 animate-fade-up">
          <div className="flex items-center gap-2 bg-[#0D1526] border border-purple-400/40 rounded-xl px-4 py-2 whitespace-nowrap shadow-lg">
            <div className="text-center">
              <div className="text-[8px] text-gray-500 uppercase">1st Weighment</div>
              <span className="text-white font-mono text-sm font-bold">12,400 kg</span>
            </div>
            <span className="text-brand-cyan text-lg font-black">−</span>
            <div className="text-center">
              <div className="text-[8px] text-gray-500 uppercase">2nd Weighment</div>
              <span className="text-white font-mono text-sm font-bold">10,300 kg</span>
            </div>
            <span className="text-brand-cyan text-lg font-black">=</span>
            <div className="text-center">
              <div className="text-[8px] text-gray-500 uppercase">Net Material</div>
              <span className="font-mono text-sm font-black" style={{ color: "#A78BFA" }}>2,100 kg</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
// ── Sub-components ────────────────────────────────────────────────────────────

function Bridge({ x, label, glowing }: { x: number; label: string; glowing: boolean }) {
  const isEntry = label === "ENTRY";
  return (
    <div className="absolute" style={{ left: `${x}px`, bottom: "52px", zIndex: 5 }}>
      {/* Platform */}
      <div className="w-36 h-5 rounded-t-md transition-all duration-500"
        style={{
          background: glowing
            ? "linear-gradient(180deg, #1E3A5F 0%, #0D1526 100%)"
            : "linear-gradient(180deg, #1A2744 0%, #0D1526 100%)",
          boxShadow: glowing ? "0 -3px 16px rgba(0,194,224,0.5)" : "none",
        }}>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-500"
          style={{ background: glowing ? "linear-gradient(90deg, transparent, #00C2E0, transparent)" : "transparent" }} />
      </div>
      {/* Labels */}
      <div className="text-center mt-1 space-y-0.5">
        <div className="text-[8px] font-black tracking-widest uppercase"
          style={{ color: glowing ? "#00C2E0" : "#334155" }}>
          {isEntry ? "1ST WEIGHMENT" : "2ND WEIGHMENT"}
        </div>
        <div className="text-[7px] tracking-widest uppercase"
          style={{ color: glowing ? "#64748B" : "#1E293B" }}>
          {label} BRIDGE
        </div>
      </div>
    </div>
  );
}

function CctvPole({ x, scanning, direction }: { x: number; scanning: boolean; direction: "left" | "right" }) {
  return (
    <div className="absolute" style={{ left: `${x}px`, bottom: "72px", zIndex: 8 }}>
      {/* Pole */}
      <div className="w-1.5 h-20 rounded-full mx-auto" style={{ background: "#1E3A5F" }} />
      {/* Camera head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-4 rounded-sm flex items-center justify-center"
        style={{ background: "#0D1526", border: "1px solid #00C2E0", opacity: scanning ? 1 : 0.4 }}>
        <div className="w-2 h-2 rounded-full" style={{ background: scanning ? "#00C2E0" : "#334155" }} />
      </div>
      {/* Scan beam */}
      {scanning && (
        <div className="absolute top-3"
          style={{
            left: direction === "right" ? "100%" : "auto",
            right: direction === "left" ? "100%" : "auto",
            width: "60px",
            height: "2px",
            background: "linear-gradient(90deg, #00C2E0, transparent)",
            transformOrigin: direction === "right" ? "left center" : "right center",
            animation: "cctvScan 1.2s ease-in-out infinite alternate",
          }} />
      )}
    </div>
  );
}

function LoadingBay({ x, active }: { x: number; active: boolean }) {
  return (
    <div className="absolute" style={{ left: `${x}px`, bottom: "72px", zIndex: 4 }}>
      {/* Warehouse wall */}
      <div className="w-28 h-24 rounded-t-lg" style={{ background: "#111827", border: "1px solid #1E3A5F" }}>
        {/* Door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 transition-all duration-700"
          style={{
            height: active ? "60px" : "0px",
            background: "#0D1526",
            border: "1px solid #1E3A5F",
            overflow: "hidden",
          }}>
          {/* Cargo boxes */}
          {active && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-sm animate-bounce"
                  style={{
                    background: "#F59E0B",
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.6s",
                  }} />
              ))}
            </div>
          )}
        </div>
        {/* Roof light */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ background: active ? "#F59E0B" : "#334155", boxShadow: active ? "0 0 8px #F59E0B" : "none" }} />
      </div>
      <div className="text-center mt-1">
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: active ? "#F59E0B" : "#334155" }}>
          LOADING BAY
        </span>
      </div>
    </div>
  );
}

function TruckSVG({ loaded }: { loaded: boolean }) {
  return (
    <svg width="160" height="64" viewBox="0 0 160 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trailer */}
      <rect x="0" y="8" width="100" height="40" rx="3" fill="#1E3A5F" stroke="#2B5CE6" strokeWidth="1.2" />
      {/* Cargo (visible when loaded) */}
      {loaded && (
        <>
          <rect x="6" y="14" width="88" height="28" rx="2" fill="#0D1526" opacity="0.7" />
          <rect x="12" y="18" width="20" height="18" rx="1" fill="#F59E0B" opacity="0.6" />
          <rect x="36" y="18" width="20" height="18" rx="1" fill="#F59E0B" opacity="0.5" />
          <rect x="60" y="18" width="20" height="18" rx="1" fill="#F59E0B" opacity="0.4" />
        </>
      )}
      {/* Cab */}
      <rect x="100" y="14" width="48" height="34" rx="3" fill="#2B5CE6" stroke="#00C2E0" strokeWidth="1.2" />
      {/* Windshield */}
      <rect x="116" y="18" width="26" height="14" rx="2" fill="#00C2E0" opacity="0.25" />
      {/* Headlight */}
      <circle cx="146" cy="42" r="3.5" fill="#FDE68A" />
      <ellipse cx="152" cy="42" rx="6" ry="2.5" fill="#FDE68A" opacity="0.2" />
      {/* Wheels */}
      <circle cx="22"  cy="50" r="8" fill="#0D1526" stroke="#475569" strokeWidth="1.5" />
      <circle cx="22"  cy="50" r="3.5" fill="#1E3A5F" />
      <circle cx="78"  cy="50" r="8" fill="#0D1526" stroke="#475569" strokeWidth="1.5" />
      <circle cx="78"  cy="50" r="3.5" fill="#1E3A5F" />
      <circle cx="128" cy="50" r="8" fill="#0D1526" stroke="#475569" strokeWidth="1.5" />
      <circle cx="128" cy="50" r="3.5" fill="#1E3A5F" />
    </svg>
  );
}

function WeightDisplay({ x, label, value, color }: { x: number; label: string; value: string; color: string }) {
  return (
    <div className="absolute z-20 animate-fade-up"
      style={{ left: `${x + 4}px`, bottom: "100px" }}>
      <div className="bg-[#0D1526] border rounded-lg px-3 py-2 text-center whitespace-nowrap"
        style={{ borderColor: `${color}40` }}>
        <div className="text-[8px] text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="font-mono font-black text-base mt-0.5" style={{ color }}>{value}</div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
          <span className="text-[8px]" style={{ color }}>LIVE</span>
        </div>
      </div>
    </div>
  );
}

function PlateDisplay({ verified }: { verified: boolean }) {
  return (
    <div className="absolute top-10 right-3 z-20 transition-all duration-500"
      style={{ opacity: verified ? 1 : 0 }}>
      <div className="bg-[#0D1526] border border-white/10 rounded-lg p-2 w-32">
        <div className="text-[10px] text-gray-400 mb-1">PLATE DETECTED</div>
        <div className="font-mono font-bold text-[13px] text-white bg-[#1E3A5F] rounded px-1.5 py-0.5 text-center">
          MH 12 AB 5678
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${verified ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
          <span className={`text-[10px] font-semibold ${verified ? "text-green-400" : "text-gray-500"}`}>
            {verified ? "VERIFIED ✓" : "SCANNING..."}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReportPopup() {
  return (
    <div className="absolute top-10 left-3 z-20 animate-fade-up">
      <div className="bg-[#0D1526] border border-purple-400/40 rounded-lg p-3 w-60 shadow-lg">
        <div className="text-[12px] text-purple-300 font-bold uppercase tracking-wider mb-2">
          📄 Report Generated
        </div>
        <div className="space-y-1">
          {[
            { l: "1st Weighment (Entry)", v: "12,400 kg", c: "#94A3B8" },
            { l: "2nd Weighment (Exit)",  v: "10,300 kg", c: "#94A3B8" },
            { l: "Net Material Weight",   v: "2,100 kg", c: "#A78BFA" },
          ].map(({ l, v, c }) => (
            <div key={l} className="flex justify-between items-center">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-mono font-bold" style={{ color: c }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-green-400 font-semibold">Audit Trail Saved</span>
        </div>
      </div>
    </div>
  );
}
