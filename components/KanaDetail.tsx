"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Volume2, PenTool, Lightbulb, AlertTriangle } from "lucide-react";
import type { KanaItem } from "@/lib/kana";
import { speak, ttsSupported } from "@/lib/speech";
import StrokeOrder from "./StrokeOrder";
import TraceCanvas from "./TraceCanvas";

interface Props {
  item: KanaItem;
  strokes: Record<string, string[]> | null;
  speechRate: number;
  showRomaji: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function KanaDetail({ item, strokes, speechRate, showRomaji, onClose, onPrev, onNext }: Props) {
  const [trace, setTrace] = useState(false);
  const canSpeak = ttsSupported();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.kana} details`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-slate-50 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            aria-label="Previous character"
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 disabled:opacity-30 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold shadow-sm ring-1 ring-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:ring-slate-700 dark:active:bg-slate-700"
          >
            <X className="size-4" />
            <span>Close</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            aria-label="Next character"
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 disabled:opacity-30 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="text-center">
          <div className="text-8xl font-medium leading-tight text-slate-900 dark:text-white" lang="ja">
            {item.kana}
          </div>
          {showRomaji && <div className="mt-1 font-heading text-2xl font-bold text-blue-600 dark:text-blue-400">{item.romaji}</div>}
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              disabled={!canSpeak}
              onClick={() => speak(item.kana, speechRate)}
              className="flex min-h-12 items-center gap-2 rounded-full bg-blue-600 px-6 font-semibold text-white shadow-sm active:bg-blue-700 disabled:opacity-40 dark:bg-blue-500 dark:active:bg-blue-600"
            >
              <Volume2 className="size-4" />
              <span>Listen</span>
            </button>
            <button
              type="button"
              disabled={!canSpeak}
              onClick={() => speak(item.kana, 0.5)}
              className="flex min-h-12 items-center gap-1.5 rounded-full bg-white px-5 font-semibold text-blue-700 shadow-sm ring-1 ring-slate-200 active:bg-blue-50 disabled:opacity-40 dark:bg-slate-800 dark:text-blue-300 dark:ring-slate-700 dark:active:bg-slate-700"
            >
              <span>Slow (0.5×)</span>
            </button>
          </div>
          {!canSpeak && <p className="mt-2 text-sm text-slate-500">Speech isn&apos;t supported on this browser.</p>}
        </div>

        <section className="mt-5 rounded-2xl bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
            <Lightbulb className="size-4" />
            <h3>Memory Trick</h3>
          </div>
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{item.mnemonic}</p>
        </section>

        {item.confusable && (
          <section className="mt-3 rounded-2xl bg-sky-50 p-4 border border-sky-200 dark:bg-sky-950/20 dark:border-sky-900/40">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-sky-900 dark:text-sky-300">
              <AlertTriangle className="size-4" />
              <h3>Easy to confuse with</h3>
            </div>
            <p className="mt-1 text-3xl font-medium" lang="ja">
              {item.confusable.join("   ")}
            </p>
          </section>
        )}

        <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stroke Order</h3>
          {strokes ? (
            <StrokeOrder key={item.id} text={item.kana} strokes={strokes} />
          ) : (
            <p className="text-sm text-slate-500">Loading strokes…</p>
          )}
        </section>

        {[...item.kana].length === 1 && (
          <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Finger Tracing</h3>
              <button
                type="button"
                onClick={() => setTrace((t) => !t)}
                className="flex min-h-12 items-center gap-1.5 rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-700 active:bg-slate-200 dark:bg-slate-700 dark:text-slate-200"
              >
                <PenTool className="size-3.5" />
                <span>{trace ? "Hide" : "Practice Tracing"}</span>
              </button>
            </div>
            {trace && <TraceCanvas char={item.kana} />}
          </section>
        )}
      </div>
    </div>
  );
}
