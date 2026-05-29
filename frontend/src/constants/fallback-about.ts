import type { CmsStat, CmsFaq } from "@/lib/cms";

export const FALLBACK_ABOUT_STATS: CmsStat[] = [
  { value: "500+",  label: "Installations" },
  { value: "99.5%", label: "System Uptime" },
  { value: "10+",   label: "Years Experience" },
];

export const FALLBACK_ABOUT_CAPABILITIES: string[] = [
  "Weighbridge automation (single & double entry)",
  "Pharma weighing systems (ALCOA+, GxP, 21 CFR Part 11)",
  "API & software integration (ERP, LIMS, MES)",
  "Audit trail systems with electronic records",
  "Device connectivity (LAN / Wi-Fi / RS232)",
  "AMC (Annual Maintenance Contracts)",
  "On-site installation, calibration & training",
];

export const FALLBACK_ABOUT_INDUSTRIES: string[] = [
  "Pharmaceutical",
  "Manufacturing",
  "Logistics",
  "FMCG",
  "Mining",
  "Retail & Jewellery",
  "Chemical",
  "Export",
];

export const FALLBACK_ABOUT_FAQS: CmsFaq[] = [
  { question: "What industries do you serve?",      answer: "We serve pharmaceuticals, logistics, manufacturing, FMCG, mining, retail, chemical, and export industries." },
  { question: "Are your systems pharma compliant?", answer: "Yes — all pharma systems are ALCOA+, GxP, and 21 CFR Part 11 compliant with full IQ/OQ/PQ validation support." },
  { question: "Do you provide AMC support?",        answer: "Yes, we offer Annual Maintenance Contracts with guaranteed response times and genuine spare parts." },
  { question: "Can systems integrate with ERP?",    answer: "Yes, our systems support REST API, RS232, TCP/IP, and direct ERP/LIMS integration." },
];
