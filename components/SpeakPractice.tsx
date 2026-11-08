"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Volume2, Check, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import type { DeckCard } from "@/lib/decks";
import { judge, type Verdict } from "@/lib/speechMatch";
import { listenOnce, recognitionSupported, type ListenError, type Listener } from "@/lib/recognition";
import { shuffle } from "@/lib/quiz";
import { speak, ttsSupported } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { addPractice } from "@/lib/db";
import { useAvailableDecks } from "@/lib/useDecks";

const ERR: Record<ListenError, string> = {
  unsupported: "",
  "not-allowed": "Microphone permission was blocked. Allow it in your browser settings.",
  "no-speech": "I didn't hear anything. Tap the mic and speak clearly.",
  network: "Speech recognition needs an internet connection.",
  aborted: "",
  unknown: "Something went wrong. Tap to try again.",
};

export default function SpeakPractice() {
  const decks = useAvailableDecks();
  const [settings] = useSettings();
  const [deckId, setDeckId] = useState("phrases");
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<{ v: Verdict; score: number } | null>(null);
  const [err, setErr] = useState("");
  const [supported, setSupported] = useState(true);
  const [good, setGood] = useState(0);
  const lis = useRef<Listener | null>(null);

  useEffect(() => {
    setSupported(recognitionSupported());
  }, []);

  const cards = useMemo(() => {
    const d = decks?.find((x) => x.info.id === deckId) ?? decks?.[0];
    return d ? shuffle(d.cards).slice(0, 50) : [];
  }, [decks, deckId]);
  const card: DeckCard | undefined = cards[i % Math.max(1, cards.length)];

  const reset = () => {
    setHeard(null);
    setVerdict(null);
    setErr("");
  };
  const next = () => {
    reset();
    setI((n) => n + 1);
  };

  const start = () => {
    if (!card || listening) return;
    reset();
    setListening(true);
    lis.current = listenOnce({
      onResult: (alts) => {
        const targets = [card.speak, card.front, card.reading ?? ""].filter(Boolean);
        const j = judge(alts, targets);
        setHeard(j.best);
        setVerdict({ v: j.verdict, score: j.score });
        if (j.verdict === "great") {
          setGood((g) => g + 1);
          void addPractice(1, 1, 3);
        }
      },
      onError: (e) => setErr(ERR[e]),
      onEnd: () => setListening(false),
    });
  };

  useEffect(() => () => lis.current?.stop(), []);

  if (!decks) return <p className="text-slate-500 dark:text-slate-400">Loading cards…</p>;
  if (!card) return <p className="text-slate-500 dark:text-slate-400">No content available to practise yet.</p>;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <select
          value={deckId}
          onChange={(e) => {
            setDeckId(e.target.value);
            setI(0);
            reset();
          }}
          className="min-h-12 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          aria-label="Practice set"
        >
          {decks.map((d) => (
            <option key={d.info.id} value={d.info.id}>
              {d.info.label}
            </option>
          ))}
        </select>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{good} mastered ✓</span>
      </div>

      <div className="rounded-3xl bg-white p-6 text-center shadow ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-4xl font-medium leading-snug text-slate-900 dark:text-white" lang="ja">
          {card.front}
        </p>
        {card.reading && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400" lang="ja">
            {card.reading}
          </p>
        )}
        {settings.showRomaji && card.romaji && (
          <p className="mt-2 font-heading text-sm font-semibold text-slate-500 dark:text-slate-400">{card.romaji}</p>
        )}
        <p className="mt-2 font-heading text-lg font-bold text-blue-600 dark:text-blue-400">{card.answer}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            disabled={!ttsSupported()}
            onClick={() => speak(card.speak, settings.speechRate)}
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm active:bg-blue-700 disabled:opacity-40 dark:bg-blue-500"
          >
            <Volume2 className="size-4" />
            <span>Listen</span>
          </button>
          <button
            type="button"
            disabled={!ttsSupported()}
            onClick={() => speak(card.speak, 0.5)}
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-700 active:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            <span>Slow (0.5×)</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        {supported ? (
          <>
            <button
              type="button"
              onClick={start}
              disabled={listening}
              aria-label="Speak Japanese"
              className={`mx-auto flex size-24 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95 ${
                listening ? "animate-pulse bg-blue-400" : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500"
              }`}
            >
              <Mic className="size-10" />
            </button>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {listening ? "Listening… say it now" : "Tap the mic and speak"}
            </p>
          </>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            <p className="font-bold">Speech recognition isn&apos;t supported in this browser.</p>
            <p className="mt-1 text-xs">Listen, speak out loud, and rate yourself below.</p>
            <div className="mt-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setGood((g) => g + 1);
                  void addPractice(1, 1, 3);
                  next();
                }}
                className="flex min-h-12 items-center gap-1.5 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm"
              >
                <Check className="size-4" />
                <span>I spoke it well</span>
              </button>
              <button
                type="button"
                onClick={() => speak(card.speak, settings.speechRate)}
                className="flex min-h-12 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
              >
                <RotateCcw className="size-4" />
                <span>Hear Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {err && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-rose-600 dark:text-rose-400" role="alert">
          <AlertCircle className="size-4" />
          <span>{err}</span>
        </div>
      )}

      {verdict && (
        <div
          className={`mt-4 rounded-2xl p-4 text-center border ${
            verdict.v === "great"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300"
              : verdict.v === "close"
              ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300"
              : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
          }`}
          role="status"
        >
          <p className="font-heading text-lg font-bold">
            {verdict.v === "great"
              ? "Great pronunciation!"
              : verdict.v === "close"
              ? "Almost! Try once more"
              : "Not quite. Listen and repeat"}
          </p>
          <p className="mt-1 text-xs">
            I heard: <span className="font-bold" lang="ja">{heard}</span> ({Math.round(verdict.score * 100)}% match)
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={next}
          className="flex min-h-12 items-center gap-1.5 rounded-full bg-slate-900 px-8 text-sm font-semibold text-white shadow-sm active:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:active:bg-slate-200"
        >
          <span>Next Word</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
