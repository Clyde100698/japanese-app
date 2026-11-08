"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ListOrdered,
  Puzzle,
  AlignLeft,
  Ear,
  Zap,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Check,
} from "lucide-react";
import { addPractice, applyQuizMiss, getAllCards } from "@/lib/db";
import type { DeckCard } from "@/lib/decks";
import { quizXp } from "@/lib/quiz";
import { useSettings } from "@/lib/settings";
import { review, type SrsCard } from "@/lib/sm2";
import { loadSentences, useAvailableDecks, type SentenceItem } from "@/lib/useDecks";
import BuildQuiz from "./quiz/BuildQuiz";
import ChoiceQuiz, { type QuizResult } from "./quiz/ChoiceQuiz";
import MatchQuiz from "./quiz/MatchQuiz";

type Mode = "choice" | "match" | "build" | "listen" | "speed";
const MODES: { id: Mode; icon: React.ElementType; label: string; hint: string }[] = [
  { id: "choice", icon: ListOrdered, label: "Multiple choice", hint: "10 rapid questions" },
  { id: "match", icon: Puzzle, label: "Matching cards", hint: "Pair 5 cards" },
  { id: "build", icon: AlignLeft, label: "Build a sentence", hint: "Tap word tiles in order" },
  { id: "listen", icon: Ear, label: "Listening quiz", hint: "Hear Japanese audio, pick meaning" },
  { id: "speed", icon: Zap, label: "Speed round", hint: "60 seconds with streak bonus" },
];

export default function QuizHome() {
  const decks = useAvailableDecks();
  const [settings] = useSettings();
  const [mode, setMode] = useState<Mode | null>(null);
  const [source, setSource] = useState<string>("");
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [srs, setSrs] = useState<Map<string, SrsCard>>(new Map());
  const [result, setResult] = useState<(QuizResult & { xp: number }) | null>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    void loadSentences().then(setSentences);
    void getAllCards().then(setSrs);
  }, []);

  const sources = useMemo(() => {
    const list = (decks ?? []).map((d) => ({ id: d.info.id, label: d.info.label, cards: d.cards }));
    const learned = (decks ?? []).flatMap((d) => d.cards).filter((c) => srs.has(c.id));
    return learned.length >= 6 ? [{ id: "learned", label: "Everything I've learned", cards: learned }, ...list] : list;
  }, [decks, srs]);
  const pool: DeckCard[] = sources.find((s) => s.id === source)?.cards ?? [];

  useEffect(() => {
    if (!source && sources.length) setSource(sources[0].id);
  }, [source, sources]);

  const finish = async (r: QuizResult) => {
    const xp = quizXp(r.correct, r.total);
    await addPractice(r.correct, r.total, xp);
    const now = Date.now();
    for (const id of r.missed) {
      const prev = srs.get(id);
      if (prev) await applyQuizMiss(prev, review(prev, id, "again", now), now);
    }
    setSrs(await getAllCards());
    setResult({ ...r, xp });
  };

  if (!decks) return <p className="text-slate-500 dark:text-slate-400">Loading quiz decks…</p>;

  if (result) {
    return (
      <div className="pt-8 text-center">
        <div className="flex size-16 items-center justify-center mx-auto rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <Sparkles className="size-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900 dark:text-white">
          {result.correct} / {result.total} Correct
        </h1>
        {result.score !== undefined && (
          <p className="mt-1 font-heading text-lg font-bold text-blue-600 dark:text-blue-400">
            {result.score} points
          </p>
        )}
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">+{result.xp} XP earned</p>
        {result.missed.length > 0 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Missed cards will appear sooner in your Review queue.</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => { setResult(null); setRun((n) => n + 1); }}
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-blue-600 px-6 font-semibold text-white shadow-sm active:bg-blue-700 dark:bg-blue-500"
          >
            <RotateCcw className="size-4" />
            <span>Play Again</span>
          </button>
          <button
            type="button"
            onClick={() => { setResult(null); setMode(null); }}
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-slate-100 px-6 font-semibold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode) {
    const bad = mode === "build" ? sentences.length < 5 : pool.length < 5;
    return (
      <div>
        <button
          type="button"
          onClick={() => setMode(null)}
          className="mb-3 flex min-h-12 items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Quizzes</span>
        </button>
        {bad ? (
          <p className="rounded-2xl bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
            Not enough content loaded for this quiz yet.
          </p>
        ) : mode === "match" ? (
          <MatchQuiz key={run} pool={pool} rate={settings.speechRate} onDone={finish} />
        ) : mode === "build" ? (
          <BuildQuiz key={run} sentences={sentences} rate={settings.speechRate} onDone={finish} />
        ) : (
          <ChoiceQuiz
            key={run}
            pool={pool}
            mode={mode}
            rate={settings.speechRate}
            furigana={settings.showFurigana}
            onDone={finish}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Tap Quizzes
      </h1>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">All input is tap-based. No typing needed.</p>

      <label htmlFor="src" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Practice Set
      </label>
      <select
        id="src"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="mb-4 mt-1 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {sources.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label} ({s.cards.length} cards)
          </option>
        ))}
      </select>

      <ul className="space-y-2.5">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setMode(m.id)}
                className="flex min-h-16 w-full items-center gap-3.5 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.99] hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800/60"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Icon className="size-6" />
                </div>
                <div>
                  <span className="font-heading block font-bold text-slate-900 dark:text-white">{m.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{m.hint}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
