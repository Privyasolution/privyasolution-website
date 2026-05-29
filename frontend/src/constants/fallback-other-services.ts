import type { CmsStat } from "@/lib/cms";

/**
 * Fallback data for the /services/other-services page.
 * Used when CMS returns empty arrays or the API is unreachable.
 * Replaced automatically once admin populates CMS.
 */

export const FALLBACK_OTHER_SERVICES_STATS: CmsStat[] = [
  { value: "13+",   label: "Solution Types" },
  { value: "500+",  label: "Installations"  },
  { value: "99.9%", label: "System Uptime"  },
];

export const FALLBACK_INDUSTRIES: string[] = [
  "Pharmaceuticals",
  "Steel & Metal",
  "Cement",
  "Food & FMCG",
  "Chemical",
  "Logistics",
  "Mining",
  "Retail & Jewellery",
  "Export",
];

export const FALLBACK_CAPABILITIES: string[] = [
  "Seamless integration with ERP, WMS, LIMS via REST API",
  "Configurable load cell connectivity for any device",
  "PDF and Excel reports generated for every transaction",
  "On-site installation, training, and AMC support",
  "Self-diagnostic software for proactive maintenance",
];
