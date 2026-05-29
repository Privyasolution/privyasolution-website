"use client";
import { useState } from "react";
import { MessageCircle, Download, ClipboardList } from "lucide-react";
import Link from "next/link";
import BrochureModal from "@/components/ui/BrochureModal";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919904095104";

export default function FloatingButtons() {
  const [brochureOpen, setBrochureOpen] = useState(false);
  console.log("WhatsApp Number:", WA_NUMBER);

  return (
    <>
      <div className="floating-buttons fixed bottom-6 right-4 flex flex-col gap-3 z-50">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%20am%20interested%20in%20your%20weighing%20solutions`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200"
        >
          <span className="absolute right-14 hidden sm:block bg-gray-900 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp
          </span>
          <MessageCircle size={20} />
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30 pointer-events-none" />
        </a>

        {/* Request Demo */}
        <Link
          href="/contact"
          aria-label="Request Demo"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-brand-navy text-white shadow-blue hover:bg-brand-electric hover:scale-110 transition-all duration-200"
        >
          <span className="absolute right-14 hidden sm:block bg-gray-900 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Request Demo
          </span>
          <ClipboardList size={20} />
        </Link>

        {/* Brochure — opens modal */}
        <button
          onClick={() => setBrochureOpen(true)}
          aria-label="Download Brochure"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full text-white shadow-cyan hover:shadow-glow hover:scale-110 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #00C2E0, #2B5CE6)" }}
        >
          <span className="absolute right-14 hidden sm:block bg-gray-900 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Brochure
          </span>
          <Download size={20} />
        </button>
      </div>

      <BrochureModal isOpen={brochureOpen} onClose={() => setBrochureOpen(false)} />
    </>
  );
}
