import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter, Poppins, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SyncProvider from "@/components/SyncProvider";
import PwaRegister from "@/components/PwaRegister";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nihongo Reviewer",
  description: "Learn Japanese from hiragana to JLPT N1. Tap and speak, no typing needed.",
  applicationName: "Nihongo Reviewer",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Nihongo", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${notoSansJP.variable}`}>
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased dark:bg-[#090d16] dark:text-slate-50">
        <SyncProvider />
        <PwaRegister />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
