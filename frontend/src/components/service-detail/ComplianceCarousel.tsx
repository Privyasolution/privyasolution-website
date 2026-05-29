"use client";
// Auto-scrolling compliance logos carousel — CSS marquee, no external libraries
// Fully responsive, pauses on hover, loops infinitely

const badges = [
  {
    id: "alcoa-plus",
    label: "ALCOA+",
    sublabel: "Data Integrity Standard",
    img: "/Alcoa_idoU7BAbE8_0.svg",
    color: "#1A1F5E",
    bg: "#EEF2FF",
    border: "#2B5CE6",
  },
  {
    id: "gxp",
    label: "GxP Compliance",
    sublabel: "Guidelines for Life Sciences",
    img: "/GXP-web-1.png",
    color: "#1A1F5E",
    bg: "#F8FAFF",
    border: "#2B5CE6",
  },
  {
    id: "21cfr",
    label: "21 CFR Part 11",
    sublabel: "Electronic Records & Signatures",
    img: "/21-CFR-Part-11.jpg",
    color: "#1A1F5E",
    bg: "#EEF2FF",
    border: "#2B5CE6",
  },
  {
    id: "iso",
    label: "ISO Compliance",
    sublabel: "International Standards",
    img: "/iso-international-organization-standardization-logo-vector_1166422-961.avif",
    color: "#92400E",
    bg: "#FFF7ED",
    border: "#F59E0B",
  },
  {
    id: "ipqc",
    label: "IPQC",
    sublabel: "In-Process Quality Control",
    img: "/ipqc.png", // optional if you have
    color: "#0D7490",
    bg: "#ECFEFF",
    border: "#00C2E0",
  },
  {
    id: "audit-trail",
    label: "Audit Trail",
    sublabel: "Immutable · Encrypted",
    img: "/audit-trail.png", // optional
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        <rect x="8" y="8" width="64" height="64" rx="12" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2.5" />
        <path d="M40 20 L52 26 L52 42 C52 50 40 58 40 58 C40 58 28 50 28 42 L28 26 Z" fill="#22C55E" opacity="0.2" stroke="#22C55E" strokeWidth="2" />
        <path d="M34 40 L38 44 L46 36" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#166534",
    bg: "#F0FDF4",
    border: "#22C55E",
  },
];

// Duplicate for seamless loop
const allBadges = [...badges, ...badges];

export default function ComplianceCarousel() {
  return (
    <section className="bg-white border-y border-gray-100 py-10 overflow-hidden">
      <div className="container-max px-4 md:px-8 lg:px-16 mb-6">
        <p className="section-tag text-center w-full">Compliance Standards</p>
        <h2 className="font-heading font-bold text-2xl text-brand-navy text-center">
          Built to Meet Every Regulatory Requirement
        </h2>
        <p className="text-gray-500 text-sm text-center mt-2 max-w-xl mx-auto">
          Our pharma weighing systems are designed and validated against the most stringent global compliance frameworks.
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, white 0%, transparent 100%)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, white 0%, transparent 100%)" }} />

        {/* Scrolling track */}
        <div
          className="flex gap-5 w-max"
          style={{
            animation: "complianceScroll 28s linear infinite",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {allBadges.map((badge, i) => (
            <div
              key={`${badge.id}-${i}`}
              className="flex-shrink-0 flex flex-col items-center gap-3 px-6 py-5 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-card cursor-default"
              style={{
                background: badge.bg,
                borderColor: badge.border,
                minWidth: "160px",
              }}
            >
              <img
                src={badge.img}
                alt={badge.label}
                className="w-24 h-24 object-contain bg-white rounded-md"
              />
              <div className="text-center">
                <p className="font-heading font-bold text-sm leading-tight" style={{ color: badge.color }}>
                  {badge.label}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{badge.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline keyframe — injected via style tag */}
      <style>{`
        @keyframes complianceScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
