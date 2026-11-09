"use client";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  PenTool,
  Lightbulb,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import type { KanaItem } from "@/lib/kana";
import { speak, ttsSupported } from "@/lib/speech";
import StrokeOrder from "./StrokeOrder";
import TraceCanvas from "./TraceCanvas";
import KanaMnemonicCard from "@/components/mascot/KanaMnemonicCard";
import { getKanaMnemonic } from "@/lib/kanaMnemonics";
import Mascot from "@/components/mascot/Mascot";
import Button3D from "@/components/game/Button3D";
import { playTapSound } from "@/lib/sound";

interface Props {
  item: KanaItem;
  strokes: Record<string, string[]> | null;
  speechRate: number;
  showRomaji: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function KanaDetail({
  item,
  strokes,
  speechRate,
  showRomaji,
  onClose,
  onPrev,
  onNext,
}: Props) {
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

  const mnemonicData = getKanaMnemonic(item.kana, item.romaji, item.mnemonic);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.kana} details`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-slate-50 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-slate-900 dark:text-slate-100 space-y-4"
      >
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
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
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-bold shadow-sm ring-1 ring-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:ring-slate-700 dark:active:bg-slate-700"
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

        {/* Illustrated Mnemonic Card (Kana as Character) */}
        <div>
          <KanaMnemonicCard mnemonic={mnemonicData} />
        </div>

        {/* Audio Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button3D
            variant="primary"
            size="md"
            iconLeft={<Volume2 className="h-4 w-4" />}
            onClick={() => {
              playTapSound();
              speak(item.kana, speechRate);
            }}
          >
            Pronounce ({item.romaji})
          </Button3D>

          <Button3D
            variant="neutral"
            size="md"
            onClick={() => {
              playTapSound();
              speak(item.kana, 0.5);
            }}
          >
            Slow (0.5×)
          </Button3D>
        </div>

        {/* Mascot Explanation Card */}
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900/50">
          <Mascot state="thinking" size={60} />
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Aoi&apos;s Memory Trick</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {item.mnemonic}
            </p>
          </div>
        </div>

        {/* Confusable warning */}
        {item.confusable && (
          <section className="rounded-2xl bg-sky-50 p-4 border border-sky-200 dark:bg-sky-950/20 dark:border-sky-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 dark:text-sky-300">
              <AlertTriangle className="size-4" />
              <span>Easy to confuse with:</span>
            </div>
            <p className="mt-1 text-2xl font-bold" lang="ja">
              {item.confusable.join("   ")}
            </p>
          </section>
        )}

        {/* Stroke Order Animation */}
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Stroke Order Animation
          </h3>
          {strokes ? (
            <StrokeOrder key={item.id} text={item.kana} strokes={strokes} />
          ) : (
            <p className="text-sm text-slate-500">Loading strokes…</p>
          )}
        </section>

        {/* Optional Finger Tracing */}
        {[...item.kana].length === 1 && (
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Finger Tracing Canvas
              </h3>
              <Button3D
                variant="neutral"
                size="sm"
                iconLeft={<PenTool className="size-3.5" />}
                onClick={() => setTrace((t) => !t)}
              >
                {trace ? "Hide" : "Trace with Finger"}
              </Button3D>
            </div>
            {trace && (
              <div className="pt-3">
                <TraceCanvas char={item.kana} />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
