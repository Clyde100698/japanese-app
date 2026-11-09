"use client";
import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  Download,
  Upload,
  CheckCircle2,
  Moon,
  Sun,
  Shield,
  Sparkles,
} from "lucide-react";
import AccountPanel from "@/components/AccountPanel";
import { exportBackup, importBackup, type Backup } from "@/lib/db";
import { hasJapaneseVoice, onVoicesChanged, speak, ttsSupported } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { useTheme } from "@/lib/theme";

function Row({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="py-2.5">
      <label className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
        <span>{label}</span>
        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{value}</span>
      </label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [s, update] = useSettings();
  const [theme, setTheme] = useTheme();
  const [voice, setVoice] = useState<"unknown" | "none" | "ok" | "unsupported">("unknown");
  const [msg, setMsg] = useState("");
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = () => setVoice(!ttsSupported() ? "unsupported" : hasJapaneseVoice() ? "ok" : "none");
    check();
    return onVoicesChanged(check);
  }, []);

  const doExport = async () => {
    const blob = new Blob([JSON.stringify(await exportBackup())], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nihongo-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg("Progress backup successfully downloaded.");
  };

  const doImport = async (f?: File) => {
    if (!f) return;
    try {
      const n = await importBackup(JSON.parse(await f.text()) as Backup);
      setMsg(`Imported ${n} records (latest updates merged).`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Import failed");
    }
  };

  const card = "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
      </div>

      {/* Theme */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Theme</span>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(["light", "dark", "system"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTheme(m)}
                className={`flex min-h-10 items-center gap-1 rounded-lg px-3 text-xs font-bold capitalize transition-all ${
                  theme === m
                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {m === "light" ? <Sun className="size-3" /> : m === "dark" ? <Moon className="size-3" /> : <Sparkles className="size-3" />}
                <span>{m}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Speech Voice Settings */}
      <section className={card}>
        <Row label="Speech speed" value={`${s.speechRate.toFixed(1)}×`}>
          <input
            type="range"
            min={0.5}
            max={1.2}
            step={0.1}
            value={s.speechRate}
            onChange={(e) => update({ speechRate: Number(e.target.value) })}
            className="mt-2 h-8 w-full accent-blue-600"
          />
        </Row>
        <button
          type="button"
          onClick={() => speak("こんにちは、日本語の勉強を頑張りましょう", s.speechRate)}
          disabled={voice === "unsupported"}
          className="flex min-h-12 items-center gap-1.5 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm active:bg-blue-700 disabled:opacity-40 dark:bg-blue-500"
        >
          <Volume2 className="size-4" />
          <span>Test Speech Audio</span>
        </button>
        {voice === "none" && (
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            No Japanese voice found yet. On Android: Settings → Languages → Text-to-speech.
          </p>
        )}
      </section>

      {/* Review Goals */}
      <section className={card}>
        <Row label="New cards per day" value={String(s.newCardsPerDay)}>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={s.newCardsPerDay}
            onChange={(e) => update({ newCardsPerDay: Number(e.target.value) })}
            className="mt-2 h-8 w-full accent-blue-600"
          />
        </Row>
        <Row label="Daily review goal" value={`${s.dailyGoal} cards`}>
          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={s.dailyGoal}
            onChange={(e) => update({ dailyGoal: Number(e.target.value) })}
            className="mt-2 h-8 w-full accent-blue-600"
          />
        </Row>
      </section>

      {/* Toggles */}
      <section className={card}>
        {([
          ["showRomaji", "Show romaji pronunciation"],
          ["showFurigana", "Show furigana above kanji"],
          ["autoSpeak", "Speak answers automatically in review"],
        ] as const).map(([k, label]) => (
          <label key={k} className="flex min-h-12 items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={s[k]}
              onChange={(e) => update({ [k]: e.target.checked })}
              className="size-6 accent-blue-600 rounded"
            />
          </label>
        ))}
      </section>

      {/* Cloud Account Panel */}
      <AccountPanel />

      {/* Backup and Restore */}
      <section className={card}>
        <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Backup &amp; Restore</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Save your progress to a portable file or restore it on another device.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => void doExport()}
            className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-xs font-bold text-white shadow-sm active:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
          >
            <Download className="size-4" />
            <span>Export File</span>
          </button>
          <button
            type="button"
            onClick={() => file.current?.click()}
            className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 shadow-sm active:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            <Upload className="size-4" />
            <span>Import File</span>
          </button>
          <input
            ref={file}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => void doImport(e.target.files?.[0])}
          />
        </div>
        {msg && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400" role="status">
            <CheckCircle2 className="size-3.5" />
            <span>{msg}</span>
          </div>
        )}
      </section>

      <p className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        <a href="/credits" className="underline hover:text-slate-700 dark:hover:text-slate-200">
          Credits &amp; Open Licenses
        </a>
      </p>
    </div>
  );
}
