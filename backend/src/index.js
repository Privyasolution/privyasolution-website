require("dotenv").config();
const path    = require("path");
const express = require("express");
const cors    = require("cors");
const rateLimit = require("express-rate-limit");
const inquiryRoutes = require("./routes/inquiries");
const adminRoutes   = require("./routes/admin");
const cmsRoutes     = require("./routes/cms");
const mediaRoutes   = require("./routes/media");

const app = express();
const PORT = process.env.PORT || 4000;

// ── CORS — must be FIRST, before any routes ──────────────────────────────────
const corsOptions = {
  origin: function (origin, callback) {
    // Allow no-origin requests (Postman, server-side calls)
    if (!origin) return callback(null, true);
    // In development allow everything
    if (process.env.NODE_ENV !== "production") return callback(null, true);
    // In production check whitelist
    const whitelist = [
      process.env.FRONTEND_URL,
      "https://privyasolution.in",
      "https://www.privyasolution.in",
    ].filter(Boolean);
    if (whitelist.includes(origin)) return callback(null, true);
    callback(new Error("CORS: origin not allowed"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Handle preflight for ALL routes first
app.options("*", cors(corsOptions));
// Apply CORS to all routes
app.use(cors(corsOptions));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/inquiries", limiter);

// ── Static — serve uploaded media files ──────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/inquiries",    inquiryRoutes);
app.use("/api/admin",        adminRoutes);
app.use("/api/cms",          cmsRoutes);
app.use("/api/cms/media",    mediaRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
