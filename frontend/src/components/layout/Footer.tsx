import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Facebook, Youtube } from "lucide-react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/cms";

const services = [
  { label: "Single Entry Weighing",  href: "/services/single-entry-weighing" },
  { label: "Double Entry Weighing",  href: "/services/double-entry-weighing" },
  { label: "Pharma Weighing",        href: "/services/pharma-industry-services" },
  { label: "All Services",           href: "/services/other-services" },
];

interface FooterProps {
  settings?: SiteSettings;
}

const defaultSettings: SiteSettings = {
  company_name: "Privya Solution LLP",
  phone:        "+91-9904095104",
  email:        "privyasolution@gmail.com",
  address:      "Surat, Gujarat, India",
  whatsapp:     "919904095104",
  tagline:      "Precision weighing and pharma automation solutions for industries that demand accuracy, compliance, and traceability.",
  linkedin:     "#",
  facebook:     "#",
  youtube:      "#",
  brochure_url: "privya-solution-brochure.pdf",
};

export default function Footer({ settings = defaultSettings }: FooterProps) {
  const s = { ...defaultSettings, ...settings };

  return (
    <footer className="bg-brand-darker text-gray-400">
      <div className="container-max section-padding grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <Link href="/" className="mb-5 inline-block">
            <div className="bg-white rounded-xl px-3 py-2 inline-flex items-center">
              <Image src="/priya-logo1.svg" alt={s.company_name} width={140} height={42} className="object-contain" />
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-5">{s.tagline}</p>
          <div className="flex gap-3">
            {[
              { Icon: Linkedin, href: s.linkedin, label: "LinkedIn" },
              { Icon: Facebook, href: s.facebook, label: "Facebook" },
              { Icon: Youtube,  href: s.youtube,  label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center
                           hover:border-brand-cyan hover:text-brand-cyan transition-all duration-200">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {services.map((svc) => (
              <li key={svc.href}>
                <Link href={svc.href} className="hover:text-brand-cyan transition-colors duration-150">{svc.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Home",    href: "/" },
              { label: "About",   href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-cyan transition-colors duration-150">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact — dynamic */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-start gap-2.5 hover:text-brand-cyan transition-colors duration-150">
                <Phone size={14} className="text-brand-cyan mt-0.5 flex-shrink-0" /> {s.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`}
                className="flex items-start gap-2.5 hover:text-brand-cyan transition-colors duration-150">
                <Mail size={14} className="text-brand-cyan mt-0.5 flex-shrink-0" /> {s.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-brand-cyan mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{s.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-max px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} {s.company_name}. All rights reserved.</span>
          <span>Weighing & Pharma Automation · Surat, Gujarat, India</span>
        </div>
      </div>
    </footer>
  );
}
