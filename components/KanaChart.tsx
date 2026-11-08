"use client";
import { useCallback, useMemo, useState } from "react";
import { CHART_TABS, columnsFor, layoutChart, type ChartTab, type KanaData, type KanaItem, type Script } from "@/lib/kana";
import { speak } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { useJson } from "@/lib/useJson";
import KanaDetail from "./KanaDetail";

const ROW_LABELS: Record<string, string> = {
  a: "", k: "k", s: "s", t: "t", n: "n", h: "h", m: "m", y: "y", r: "r", w: "w",
};

export default function KanaChart() {
  const { data, error } = useJson<KanaData>("/data/kana.json");
  const { data: strokes } = useJson<Record<string, string[]>>("/data/kana-strokes.json");
  const [settings] = useSettings();
  const [script, setScript] = useState<Script>("hiragana");
  const [tab, setTab] = useState<ChartTab>("basic");
  const [openId, setOpenId] = useState<string | null>(null);

  const scriptItems = useMemo(() => data?.items.filter((i) => i.script === script) ?? [], [data, script]);
  const rows = useMemo(() => layoutChart(scriptItems, tab), [scriptItems, tab]);
  const flat = useMemo(() => rows.flat().filter((x): x is KanaItem => !!x), [rows]);
  const openIndex = flat.findIndex((i) => i.id === openId);
  const open = openIndex >= 0 ? flat[openIndex] : null;

  const select = useCallback(
    (item: KanaItem) => {
      speak(item.kana, settings.speechRate);
      setOpenId(item.id);
    },
    [settings.speechRate],
  );

  // Speak on prev/next too, so tapping through the chart is a listening drill
  const go = useCallback(
    (delta: number) => {
      const next = flat[openIndex + delta];
      if (next) select(next);
    },
    [flat, openIndex, select],
  );

  if (error) return <p className="p-4 text-rose-700">Couldn&apos;t load the kana. Please check your connection and reload.</p>;
  if (!data) return <p className="p-4 text-slate-500">Loading…</p>;

  const cols = columnsFor(tab);
  const colHeads = tab === "combo" ? ["ya", "yu", "yo"] : ["a", "i", "u", "e", "o"];

  return (
    <div>
      <div role="tablist" aria-label="Script" className="mb-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-200 p-1">
        {(["hiragana", "katakana"] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={script === s}
            onClick={() => setScript(s)}
            className={`min-h-11 rounded-xl text-lg font-semibold ${script === s ? "bg-white text-rose-700 shadow" : "text-slate-600"}`}
          >
            <span lang="ja">{s === "hiragana" ? "ひらがな" : "カタカナ"}</span>
          </button>
        ))}
      </div>

      <div role="tablist" aria-label="Chart" className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CHART_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${tab === t.id ? "bg-rose-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "voiced" && (
        <p className="mb-3 text-sm text-slate-600">Add two dots (dakuten ゛) or a circle (handakuten ゜) to change the sound.</p>
      )}
      {tab === "combo" && (
        <p className="mb-3 text-sm text-slate-600">A small ゃ ゅ ょ blends into the kana before it: one beat, not two.</p>
      )}
      {tab === "special" && (
        <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {data.longVowelNotes.map((n) => (
            <li key={n} lang="ja">{n}</li>
          ))}
        </ul>
      )}

      {tab !== "special" && (
        <div
          className="mb-1 grid gap-2 pl-6 text-center text-xs font-semibold uppercase text-slate-400"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {colHeads.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {rows.map((row, ri) => {
          const first = row.find(Boolean);
          const label = tab === "basic" ? ROW_LABELS[first?.row ?? ""] ?? first?.row : first?.row;
          return (
            <div key={ri} className="flex items-center gap-1">
              <span className="w-5 shrink-0 text-center text-xs font-semibold text-slate-400">{tab === "special" ? "" : label}</span>
              <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {row.map((item, ci) =>
                  item ? (
                    <button
                      key={item.id}
                      onClick={() => select(item)}
                      className="flex aspect-square min-h-14 flex-col items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 active:bg-rose-50"
                      aria-label={`${item.kana} ${item.romaji}`}
                    >
                      <span className="text-3xl leading-none text-slate-900" lang="ja">{item.kana}</span>
                      {settings.showRomaji && <span className="mt-1 text-xs font-medium text-slate-500">{item.romaji}</span>}
                    </button>
                  ) : (
                    <span key={ci} aria-hidden />
                  ),
                )}
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <KanaDetail
          item={open}
          strokes={strokes}
          speechRate={settings.speechRate}
          showRomaji={settings.showRomaji}
          onClose={() => setOpenId(null)}
          onPrev={openIndex > 0 ? () => go(-1) : undefined}
          onNext={openIndex < flat.length - 1 ? () => go(1) : undefined}
        />
      )}
    </div>
  );
}

