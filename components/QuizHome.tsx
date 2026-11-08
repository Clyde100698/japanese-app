"use client";
import { useEffect, useMemo, useState } from "react";
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
const MODES: { id: Mode; icon: string; label: string; hint: string }[] = [
  { id: "choice", icon: "🔤", label: "Multiple choice", hint: "10 questions" },
  { id: "match", icon: "🧩", label: "Matching", hint: "Pair 5 cards" },
  { id: "build", icon: "🧱", label: "Build a sentence", hint: "Tap the pieces in order" },
  { id: "listen", icon: "👂", label: "Listening", hint: "Hear it, pick it" },
  { id: "speed", icon: "⚡", label: "Speed round", hint: "60 seconds" },
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
    if (!source && sources.length) setSource(sources[0].id); // eslint-disable-line react-hooks/set-state-in-effect
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

  if (!decks) return <p className="text-slate-500">Loading…</p>;

  if (result) {
    return (
      <div className="pt-8 text-center">
        <div className="text-6xl">{result.correct === result.total ? "🌟" : "👍"}</div>
        <h1 className="mt-3 text-2xl font-bold">{result.correct} / {result.total} correct</h1>
        {result.score !== undefined && <p className="mt-1 text-lg font-semibold text-rose-600">{result.score} points</p>}
        <p className="mt-1 text-slate-600">+{result.xp} XP</p>
        {result.missed.length > 0 && <p className="mt-1 text-sm text-slate-500">Missed cards will come back sooner in Review.</p>}
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { setResult(null); setRun((n) => n + 1); }} className="min-h-12 rounded-full bg-rose-600 px-6 font-semibold text-white">Again</button>
          <button onClick={() => { setResult(null); setMode(null); }} className="min-h-12 rounded-full bg-slate-100 px-6 font-semibold">Done</button>
        </div>
      </div>
    );
  }

  if (mode) {
    const bad = mode === "build" ? sentences.length < 5 : pool.length < 5;
    return (
      <div>
        <button onClick={() => setMode(null)} className="mb-2 min-h-11 px-1 text-sm text-slate-500">← Quit</button>
        {bad ? <p className="rounded-2xl bg-amber-50 p-4 text-amber-800">Not enough content for this quiz yet.</p>
          : mode === "match" ? <MatchQuiz key={run} pool={pool} rate={settings.speechRate} onDone={finish} />
          : mode === "build" ? <BuildQuiz key={run} sentences={sentences} rate={settings.speechRate} onDone={finish} />
          : <ChoiceQuiz key={run} pool={pool} mode={mode} rate={settings.speechRate} furigana={settings.showFurigana} onDone={finish} />}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Quiz</h1>
      <p className="mb-4 text-sm text-slate-600">All answers are taps. No typing.</p>
      <label htmlFor="src" className="text-sm font-medium text-slate-600">Practice from</label>
      <select id="src" value={source} onChange={(e) => setSource(e.target.value)} className="mb-4 mt-1 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3">
        {sources.map((s) => <option key={s.id} value={s.id}>{s.label} ({s.cards.length})</option>)}
      </select>
      <ul className="space-y-2">
        {MODES.map((m) => (
          <li key={m.id}>
            <button onClick={() => setMode(m.id)} className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-200 active:bg-rose-50">
              <span className="text-3xl">{m.icon}</span>
              <span><span className="block font-semibold">{m.label}</span><span className="block text-xs text-slate-500">{m.hint}</span></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

