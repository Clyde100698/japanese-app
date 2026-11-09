"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowLeft, Check, CheckCircle2, RotateCcw, Volume2, Sparkles, Heart } from "lucide-react";
import { dayKey, getAllCards, getDaily, onDbChange, recordReview } from "@/lib/db";
import { DECKS, loadDeck, type DeckCard } from "@/lib/decks";
import { buildQueue, GRADES, previewLabel, review, type Grade, type SrsCard } from "@/lib/sm2";
import { speak } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { syncNow } from "@/lib/sync";
import Furigana from "./Furigana";
import Mascot, { type MascotState } from "@/components/mascot/Mascot";
import Button3D from "@/components/game/Button3D";
import {
  playTapSound,
  playCorrectSound,
  playWrongSound,
  playCelebrateSound,
  triggerHaptic,
} from "@/lib/sound";

const GRADE_STYLE_3D: Record<Grade, string> = {
  again: "btn-3d bg-rose-500 text-white border-b-4 border-rose-700 active:border-b-0",
  hard: "btn-3d bg-amber-500 text-white border-b-4 border-amber-700 active:border-b-0",
  good: "btn-3d-blue",
  easy: "btn-3d-emerald",
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

  const totalDue = summaries.reduce((acc, s) => acc + s.due, 0);

  return (
    <div className="space-y-4 pb-12">
      {/* Kawaii Mascot Intro Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Spaced Repetition
            </span>
            <h1 className="text-xl font-black tracking-tight">
              Daily SRS Review
            </h1>
            <p className="text-xs text-blue-100 max-w-[240px] leading-relaxed">
              {totalDue > 0
                ? `${totalDue} cards are due for review today. Let's sharpen your memory!`
                : "All caught up for today! Feel free to practice new cards anytime."}
            </p>
          </div>

          <div className="shrink-0">
            <Mascot
              state={totalDue > 0 ? "happy" : "sleepy"}
              size={85}
              speech={
                totalDue > 0
                  ? { ja: "がんばろう！", en: `${totalDue} due!` }
                  : { ja: "ふにゃ〜 完了！", en: "All caught up!" }
              }
              bubblePlacement="left"
              interactive={true}
            />
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
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
                onClick={() => {
                  playTapSound();
                  setActive(s.id);
                }}
                disabled={todo === 0}
                className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.99] disabled:opacity-60 dark:bg-slate-900 dark:ring-slate-800"
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
  const [mascotState, setMascotState] = useState<MascotState>("thinking");
  const [mascotSpeech, setMascotSpeech] = useState<string | { ja: string; en: string }>({
    ja: "思い出せるかな？",
    en: "Try to recall!",
  });

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
  }, [deckId, settings.newCardsPerDay]);

  const currentId = queue[pos];
  const card = currentId ? deck?.get(currentId) : undefined;

  const reveal = useCallback(() => {
    playTapSound();
    setShown(true);
    if (settings.autoSpeak && card) speak(card.speak, settings.speechRate);
  }, [card, settings.autoSpeak, settings.speechRate]);

  const now = Date.now();
  const previews = useMemo(
    () => (currentId ? Object.fromEntries(GRADES.map((g) => [g, previewLabel(cards.get(currentId), currentId, g, now)])) : {}),
    [currentId, cards, now],
  );

  const grade = async (g: Grade) => {
    if (!currentId) return;
    const t = Date.now();
    const prev = cards.get(currentId);
    const next = review(prev, currentId, g, t);
    await recordReview(prev, next, g, t);
    setCards((m) => new Map(m).set(currentId, next));
    setStats((s) => ({ done: s.done + 1, correct: s.correct + (g === "again" ? 0 : 1), xp: s.xp + ({ again: 1, hard: 3, good: 5, easy: 6 }[g]) }));

    if (g === "again") {
      playWrongSound();
      triggerHaptic("warning");
      setMascotState("sad");
      setMascotSpeech({ ja: "次は大丈夫！", en: "No worries, we'll see it again!" });
      setQueue((q) => [...q, currentId]);
    } else if (g === "hard") {
      playTapSound();
      triggerHaptic("medium");
      setMascotState("thinking");
      setMascotSpeech({ ja: "いい調子！", en: "Good effort!" });
    } else if (g === "good") {
      playCorrectSound();
      triggerHaptic("success");
      setMascotState("happy");
      setMascotSpeech({ ja: "正解！", en: "Nice recall!" });
    } else {
      playCorrectSound();
      triggerHaptic("success");
      setMascotState("cheering");
      setMascotSpeech({ ja: "すごい！", en: "Mastered!" });
    }

    setShown(false);
    setPos((p) => p + 1);
  };

  const finished = ready && pos >= queue.length;
  useEffect(() => {
    if (finished && stats.done > 0) {
      playCelebrateSound();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#2563EB", "#10B981", "#F59E0B", "#EC4899"],
      });
      void syncNow();
    }
  }, [finished, stats.done]);

  if (!ready || !deck) return <p className="text-slate-500 dark:text-slate-400">Loading cards…</p>;

  if (finished) {
    const acc = stats.done ? Math.round((stats.correct / stats.done) * 100) : 0;
    return (
      <div className="pt-8 text-center space-y-5">
        <div className="flex justify-center">
          <Mascot
            state={stats.done > 0 ? "cheering" : "sleepy"}
            size={120}
            speech={
              stats.done > 0
                ? { ja: "よくできました！", en: "Review complete!" }
                : { ja: "ふにゃ〜 休憩タイム！", en: "Nothing due!" }
            }
            bubblePlacement="top"
            interactive={true}
          />
        </div>

        <h1 className="font-heading text-2xl font-black text-slate-900 dark:text-white">
          {stats.done ? "Session Complete!" : "Nothing due right now"}
        </h1>

        {stats.done > 0 && (
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Cards</span>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400">{stats.done}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Accuracy</span>
              <p className="text-lg font-black text-emerald-500">{acc}%</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">XP</span>
              <p className="text-lg font-black text-amber-500">+{stats.xp}</p>
            </div>
          </div>
        )}

        <div className="pt-2 max-w-xs mx-auto">
          <Button3D variant="primary" fullWidth size="lg" onClick={onExit}>
            Back to Decks
          </Button3D>
        </div>
      </div>
    );
  }

  const isNew = !cards.has(currentId);
  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={onExit}
          className="flex min-h-12 items-center gap-1 px-1 font-bold text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="size-4" />
          <span>Exit</span>
        </button>

        <span className="font-bold">
          {Math.min(pos + 1, queue.length)} / {queue.length}
        </span>

        <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${isNew ? "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
          {isNew ? "New Card" : "Review"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(pos / Math.max(1, queue.length)) * 100}%` }}
        />
      </div>

      {/* Mascot Assistant Bar */}
      <div className="flex justify-end pr-2">
        <Mascot
          state={mascotState}
          size={55}
          speech={mascotSpeech}
          bubblePlacement="left"
          interactive={true}
        />
      </div>

      {/* Main Flashcard */}
      <button
        type="button"
        onClick={() => (shown ? speak(card!.speak, settings.speechRate) : reveal())}
        className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 active:scale-[0.99] transition-all dark:bg-slate-900 dark:ring-slate-800"
        aria-label={shown ? "Hear it again" : "Show answer"}
      >
        <Furigana text={card!.front} reading={card!.reading} show={settings.showFurigana} big />
        {!shown && (
          <span className="mt-6 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Tap to reveal answer
          </span>
        )}
        {shown && (
          <div className="mt-4 space-y-2">
            {settings.showRomaji && card!.romaji && (
              <p className="font-heading text-lg text-slate-500 dark:text-slate-400">{card!.romaji}</p>
            )}
            <p className="font-heading text-2xl font-black text-blue-600 dark:text-blue-400">{card!.answer}</p>
            {card!.detail && (
              <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                {card!.detail}
              </p>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-slate-400 pt-2">
              <Volume2 className="size-3.5" />
              <span>Tap card to hear audio</span>
            </div>
          </div>
        )}
      </button>

      {/* 3D Grading Buttons */}
      <div className="pt-2">
        {shown ? (
          <div className="grid grid-cols-4 gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => void grade(g)}
                className={`min-h-16 rounded-2xl text-xs font-black transition-transform active:scale-95 ${GRADE_STYLE_3D[g]}`}
              >
                {GRADE_LABEL[g]}
                <span className="block text-[10px] font-normal opacity-90">{previews[g]}</span>
              </button>
            ))}
          </div>
        ) : (
          <Button3D
            variant="primary"
            fullWidth
            size="lg"
            onClick={reveal}
          >
            Show Answer
          </Button3D>
        )}
      </div>
    </div>
  );
}
