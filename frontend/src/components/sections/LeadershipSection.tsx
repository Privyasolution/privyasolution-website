"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import type { CmsLeadershipMember } from "@/lib/cms";

// ── Layout constants ──────────────────────────────────────────────────────────
const CARD_W = 265;
const GAP    = 28;   // matches gap-7
const STEP   = CARD_W + GAP;

function getVisibleCount(w: number): number {
  if (w < 640)  return 1;
  if (w < 1024) return 2;
  if (w < 1280) return 3;
  return 4;
}

// ── Framer Motion variants ────────────────────────────────────────────────────
const headingVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const gridVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 44, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ── Social icon button ────────────────────────────────────────────────────────
function SocialBtn({
  href, label, hoverClass, children,
}: {
  href: string; label: string; hoverClass: string; children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className={`w-7 h-7 rounded-full bg-white/15 flex items-center justify-center
                  flex-shrink-0 transition-all duration-200 ${hoverClass}`}
    >
      {children}
    </a>
  );
}

// ── Portrait card ─────────────────────────────────────────────────────────────
function LeadershipCard({ member }: { member: CmsLeadershipMember }) {
  const initials = member.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasSocials = !!(
    member.linkedin_url || member.twitter_url ||
    member.instagram_url || member.facebook_url
  );
  const hasReveal = !!(member.bio || hasSocials);

  return (
    <div
      className="group relative w-full rounded-2xl overflow-hidden cursor-default select-none
                 shadow-[0_4px_24px_rgba(26,31,94,0.10)]
                 hover:shadow-[0_16px_56px_rgba(26,31,94,0.22)]
                 transition-shadow duration-500"
    >
      {/* ── 3 : 4 portrait ──────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] overflow-hidden
                      bg-gradient-to-br from-[#141C35] via-[#1A1F5E] to-[#2B5CE6]">

        {/* Profile image or initials avatar */}
        {member.profile_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.profile_image}
            alt={`${member.full_name} — ${member.designation}`}
            className="absolute inset-0 w-full h-full object-cover object-top
                       transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-full bg-white/10 ring-2 ring-white/20
                            flex items-center justify-center
                            transition-transform duration-500 group-hover:scale-105">
              <span className="text-white font-bold text-3xl tracking-tight">{initials}</span>
              <span className="absolute inset-0 rounded-full ring-4 ring-brand-cyan/0 opacity-0
                               scale-100 group-hover:ring-brand-cyan/40 group-hover:opacity-100
                               group-hover:scale-125 transition-all duration-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Permanent bottom scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15
                        to-transparent pointer-events-none" />
        {/* Hover tint */}
        <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100
                        transition-opacity duration-500 pointer-events-none" />

        {/* Featured badge */}
        {member.is_featured && (
          <div className="absolute top-3.5 left-3.5 z-20">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full
                         text-[9px] font-bold tracking-[0.12em] uppercase text-white"
              style={{ background: "linear-gradient(135deg,#00C2E0 0%,#2B5CE6 100%)" }}
            >
              ★ Director
            </span>
          </div>
        )}

        {/* Bottom content panel */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pt-8 pb-5">
          <h3 className="font-heading font-bold text-white text-[17px] leading-snug tracking-tight">
            {member.full_name}
          </h3>
          <p className="text-brand-cyan text-[10px] font-bold tracking-[0.16em] uppercase mt-1.5">
            {member.designation}
          </p>

          {/* Divider that expands left → right on hover */}
          <div className="mt-3 h-px w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full w-full origin-left scale-x-0 group-hover:scale-x-100
                         transition-transform duration-500 ease-out rounded-full"
              style={{ background: "linear-gradient(90deg,#00C2E0,#2B5CE6)" }}
              aria-hidden="true"
            />
          </div>

          {/* Bio + socials — revealed on hover */}
          {hasReveal && (
            <div className="max-h-0 group-hover:max-h-36 overflow-hidden
                            transition-all duration-500 ease-out">
              {member.bio && (
                <p className="text-white/70 text-[11px] leading-relaxed mt-3 line-clamp-3">
                  {member.bio}
                </p>
              )}
              {hasSocials && (
                <div className="flex items-center gap-2.5 mt-3">
                  {member.linkedin_url && (
                    <SocialBtn href={member.linkedin_url}
                      label={`${member.full_name} on LinkedIn`}
                      hoverClass="hover:bg-[#0077B5]">
                      <Linkedin size={11} className="text-white" />
                    </SocialBtn>
                  )}
                  {member.twitter_url && (
                    <SocialBtn href={member.twitter_url}
                      label={`${member.full_name} on X / Twitter`}
                      hoverClass="hover:bg-sky-500">
                      <Twitter size={11} className="text-white" />
                    </SocialBtn>
                  )}
                  {member.instagram_url && (
                    <SocialBtn href={member.instagram_url}
                      label={`${member.full_name} on Instagram`}
                      hoverClass="hover:bg-pink-500">
                      <Instagram size={11} className="text-white" />
                    </SocialBtn>
                  )}
                  {member.facebook_url && (
                    <SocialBtn href={member.facebook_url}
                      label={`${member.full_name} on Facebook`}
                      hoverClass="hover:bg-blue-600">
                      <Facebook size={11} className="text-white" />
                    </SocialBtn>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card border glow */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10
                        group-hover:ring-brand-cyan/35 transition-all duration-500
                        pointer-events-none z-20" />
      </div>
    </div>
  );
}

// ── Slider / centered grid ────────────────────────────────────────────────────
function LeadershipSlider({ members }: { members: CmsLeadershipMember[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4); // SSR-safe default (largest)

  // Sync visibleCount to actual window width after hydration
  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex  = Math.max(0, members.length - visibleCount);
  const safeIndex = Math.min(currentIndex, maxIndex);
  const offset    = safeIndex * STEP;
  const canPrev   = safeIndex > 0;
  const canNext   = safeIndex < maxIndex;

  // ── When all cards fit: centered staggered grid ───────────────────────────
  if (members.length <= visibleCount) {
    return (
      <motion.div
        className="flex flex-wrap justify-center gap-6 md:gap-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={gridVariants}
      >
        {members.map((member) => (
          <motion.div key={member.id} variants={cardVariants} style={{ width: CARD_W }}>
            <LeadershipCard member={member} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // ── When cards overflow: animated slider ──────────────────────────────────
  const goTo = (i: number) => setCurrentIndex(Math.max(0, Math.min(maxIndex, i)));

  return (
    <div>
      {/* Track */}
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: GAP }}
          animate={{ x: -offset }}
          transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
        >
          {members.map((member) => (
            <div key={member.id} style={{ width: CARD_W, flexShrink: 0 }}>
              <LeadershipCard member={member} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls — prev · dots · next */}
      <div className="flex items-center justify-center gap-5 mt-9">

        <button
          onClick={() => goTo(safeIndex - 1)}
          disabled={!canPrev}
          aria-label="Previous members"
          className="w-10 h-10 rounded-full flex items-center justify-center
                     border-2 border-brand-navy/20 text-brand-navy
                     hover:bg-brand-navy hover:text-white hover:border-brand-navy
                     disabled:opacity-25 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to position ${i + 1}`}
              className={`rounded-full transition-all duration-300
                ${safeIndex === i
                  ? "w-6 h-2 bg-brand-cyan"
                  : "w-2 h-2 bg-gray-300 hover:bg-brand-navy/40"
                }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(safeIndex + 1)}
          disabled={!canNext}
          aria-label="Next members"
          className="w-10 h-10 rounded-full flex items-center justify-center
                     border-2 border-brand-navy/20 text-brand-navy
                     hover:bg-brand-navy hover:text-white hover:border-brand-navy
                     disabled:opacity-25 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
}

// ── Section export ────────────────────────────────────────────────────────────
interface Props {
  /** Only CMS data — no fallback dummy entries */
  members: CmsLeadershipMember[];
}

export default function LeadershipSection({ members }: Props) {
  // Section is fully hidden until real members are added via admin
  if (members.length === 0) return null;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="leadership-heading"
    >
      {/* ── Background ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4F6FF] via-white to-[#F4F6FF]" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, #1A1F5E 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/35 to-transparent" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-navy/10 to-transparent" aria-hidden="true" />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative container-max px-4 md:px-8 lg:px-16 xl:px-24">

        {/* Section heading */}
        <motion.div
          id="leadership-heading"
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={headingVariants}
        >
          <p className="section-tag">Our People</p>
          <h2 className="section-title mb-4">Executive Leadership</h2>

          {/* No max-width — wraps only when the full container width is exceeded */}
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            The visionaries driving Privya Solution&apos;s mission of precision,
            innovation, and compliance excellence.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-7" aria-hidden="true">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-cyan/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan/60" />
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#00C2E0,#2B5CE6)" }}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-cyan/50" />
          </div>
        </motion.div>

        {/* Slider or centered grid */}
        <LeadershipSlider members={members} />

      </div>
    </section>
  );
}
