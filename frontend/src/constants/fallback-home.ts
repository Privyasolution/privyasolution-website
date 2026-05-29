import type { CmsService, CmsValueProp, CmsStat } from "@/lib/cms";

export const FALLBACK_SERVICES: CmsService[] = [
  { slug: "single-entry-weighing",    title: "Single Entry Weighing",  description: "Automated single-point weighbridge for fast, accurate vehicle weighing with real-time reporting.", badge: "Popular",     has_page: true,  show_on_homepage: true, show_in_menu: true, sort_order: 1 },
  { slug: "double-entry-weighing",    title: "Double Entry Weighing",  description: "Dual-weighment system with ANPR, fraud prevention, and complete audit trail for logistics hubs.",    badge: undefined,    has_page: true,  show_on_homepage: true, show_in_menu: true, sort_order: 2 },
  { slug: "pharma-industry-services", title: "Pharma Weighing",        description: "ALCOA+ & GxP compliant systems with IPQC, audit trails, and 21 CFR Part 11 support.",               badge: "Compliance", has_page: true,  show_on_homepage: true, show_in_menu: true, sort_order: 3 },
  { slug: "other-services",           title: "Other Services",         description: "Checkweighers, crane scales, tank weighing, retail scales, and more.",                               badge: undefined,    has_page: false, show_on_homepage: true, show_in_menu: true, sort_order: 4 },
];

export const FALLBACK_VALUE_PROPS: CmsValueProp[] = [
  { icon_name: "ShieldCheck", title: "100% Audit Traceability",  description: "ALCOA+ ready systems with complete electronic records and audit trails." },
  { icon_name: "Zap",         title: "98% Error Reduction",      description: "Eliminate manual weighing errors with intelligent automation." },
  { icon_name: "BarChart3",   title: "Real-time Data & Reports", description: "Live dashboards, PDF/Excel exports, and ERP/LIMS integration." },
  { icon_name: "Clock",       title: "65% Faster Operations",    description: "Streamlined workflows reduce weighing cycle time significantly." },
];

export const FALLBACK_HOME_INDUSTRIES: string[] = [
  "Pharmaceuticals",
  "Logistics & Transport",
  "Steel & Mining",
  "Food & FMCG",
  "Chemical",
  "Retail & Jewellery",
];

export const FALLBACK_HOME_STATS: CmsStat[] = [
  { value: "500+",  label: "Installations" },
  { value: "99.5%", label: "System Uptime" },
  { value: "10+",   label: "Years Experience" },
];
