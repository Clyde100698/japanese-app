"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/learn", label: "Learn", icon: "あ" },
  { href: "/review", label: "Review", icon: "🔁" },
  { href: "/quiz", label: "Quiz", icon: "🎮" },
  { href: "/dashboard", label: "Stats", icon: "📊" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center text-[11px] font-semibold transition-colors ${
                  active ? "text-rose-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="text-xl leading-none" lang={t.icon === "あ" ? "ja" : undefined}>
                  {t.icon}
                </span>
                <span className="mt-0.5">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
