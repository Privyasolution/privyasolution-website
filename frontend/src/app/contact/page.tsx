import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { getSettings, getFaqs } from "@/lib/cms";
import { FALLBACK_CONTACT_FAQS } from "@/constants/fallback-contact";

export const metadata: Metadata = {
  title: "Contact Privya Solution | Get a Demo",
  description: "Contact us for weighing solutions, pharma systems, and automation services. Request a demo today.",
};

export default async function ContactPage() {
  const [settings, cmsFaqs] = await Promise.all([
    getSettings(),
    getFaqs("contact"),
  ]);

  const faqs = cmsFaqs.length > 0
    ? cmsFaqs.map((f) => ({ question: f.question, answer: f.answer }))
    : FALLBACK_CONTACT_FAQS;

  const waLink = `https://wa.me/${settings.whatsapp}?text=Hello%20I%20am%20interested%20in%20your%20weighing%20solutions`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${settings.company_name}`,
    url: "https://privyasolution.com/contact",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-hero-gradient text-white section-padding text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern bg-[size:28px_28px] pointer-events-none" />
        <div className="relative container-max max-w-2xl">
          <p className="section-tag">Get in Touch</p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Contact Us</h1>
          <p className="text-gray-300 text-sm">
            Get in touch with {settings.company_name} for advanced weighing systems, automation solutions, and pharma compliance services. Our team will get back to you shortly.
          </p>
        </div>
      </section>

      <section className="section-padding bg-section-gradient">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info — dynamic from CMS settings */}
          <div className="space-y-6">
            <div>
              <p className="section-tag">Contact Details</p>
              <h2 className="font-heading font-bold text-xl text-brand-navy mb-5">Reach Us Directly</h2>
            </div>

            {[
              { Icon: Phone,  label: "Phone",   value: settings.phone,   href: `tel:${settings.phone.replace(/[^+\d]/g, "")}` },
              { Icon: Mail,   label: "Email",   value: settings.email,   href: `mailto:${settings.email}` },
              { Icon: MapPin, label: "Address", value: settings.address, href: undefined },
              { Icon: Clock,  label: "Hours",   value: "Mon–Sat, 9 AM – 7 PM", href: undefined },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-brand-navy" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-brand-navy hover:text-brand-electric transition-colors font-medium break-all">{value}</a>
                  ) : (
                    <p className="text-sm text-brand-navy font-medium break-words">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>

            {/* FAQs — dynamic */}
            <div className="pt-4 border-t border-gray-100">
              <p className="font-semibold text-brand-navy text-sm mb-4">Quick Answers</p>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <p className="flex items-start gap-2 text-xs font-semibold text-brand-navy">
                      <CheckCircle2 size={13} className="text-brand-cyan mt-0.5 flex-shrink-0" /> {faq.question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 pl-5">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
