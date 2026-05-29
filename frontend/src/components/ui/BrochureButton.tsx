"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import BrochureModal from "@/components/ui/BrochureModal";

interface Props {
  label?: string;
  className?: string;
  variant?: "primary" | "outline" | "outline-dark";
}

export default function BrochureButton({
  label = "Download Brochure",
  className,
  variant = "outline",
}: Props) {
  const [brochureOpen, setBrochureOpen] = useState(false);

  const variantClass =
    variant === "primary"      ? "btn-primary" :
    variant === "outline-dark" ? "btn-outline-dark" :
    "btn-outline";

  // className is additive — it extends the variant base, not replaces it
  const finalClass = className ? `${variantClass} ${className}` : variantClass;

  return (
    <>
      <button
        onClick={() => setBrochureOpen(true)}
        className={`${finalClass} justify-center`}
        aria-label="Download brochure"
      >
        <Download size={16} /> {label}
      </button>
      <BrochureModal isOpen={brochureOpen} onClose={() => setBrochureOpen(false)} />
    </>
  );
}
