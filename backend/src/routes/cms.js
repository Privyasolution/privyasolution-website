const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// function auth(req, res, next) {
//   const token = req.headers["x-admin-token"];
//   if (!token || token !== process.env.ADMIN_TOKEN)
//     return res.status(401).json({ error: "Unauthorized" });
//   next();
// }

// ── PUBLIC endpoints (no auth — used by frontend pages) ──────────────────────

// GET public site settings (excludes admin_token)
router.get("/public/settings", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT key, value FROM site_settings WHERE key != 'admin_token' ORDER BY key"
    );
    const settings = {};
    rows.forEach((r) => { settings[r.key] = r.value; });
    res.json({ settings });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public page content
router.get("/public/pages/:page", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT section, field, value FROM page_content WHERE page=$1",
      [req.params.page]
    );
    const content = {};
    rows.forEach((r) => {
      if (!content[r.section]) content[r.section] = {};
      content[r.section][r.field] = r.value;
    });
    res.json({ content });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public services — filters by published=true; ?homepage=true also filters show_on_homepage=true
router.get("/public/services", async (req, res) => {
  try {
    const homepageOnly = req.query.homepage === "true";
    const query = homepageOnly
      ? `SELECT slug, title, description, badge, image_url, specs, has_page, show_on_homepage, show_in_menu, sort_order
         FROM services WHERE published = true AND show_on_homepage = true ORDER BY sort_order, title`
      : `SELECT slug, title, description, badge, image_url, specs, has_page, show_on_homepage, show_in_menu, sort_order
         FROM services WHERE published = true ORDER BY sort_order, title`;
    const { rows } = await pool.query(query);
    res.json({ services: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public catalog services — the 13+ cards shown on /services/other-services
router.get("/public/catalog", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT slug, title, description, badge, image_url, specs, sort_order
       FROM services
       WHERE published = true AND has_page = false AND slug != 'other-services'
       ORDER BY sort_order, title`
    );
    res.json({ services: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public testimonials
router.get("/public/testimonials", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT quote, author, role, company, rating FROM testimonials ORDER BY sort_order"
    );
    res.json({ testimonials: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public FAQs by page
router.get("/public/faqs/:page", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT question, answer FROM faqs WHERE page=$1 ORDER BY sort_order",
      [req.params.page]
    );
    res.json({ faqs: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public value props
router.get("/public/value-props", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT icon_name, title, description FROM value_props ORDER BY sort_order"
    );
    res.json({ valueProps: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public stats by page
router.get("/public/stats/:page", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT value, label FROM stats WHERE page=$1 ORDER BY sort_order",
      [req.params.page]
    );
    res.json({ stats: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public leadership team — active members ordered by display_order
router.get("/public/leadership", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, full_name, designation, bio, profile_image,
              linkedin_url, twitter_url, instagram_url, facebook_url,
              display_order, is_featured
       FROM leadership_team WHERE is_active = true ORDER BY display_order, full_name`
    );
    res.json({ members: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET public clients
router.get("/public/clients", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, logo_url, website_url, sort_order FROM clients WHERE published = true ORDER BY sort_order"
    );
    res.json({ clients: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ADMIN endpoints (auth required) ──────────────────────────────────────────
router.get("/settings", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM site_settings ORDER BY key");
    const settings = {};
    rows.forEach((r) => { settings[r.key] = { value: r.value, label: r.label }; });
    res.json({ settings });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/settings", async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(updates)) {
      await pool.query(
        `INSERT INTO site_settings (key, value) VALUES ($1,$2)
         ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()`,
        [key, value]
      );
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Page Content ──────────────────────────────────────────────────────────────
router.get("/pages/:page", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM page_content WHERE page=$1 ORDER BY section, field",
      [req.params.page]
    );
    // Group by section
    const content = {};
    rows.forEach((r) => {
      if (!content[r.section]) content[r.section] = {};
      content[r.section][r.field] = r.value;
    });
    res.json({ page: req.params.page, content });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Single-field save (legacy)
router.patch("/pages/:page", async (req, res) => {
  try {
    const { section, field, value } = req.body;
    await pool.query(
      `INSERT INTO page_content (page, section, field, value)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (page, section, field) DO UPDATE SET value=$4, updated_at=NOW()`,
      [req.params.page, section, field, value]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Batch save — POST /api/cms/pages/:page/batch  body: { changes: [{section,field,value}] }
router.post("/pages/:page/batch", async (req, res) => {
  try {
    const { changes } = req.body; // [{ section, field, value }]
    if (!Array.isArray(changes) || changes.length === 0) return res.json({ success: true });
    await Promise.all(
      changes.map(({ section, field, value }) =>
        pool.query(
          `INSERT INTO page_content (page, section, field, value)
           VALUES ($1,$2,$3,$4)
           ON CONFLICT (page, section, field) DO UPDATE SET value=$4, updated_at=NOW()`,
          [req.params.page, section, field, value]
        )
      )
    );
    res.json({ success: true, saved: changes.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Services ──────────────────────────────────────────────────────────────────
router.get("/services", async (req, res) => {
  try {
    // ?catalog=true returns only catalog items (has_page=false, not the other-services nav entry)
    const catalogOnly = req.query.catalog === "true";
    const { rows } = catalogOnly
      ? await pool.query(
          `SELECT * FROM services WHERE has_page = false AND slug != 'other-services' ORDER BY sort_order, title`
        )
      : await pool.query("SELECT * FROM services ORDER BY sort_order, title");
    res.json({ services: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/services", async (req, res) => {
  try {
    const { slug, title, description, badge, image_url, specs, has_page, show_on_homepage, show_in_menu, published, sort_order } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO services (slug, title, description, badge, image_url, specs, has_page, show_on_homepage, show_in_menu, published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [slug, title, description, badge, image_url || "", specs || "",
       has_page ?? true, show_on_homepage ?? true, show_in_menu ?? true, published ?? true,
       sort_order || 0]
    );
    res.status(201).json({ service: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/services/:id", async (req, res) => {
  try {
    const { title, description, badge, image_url, specs, has_page, show_on_homepage, show_in_menu, published, sort_order } = req.body;
    await pool.query(
      `UPDATE services
       SET title=$1, description=$2, badge=$3, image_url=$4, specs=$5, has_page=$6,
           show_on_homepage=$7, show_in_menu=$8, published=$9, sort_order=$10, updated_at=NOW()
       WHERE id=$11`,
      [title, description, badge, image_url || "", specs || "", has_page ?? true,
       show_on_homepage ?? true, show_in_menu ?? true, published ?? true,
       sort_order, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/services/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM services WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Testimonials ──────────────────────────────────────────────────────────────
router.get("/testimonials", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM testimonials ORDER BY sort_order");
    res.json({ testimonials: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/testimonials", async (req, res) => {
  try {
    const { quote, author, role, company, rating, sort_order } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO testimonials (quote, author, role, company, rating, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [quote, author, role, company, rating || 5, sort_order || 0]
    );
    res.status(201).json({ testimonial: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/testimonials/:id", async (req, res) => {
  try {
    const { quote, author, role, company, rating, sort_order } = req.body;
    await pool.query(
      `UPDATE testimonials SET quote=$1, author=$2, role=$3, company=$4,
       rating=$5, sort_order=$6, updated_at=NOW() WHERE id=$7`,
      [quote, author, role, company, rating, sort_order, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/testimonials/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM testimonials WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── FAQs ──────────────────────────────────────────────────────────────────────
router.get("/faqs", async (req, res) => {
  try {
    const page = req.query.page;
    const { rows } = await pool.query(
      page
        ? "SELECT * FROM faqs WHERE page=$1 ORDER BY sort_order"
        : "SELECT * FROM faqs ORDER BY page, sort_order",
      page ? [page] : []
    );
    res.json({ faqs: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/faqs", async (req, res) => {
  try {
    const { page, question, answer, sort_order } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO faqs (page, question, answer, sort_order)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [page, question, answer, sort_order || 0]
    );
    res.status(201).json({ faq: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/faqs/:id", async (req, res) => {
  try {
    const { question, answer, sort_order } = req.body;
    await pool.query(
      `UPDATE faqs SET question=$1, answer=$2, sort_order=$3, updated_at=NOW() WHERE id=$4`,
      [question, answer, sort_order, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/faqs/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM faqs WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Value Props (admin CRUD) ──────────────────────────────────────────────────
router.get("/value-props", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM value_props ORDER BY sort_order");
    res.json({ valueProps: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/value-props", async (req, res) => {
  try {
    const { icon_name, title, description, sort_order } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO value_props (icon_name, title, description, sort_order)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [icon_name, title, description, sort_order || 0]
    );
    res.status(201).json({ valueProp: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/value-props/:id", async (req, res) => {
  try {
    const { icon_name, title, description, sort_order } = req.body;
    await pool.query(
      `UPDATE value_props SET icon_name=$1, title=$2, description=$3, sort_order=$4, updated_at=NOW() WHERE id=$5`,
      [icon_name, title, description, sort_order, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/value-props/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM value_props WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Stats (admin CRUD) ────────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const page = req.query.page;
    const { rows } = page
      ? await pool.query("SELECT * FROM stats WHERE page=$1 ORDER BY sort_order", [page])
      : await pool.query("SELECT * FROM stats ORDER BY page, sort_order");
    res.json({ stats: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/stats", async (req, res) => {
  try {
    const { page, value, label, sort_order } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO stats (page, value, label, sort_order) VALUES ($1,$2,$3,$4) RETURNING *`,
      [page || "global", value, label, sort_order || 0]
    );
    res.status(201).json({ stat: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/stats/:id", async (req, res) => {
  try {
    const { value, label, sort_order } = req.body;
    await pool.query(
      `UPDATE stats SET value=$1, label=$2, sort_order=$3, updated_at=NOW() WHERE id=$4`,
      [value, label, sort_order, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/stats/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM stats WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Leadership Team (admin CRUD) ─────────────────────────────────────────────
router.get("/leadership", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM leadership_team ORDER BY display_order, full_name"
    );
    res.json({ members: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/leadership", async (req, res) => {
  try {
    const { full_name, designation, bio, profile_image, linkedin_url, twitter_url, instagram_url, facebook_url, display_order, is_active, is_featured } = req.body;
    if (!full_name?.trim()) return res.status(400).json({ error: "full_name is required" });
    if (!designation?.trim()) return res.status(400).json({ error: "designation is required" });
    const { rows } = await pool.query(
      `INSERT INTO leadership_team
         (full_name, designation, bio, profile_image, linkedin_url, twitter_url, instagram_url, facebook_url, display_order, is_active, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [full_name.trim(), designation.trim(), bio || "", profile_image || "",
       linkedin_url || "", twitter_url || "", instagram_url || "", facebook_url || "",
       display_order || 0, is_active ?? true, is_featured ?? false]
    );
    res.status(201).json({ member: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/leadership/:id", async (req, res) => {
  try {
    const { full_name, designation, bio, profile_image, linkedin_url, twitter_url, instagram_url, facebook_url, display_order, is_active, is_featured } = req.body;
    await pool.query(
      `UPDATE leadership_team
       SET full_name=$1, designation=$2, bio=$3, profile_image=$4,
           linkedin_url=$5, twitter_url=$6, instagram_url=$7, facebook_url=$8,
           display_order=$9, is_active=$10, is_featured=$11, updated_at=NOW()
       WHERE id=$12`,
      [full_name, designation, bio || "", profile_image || "",
       linkedin_url || "", twitter_url || "", instagram_url || "", facebook_url || "",
       display_order, is_active ?? true, is_featured ?? false, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/leadership/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM leadership_team WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Clients (admin CRUD) ──────────────────────────────────────────────────────
router.get("/clients", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM clients ORDER BY sort_order");
    res.json({ clients: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/clients", async (req, res) => {
  try {
    const { name, logo_url, website_url, sort_order, published } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO clients (name, logo_url, website_url, sort_order, published)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, logo_url || "", website_url || "", sort_order || 0, published ?? true]
    );
    res.status(201).json({ client: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch("/clients/:id", async (req, res) => {
  try {
    const { name, logo_url, website_url, sort_order, published } = req.body;
    await pool.query(
      `UPDATE clients
       SET name=$1, logo_url=$2, website_url=$3, sort_order=$4, published=$5, updated_at=NOW()
       WHERE id=$6`,
      [name, logo_url || "", website_url || "", sort_order, published ?? true, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/clients/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM clients WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
