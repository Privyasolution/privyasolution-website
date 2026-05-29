const nodemailer = require("nodemailer");
const path = require("path");

const SITE_URL = process.env.FRONTEND_URL || "https://privyasolution.in";
const LOGO_URL = `${SITE_URL}/logo-darkmode.svg`;

function isSmtpConfigured() {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.SMTP_USER.includes("@")
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("✅ SMTP server connected successfully");
    return true;
  } catch (err) {
    console.error("❌ SMTP connection failed:", err.message);
    return false;
  }
}

async function sendInquiryEmail(data) {
  if (!isSmtpConfigured()) {
    console.log("⚠️ SMTP not configured — inquiry saved to DB only.");
    return;
  }

  const smtpReady = await verifyTransporter();
  if (!smtpReady) {
    console.log("⚠️ Inquiry saved to DB only.");
    return;
  }

  const logoHeader = `
    <div style="text-align:center;margin-bottom:20px;">
      <img src="${LOGO_URL}" alt="Privya Solution LLP" style="width:180px;height:auto;display:inline-block;" />
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;">
      <div style="background:linear-gradient(135deg,#1A1F5E,#2B5CE6);padding:20px 24px;border-radius:8px;margin-bottom:20px;">
        ${logoHeader}
        <h2 style="color:#fff;margin:0;font-size:18px;text-align:center;">
          🔔 New Inquiry — Privya Solution LLP
        </h2>
      </div>

      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
        ${[
          ["Name", data.name],
          ["Company", data.company || "—"],
          ["Email", data.email],
          ["Phone", data.phone || "—"],
          ["Service Interest", data.service_interest || "—"],
          ["Preferred Time", data.preferred_time || "—"],
          ["Message", data.message || "—"],
        ]
          .map(
            ([k, v], i) => `
          <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#fff"}">
            <td style="padding:12px 16px;font-weight:600;color:#1A1F5E;width:35%;">
              ${k}
            </td>
            <td style="padding:12px 16px;color:#374151;">
              ${v}
            </td>
          </tr>
        `
          )
          .join("")}
      </table>

      <p style="color:#94a3b8;font-size:11px;margin-top:16px;text-align:center;">
        Privya Solution LLP · support.privyasolution@gmail.com · +91-9904095104
      </p>
    </div>
  `;

  const userHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;">
      <div style="background:linear-gradient(135deg,#1A1F5E,#2B5CE6);padding:20px 24px;border-radius:8px;margin-bottom:20px;">
        ${logoHeader}
        <h2 style="color:#fff;margin:0;font-size:18px;text-align:center;">
          Thank you for contacting Privya Solution LLP
        </h2>
      </div>

      <p style="color:#374151;font-size:14px;">
        Dear <strong>${data.name}</strong>,
      </p>

      <p style="color:#374151;font-size:14px;line-height:1.7;">
        Thank you for your inquiry regarding
        <strong>${data.service_interest || "our services"}</strong>.
      </p>

      <p style="color:#374151;font-size:14px;line-height:1.7;">
        Our team has received your request and will contact you within
        <strong>4 business hours</strong>.
      </p>

      <p style="color:#374151;font-size:14px;line-height:1.7;">
        📞 +91-9904095104<br/>
        📧 support.privyasolution@gmail.com<br/>
        📍 Surat, Gujarat
      </p>

      <p style="color:#374151;font-size:14px;">
        Warm regards,<br/>
        <strong>Team Privya Solution LLP</strong>
      </p>
    </div>
  `;

  const isBrochureRequest = data.service_interest === "Brochure Request";

  try {
    await transporter.sendMail({
      from: `"Privya Solution LLP" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: data.email,
      subject: `🔔 New Inquiry: ${data.name}`,
      html: adminHtml,
    });

    console.log(`✅ Admin email sent successfully`);

    if (data.email) {
      const userMailOptions = {
        from: `"Privya Solution LLP" <${process.env.FROM_EMAIL}>`,
        to: data.email,
        subject: isBrochureRequest
          ? "Your Privya Solution Brochure — Privya Solution LLP"
          : "We received your inquiry — Privya Solution LLP",
        html: userHtml,
      };

      if (isBrochureRequest) {
        userMailOptions.attachments = [
          {
            filename: "Privya-Solution-Brochure.pdf",
            path: path.join(__dirname, "../assets/privya-solution-brochure.pdf"),
            contentType: "application/pdf",
          },
        ];
      }

      transporter
        .sendMail(userMailOptions)
        .then(() => {
          console.log(`✅ Auto-reply sent to ${data.email}`);
        })
        .catch((err) => {
          console.warn("⚠️ Auto-reply failed:", err.message);
        });
    }
  } catch (err) {
    console.error("❌ Failed to send inquiry email:", err.message);
  }
}

module.exports = {
  sendInquiryEmail,
};
