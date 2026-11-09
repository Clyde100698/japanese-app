"use client";
import Link from "next/link";
import { Mic, Moon, Sun, Settings, Lock, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { lockSessionNow } from "@/lib/auth";

export default function HeaderControls() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/design-preview"
        aria-label="Design Preview"
        title="Kawaii & Game Redesign Preview"
        className="flex size-9 items-center justify-center rounded-full text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
      >
        <Sparkles className="size-4 fill-amber-400" />
      </Link>

      <button
        type="button"
        onClick={lockSessionNow}
        aria-label="Lock app now"
        title="Lock now"
        className="flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Lock className="size-4" />
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
        className="flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {theme === "dark" ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
      </button>

      <Link
        href="/speak"
        aria-label="Voice Practice"
        title="Voice Practice"
        className="flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Mic className="size-4" />
      </Link>

      <Link
        href="/settings"
        aria-label="Settings"
        title="Settings"
        className="flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Settings className="size-4" />
      </Link>
    </div>
  );
}

