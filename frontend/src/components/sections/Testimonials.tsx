"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CmsTestimonial } from "@/lib/cms";

interface Props {
  testimonials: CmsTestimonial[];
}

export default function Testimonials({ testimonials }: Props) {
  const [current, setCurrent] = useState(0);

  if (!testimonials.length) return null;

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="section-padding bg-brand-darker overflow-hidden">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="section-tag">Testimonials</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Hear from the companies that rely on Privya Solution every day.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10"
            >
              <Quote size={28} className="text-brand-cyan/40 mb-4" />
              <p className="text-gray-200 text-lg leading-relaxed mb-6 italic">
                "{testimonials[current].quote}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold text-white">{testimonials[current].author}</p>
                  <p className="text-sm text-gray-400">
                    {testimonials[current].role}
                    {testimonials[current].company ? ` · ${testimonials[current].company}` : ""}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonials[current].rating || 5 }).map((_, i) => (
                    <Star key={i} size={13} className="text-brand-cyan fill-brand-cyan" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} aria-label="Previous"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} aria-label={`Testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-brand-cyan w-6" : "bg-white/30 w-2"}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
