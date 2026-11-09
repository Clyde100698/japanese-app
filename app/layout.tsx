import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter, Poppins, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SyncProvider from "@/components/SyncProvider";
import PwaRegister from "@/components/PwaRegister";
import HeaderControls from "@/components/HeaderControls";

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
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-2.5 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm dark:bg-blue-500">
                あ
              </span>
              <span className="font-heading text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Nihongo<span className="text-blue-600 dark:text-blue-400">.app</span>
              </span>
            </Link>
            <HeaderControls />
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 pb-28 pt-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
