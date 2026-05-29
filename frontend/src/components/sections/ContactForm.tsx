"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Send } from "lucide-react";

const SERVICE_OPTIONS = [
  "Single Entry Weighing",
  "Double Entry Weighing",
  "Pharma Weighing Solutions",
  "Checkweigher",
  "Tank / Hopper Weighing",
  "Crane Scale",
  "Bagging / Filling Machine",
  "Weighing API Integration",
  "Other",
];

const TIME_OPTIONS = ["Morning (9–12)", "Afternoon (12–5)", "Evening (5–7)"];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    service_interest: "", message: "", preferred_time: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/inquiries`, form);
      toast.success("Thank you! Your inquiry has been submitted successfully.");
      setForm({ name: "", company: "", email: "", phone: "", service_interest: "", message: "", preferred_time: "" });
    } catch {
      toast.error("Something went wrong. Please try again or call +91-9904095104");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
      <div>
        <h3 className="font-heading font-bold text-xl text-brand-navy mb-1">Send Us a Message</h3>
        <p className="text-sm text-gray-400">We'll get back to you soon.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company *</label>
          <input name="company" value={form.company} onChange={handleChange} required className="input-field" placeholder="Company name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="you@company.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="+91 XXXXX XXXXX" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Service Interest</label>
        <select name="service_interest" value={form.service_interest} onChange={handleChange} className="input-field">
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Tell us about your requirement..." />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Preferred Contact Time</label>
        <select name="preferred_time" value={form.preferred_time} onChange={handleChange} className="input-field">
          <option value="">Select preferred time</option>
          {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? "Sending..." : <><Send size={15} /> Send Inquiry</>}
      </button>
    </form>
  );
}
