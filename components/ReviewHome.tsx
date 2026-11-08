"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import { dayKey, getAllCards, getDaily, onDbChange, recordReview } from "@/lib/db";
import { DECKS, loadDeck, type DeckCard } from "@/lib/decks";
import { buildQueue, GRADES, previewLabel, review, type Grade, type SrsCard } from "@/lib/sm2";
import { speak } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { syncNow } from "@/lib/sync";
import Furigana from "./Furigana";

const GRADE_STYLE: Record<Grade, string> = {
  again: "bg-rose-600 text-white dark:bg-rose-500",
  hard: "bg-amber-500 text-white dark:bg-amber-600",
  good: "bg-blue-600 text-white dark:bg-blue-500",
  easy: "bg-emerald-600 text-white dark:bg-emerald-500",
};
const GRADE_LABEL: Record<Grade, string> = { again: "Again", hard: "Hard", good: "Good", easy: "Easy" };

interface DeckSummary { id: string; due: number; fresh: number; total: number; known: number }

export default function ReviewHome() {
  const [settings] = useSettings();
  const [summaries, setSummaries] = useState<DeckSummary[] | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [cards, daily] = await Promise.all([getAllCards(), getDaily(dayKey(Date.now()))]);
    const now = Date.now();
    const out: DeckSummary[] = [];
    for (const d of DECKS) {
      let deck: DeckCard[];
      try { deck = await loadDeck(d.id); } catch { continue; }
      if (!deck.length) continue;
      const ids = deck.map((c) => c.id);
      const q = buildQueue(ids, cards, { now, newLimit: settings.newCardsPerDay, newDoneToday: daily?.newCards ?? 0 });
      out.push({ id: d.id, due: q.due.length, fresh: q.fresh.length, total: ids.length, known: ids.filter((i) => cards.has(i)).length });
    }
    setSummaries(out);
  }, [settings.newCardsPerDay]);

  useEffect(() => {
    if (!active) void load();
    return onDbChange(() => !active && void load());
  }, [active, load]);

  if (active) return <Session deckId={active} onExit={() => setActive(null)} />;
  if (!summaries) return <p className="text-slate-500 dark:text-slate-400">Loading study queues…</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Spaced Repetition Review
      </h1>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        New cards per day: {settings.newCardsPerDay} (customizable in Settings)
      </p>
      <ul className="space-y-2.5">
        {summaries.map((s) => {
          const info = DECKS.find((d) => d.id === s.id)!;
          const todo = s.due + s.fresh;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setActive(s.id)}
                disabled={todo === 0}
                className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.99] disabled:opacity-60 dark:bg-slate-900 dark:ring-slate-800"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-base font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" lang="ja">
                  {info.ja.slice(0, 2)}
                </span>
                <span className="flex-1">
                  <span className="font-heading block font-bold text-slate-900 dark:text-white">{info.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{s.known}/{s.total} learned</span>
                </span>
                {todo > 0 ? (
                  <span className="text-right text-xs">
                    <span className="block font-bold text-blue-600 dark:text-blue-400">{s.due} due</span>
                    <span className="block text-slate-500 dark:text-slate-400">{s.fresh} new</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="size-3.5" />
                    <span>Done</span>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Session({ deckId, onExit }: { deckId: string; onExit: () => void }) {
  const [settings] = useSettings();
  const [deck, setDeck] = useState<Map<string, DeckCard> | null>(null);
  const [cards, setCards] = useState<Map<string, SrsCard>>(new Map());
  const [queue, setQueue] = useState<string[]>([]);
  const [pos, setPos] = useState(0);
  const [shown, setShown] = useState(false);
  const [stats, setStats] = useState({ done: 0, correct: 0, xp: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [list, all, daily] = await Promise.all([loadDeck(deckId), getAllCards(), getDaily(dayKey(Date.now()))]);
      if (!alive) return;
      const q = buildQueue(list.map((c) => c.id), all, { now: Date.now(), newLimit: settings.newCardsPerDay, newDoneToday: daily?.newCards ?? 0 });
      setDeck(new Map(list.map((c) => [c.id, c])));
      setCards(all);
      setQueue([...q.due, ...q.fresh]);
      setReady(true);
    })();
    return () => { alive = false; };
  }, [deckId]);

  const currentId = queue[pos];
  const card = currentId ? deck?.get(currentId) : undefined;

  const reveal = useCallback(() => {
    setShown(true);
    if (settings.autoSpeak && card) speak(card.speak, settings.speechRate);
  }, [card, settings.autoSpeak, settings.speechRate]);

  const now = Date.now();
  const previews = useMemo(
    () => (currentId ? Object.fromEntries(GRADES.map((g) => [g, previewLabel(cards.get(currentId), currentId, g, now)])) : {}),
    [currentId, cards, shown],
  );

  const grade = async (g: Grade) => {
    if (!currentId) return;
    const t = Date.now();
    const prev = cards.get(currentId);
    const next = review(prev, currentId, g, t);
    await recordReview(prev, next, g, t);
    setCards((m) => new Map(m).set(currentId, next));
    setStats((s) => ({ done: s.done + 1, correct: s.correct + (g === "again" ? 0 : 1), xp: s.xp + ({ again: 1, hard: 3, good: 5, easy: 6 }[g]) }));
    if (g === "again") setQueue((q) => [...q, currentId]);
    setShown(false);
    setPos((p) => p + 1);
  };

  const finished = ready && pos >= queue.length;
  useEffect(() => {
    if (finished && stats.done > 0) void syncNow();
  }, [finished, stats.done]);

  if (!ready || !deck) return <p className="text-slate-500 dark:text-slate-400">Loading cards…</p>;

  if (finished) {
    const acc = stats.done ? Math.round((stats.correct / stats.done) * 100) : 0;
    return (
      <div className="pt-8 text-center">
        <div className="flex size-16 items-center justify-center mx-auto rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-slate-900 dark:text-white">
          {stats.done ? "Session Complete!" : "Nothing due right now"}
        </h1>
        {stats.done > 0 && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {stats.done} reviews · {acc}% accuracy · +{stats.xp} XP
          </p>
        )}
        <button
          type="button"
          onClick={onExit}
          className="mt-6 flex min-h-12 items-center justify-center mx-auto rounded-full bg-blue-600 px-8 font-semibold text-white shadow-sm active:bg-blue-700 dark:bg-blue-500"
        >
          Back to Decks
        </button>
      </div>
    );
  }

  const isNew = !cards.has(currentId);
  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <button type="button" onClick={onExit} className="flex min-h-12 items-center gap-1 px-1">
          <ArrowLeft className="size-4" />
          <span>Exit</span>
        </button>
        <span className="font-semibold">{Math.min(pos + 1, queue.length)} / {queue.length}</span>
        <span className={isNew ? "font-bold text-blue-600 dark:text-blue-400" : ""}>{isNew ? "New" : "Review"}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all" style={{ width: `${(pos / queue.length) * 100}%` }} />
      </div>

      <button
        type="button"
        onClick={() => (shown ? speak(card!.speak, settings.speechRate) : reveal())}
        className="mt-4 flex flex-1 flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow ring-1 ring-slate-200 active:scale-[0.99] transition-all dark:bg-slate-900 dark:ring-slate-800"
        aria-label={shown ? "Hear it again" : "Show answer"}
      >
        <Furigana text={card!.front} reading={card!.reading} show={settings.showFurigana} big />
        {!shown && <span className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tap to reveal</span>}
        {shown && (
          <div className="mt-4 space-y-2">
            {settings.showRomaji && card!.romaji && <p className="font-heading text-lg text-slate-500 dark:text-slate-400">{card!.romaji}</p>}
            <p className="font-heading text-2xl font-bold text-blue-600 dark:text-blue-400">{card!.answer}</p>
            {card!.detail && <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">{card!.detail}</p>}
            <div className="flex items-center justify-center gap-1 text-xs text-slate-400 pt-2">
              <Volume2 className="size-3.5" />
              <span>Tap to hear audio</span>
            </div>
          </div>
        )}
      </button>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {shown
          ? GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => void grade(g)}
                className={`min-h-16 rounded-2xl text-xs font-bold transition-transform active:scale-95 ${GRADE_STYLE[g]}`}
              >
                {GRADE_LABEL[g]}
                <span className="block text-[10px] font-normal opacity-80">{previews[g]}</span>
              </button>
            ))
          : (
            <button
              type="button"
              onClick={reveal}
              className="col-span-4 min-h-16 rounded-2xl bg-blue-600 font-heading text-base font-bold text-white shadow-sm active:bg-blue-700 dark:bg-blue-500"
            >
              Show Answer
            </button>
          )}
      </div>
    </div>
  );
}
