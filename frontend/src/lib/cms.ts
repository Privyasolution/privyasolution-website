// CMS data fetching — used by Next.js server components (SSR/SSG)
// Falls back to hardcoded defaults if CMS has no data yet

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// Generic fetch with fallback
async function cmsFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 10 } }); // revalidate every 10s
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

// ── Settings ──────────────────────────────────────────────────────────────────
export type SiteSettings = {
  company_name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  tagline: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  brochure_url: string;
};

const defaultSettings: SiteSettings = {
  company_name: "Privya Solution LLP",
  phone:        "+91-9904095104",
  email:        "privyasolution@gmail.com",
  address:      "523, Universal Trade Center, Opp. Mahendra Showroom, Near Hari Om Circle, L.P. Savani Road, Surat, Gujarat",
  whatsapp:     "919904095104",
  tagline:      "Precision weighing and pharma automation solutions for industries that demand accuracy, compliance, and traceability.",
  linkedin:     "#",
  facebook:     "#",
  youtube:      "#",
  brochure_url: "privya-solution-brochure.pdf",
};

export async function getSettings(): Promise<SiteSettings> {
  const data = await cmsFetch<{ settings: Record<string, string> }>(
    `${API}/api/cms/public/settings`,
    { settings: {} }
  );
  return { ...defaultSettings, ...data.settings };
}

// ── Page Content ──────────────────────────────────────────────────────────────
export type PageContent = Record<string, Record<string, string>>;

export async function getPageContent(page: string): Promise<PageContent> {
  const data = await cmsFetch<{ content: PageContent }>(
    `${API}/api/cms/public/pages/${page}`,
    { content: {} }
  );
  return data.content || {};
}

// Helper: get a field with fallback
export function getField(
  content: PageContent,
  section: string,
  field: string,
  fallback = ""
): string {
  return content?.[section]?.[field] || fallback;
}

// ── Services ──────────────────────────────────────────────────────────────────
export type CmsService = {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  image_url?: string;
  specs?: string;
  has_page: boolean;
  show_on_homepage: boolean;
  show_in_menu: boolean;
  sort_order: number;
};

export async function getServices(options?: { homepage?: boolean }): Promise<CmsService[]> {
  const qs = options?.homepage ? "?homepage=true" : "";
  const data = await cmsFetch<{ services: CmsService[] }>(
    `${API}/api/cms/public/services${qs}`,
    { services: [] }
  );
  return data.services || [];
}

// Catalog services — cards shown on /services/other-services (has_page=false, not the nav entry)
export type CmsCatalogService = {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  image_url?: string;
  specs?: string;
  sort_order: number;
};

export async function getCatalogServices(): Promise<CmsCatalogService[]> {
  const data = await cmsFetch<{ services: CmsCatalogService[] }>(
    `${API}/api/cms/public/catalog`,
    { services: [] }
  );
  return data.services || [];
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export type CmsTestimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
};

export async function getTestimonials(): Promise<CmsTestimonial[]> {
  const data = await cmsFetch<{ testimonials: CmsTestimonial[] }>(
    `${API}/api/cms/public/testimonials`,
    { testimonials: [] }
  );
  return data.testimonials || [];
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
export type CmsFaq = { question: string; answer: string };

export async function getFaqs(page: string): Promise<CmsFaq[]> {
  const data = await cmsFetch<{ faqs: CmsFaq[] }>(
    `${API}/api/cms/public/faqs/${page}`,
    { faqs: [] }
  );
  return data.faqs || [];
}

// ── Value Props ───────────────────────────────────────────────────────────────
export type CmsValueProp = {
  icon_name: string;
  title: string;
  description: string;
};

export async function getValueProps(): Promise<CmsValueProp[]> {
  const data = await cmsFetch<{ valueProps: CmsValueProp[] }>(
    `${API}/api/cms/public/value-props`,
    { valueProps: [] }
  );
  return data.valueProps || [];
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export type CmsStat = { value: string; label: string };

export async function getStats(page: string): Promise<CmsStat[]> {
  const data = await cmsFetch<{ stats: CmsStat[] }>(
    `${API}/api/cms/public/stats/${page}`,
    { stats: [] }
  );
  return data.stats || [];
}

// ── Leadership Team ───────────────────────────────────────────────────────────
export type CmsLeadershipMember = {
  id: string;
  full_name: string;
  designation: string;
  bio: string;
  profile_image: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  facebook_url: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
};

export async function getLeadershipTeam(): Promise<CmsLeadershipMember[]> {
  const data = await cmsFetch<{ members: CmsLeadershipMember[] }>(
    `${API}/api/cms/public/leadership`,
    { members: [] }
  );
  return data.members || [];
}

// ── Clients ───────────────────────────────────────────────────────────────────
export type CmsClient = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  sort_order: number;
};

export async function getClients(): Promise<CmsClient[]> {
  const data = await cmsFetch<{ clients: CmsClient[] }>(
    `${API}/api/cms/public/clients`,
    { clients: [] }
  );
  return data.clients || [];
}
