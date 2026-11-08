"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, RotateCcw, MessageSquare, TrendingUp, Settings } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/review", label: "Review", icon: RotateCcw },
  { href: "/conversation", label: "Chat", icon: MessageSquare },
  { href: "/dashboard", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95"
    >
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center text-[10px] font-semibold transition-colors ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`size-5 transition-transform ${active ? "scale-110" : ""}`} />
                <span className="mt-1">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
