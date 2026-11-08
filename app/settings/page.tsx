"use client";
import { useEffect, useRef, useState } from "react";
import AccountPanel from "@/components/AccountPanel";
import { exportBackup, importBackup, type Backup } from "@/lib/db";
import { hasJapaneseVoice, onVoicesChanged, speak, ttsSupported } from "@/lib/speech";
import { useSettings } from "@/lib/settings";

function Row({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <label className="flex items-center justify-between font-medium">{label}<span className="text-slate-500">{value}</span></label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [s, update] = useSettings();
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
    setMsg("Progress exported.");
  };

  const doImport = async (f?: File) => {
    if (!f) return;
    try {
      const n = await importBackup(JSON.parse(await f.text()) as Backup);
      setMsg(`Imported ${n} records (newer data wins).`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Import failed");
    }
  };

  const card = "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200";
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className={card}>
        <Row label="Speech speed" value={`${s.speechRate.toFixed(1)}×`}>
          <input type="range" min={0.5} max={1.2} step={0.1} value={s.speechRate} onChange={(e) => update({ speechRate: Number(e.target.value) })} className="mt-2 h-8 w-full accent-rose-600" />
        </Row>
        <button onClick={() => speak("こんにちは", s.speechRate)} disabled={voice === "unsupported"} className="min-h-11 rounded-full bg-rose-600 px-5 font-semibold text-white disabled:opacity-40">🔊 Test voice</button>
        {voice === "none" && <p className="mt-2 text-sm text-amber-700">No Japanese voice found yet. On Android: Settings → System → Languages → Text-to-speech.</p>}
        {voice === "unsupported" && <p className="mt-2 text-sm text-slate-500">This browser can&apos;t read text aloud.</p>}
      </section>

      <section className={card}>
        <Row label="New cards per day" value={String(s.newCardsPerDay)}>
          <input type="range" min={0} max={50} step={1} value={s.newCardsPerDay} onChange={(e) => update({ newCardsPerDay: Number(e.target.value) })} className="mt-2 h-8 w-full accent-rose-600" />
        </Row>
        <Row label="Daily goal (reviews)" value={String(s.dailyGoal)}>
          <input type="range" min={5} max={200} step={5} value={s.dailyGoal} onChange={(e) => update({ dailyGoal: Number(e.target.value) })} className="mt-2 h-8 w-full accent-rose-600" />
        </Row>
      </section>

      <section className={card}>
        {([["showRomaji", "Show romaji"], ["showFurigana", "Show furigana"], ["autoSpeak", "Speak answers automatically"]] as const).map(([k, label]) => (
          <label key={k} className="flex min-h-12 items-center justify-between font-medium">
            {label}
            <input type="checkbox" checked={s[k]} onChange={(e) => update({ [k]: e.target.checked })} className="size-6 accent-rose-600" />
          </label>
        ))}
      </section>

      <AccountPanel />

      <section className={card}>
        <h2 className="font-semibold">Backup</h2>
        <p className="text-sm text-slate-600">Save your progress to a file or restore it on another device.</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => void doExport()} className="min-h-11 rounded-full bg-slate-800 px-5 font-semibold text-white">Export</button>
          <button onClick={() => file.current?.click()} className="min-h-11 rounded-full bg-slate-100 px-5 font-semibold">Import</button>
          <input ref={file} type="file" accept="application/json" className="hidden" onChange={(e) => void doImport(e.target.files?.[0])} />
        </div>
        {msg && <p className="mt-2 text-sm text-emerald-700" role="status">{msg}</p>}
      </section>

      <p className="pt-2 text-center text-xs text-slate-500"><a href="/credits" className="underline">Credits &amp; licenses</a></p>
    </div>
  );
}
