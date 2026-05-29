"use client";

import { useState, useEffect } from "react";
import {
  Home, Info, Wrench, Phone, Layers, Star,
  HelpCircle, Settings, Mail, ArrowRight, CheckCircle2,
} from "lucide-react";

type DashboardStats = { total: number; unread: number; today: number };

type Section =
  | "home" | "about" | "other-services" | "contact"
  | "services" | "testimonials" | "faqs"
  | "inquiries" | "settings";

type Props = {
  apiBase: string;
  onNavigate: (section: Section) => void;
};

const QUICK_LINKS: { label: string; desc: string; section: Section; icon: React.ElementType }[] = [
  { label: "Home Page",      desc: "Hero text, value props, stats",     section: "home",           icon: Home },
  { label: "About Page",     desc: "Mission, vision, body copy, stats", section: "about",          icon: Info },
  { label: "Other Services", desc: "Catalog text, capabilities, CTA",   section: "other-services", icon: Wrench },
  { label: "Contact Page",   desc: "Hero headline and subtext",         section: "contact",        icon: Phone },
  { label: "Services",       desc: "Main navigation service cards",     section: "services",       icon: Layers },
  { label: "Testimonials",   desc: "Customer reviews and ratings",      section: "testimonials",   icon: Star },
  { label: "FAQs",           desc: "Questions and answers by page",     section: "faqs",           icon: HelpCircle },
  { label: "Site Settings",  desc: "Phone, email, address, social",     section: "settings",       icon: Settings },
];

const CONTENT_GUIDE = [
  'To edit any page text → use the "Website Pages" section in the sidebar.',
  'To update phone number, email, or address → go to Site Settings.',
  'To add customer reviews → go to Shared Content → Testimonials.',
  'To respond to a contact inquiry → go to Admin → Inquiries.',
  'Stats shown on the website (e.g. "500+ Installations") → go to the relevant page editor, Stats tab.',
];

export default function AdminDashboard({ apiBase, onNavigate }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch(`${apiBase}/api/admin/stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, [apiBase]);

  return (
    <div className="space-y-7 max-w-4xl">

      {/* Welcome */}
      <div>
        <h2 className="font-heading font-bold text-brand-navy text-xl">Welcome to Privya CMS</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage all your website content from one place.</p>
      </div>

      {/* Inquiry stats */}
      {stats && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Inquiries</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total",  value: stats.total,  color: "text-brand-navy" },
              { label: "Unread", value: stats.unread, color: "text-brand-cyan" },
              { label: "Today",  value: stats.today,  color: "text-brand-electric" },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => onNavigate("inquiries")}
                className="bg-white rounded-2xl shadow-card p-5 text-left hover:shadow-card-lg transition-shadow group"
              >
                <p className={`font-heading font-black text-4xl ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                <p className="text-[10px] text-gray-300 group-hover:text-brand-cyan transition-colors mt-2">
                  View all →
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick access */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Access</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ label, desc, section, icon: Icon }) => (
            <button
              key={section}
              onClick={() => onNavigate(section)}
              className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:shadow-card-lg transition-shadow text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-brand-navy" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-navy leading-tight">{label}</p>
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5 line-clamp-2">{desc}</p>
              </div>
              <ArrowRight
                size={13}
                className="ml-auto text-gray-200 group-hover:text-brand-cyan transition-colors flex-shrink-0"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Content guide */}
      <div className="bg-brand-light rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Content Guide</p>
        <ul className="space-y-2.5">
          {CONTENT_GUIDE.map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-xs text-gray-600">
              <CheckCircle2 size={13} className="text-brand-cyan mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
