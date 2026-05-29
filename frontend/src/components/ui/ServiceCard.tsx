import Link from "next/link";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  badge?: string;
  hasPage?: boolean; // false = no detail page, hide "Learn more" link
}

const cardClass =
  "group relative flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 transition-all duration-300 overflow-hidden";

const hoverClass =
  "hover:border-brand-cyan/30 hover:shadow-card-lg hover:-translate-y-1.5";

function CardInner({ title, description, Icon, badge }: Omit<ServiceCardProps, "href" | "hasPage">) {
  return (
    <>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(0,194,224,0.03) 0%, rgba(43,92,230,0.04) 100%)" }} />
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-brand-surface flex items-center justify-center group-hover:bg-brand-navy transition-colors duration-300">
          <Icon size={22} className="text-brand-navy group-hover:text-white transition-colors duration-300" />
        </div>
        {badge && <span className="badge-cyan text-[10px]">{badge}</span>}
        <ArrowUpRight size={16}
          className="text-gray-300 group-hover:text-brand-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
      </div>
      <h3 className="font-heading font-semibold text-base text-gray-900 group-hover:text-brand-navy transition-colors leading-snug">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed flex-1">{description}</p>
    </>
  );
}

export default function ServiceCard({ title, description, href, Icon, badge, hasPage = true }: ServiceCardProps) {
  if (hasPage) {
    return (
      <Link href={href} className={`${cardClass} ${hoverClass}`}>
        <CardInner title={title} description={description} Icon={Icon} badge={badge} />
        <span className="text-xs font-semibold text-brand-electric flex items-center gap-1 mt-auto group-hover:text-brand-cyan transition-colors">
          Learn more <ArrowUpRight size={12} />
        </span>
      </Link>
    );
  }

  // No detail page — non-clickable card, no "Learn more"
  return (
    <div className={`${cardClass} cursor-default`}>
      <CardInner title={title} description={description} Icon={Icon} badge={badge} />
      <span className="text-xs text-gray-300 mt-auto">Contact us for details</span>
    </div>
  );
}
