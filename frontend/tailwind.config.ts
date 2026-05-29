import type { Config } from "tailwindcss";

// ── Logo color extraction ──────────────────────────────────────────────────
// "PRIVYA"       → deep navy   #1A1F5E  (very dark, almost black-blue)
// "SOLUTION LLP" → medium blue #3B5BDB
// P-icon stroke  → blue        #2B5CE6
// Node top       → cyan        #00C2E0
// Node bottom    → blue        #2B5CE6
// Background     → white (logo has white bg in the actual file)
// ─────────────────────────────────────────────────────────────────────────

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          navy:     "#1A1F5E",
          blue:     "#3B5BDB",
          cyan:     "#00C2E0",
          electric: "#2B5CE6",
          dark:     "#1E2A4A",   // alias — same as darker for backward compat
          darker:   "#141C35",
          surface:  "#F4F6FF",
          light:    "#EEF2FF",
          muted:    "#64748B",
        },
      },
      fontFamily: {
        body: ['var(--font-poppins)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
      backgroundImage: {
        // Header uses white — logo is dark so it shows perfectly
        "hero-gradient":    "linear-gradient(135deg, #141C35 0%, #1A1F5E 50%, #2B5CE6 100%)",
        "icon-gradient":    "linear-gradient(180deg, #00C2E0 0%, #2B5CE6 100%)",
        "blue-gradient":    "linear-gradient(135deg, #1A1F5E 0%, #3B5BDB 100%)",
        "cyan-gradient":    "linear-gradient(135deg, #00C2E0 0%, #2B5CE6 100%)",
        "card-gradient":    "linear-gradient(135deg, #1A1F5E 0%, #2B5CE6 100%)",
        "section-gradient": "linear-gradient(180deg, #F4F6FF 0%, #ffffff 100%)",
        "dot-pattern":      "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        "card":    "0 2px 16px rgba(26,31,94,0.08)",
        "card-lg": "0 8px 40px rgba(26,31,94,0.16)",
        "glow":    "0 0 24px rgba(0,194,224,0.35)",
        "glow-lg": "0 0 48px rgba(0,194,224,0.20)",
        "blue":    "0 4px 20px rgba(43,92,230,0.35)",
        "cyan":    "0 4px 20px rgba(0,194,224,0.35)",
        "header":  "0 1px 0 rgba(26,31,94,0.08), 0 4px 16px rgba(26,31,94,0.06)",
      },
      animation: {
        "fade-up":    "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-down": "slideDown 0.3s cubic-bezier(0.22,1,0.36,1) forwards",
        "float":      "float 5s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer":    "shimmer 2.5s linear infinite",
        "marquee":    "marquee 20s linear infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity:"0", transform:"translateY(20px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        fadeIn:    { "0%": { opacity:"0" }, "100%": { opacity:"1" } },
        slideDown: { "0%": { opacity:"0", transform:"translateY(-8px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        float:     { "0%,100%": { transform:"translateY(0)" }, "50%": { transform:"translateY(-10px)" } },
        shimmer:   { "0%": { backgroundPosition:"-200% 0" }, "100%": { backgroundPosition:"200% 0" } },
        // Clients slider: items are quadrupled, so -25% = exactly one set of originals
        marquee:   { "0%": { transform:"translateX(0)" }, "100%": { transform:"translateX(-25%)" } },
      },
    },
  },
  plugins: [],
};

export default config;
