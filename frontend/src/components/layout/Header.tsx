"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const services = [
  { label: "Pharma Weighing",        href: "/services/pharma-industry-services", desc: "ALCOA+ & GxP compliant systems" },
  { label: "Single Entry Weighing",  href: "/services/single-entry-weighing",    desc: "Fast, accurate single-point weighbridge" },
  { label: "Double Entry Weighing",  href: "/services/double-entry-weighing",    desc: "Drive-through dual-weighment with ANPR" },
  { label: "All Services",           href: "/services/other-services",           desc: "Checkweighers, crane scales & more" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [phone, setPhone]                   = useState("+91-9904095104");
  const [email, setEmail]                   = useState("privyasolution@gmail.com");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Fetch contact info from CMS settings
  useEffect(() => {
    fetch(`${API}/api/cms/public/settings`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.settings) {
          if (d.settings.phone) setPhone(d.settings.phone);
          if (d.settings.email) setEmail(d.settings.email);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className={`site-header sticky top-0 z-50 transition-all duration-300 bg-white
       ${
      scrolled ? "shadow-header" : "border-b border-gray-100"
    }`}>

      {/* Top contact bar — dynamic from CMS */}
      <div className="hidden lg:flex items-center justify-end gap-6 px-8 py-1.5 bg-brand-navy text-xs text-gray-300">
        <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-1.5 hover:text-brand-cyan transition-colors duration-150">
          <Phone size={11} className="text-brand-cyan" /> {phone}
        </a>
        <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-brand-cyan transition-colors duration-150">
          <Mail size={11} className="text-brand-cyan" /> {email}
        </a>
      </div>

      {/* Main nav — white background, dark text */}
      <div className="container-max flex items-center justify-between px-4 py-2.5 md:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image src="/logo-darkmode.svg" alt="Privya Solution LLP" width={140} height={42} priority className="object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600">
          <Link href="/" className="nav-link px-3 py-2 rounded-lg hover:text-brand-navy hover:bg-brand-surface transition-colors duration-150">
            Home
          </Link>
          <Link href="/about" className="nav-link px-3 py-2 rounded-lg hover:text-brand-navy hover:bg-brand-surface transition-colors duration-150">
            About
          </Link>

          {/* Services dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-brand-navy hover:bg-brand-surface transition-colors duration-150 text-gray-600">
              Services <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
            </button>
            {/* Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-card-lg border border-gray-100
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            translate-y-1 group-hover:translate-y-0
                            transition-all duration-200 z-50 overflow-hidden">
              <div className="p-2">
                {services.map((s) => (
                  <Link key={s.href} href={s.href}
                    className="flex flex-col px-4 py-3 rounded-xl hover:bg-brand-surface transition-colors duration-150 group/item">
                    <span className="font-semibold text-brand-navy text-sm group-hover/item:text-brand-electric transition-colors">{s.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{s.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/contact" className="nav-link px-3 py-2 rounded-lg hover:text-brand-navy hover:bg-brand-surface transition-colors duration-150">
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact" className="btn-primary text-sm py-2 px-5">
            Request Demo
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-brand-navy p-1.5 rounded-lg hover:bg-brand-surface transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-5 pt-2 space-y-1 animate-slide-down">
          <Link href="/" className="block px-3 py-2.5 text-sm text-gray-700 hover:text-brand-navy rounded-lg hover:bg-brand-surface transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/about" className="block px-3 py-2.5 text-sm text-gray-700 hover:text-brand-navy rounded-lg hover:bg-brand-surface transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
          <button
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-gray-700 hover:text-brand-navy rounded-lg hover:bg-brand-surface transition-colors"
            onClick={() => setMobileServices(!mobileServices)}>
            Services <ChevronDown size={13} className={`transition-transform duration-200 ${mobileServices ? "rotate-180" : ""}`} />
          </button>
          {mobileServices && (
            <div className="pl-4 space-y-1 animate-slide-down">
              {services.map((s) => (
                <Link key={s.href} href={s.href}
                  className="block px-3 py-2 text-sm text-gray-500 hover:text-brand-electric rounded-lg hover:bg-brand-surface transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  {s.label}
                </Link>
              ))}
            </div>
          )}
          <Link href="/contact" className="block px-3 py-2.5 text-sm text-gray-700 hover:text-brand-navy rounded-lg hover:bg-brand-surface transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
          <div className="pt-2">
            <Link href="/contact" className="btn-primary w-full justify-center text-sm" onClick={() => setMobileOpen(false)}>
              Request Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
