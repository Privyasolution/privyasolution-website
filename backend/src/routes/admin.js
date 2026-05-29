const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// function authMiddleware(req, res, next) {
//   const token = req.headers["x-admin-token"];
//   if (!token || token !== process.env.ADMIN_TOKEN) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   next();
// }

// GET inquiries — supports ?page=1&limit=20&search=&filter=all|unread
router.get("/inquiries", async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || "1"));
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit || "20")));
    const offset = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const filter = req.query.filter || "all"; // "all" | "unread"

    const conditions = [];
    const params     = [];

    if (filter === "unread") {
      params.push(false);
      conditions.push(`is_read = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      const p = params.length;
      conditions.push(`(name ILIKE $${p} OR company ILIKE $${p} OR email ILIKE $${p} OR service_interest ILIKE $${p})`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [data, countResult] = await Promise.all([
      pool.query(
        `SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM inquiries ${where}`, params),
    ]);

    const total      = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({ inquiries: data.rows, total, page, limit, totalPages });
  } catch (err) {
    console.error("DB error in /inquiries:", err.message);
    res.status(500).json({
      error: "Database unavailable. Run migrations: node src/db/migrate.js",
      detail: err.message,
    });
  }
});

// PATCH mark as read/unread
router.patch("/inquiries/:id", async (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;
  try {
    await pool.query("UPDATE inquiries SET is_read = $1 WHERE id = $2", [is_read, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE inquiry
router.delete("/inquiries/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM inquiries WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [total, unread, today] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM inquiries"),
      pool.query("SELECT COUNT(*) FROM inquiries WHERE is_read = false"),
      pool.query("SELECT COUNT(*) FROM inquiries WHERE created_at::date = CURRENT_DATE"),
    ]);
    res.json({
      total:  parseInt(total.rows[0].count),
      unread: parseInt(unread.rows[0].count),
      today:  parseInt(today.rows[0].count),
    });
  } catch (err) {
    console.error("DB error in /stats:", err.message);
    res.status(500).json({
      error: "Database unavailable. Run migrations: node src/db/migrate.js",
      detail: err.message,
    });
  }
});

module.exports = router;
