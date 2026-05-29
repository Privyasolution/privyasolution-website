require("dotenv").config();
const pool = require("./pool");

async function migrate() {
  // ── Inquiries ─────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name             TEXT NOT NULL,
      company          TEXT NOT NULL,
      email            TEXT NOT NULL,
      phone            TEXT NOT NULL,
      service_interest TEXT,
      message          TEXT,
      preferred_time   TEXT,
      is_read          BOOLEAN DEFAULT false,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
  `);

  // ── Site Settings (global: company name, phone, email, address, socials) ──
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      label TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // ── Page Content (hero, sections per page) ────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS page_content (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page       TEXT NOT NULL,
      section    TEXT NOT NULL,
      field      TEXT NOT NULL,
      value      TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(page, section, field)
    );
  `);

  // ── Services ──────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug             TEXT UNIQUE NOT NULL,
      title            TEXT NOT NULL,
      description      TEXT,
      badge            TEXT,
      has_page         BOOLEAN DEFAULT true,
      show_on_homepage BOOLEAN DEFAULT true,
      show_in_menu     BOOLEAN DEFAULT true,
      published        BOOLEAN DEFAULT true,
      sort_order       INT DEFAULT 0,
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE services ADD COLUMN IF NOT EXISTS has_page         BOOLEAN DEFAULT true;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT true;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS show_in_menu     BOOLEAN DEFAULT true;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS published        BOOLEAN DEFAULT true;
    ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url        TEXT DEFAULT '';
    ALTER TABLE services ADD COLUMN IF NOT EXISTS specs            TEXT DEFAULT '';
  `);

  // Seed the main navigation services (those with dedicated detail pages)
  const mainServices = [
    ["single-entry-weighing",    "Single Entry Weighing",       "Automated single-point parcel weighing with camera capture and PDF receipt generation.",   "Popular", true, 1],
    ["double-entry-weighing",    "Double Entry Weighing",       "Dual-weighment system with ANPR, fraud prevention, and complete audit trail for logistics.", null,      true, 2],
    ["pharma-industry-services", "Pharma Industry Services",    "ALCOA+ & GxP compliant systems with IPQC, audit trails, and 21 CFR Part 11 support.",       "Compliance", true, 3],
    ["other-services",           "Other Weighing Solutions",    "Checkweighers, crane scales, tank weighing, retail scales, and more.",                       null,      false, 4],
  ];
  for (const [slug, title, description, badge, has_page, sort_order] of mainServices) {
    await pool.query(
      `INSERT INTO services (slug, title, description, badge, has_page, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (slug) DO NOTHING`,
      [slug, title, description, badge, has_page, sort_order]
    );
  }

  // ── Seed catalog services (shown on /services/other-services page) ────────
  const catalogServices = [
    ["checkweighers",        "Checkweighers",                    "Dynamic checkweighers verify every product on your line against target weight tolerances, instantly rejecting underweight or overweight items without slowing throughput.",                                                  "High Speed",      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",    "Up to 300 packs/min|±0.1g accuracy|IP65 rated|Auto-reject",             10],
    ["bagging-powder-filling","Bagging & Powder Filling",        "Combine precision weighing with automated packaging to deliver consistent fill weights at high throughput — reducing product giveaway and operator dependency.",                                                            "Automation",      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",    "100g–50kg fill range|1,200 bags/hr|±0.5% accuracy|SS304/316",           20],
    ["platform-tabletop-scales","Platform & Tabletop Scales",   "From compact bench scales to heavy-duty floor platforms, our Legal Metrology approved scales deliver consistent accuracy across all industrial and laboratory environments.",                                               "Certified",       "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",    "1kg–3,000kg|0.1g readability|IP54/IP65|RS232/USB",                      30],
    ["tank-weighing",        "Tank Weighing Systems",            "Compression and tension load cell arrays provide continuous, accurate weight data for process tanks — enabling live inventory control and automated batch management.",                                                       "Process Control", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",    "Compression & tension|ATEX rated options|PLC integration|Live inventory", 40],
    ["hopper-weighing",      "Hopper Weighing",                  "Hopper weighing systems deliver accurate dosing and batching with full PLC integration — eliminating manual measurement and enabling fully automated production workflows.",                                                  "Batching",        "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",    "Automated dosing|PLC integration|SS construction|Multi-hopper",          50],
    ["vessel-weighing",      "Vessel Weighing",                  "Precision load cell mounting kits for new or retrofit installation on process vessels, with hygienic designs for pharma and food applications and full process control integration.",                                          "Pharma Ready",    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",    "Retrofit-friendly|Hygienic design|ATEX options|Continuous monitoring",   60],
    ["drum-tin-filling",     "Drum & Tin Filling Systems",       "Semi-automatic and fully automatic drum filling systems combine precision weighing with fill control — ensuring every container meets exact specification with operator safety features.",                                      "Automated",       "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",    "1L–1,000L range|±0.1% accuracy|Manual/semi/full auto|SS304/316",        70],
    ["crane-scales",         "Crane Scales (Coil Weighing)",     "Wireless crane scales deliver accurate weight readings for steel coils, heavy fabrications, and overhead crane operations without interrupting lifting workflows.",                                                           "Heavy Duty",      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",    "500kg–100T|±0.1% accuracy|Wireless display|IP65 · Battery",             80],
    ["retail-scales",        "Retail Scales (Gold, Silver & Lab)","NABL-traceable retail scales for gold, silver, and pharmaceutical counters — with tamper-proof design, dual LCD display, and Legal Metrology certification for trade use.",                                                "Legal Metrology", "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",    "50g–30kg|0.001g readability|Dual LCD|NABL traceable",                   90],
    ["export-weighing",      "Export Weighing Solutions",        "Export-grade weighbridges and container scales certified for international customs compliance — with multi-currency display, documentation integration, and international calibration certificates.",                           "OIML Certified",  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",    "OIML certified|Customs docs|Multi-currency|International certs",         100],
    ["standard-weight-boxes","Standard Weight Boxes",            "Complete sets and individual weights in cast iron, stainless steel, and precision classes — supplied with NABL-traceable calibration certificates for legal and industrial use.",                                              "NABL Traceable",  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",    "Classes E1–M3|Cast iron & SS|1mg–5,000kg|NABL certificates",            110],
    ["hardness-testing",     "Hardness Testing Devices",         "Multi-scale hardness testing instruments for pharmaceutical tablet quality control and industrial material testing — with digital readout, GMP-compatible design, and calibration support.",                                   "GMP Compatible",  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",    "Rockwell/Brinell/Vickers|Digital readout|GMP compatible|Calibration support", 120],
    ["weighing-api",         "Weighing API Services",            "Bridge physical weighing devices with your digital infrastructure — real-time data sync, webhook support, and secure API endpoints for ERP, LIMS, WMS, and custom software integration.",                                     "Integration",     "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",    "REST API|Real-time sync|ERP/LIMS/WMS|Webhook support",                  130],
  ];
  for (const [slug, title, description, badge, image_url, specs, sort_order] of catalogServices) {
    await pool.query(
      `INSERT INTO services (slug, title, description, badge, image_url, specs, has_page, show_on_homepage, show_in_menu, published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,false,false,false,true,$7)
       ON CONFLICT (slug) DO NOTHING`,
      [slug, title, description, badge, image_url, specs, sort_order]
    );
  }

  // ── Testimonials ──────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      quote      TEXT NOT NULL,
      author     TEXT NOT NULL,
      role       TEXT,
      company    TEXT,
      rating     INT DEFAULT 5,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // ── FAQs ──────────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS faqs (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page       TEXT NOT NULL,
      question   TEXT NOT NULL,
      answer     TEXT NOT NULL,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // ── Seed default site settings ────────────────────────────────────────────
  const defaults = [
    ["company_name",    "Privya Solution LLP",                    "Company Name"],
    ["phone",           "+91-9904095104",                         "Phone Number"],
    ["email",           "privyasolution@gmail.com",               "Email Address"],
    ["address",         "523, Universal Trade Center, Opp. Mahendra Showroom, Near Hari Om Circle, L.P. Savani Rd, Surat, Gujarat", "Address"],
    ["whatsapp",        "919904095104",                           "WhatsApp Number"],
    ["tagline",         "Precision weighing and pharma automation solutions for industries that demand accuracy, compliance, and traceability.", "Company Tagline"],
    ["linkedin",        "#",                                      "LinkedIn URL"],
    ["facebook",        "#",                                      "Facebook URL"],
    ["youtube",         "#",                                      "YouTube URL"],
    ["brochure_url",    "privya-solution-brochure.pdf","Brochure PDF URL"],
    // ["admin_token",     process.env.ADMIN_TOKEN || "privya_admin_987654", "Admin Token"],
  ];
  for (const [key, value, label] of defaults) {
    await pool.query(
      `INSERT INTO site_settings (key, value, label) VALUES ($1,$2,$3)
       ON CONFLICT (key) DO NOTHING`,
      [key, value, label]
    );
  }

  // ── Seed default testimonials ─────────────────────────────────────────────
  const testimonials = [
    ["Privya's automation reduced our weighing errors to zero. The system is incredibly reliable and the support team is always available.", "Rajesh Mehta", "Plant Manager", "Steel Manufacturing Unit, Surat", 5, 1],
    ["Perfect solution for pharma compliance and audit readiness. Our GMP audit passed on the first attempt after Privya installed the system.", "Dr. Priya Sharma", "QA Head", "Pharmaceutical Company, Ahmedabad", 5, 2],
    ["Our quarry processes 300+ trucks per day. The double entry weighbridge paid for itself in 6 months. Excellent ROI.", "Suresh Patel", "Site Manager", "Quarry Operations, Rajkot", 5, 3],
    ["The ALCOA+ compliant system transformed our dispensing process. Zero manual errors and complete audit trail.", "Anita Desai", "Production Head", "API Manufacturer, Vadodara", 5, 4],
  ];
  for (const [quote, author, role, company, rating, sort_order] of testimonials) {
    await pool.query(
      `INSERT INTO testimonials (quote, author, role, company, rating, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT DO NOTHING`,
      [quote, author, role, company, rating, sort_order]
    );
  }

  // ── Value Props (home page stats/features) ───────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS value_props (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      icon_name  TEXT NOT NULL,
      title      TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // ── Stats (reusable across pages) ─────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stats (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page       TEXT NOT NULL DEFAULT 'global',
      value      TEXT NOT NULL,
      label      TEXT NOT NULL,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // ── Seed value props ──────────────────────────────────────────────────────
  const valueProps = [
    ["ShieldCheck", "100% Audit Traceability",  "ALCOA+ ready systems with complete electronic records and audit trails.",  1],
    ["Zap",         "98% Error Reduction",      "Eliminate manual weighing errors with intelligent automation.",             2],
    ["BarChart3",   "Real-time Data & Reports", "Live dashboards, PDF/Excel exports, and ERP/LIMS integration.",            3],
    ["Clock",       "65% Faster Operations",    "Streamlined workflows reduce weighing cycle time significantly.",           4],
  ];
  for (const [icon_name, title, description, sort_order] of valueProps) {
    await pool.query(
      `INSERT INTO value_props (icon_name, title, description, sort_order)
       VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [icon_name, title, description, sort_order]
    );
  }

  // ── Seed global stats ─────────────────────────────────────────────────────
  const statsData = [
    ["global", "500+",  "Installations",      1],
    ["global", "99.5%", "System Uptime",       2],
    ["global", "10+",   "Years Experience",    3],
    ["global", "24/7",  "Support",             4],
    ["home",   "98%",   "Error Reduction",     1],
    ["home",   "500+",  "Installations",       2],
    ["home",   "100%",  "Audit Ready",         3],
  ];
  for (const [page, value, label, sort_order] of statsData) {
    await pool.query(
      `INSERT INTO stats (page, value, label, sort_order)
       VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [page, value, label, sort_order]
    );
  }

  // ── Leadership Team ───────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leadership_team (
      id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name      TEXT NOT NULL,
      designation    TEXT NOT NULL,
      bio            TEXT DEFAULT '',
      profile_image  TEXT DEFAULT '',
      linkedin_url   TEXT DEFAULT '',
      twitter_url    TEXT DEFAULT '',
      instagram_url  TEXT DEFAULT '',
      facebook_url   TEXT DEFAULT '',
      display_order  INT DEFAULT 0,
      is_active      BOOLEAN DEFAULT true,
      is_featured    BOOLEAN DEFAULT false,
      created_at     TIMESTAMPTZ DEFAULT NOW(),
      updated_at     TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Only seed if table is empty
  const { rows: leaderCount } = await pool.query("SELECT COUNT(*) FROM leadership_team");
  if (parseInt(leaderCount[0].count) === 0) {
    const leaders = [
      ["Jenin Shah",  "Director", "", "", 1],
      ["Ishani Shah", "Director", "", "", 2],
    ];
    for (const [full_name, designation, bio, profile_image, display_order] of leaders) {
      await pool.query(
        `INSERT INTO leadership_team (full_name, designation, bio, profile_image, display_order)
         VALUES ($1,$2,$3,$4,$5)`,
        [full_name, designation, bio, profile_image, display_order]
      );
    }
  }

  // ── Clients (logo slider on homepage) ────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT NOT NULL,
      logo_url    TEXT NOT NULL DEFAULT '',
      website_url TEXT NOT NULL DEFAULT '',
      sort_order  INT DEFAULT 0,
      published   BOOLEAN DEFAULT true,
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS website_url TEXT NOT NULL DEFAULT '';
  `);

  // Only seed if table is empty (safe to re-run migrate)
  const { rows: clientCount } = await pool.query("SELECT COUNT(*) FROM clients");
  if (parseInt(clientCount[0].count) === 0) {
    const clientsData = [
      ["Stellion",                              "", 1],
      ["Amneal",                                "", 2],
      ["Believe International",                 "", 3],
      ["Shree Bhagwati Flour & Foods Pvt. Ltd.", "", 4],
      ["Emcure Pharmaceuticals",                "", 5],
    ];
    for (const [name, logo_url, sort_order] of clientsData) {
      await pool.query(
        `INSERT INTO clients (name, logo_url, sort_order) VALUES ($1,$2,$3)`,
        [name, logo_url, sort_order]
      );
    }
  }

  console.log("✅ Migration complete — all tables created and seeded.");
  process.exit(0);
}

migrate().catch((err) => { console.error("❌ Migration failed:", err.message); process.exit(1); });
