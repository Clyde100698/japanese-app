"use client";
import { useEffect, useState } from "react";
import TraceCanvas from "./TraceCanvas";
import type { KanaItem } from "@/lib/kana";
import { speak, ttsSupported } from "@/lib/speech";
import StrokeOrder from "./StrokeOrder";

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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const [trace, setTrace] = useState(false);
  const canSpeak = ttsSupported();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.kana} details`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-slate-50 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            aria-label="Previous character"
            className="min-h-11 min-w-11 rounded-full bg-white text-xl shadow-sm disabled:opacity-30"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-full bg-white px-5 font-medium shadow-sm"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            aria-label="Next character"
            className="min-h-11 min-w-11 rounded-full bg-white text-xl shadow-sm disabled:opacity-30"
          >
            ›
          </button>
        </div>

        <div className="text-center">
          <div className="text-8xl font-medium leading-tight text-slate-900" lang="ja">
            {item.kana}
          </div>
          {showRomaji && <div className="mt-1 text-2xl font-semibold text-rose-600">{item.romaji}</div>}
          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              disabled={!canSpeak}
              onClick={() => speak(item.kana, speechRate)}
              className="min-h-12 rounded-full bg-rose-600 px-5 font-semibold text-white active:bg-rose-700 disabled:opacity-40"
            >
              🔊 Listen
            </button>
            <button
              type="button"
              disabled={!canSpeak}
              onClick={() => speak(item.kana, 0.5)}
              className="min-h-12 rounded-full bg-white px-5 font-semibold text-rose-700 shadow-sm active:bg-rose-50 disabled:opacity-40"
            >
              🐢 Slow
            </button>
          </div>
          {!canSpeak && <p className="mt-2 text-sm text-slate-500">Speech isn&apos;t supported on this browser.</p>}
        </div>

        <section className="mt-5 rounded-2xl bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-800">Memory trick</h3>
          <p className="mt-1 text-slate-800">{item.mnemonic}</p>
          {item.needs_review && <p className="mt-1 text-xs text-amber-700">This mnemonic is flagged for review.</p>}
        </section>

        {item.confusable && (
          <section className="mt-3 rounded-2xl bg-sky-50 p-4 text-sky-900">
            <h3 className="text-sm font-semibold">Easy to confuse with</h3>
            <p className="mt-1 text-3xl" lang="ja">
              {item.confusable.join("  ")}
            </p>
          </section>
        )}

        <section className="mt-3 rounded-2xl bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-600">Stroke order</h3>
          {strokes ? (
            <StrokeOrder key={item.id} text={item.kana} strokes={strokes} />
          ) : (
            <p className="text-sm text-slate-500">Loading strokes…</p>
          )}
        </section>

        {[...item.kana].length === 1 && (
          <section className="mt-3 rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-600">Practice writing (optional)</h3>
              <button type="button" onClick={() => setTrace((t) => !t)} className="min-h-11 rounded-full bg-slate-100 px-4 text-sm font-medium">
                {trace ? "Hide" : "✍️ Trace"}
              </button>
            </div>
            {trace && <TraceCanvas char={item.kana} />}
          </section>
        )}
      </div>
    </div>
  );
}

