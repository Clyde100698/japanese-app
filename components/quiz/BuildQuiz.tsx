"use client";
import { useMemo, useState } from "react";
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
  if (!round) return <p className="text-slate-500">Not enough sentences yet.</p>;
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

  const chip = "min-h-12 rounded-xl bg-white px-3 text-xl shadow-sm ring-1 ring-slate-200 active:bg-rose-50";
  return (
    <div>
      <div className="mb-2 text-sm text-slate-500">{r + 1} / {rounds.length}</div>
      <p className="rounded-2xl bg-white p-4 text-center text-lg font-medium shadow ring-1 ring-slate-200">{round.en}</p>
      <div className={`mt-4 flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3 ${verdict === "ok" ? "border-emerald-500 bg-emerald-50" : verdict === "bad" ? "border-rose-500 bg-rose-50" : "border-slate-300"}`} lang="ja">
        {picked.length === 0 && <span className="text-sm text-slate-400">Tap the pieces in order</span>}
        {placed.map((idx) => (
          <button key={idx} disabled={!!verdict} onClick={() => setPlaced(placed.filter((p) => p !== idx))} className={chip}>{round.tokens[idx]}</button>
        ))}
      </div>
      {verdict === "bad" && <p className="mt-2 text-center text-lg text-rose-700" lang="ja">Answer: {round.ja}</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-2" lang="ja">
        {bank.map((idx) => (
          <button key={idx} disabled={!!verdict} onClick={() => setPlaced([...placed, idx])} className={chip}>{round.tokens[idx]}</button>
        ))}
      </div>
      <button onClick={check} disabled={bank.length > 0 || !!verdict} className="mt-6 min-h-14 w-full rounded-2xl bg-rose-600 text-lg font-semibold text-white disabled:opacity-40">Check</button>
    </div>
  );
}

