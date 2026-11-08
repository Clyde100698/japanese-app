"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, Timer, CheckCircle2 } from "lucide-react";
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

  useEffect(() => {
    if (mode === "listen" && card) speak(card.speak, rate);
  }, [mode, card, rate]);

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
    return (
      <p className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 text-amber-800 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-900">
        Listening quiz requires speech synthesis, which is not supported in this browser.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
        {mode === "speed" ? (
          <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Timer className="h-4 w-4" />
            {Math.max(0, left)}s remaining
          </span>
        ) : (
          <span>Question {Math.min(i + 1, ROUND)} of {ROUND}</span>
        )}
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {results.filter(Boolean).length} correct
          {mode === "speed" && ` (${speedScore(results)} pts)`}
        </span>
      </div>

      <div className="flex min-h-44 flex-col items-center justify-center rounded-3xl bg-white dark:bg-slate-800 p-6 text-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        {mode === "listen" ? (
          <button
            onClick={() => speak(card.speak, rate)}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-md hover:bg-blue-700 active:scale-95 transition"
            aria-label="Play audio again"
          >
            <Volume2 className="h-9 w-9" />
          </button>
        ) : dir === "front-to-answer" ? (
          <Furigana text={card.front} reading={card.reading} show={furigana} big />
        ) : (
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{card.answer}</p>
        )}
        <p className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-500">
          {mode === "listen"
            ? "Tap speaker to hear again · Choose the matching word"
            : dir === "front-to-answer"
            ? "Choose the correct meaning or reading"
            : "Choose the matching Japanese word"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => {
          const state = picked ? (o.id === card.id ? "ok" : o.id === picked ? "bad" : "dim") : "idle";
          const cls = {
            idle: "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ring-slate-200 dark:ring-slate-700 hover:ring-blue-400 active:bg-blue-50 dark:active:bg-slate-700",
            ok: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-emerald-500 font-semibold",
            bad: "bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-rose-500",
            dim: "bg-white/60 dark:bg-slate-800/60 opacity-40 ring-slate-200 dark:ring-slate-700 text-slate-500",
          }[state];
          const text = optDir === "front-to-answer" ? o.answer : o.front;
          return (
            <button
              key={o.id}
              onClick={() => answer(o)}
              className={`flex min-h-16 items-center justify-center rounded-2xl p-3 text-center text-base font-medium shadow-sm ring-1 transition ${cls}`}
              lang={optDir === "answer-to-front" ? "ja" : undefined}
            >
              {optDir === "answer-to-front" && o.reading ? (
                <Furigana text={o.front} reading={o.reading} show={furigana} />
              ) : (
                <span className={text.length > 14 ? "text-sm" : ""}>{text}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
