import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SyncProvider from "@/components/SyncProvider";

export const metadata: Metadata = {
  title: "Nihongo Reviewer",
  description: "Learn Japanese from hiragana to JLPT N1. Tap and speak, no typing needed.",
  applicationName: "Nihongo Reviewer",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Nihongo", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#e11d48",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
        <SyncProvider />
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-2.5 backdrop-blur">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-rose-600 text-xs font-black text-white">
                あ
              </span>
              <span className="text-sm font-extrabold tracking-tight text-slate-800">
                Nihongo<span className="text-rose-600">.app</span>
              </span>
            </Link>
            <div className="flex items-center gap-1.5">
              <Link
                href="/speak"
                aria-label="Voice Practice"
                className="flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
              >
                🎤
              </Link>
              <Link
                href="/settings"
                aria-label="Settings"
                className="flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
              >
                ⚙️
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 pb-28 pt-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
