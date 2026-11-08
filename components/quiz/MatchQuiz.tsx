"use client";
import { useMemo, useState } from "react";
import type { DeckCard } from "@/lib/decks";
import { shuffle } from "@/lib/quiz";
import { speak } from "@/lib/speech";
import type { QuizResult } from "./ChoiceQuiz";

const PAIRS = 5;

export default function MatchQuiz({ pool, rate, onDone }: { pool: DeckCard[]; rate: number; onDone: (r: QuizResult) => void }) {
  const { cards, rightOrder } = useMemo(() => {
    const seen = new Set<string>();
    const picked = shuffle(pool).filter((c) => !seen.has(c.answer) && !!seen.add(c.answer)).slice(0, PAIRS);
    return { cards: picked, rightOrder: shuffle(picked) };
  }, [pool]);

  const [sel, setSel] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<string | null>(null);
  const [missed, setMissed] = useState<Set<string>>(new Set());

  const pickRight = (c: DeckCard) => {
    if (!sel || matched.has(c.id)) return;
    if (sel === c.id) {
      speak(c.speak, rate);
      const m = new Set(matched).add(c.id);
      setMatched(m);
      setSel(null);
      if (m.size === cards.length) setTimeout(() => onDone({ correct: cards.length - missed.size, total: cards.length, missed: [...missed] }), 600);
    } else {
      setMissed(new Set(missed).add(sel));
      setFlash(c.id);
      setTimeout(() => setFlash(null), 500);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        Tap a Japanese card on the left, then its English match on the right.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2.5">
          {cards.map((c) => {
            const isMatched = matched.has(c.id);
            const isSelected = sel === c.id;
            return (
              <button
                key={c.id}
                disabled={isMatched}
                onClick={() => { setSel(c.id); speak(c.speak, rate); }}
                className={`flex min-h-16 w-full items-center justify-center rounded-2xl p-2.5 text-2xl font-medium shadow-sm ring-1 transition ${
                  isMatched
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 opacity-60 ring-emerald-400"
                    : isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600 scale-[1.02]"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ring-slate-200 dark:ring-slate-700 hover:ring-blue-400"
                }`}
                lang="ja"
              >
                {c.front}
              </button>
            );
          })}
        </div>
        <div className="space-y-2.5">
          {rightOrder.map((c) => {
            const isMatched = matched.has(c.id);
            const isError = flash === c.id;
            return (
              <button
                key={c.id}
                disabled={isMatched}
                onClick={() => pickRight(c)}
                className={`flex min-h-16 w-full items-center justify-center rounded-2xl p-2.5 text-center text-sm font-medium shadow-sm ring-1 transition ${
                  isMatched
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 opacity-60 ring-emerald-400"
                    : isError
                    ? "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-rose-500 animate-shake"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ring-slate-200 dark:ring-slate-700 hover:ring-blue-400"
                }`}
              >
                {c.answer}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
