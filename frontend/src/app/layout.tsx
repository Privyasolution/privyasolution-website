import type { Metadata } from "next";
import { Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SiteShell from "@/components/layout/SiteShell";
import FooterServer from "@/components/layout/FooterServer";
import RouteProgressBar from "@/components/layout/RouteProgressBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Privya Solution LLP – Weighing & Pharma Automation Experts",
  description:
    "Advanced weighing scales, pharma weighing solutions, checkweighers & automation systems. Accurate, compliant & audit-ready. Surat, Gujarat.",
  metadataBase: new URL("https://privyasolution.com"),
  openGraph: { siteName: "Privya Solution LLP", type: "website" },
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-white text-gray-900 antialiased" suppressHydrationWarning>
        <RouteProgressBar />
        {/* FooterServer is a server component passed as prop — avoids hydration issues */}
        <SiteShell footer={<FooterServer />}>
          {children}
        </SiteShell>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: "Inter, sans-serif", fontSize: "14px" },
            success: { iconTheme: { primary: "#00C2E0", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
