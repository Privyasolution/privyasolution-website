"use client";

import type { CmsClient } from "@/lib/cms";
import { Building2 } from "lucide-react";

export default function ClientsSlider({ clients }: { clients: CmsClient[] }) {
  if (!clients.length) return null;

  // Quadruple so translateX(-25%) is exactly one full original set → seamless loop
  const items = [...clients, ...clients, ...clients, ...clients];
  // ~5 s per card, minimum 24 s — gives a comfortable scroll speed
  const duration = `${Math.max(clients.length * 5, 24)}s`;

  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      {/* Header */}
      <div className="container-max px-4 md:px-8 lg:px-16 text-center mb-10">
        <p className="section-tag">Our Clients</p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-brand-navy leading-tight">
          Trusted by Leading Companies
        </h2>
      </div>

      {/* Marquee — relative wrapper holds the left/right fade overlays */}
      <div className="relative">

        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10"
          style={{ background: "linear-gradient(to right, #f9fafb, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10"
          style={{ background: "linear-gradient(to left, #f9fafb, transparent)" }}
        />

        {/*
          group → group-hover: pauses the animation on the inner track
          overflow-x-clip → clips horizontal marquee overflow
          py-3 → 12 px vertical buffer so the hover-lift (-8 px) is never clipped
        */}
        <div
          className="group overflow-x-clip py-3"
          style={{ overflowY: "visible" } as React.CSSProperties}
        >
          <div
            className="flex animate-marquee group-hover:[animation-play-state:paused]"
            style={{
              width: "max-content",
              gap: "20px",
              animationDuration: duration,
            }}
          >
            {items.map((c, i) => (
              <div
                key={i}
                className="
                  flex-shrink-0 w-44 bg-white rounded-2xl
                  border border-gray-100
                  p-5 flex flex-col items-center justify-between gap-3 min-h-[152px]
                  hover:-translate-y-2 hover:border-brand-cyan/30
                  transition-all duration-300 cursor-default
                "
                style={{
                  boxShadow: "0 4px 20px rgba(26,31,94,0.10)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 10px 36px rgba(26,31,94,0.20)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 20px rgba(26,31,94,0.10)";
                }}
              >
                {/* Logo area — fixed 72 px height, object-contain, full colour always */}
                <div className="w-full h-[72px] flex items-center justify-center px-3 overflow-hidden">
                  {c.logo_url ? (
                    <img
                      src={c.logo_url}
                      alt={`${c.name} logo`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center">
                      <Building2 size={22} className="text-brand-navy/50" />
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="w-8 h-px bg-gray-100" />

                {/* Client name */}
                <p className="text-[12px] font-semibold text-gray-700 text-center leading-snug line-clamp-2 w-full">
                  {c.name}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
