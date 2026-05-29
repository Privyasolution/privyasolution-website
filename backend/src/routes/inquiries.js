const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("../db/pool");
const { sendInquiryEmail } = require("../mailer");

const router = express.Router();

const validate = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
];

router.post("/", validate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, company, email, phone, service_interest, message, preferred_time } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO inquiries (name, company, email, phone, service_interest, message, preferred_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [name, company, email, phone, service_interest, message, preferred_time]
    );

    // Send email (non-blocking)
    sendInquiryEmail({ name, company, email, phone, service_interest, message, preferred_time }).catch(console.error);

    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
