"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import HeaderControls from "@/components/HeaderControls";

interface Props {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: Props) {
  const pathname = usePathname() || "";
  const isAuthPage = ["/account", "/login", "/register"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      {/* Top Header Navigation (Hidden on Login / Register / Account pages) */}
      {!isAuthPage && (
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
      )}

      {/* Main Content */}
      <main
        className={`mx-auto max-w-lg px-4 ${
          isAuthPage
            ? "py-6 min-h-dvh flex flex-col justify-start"
            : "pb-28 pt-4"
        }`}
      >
        {children}
      </main>

      {/* Bottom Tab Bar (Hidden on Login / Register / Account pages) */}
      {!isAuthPage && <BottomNav />}
    </>
  );
}
