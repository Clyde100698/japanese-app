"use client";
import { useState } from "react";
import { Volume2, Sparkles, Eye } from "lucide-react";
import { speak } from "@/lib/speech";
import { playTapSound } from "@/lib/sound";

export interface KanaMnemonic {
  kana: string;
  romaji: string;
  item: string;
  itemJa: string;
  concept: string;
  svgArt: React.ReactNode;
}

interface Props {
  mnemonic: KanaMnemonic;
  strokes?: string[];
  className?: string;
}

export default function KanaMnemonicCard({ mnemonic, strokes, className = "" }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleTap = () => {
    playTapSound();
    speak(mnemonic.kana, 0.9);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
  };

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
            Mnemonic
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            &quot;{mnemonic.romaji}&quot; like {mnemonic.item}
          </p>
        </div>
        <button
          onClick={() => setIsFlipped((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
          aria-label="Toggle illustration"
          title="Toggle illustration"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Main Interactive Character & Art Box */}
      <div
        onClick={handleTap}
        className={`my-3 flex h-32 w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-b from-blue-50/50 to-indigo-50/30 dark:from-slate-900/40 dark:to-slate-800/40 ring-1 ring-blue-100 dark:ring-slate-700/60 transition select-none ${
          isBouncing ? "scale-105" : "hover:scale-[1.02]"
        }`}
      >
        {isFlipped ? (
          // Visual Illustrated Mnemonic Art
          <div className="flex flex-col items-center justify-center p-2 text-center animate-fade-in">
            {mnemonic.svgArt}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              {mnemonic.item} ({mnemonic.itemJa})
            </span>
          </div>
        ) : (
          // Giant Japanese Kana Character with animated stroke feel
          <div className="flex flex-col items-center justify-center">
            <span
              className="text-6xl font-bold text-blue-600 dark:text-blue-400 tracking-wider"
              lang="ja"
            >
              {mnemonic.kana}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
              /{mnemonic.romaji}/
            </span>
          </div>
        )}
      </div>

      {/* Memory Hook Explanation */}
      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        {mnemonic.concept}
      </p>

      {/* Action Footer */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <span className="text-[11px] font-medium text-slate-400">Tap to hear audio</span>
        <button
          onClick={handleTap}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Volume2 className="h-3.5 w-3.5" />
          Play &quot;{mnemonic.kana}&quot;
        </button>
      </div>
    </div>
  );
}

