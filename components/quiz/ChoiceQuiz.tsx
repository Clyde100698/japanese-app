"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DeckCard } from "@/lib/decks";
import { makeChoices, shuffle, speedScore, type Direction } from "@/lib/quiz";
import { speak, ttsSupported } from "@/lib/speech";
import Furigana from "../Furigana";

export interface QuizResult { correct: number; total: number; missed: string[]; score?: number }

interface Props {
  pool: DeckCard[];
  mode: "choice" | "listen" | "speed";
  rate: number;
  furigana: boolean;
  onDone: (r: QuizResult) => void;
}

const ROUND = 10;
const SPEED_SECONDS = 60;

export default function ChoiceQuiz({ pool, mode, rate, furigana, onDone }: Props) {
  const order = useMemo(() => {
    // Enough shuffled cards for the longest session, repeating the pool if needed
    const reps = Math.ceil((mode === "speed" ? 200 : ROUND) / Math.max(1, pool.length));
    return Array.from({ length: reps }, () => shuffle(pool)).flat();
  }, [pool, mode]);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [left, setLeft] = useState(SPEED_SECONDS);
  const done = useRef(false);

  const card = order[i];
  const dir: Direction = useMemo(() => {
    // Kana: always show the character and pick the romaji. Others alternate.
    if (mode === "listen" || card?.kind === "kana") return "front-to-answer";
    return i % 2 ? "answer-to-front" : "front-to-answer";
  }, [card, i, mode]);
  const options = useMemo(() => (card ? makeChoices(card, pool, mode === "listen" ? "answer-to-front" : dir) : []), [card, pool, dir, mode]);
  const optDir: Direction = mode === "listen" ? "answer-to-front" : dir;

  const finish = useCallback(
    (res: boolean[], miss: string[]) => {
      if (done.current) return;
      done.current = true;
      onDone({ correct: res.filter(Boolean).length, total: res.length, missed: miss, score: mode === "speed" ? speedScore(res) : undefined });
    },
    [onDone, mode],
  );

  // Listening: speak automatically on each new question
  useEffect(() => {
    if (mode === "listen" && card) speak(card.speak, rate);
  }, [mode, card, rate]);

  // Speed round countdown
  useEffect(() => {
    if (mode !== "speed") return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [mode]);
  useEffect(() => {
    if (mode === "speed" && left <= 0) finish(results, missed);
  }, [left, mode, finish, results, missed]);

  const answer = (c: DeckCard) => {
    if (picked || !card) return;
    const ok = c.id === card.id;
    setPicked(c.id);
    const res = [...results, ok];
    const miss = ok ? missed : [...missed, card.id];
    setResults(res);
    setMissed(miss);
    if (!ok && mode !== "listen") speak(card.speak, rate);
    setTimeout(() => {
      if (mode !== "speed" && res.length >= ROUND) return finish(res, miss);
      setPicked(null);
      setI((n) => n + 1);
    }, mode === "speed" ? (ok ? 250 : 700) : ok ? 700 : 1400);
  };

  if (!card) return null;
  if (mode === "listen" && !ttsSupported()) {
    return <p className="rounded-2xl bg-amber-50 p-4 text-amber-800">Listening quiz needs speech, which this browser doesn&apos;t support.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>{mode === "speed" ? `⏱ ${Math.max(0, left)}s` : `${Math.min(i + 1, ROUND)} / ${ROUND}`}</span>
        <span>{results.filter(Boolean).length} ✓{mode === "speed" ? ` · ${speedScore(results)} pts` : ""}</span>
      </div>
      <div className="flex min-h-40 flex-col items-center justify-center rounded-3xl bg-white p-5 text-center shadow ring-1 ring-slate-200">
        {mode === "listen" ? (
          <button onClick={() => speak(card.speak, rate)} className="min-h-20 min-w-20 rounded-full bg-rose-600 text-4xl text-white" aria-label="Play again">🔊</button>
        ) : dir === "front-to-answer" ? (
          <Furigana text={card.front} reading={card.reading} show={furigana} big />
        ) : (
          <p className="text-2xl font-semibold text-rose-700">{card.answer}</p>
        )}
        <p className="mt-2 text-xs text-slate-400">{mode === "listen" ? "What did you hear?" : dir === "front-to-answer" ? "Pick the meaning / reading" : "Pick the Japanese"}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((o) => {
          const state = picked ? (o.id === card.id ? "ok" : o.id === picked ? "bad" : "dim") : "idle";
          const cls = { idle: "bg-white ring-slate-200", ok: "bg-emerald-100 ring-emerald-500", bad: "bg-rose-100 ring-rose-500", dim: "bg-white opacity-50 ring-slate-200" }[state];
          const text = optDir === "front-to-answer" ? o.answer : o.front;
          return (
            <button key={o.id} onClick={() => answer(o)} className={`min-h-16 rounded-2xl p-2 text-lg font-medium shadow-sm ring-1 ${cls}`} lang={optDir === "answer-to-front" ? "ja" : undefined}>
              {optDir === "answer-to-front" && o.reading ? <Furigana text={o.front} reading={o.reading} show={furigana} /> : <span className={text.length > 14 ? "text-sm" : ""}>{text}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

