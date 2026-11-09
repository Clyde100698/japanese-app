"use client";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
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
import Mascot from "@/components/mascot/Mascot";
import Button3D from "@/components/game/Button3D";
import { playTapSound, playCelebrateSound } from "@/lib/sound";

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

    playCelebrateSound();
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#2563EB", "#10B981", "#F59E0B", "#EC4899"],
    });
  };

  if (!decks) return <p className="text-slate-500 dark:text-slate-400">Loading quiz decks…</p>;

  if (result) {
    return (
      <div className="pt-8 text-center space-y-5">
        <div className="flex justify-center">
          <Mascot
            state="cheering"
            size={120}
            speech={{ ja: "よくできました！", en: "Quiz cleared!" }}
            bubblePlacement="top"
            interactive={true}
          />
        </div>

        <h1 className="font-heading text-2xl font-black text-slate-900 dark:text-white">
          {result.correct} / {result.total} Correct
        </h1>

        {result.score !== undefined && (
          <p className="font-heading text-lg font-black text-blue-600 dark:text-blue-400">
            {result.score} points
          </p>
        )}

        <div className="flex justify-center items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full ring-1 ring-amber-300/40">
            <Sparkles className="h-3.5 w-3.5" />
            +{result.xp} XP earned
          </span>
        </div>

        {result.missed.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Missed cards will appear sooner in your Review queue for reinforcement.
          </p>
        )}

        <div className="pt-2 flex justify-center gap-3">
          <Button3D
            variant="primary"
            size="md"
            iconLeft={<RotateCcw className="size-4" />}
            onClick={() => {
              setResult(null);
              setRun((n) => n + 1);
            }}
          >
            Play Again
          </Button3D>

          <Button3D
            variant="neutral"
            size="md"
            onClick={() => {
              setResult(null);
              setMode(null);
            }}
          >
            Done
          </Button3D>
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
          onClick={() => {
            playTapSound();
            setMode(null);
          }}
          className="mb-3 flex min-h-12 items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
    <div className="space-y-4 pb-12">
      {/* Kawaii Mascot Intro Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Tap Arcade
            </span>
            <h1 className="text-xl font-black tracking-tight">
              Tap-Only Quizzes
            </h1>
            <p className="text-xs text-blue-100 max-w-[240px] leading-relaxed">
              Fast, zero-typing games to test your recognition, matching, and listening skills!
            </p>
          </div>

          <div className="shrink-0">
            <Mascot
              state="happy"
              size={85}
              speech={{ ja: "クイズしよう！", en: "Pick a game!" }}
              bubblePlacement="left"
              interactive={true}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1 px-1">
        <label
          htmlFor="src"
          className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          Practice Set
        </label>
        <select
          id="src"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-3.5 text-sm font-bold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} ({s.cards.length} cards)
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-2.5">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  setMode(m.id);
                }}
                className="flex min-h-16 w-full items-center gap-3.5 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.99] hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800/60"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Icon className="size-6" />
                </div>
                <div>
                  <span className="font-heading block font-black text-slate-900 dark:text-white">
                    {m.label}
                  </span>
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
