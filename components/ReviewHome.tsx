"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dayKey, getAllCards, getDaily, onDbChange, recordReview } from "@/lib/db";
import { DECKS, loadDeck, type DeckCard } from "@/lib/decks";
import { buildQueue, GRADES, previewLabel, review, type Grade, type SrsCard } from "@/lib/sm2";
import { speak } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { syncNow } from "@/lib/sync";
import Furigana from "./Furigana";

const GRADE_STYLE: Record<Grade, string> = {
  again: "bg-rose-600 text-white",
  hard: "bg-amber-500 text-white",
  good: "bg-emerald-600 text-white",
  easy: "bg-sky-600 text-white",
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!active) void load();
    return onDbChange(() => !active && void load());
  }, [active, load]);

  if (active) return <Session deckId={active} onExit={() => setActive(null)} />;
  if (!summaries) return <p className="text-slate-500">Loading…</p>;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Review</h1>
      <p className="mb-4 text-sm text-slate-600">New cards per day: {settings.newCardsPerDay} (change in Settings)</p>
      <ul className="space-y-2">
        {summaries.map((s) => {
          const info = DECKS.find((d) => d.id === s.id)!;
          const todo = s.due + s.fresh;
          return (
            <li key={s.id}>
              <button
                onClick={() => setActive(s.id)}
                disabled={todo === 0}
                className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-200 disabled:opacity-60"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-rose-50 text-lg text-rose-700" lang="ja">{info.ja.slice(0, 2)}</span>
                <span className="flex-1">
                  <span className="block font-semibold">{info.label}</span>
                  <span className="block text-xs text-slate-500">{s.known}/{s.total} learned</span>
                </span>
                {todo > 0 ? (
                  <span className="text-right text-xs">
                    <span className="block font-semibold text-rose-600">{s.due} due</span>
                    <span className="block text-sky-700">{s.fresh} new</span>
                  </span>
                ) : (
                  <span className="text-xs text-emerald-700">✓ done</span>
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
    // The queue is built once per session; settings changes apply next session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Failed cards come back at the end of this session
    if (g === "again") setQueue((q) => [...q, currentId]);
    setShown(false);
    setPos((p) => p + 1);
  };

  const finished = ready && pos >= queue.length;
  useEffect(() => {
    if (finished && stats.done > 0) void syncNow();
  }, [finished, stats.done]);

  if (!ready || !deck) return <p className="text-slate-500">Loading…</p>;

  if (finished) {
    const acc = stats.done ? Math.round((stats.correct / stats.done) * 100) : 0;
    return (
      <div className="pt-8 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-3 text-2xl font-bold">{stats.done ? "Session complete!" : "Nothing due right now"}</h1>
        {stats.done > 0 && (
          <p className="mt-2 text-slate-600">{stats.done} reviews · {acc}% correct · +{stats.xp} XP</p>
        )}
        <button onClick={onExit} className="mt-6 min-h-12 rounded-full bg-rose-600 px-8 font-semibold text-white">Back to decks</button>
      </div>
    );
  }

  const isNew = !cards.has(currentId);
  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <button onClick={onExit} className="min-h-11 px-2">← Exit</button>
        <span>{Math.min(pos + 1, queue.length)} / {queue.length}</span>
        <span className={isNew ? "font-semibold text-sky-700" : ""}>{isNew ? "New" : "Review"}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-rose-500 transition-all" style={{ width: `${(pos / queue.length) * 100}%` }} />
      </div>

      <button
        onClick={() => (shown ? speak(card!.speak, settings.speechRate) : reveal())}
        className="mt-4 flex flex-1 flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow ring-1 ring-slate-200"
        aria-label={shown ? "Hear it again" : "Show answer"}
      >
        <Furigana text={card!.front} reading={card!.reading} show={settings.showFurigana} big />
        {!shown && <span className="mt-6 text-sm text-slate-400">Tap to reveal</span>}
        {shown && (
          <div className="mt-4 space-y-2">
            {settings.showRomaji && card!.romaji && <p className="text-lg text-slate-500">{card!.romaji}</p>}
            <p className="text-2xl font-semibold text-rose-700">{card!.answer}</p>
            {card!.detail && <p className="whitespace-pre-line text-sm text-slate-600">{card!.detail}</p>}
            <p className="text-xs text-slate-400">🔊 tap to hear again</p>
          </div>
        )}
      </button>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {shown
          ? GRADES.map((g) => (
              <button key={g} onClick={() => void grade(g)} className={`min-h-16 rounded-2xl text-sm font-semibold ${GRADE_STYLE[g]}`}>
                {GRADE_LABEL[g]}
                <span className="block text-xs font-normal opacity-80">{previews[g]}</span>
              </button>
            ))
          : (
            <button onClick={reveal} className="col-span-4 min-h-16 rounded-2xl bg-slate-800 text-lg font-semibold text-white">Show answer</button>
          )}
      </div>
    </div>
  );
}
