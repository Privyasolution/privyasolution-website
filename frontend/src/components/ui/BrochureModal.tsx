"use client";
import { useState, useEffect } from "react";
import { X, Send, Download, Mail } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function BrochureModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

useEffect(() => {
  if (isOpen) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }

  return () => document.body.classList.remove("modal-open");
}, [isOpen]);

  // Reset state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", email: "", phone: "" });
      setSent(false);
      setLoading(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/inquiries`, {
        name: form.name,
        company: "—",
        email: form.email,
        phone: form.phone || "—",
        service_interest: "Brochure Request",
        message: "Requested company brochure via website.",
        preferred_time: "—",
      });
      setSent(true);
      toast.success("Request received! We'll send the brochure to your email.");
    } catch {
      const link = document.createElement("a");
      link.href = "/privya-solution-brochure.pdf";
      link.download = "Privya-Solution-Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Brochure downloaded!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    // Use inline styles for the overlay to guarantee consistent rendering
    // regardless of parent CSS context (overflow-hidden, transforms, etc.)
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Download Brochure"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(10,15,30,0.85)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card — inline styles to guarantee identical appearance everywhere */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "440px",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          animation: "fadeUp 0.3s ease forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #141C35 0%, #1A1F5E 100%)",
            padding: "24px 24px 20px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Download size={16} color="#00C2E0" />
              <span style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#00C2E0",
                fontFamily: "inherit",
              }}>
                Free Download
              </span>
            </div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.2,
              fontFamily: "var(--font-poppins), sans-serif",
            }}>
              Get Our Product Brochure
            </h3>
            <p style={{ fontSize: "12px", textAlign: "left", color: "#94A3B8", margin: 0 }}>
              We'll send it directly to your inbox.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94A3B8",
              padding: "4px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "#F0FDF4", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 16px",
              }}>
                <Mail size={28} color="#22C55E" />
              </div>
              <h4 style={{
                fontSize: "18px", fontWeight: 700, color: "#1A1F5E",
                margin: "0 0 8px", fontFamily: "var(--font-poppins), sans-serif",
              }}>
                Request Received!
              </h4>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 4px" }}>
                We'll send the brochure to <strong>{form.email}</strong>
              </p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
                Check your inbox (and spam folder).
              </p>
              <button
                onClick={onClose}
                style={{
                  marginTop: "24px",
                  padding: "10px 24px",
                  border: "2px solid #1A1F5E",
                  borderRadius: "12px",
                  background: "none",
                  color: "#1A1F5E",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Full Name */}
              <div>
                <label style={{
                  display: "block", fontSize: "12px", fontWeight: 600, textAlign: "left",
                  color: "#4B5563", marginBottom: "6px",
                }}>
                  Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  autoComplete="name"
                  style={{
                    width: "100%", padding: "12px 16px", fontSize: "14px",
                    border: "1px solid #E5E7EB", borderRadius: "12px",
                    background: "#F9FAFB", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", color: "#111827",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00C2E0")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: "block", fontSize: "12px", fontWeight: 600, textAlign: "left",
                  color: "#4B5563", marginBottom: "6px",
                }}>
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                  autoComplete="email"
                  style={{
                    width: "100%", padding: "12px 16px", fontSize: "14px", 
                    border: "1px solid #E5E7EB", borderRadius: "12px",
                    background: "#F9FAFB", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", color: "#111827",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00C2E0")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{
                  display: "block", fontSize: "12px", fontWeight: 600, textAlign: "left",
                  color: "#4B5563", marginBottom: "6px",
                }}>
                  Phone (optional)
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  autoComplete="tel"
                  style={{
                    width: "100%", padding: "12px 16px", fontSize: "14px",
                    border: "1px solid #E5E7EB", borderRadius: "12px",
                    background: "#F9FAFB", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", color: "#111827",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00C2E0")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background: loading
                    ? "#94A3B8"
                    : "linear-gradient(135deg, #00C2E0 0%, #2B5CE6 100%)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontFamily: "inherit",
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "Sending..." : <><Send size={15} /> Send Brochure to My Email</>}
              </button>

              <p style={{ fontSize: "10px", color: "#9CA3AF", textAlign: "center", margin: 0 }}>
                We respect your privacy. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
