"use client";
import { useMemo, useState } from "react";
import type { DeckCard } from "@/lib/decks";
import { shuffle } from "@/lib/quiz";
import { speak } from "@/lib/speech";
import type { QuizResult } from "./ChoiceQuiz";

const PAIRS = 5;

export default function MatchQuiz({ pool, rate, onDone }: { pool: DeckCard[]; rate: number; onDone: (r: QuizResult) => void }) {
  const { cards, rightOrder } = useMemo(() => {
    // distinct answers only, so each pair is unambiguous
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
    <div>
      <p className="mb-3 text-center text-sm text-slate-500">Tap a card on the left, then its match on the right.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {cards.map((c) => (
            <button key={c.id} disabled={matched.has(c.id)} onClick={() => { setSel(c.id); speak(c.speak, rate); }}
              className={`min-h-16 w-full rounded-2xl p-2 text-2xl shadow-sm ring-1 ${matched.has(c.id) ? "bg-emerald-100 opacity-60 ring-emerald-400" : sel === c.id ? "bg-rose-100 ring-rose-500" : "bg-white ring-slate-200"}`} lang="ja">
              {c.front}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rightOrder.map((c) => (
            <button key={c.id} disabled={matched.has(c.id)} onClick={() => pickRight(c)}
              className={`min-h-16 w-full rounded-2xl p-2 text-base font-medium shadow-sm ring-1 ${matched.has(c.id) ? "bg-emerald-100 opacity-60 ring-emerald-400" : flash === c.id ? "bg-rose-200 ring-rose-500" : "bg-white ring-slate-200"}`}>
              {c.answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

