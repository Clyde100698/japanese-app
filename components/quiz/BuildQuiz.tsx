"use client";
import { useMemo, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { chunkJapanese, isSameSentence, shuffle } from "@/lib/quiz";
import { speak } from "@/lib/speech";
import type { SentenceItem } from "@/lib/useDecks";
import type { QuizResult } from "./ChoiceQuiz";

const ROUNDS = 5;

export default function BuildQuiz({ sentences, rate, onDone }: { sentences: SentenceItem[]; rate: number; onDone: (r: QuizResult) => void }) {
  const rounds = useMemo(() => shuffle(sentences).slice(0, ROUNDS).map((s) => {
    const tokens = s.tokens && s.tokens.join("") === s.ja ? s.tokens : chunkJapanese(s.ja);
    return { ...s, tokens, order: shuffle(tokens.map((_, i) => i)) };
  }), [sentences]);

  const [r, setR] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [verdict, setVerdict] = useState<"ok" | "bad" | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const round = rounds[r];
  if (!round) return <p className="text-slate-500 dark:text-slate-400">Not enough sentences yet.</p>;
  const bank = round.order.filter((i) => !placed.includes(i));
  const picked = placed.map((i) => round.tokens[i]);

  const check = () => {
    const ok = isSameSentence(picked, round.ja);
    setVerdict(ok ? "ok" : "bad");
    speak(round.ja, rate);
    const res = [...results, ok];
    setResults(res);
    setTimeout(() => {
      if (res.length >= rounds.length) return onDone({ correct: res.filter(Boolean).length, total: res.length, missed: [] });
      setR(r + 1); setPlaced([]); setVerdict(null);
    }, ok ? 1500 : 2800);
  };

  const chip = "min-h-12 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3.5 py-2 text-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 active:bg-blue-50 dark:active:bg-blue-950/40 transition";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
        <span>Question {r + 1} of {rounds.length}</span>
        <button
          onClick={() => { setPlaced([]); setVerdict(null); }}
          disabled={placed.length === 0 || !!verdict}
          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <p className="rounded-2xl bg-white dark:bg-slate-800 p-4 text-center text-lg font-medium shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 text-slate-900 dark:text-slate-100">
        {round.en}
      </p>

      <div
        className={`flex min-h-24 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3.5 transition-colors ${
          verdict === "ok"
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
            : verdict === "bad"
            ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20"
            : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
        }`}
        lang="ja"
      >
        {picked.length === 0 && (
          <span className="w-full text-center text-sm text-slate-400 dark:text-slate-500">
            Tap the words below in order
          </span>
        )}
        {placed.map((idx) => (
          <button
            key={idx}
            disabled={!!verdict}
            onClick={() => setPlaced(placed.filter((p) => p !== idx))}
            className={chip}
          >
            {round.tokens[idx]}
          </button>
        ))}
      </div>

      {verdict === "ok" && (
        <div className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4" />
          <span>Correct!</span>
        </div>
      )}

      {verdict === "bad" && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-3 text-center ring-1 ring-rose-200 dark:ring-rose-900">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <X className="h-3.5 w-3.5" />
            Correct sentence
          </div>
          <p className="mt-1 text-base font-medium text-rose-900 dark:text-rose-200" lang="ja">{round.ja}</p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 pt-2" lang="ja">
        {bank.map((idx) => (
          <button
            key={idx}
            disabled={!!verdict}
            onClick={() => setPlaced([...placed, idx])}
            className={chip}
          >
            {round.tokens[idx]}
          </button>
        ))}
      </div>

      <button
        onClick={check}
        disabled={bank.length > 0 || !!verdict}
        className="mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-blue-600 dark:bg-blue-500 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40 transition"
      >
        Check Answer
      </button>
    </div>
  );
}
