"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import FloatingButtons from "@/components/layout/FloatingButtons";

// FooterServer is a server component — imported directly (not via dynamic)
// SiteShell is client-only for pathname detection; children (including FooterServer) render server-side
export default function SiteShell({ children, footer }: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && footer}
      {!isAdmin && <FloatingButtons />}
    </>
  );
}
