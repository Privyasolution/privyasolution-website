"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  LayoutDashboard, Home, Info, Wrench, Phone,
  Layers, Star, HelpCircle, Mail, Settings,
  LogOut, RefreshCw, Menu, X, Eye, EyeOff, FileText, Users2, UserCircle2,
} from "lucide-react";

import AdminDashboard        from "@/components/admin/AdminDashboard";
import AdminHomePage         from "@/components/admin/AdminHomePage";
import AdminAboutPage        from "@/components/admin/AdminAboutPage";
import AdminOtherServicesPage from "@/components/admin/AdminOtherServicesPage";
import AdminServicePages     from "@/components/admin/AdminServicePages";
import AdminContactPage      from "@/components/admin/AdminContactPage";
import AdminServices         from "@/components/admin/AdminServices";
import AdminTestimonials     from "@/components/admin/AdminTestimonials";
import AdminFAQs             from "@/components/admin/AdminFAQs";
import AdminInquiries        from "@/components/admin/AdminInquiries";
import AdminSettings         from "@/components/admin/AdminSettings";
import AdminClients          from "@/components/admin/AdminClients";
import AdminLeadershipTeam   from "@/components/admin/AdminLeadershipTeam";

const API_BASE       = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const ADMIN_EMAIL    = "sweety@inventam.com";
const ADMIN_PASSWORD = "Privya@1234";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Section =
  | "dashboard"
  | "home" | "about" | "service-pages" | "other-services" | "contact"
  | "services" | "testimonials" | "faqs" | "clients" | "leadership"
  | "inquiries" | "settings";

type NavItem = {
  id: Section;
  label: string;
  icon: React.ElementType;
  badge?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

// ── Navigation definition ─────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Website Pages",
    items: [
      { id: "home",           label: "Home Page",      icon: Home },
      { id: "about",          label: "About Page",      icon: Info },
      { id: "service-pages",  label: "Service Pages",   icon: FileText },
      { id: "other-services", label: "Other Services",  icon: Wrench },
      { id: "contact",        label: "Contact Page",   icon: Phone },
    ],
  },
  {
    label: "Shared Content",
    items: [
      { id: "services",     label: "Services",     icon: Layers },
      { id: "testimonials", label: "Testimonials", icon: Star },
      { id: "faqs",         label: "FAQs",         icon: HelpCircle },
      { id: "clients",      label: "Clients",        icon: Users2 },
      { id: "leadership",   label: "Leadership Team", icon: UserCircle2 },
    ],
  },
  {
    label: "Admin",
    items: [
      { id: "inquiries", label: "Inquiries",    icon: Mail,     badge: true },
      { id: "settings",  label: "Site Settings", icon: Settings },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [loginError, setLoginError]           = useState("");
  const [activeSection, setActiveSection]     = useState<Section>("dashboard");
  const [unreadCount, setUnreadCount]         = useState(0);
  const [sidebarOpen, setSidebarOpen]         = useState(false);

  const fetchUnread = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/admin/stats`);
      if (r.ok) {
        const d = await r.json();
        setUnreadCount(d.unread ?? 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchUnread();
  }, [isAuthenticated, fetchUnread]);

  const handleLogin = () => {
    setLoginError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setUnreadCount(0);
    setActiveSection("dashboard");
  };

  const navigate = (section: Section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // ── Login screen ─────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-card-lg p-8 w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Image
              src="/priya-logo1.svg"
              alt="Privya Solution LLP"
              width={140}
              height={42}
              className="object-contain"
            />
          </div>
          <h1 className="font-heading font-bold text-xl text-brand-navy text-center mb-1">
            Admin Login
          </h1>
          <p className="text-xs text-gray-400 text-center mb-6">
            Sign in with your admin credentials
          </p>

          {loginError && (
            <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 rounded-lg">
              {loginError}
            </p>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field mb-4"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="input-field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button onClick={handleLogin} className="btn-primary w-full justify-center">
            Login
          </button>
        </div>
      </div>
    );
  }

  // ── Admin shell ──────────────────────────────────────────────────────────

  const sectionLabel = ALL_ITEMS.find((i) => i.id === activeSection)?.label || "";

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-brand-navy flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="bg-white rounded-xl px-2 py-1.5 inline-flex">
            <Image
              src="/priya-logo1.svg"
              alt="Privya Solution LLP"
              width={130}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ id, label, icon: Icon, badge }) => (
                  <button
                    key={id}
                    onClick={() => navigate(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                      ${
                        activeSection === id
                          ? "bg-white/15 text-white"
                          : "text-gray-400 hover:bg-white/8 hover:text-white"
                      }`}
                  >
                    <Icon size={15} />
                    {label}
                    {badge && unreadCount > 0 && (
                      <span className="ml-auto text-[10px] bg-brand-cyan text-white rounded-full px-1.5 py-0.5 font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-white/10 space-y-0.5 flex-shrink-0">
          <button
            onClick={fetchUnread}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/8 transition-colors"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/8 transition-colors"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:px-6 flex-shrink-0">
          <button
            className="lg:hidden text-gray-500 flex-shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="font-heading font-semibold text-brand-navy text-sm truncate">
            {sectionLabel}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto min-h-0">
          {activeSection === "dashboard"       && <AdminDashboard         apiBase={API_BASE} onNavigate={navigate} />}
          {activeSection === "home"            && <AdminHomePage          apiBase={API_BASE} />}
          {activeSection === "about"           && <AdminAboutPage         apiBase={API_BASE} />}
          {activeSection === "service-pages"   && <AdminServicePages      apiBase={API_BASE} />}
          {activeSection === "other-services"  && <AdminOtherServicesPage apiBase={API_BASE} />}
          {activeSection === "contact"         && <AdminContactPage       apiBase={API_BASE} />}
          {activeSection === "services"        && <AdminServices          apiBase={API_BASE} />}
          {activeSection === "testimonials"    && <AdminTestimonials      apiBase={API_BASE} />}
          {activeSection === "faqs"            && <AdminFAQs              apiBase={API_BASE} />}
          {activeSection === "clients"         && <AdminClients           apiBase={API_BASE} />}
          {activeSection === "leadership"      && <AdminLeadershipTeam    apiBase={API_BASE} />}
          {activeSection === "inquiries"       && <AdminInquiries         apiBase={API_BASE} onStatsChange={fetchUnread} />}
          {activeSection === "settings"        && <AdminSettings          apiBase={API_BASE} />}
        </main>
      </div>
    </div>
  );
}
