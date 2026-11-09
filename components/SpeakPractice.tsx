"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Mic, Volume2, Check, ArrowRight, RotateCcw, AlertCircle, Sparkles } from "lucide-react";
import type { DeckCard } from "@/lib/decks";
import { judge, type Verdict } from "@/lib/speechMatch";
import { listenOnce, recognitionSupported, type ListenError, type Listener } from "@/lib/recognition";
import { shuffle } from "@/lib/quiz";
import { speak, ttsSupported } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { addPractice } from "@/lib/db";
import { useAvailableDecks } from "@/lib/useDecks";
import Mascot, { type MascotState } from "@/components/mascot/Mascot";
import Button3D from "@/components/game/Button3D";
import {
  playTapSound,
  playCorrectSound,
  playWrongSound,
  triggerHaptic,
} from "@/lib/sound";

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
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotSpeech, setMascotSpeech] = useState<string | { ja: string; en: string }>({
    ja: "言ってみよう！",
    en: "Tap mic and speak!",
  });
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
    setMascotState("idle");
    setMascotSpeech({ ja: "言ってみよう！", en: "Tap mic and speak!" });
  };

  const next = () => {
    playTapSound();
    reset();
    setI((n) => n + 1);
  };

  const start = () => {
    if (!card || listening) return;
    reset();
    playTapSound();
    setListening(true);
    setMascotState("listening");
    setMascotSpeech({ ja: "聞いてるよ！", en: "I'm listening!" });

    lis.current = listenOnce({
      onResult: (alts) => {
        const targets = [card.speak, card.front, card.reading ?? ""].filter(Boolean);
        const j = judge(alts, targets);
        setHeard(j.best);
        setVerdict({ v: j.verdict, score: j.score });

        if (j.verdict === "great") {
          playCorrectSound();
          triggerHaptic("success");
          setGood((g) => g + 1);
          void addPractice(1, 1, 3);
          setMascotState("cheering");
          setMascotSpeech({ ja: "完璧！", en: "Perfect pronunciation!" });
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
            colors: ["#2563EB", "#10B981", "#F59E0B"],
          });
        } else if (j.verdict === "close") {
          playTapSound();
          triggerHaptic("medium");
          setMascotState("happy");
          setMascotSpeech({ ja: "惜しい！", en: "Almost there!" });
        } else {
          playWrongSound();
          triggerHaptic("warning");
          setMascotState("sad");
          setMascotSpeech({ ja: "もう一度！", en: "Listen and try again!" });
        }
      },
      onError: (e) => {
        setErr(ERR[e]);
        setMascotState("thinking");
      },
      onEnd: () => setListening(false),
    });
  };

  useEffect(() => () => lis.current?.stop(), []);

  if (!decks) return <p className="text-slate-500 dark:text-slate-400">Loading cards…</p>;
  if (!card) return <p className="text-slate-500 dark:text-slate-400">No content available to practise yet.</p>;

  return (
    <div className="space-y-4 pb-12">
      {/* Kawaii Mascot Intro Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Speaking Coach
            </span>
            <h1 className="text-xl font-black tracking-tight">
              Pronunciation Practice
            </h1>
            <p className="text-xs text-blue-100 max-w-[240px] leading-relaxed">
              Listen to native Japanese audio, then tap the mic to practice speaking with Aoi!
            </p>
          </div>

          <div className="shrink-0">
            <Mascot
              state={listening ? "listening" : mascotState}
              size={85}
              speech={mascotSpeech}
              bubblePlacement="left"
              interactive={true}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <select
          value={deckId}
          onChange={(e) => {
            setDeckId(e.target.value);
            setI(0);
            reset();
          }}
          className="min-h-12 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          aria-label="Practice set"
        >
          {decks.map((d) => (
            <option key={d.info.id} value={d.info.id}>
              {d.info.label}
            </option>
          ))}
        </select>
        <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
          {good} mastered ✓
        </span>
      </div>

      {/* Target Word Card */}
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 space-y-2">
        <p className="text-4xl font-black leading-snug text-slate-900 dark:text-white" lang="ja">
          {card.front}
        </p>
        {card.reading && (
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400" lang="ja">
            {card.reading}
          </p>
        )}
        {settings.showRomaji && card.romaji && (
          <p className="font-heading text-sm font-semibold text-slate-500 dark:text-slate-400">
            {card.romaji}
          </p>
        )}
        <p className="font-heading text-lg font-black text-blue-600 dark:text-blue-400">
          {card.answer}
        </p>

        {/* Audio buttons */}
        <div className="pt-3 flex justify-center gap-2">
          <Button3D
            variant="primary"
            size="sm"
            iconLeft={<Volume2 className="size-4" />}
            onClick={() => {
              playTapSound();
              speak(card.speak, settings.speechRate);
            }}
          >
            Listen
          </Button3D>

          <Button3D
            variant="neutral"
            size="sm"
            onClick={() => {
              playTapSound();
              speak(card.speak, 0.5);
            }}
          >
            Slow (0.5×)
          </Button3D>
        </div>
      </div>

      {/* Microphone Section */}
      <div className="pt-4 text-center">
        {supported ? (
          <>
            <button
              type="button"
              onClick={start}
              disabled={listening}
              aria-label="Speak Japanese"
              className={`mx-auto flex size-24 items-center justify-center rounded-full text-white shadow-xl transition-transform active:scale-95 ${
                listening
                  ? "animate-pulse bg-emerald-500 ring-8 ring-emerald-200 dark:ring-emerald-950"
                  : "bg-blue-600 hover:bg-blue-700 ring-8 ring-blue-100 dark:ring-blue-950 btn-3d-blue"
              }`}
            >
              <Mic className="size-10" />
            </button>
            <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {listening ? "Listening… speak in Japanese now" : "Tap the mic and speak"}
            </p>
          </>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            <p className="font-bold">Speech recognition isn&apos;t supported in this browser.</p>
            <p className="mt-1 text-xs">Listen, speak out loud, and rate yourself below.</p>
            <div className="mt-3 flex justify-center gap-2">
              <Button3D
                variant="success"
                size="sm"
                iconLeft={<Check className="size-4" />}
                onClick={() => {
                  setGood((g) => g + 1);
                  void addPractice(1, 1, 3);
                  next();
                }}
              >
                I spoke it well
              </Button3D>
              <Button3D
                variant="neutral"
                size="sm"
                iconLeft={<RotateCcw className="size-4" />}
                onClick={() => speak(card.speak, settings.speechRate)}
              >
                Hear Again
              </Button3D>
            </div>
          </div>
        )}
      </div>

      {err && (
        <div
          className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-rose-600 dark:text-rose-400"
          role="alert"
        >
          <AlertCircle className="size-4" />
          <span>{err}</span>
        </div>
      )}

      {verdict && (
        <div
          className={`rounded-2xl p-4 text-center border animate-fade-in ${
            verdict.v === "great"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300"
              : verdict.v === "close"
              ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300"
              : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
          }`}
          role="status"
        >
          <p className="font-heading text-lg font-black">
            {verdict.v === "great"
              ? "🎉 Great pronunciation!"
              : verdict.v === "close"
              ? "💡 Almost! Try once more"
              : "⚠️ Not quite. Listen and repeat"}
          </p>
          <p className="mt-1 text-xs">
            I heard: <span className="font-black" lang="ja">{heard}</span> ({Math.round(verdict.score * 100)}% match)
          </p>
        </div>
      )}

      <div className="pt-2 flex justify-center">
        <Button3D
          variant="primary"
          size="lg"
          iconRight={<ArrowRight className="size-4" />}
          onClick={next}
        >
          Next Word
        </Button3D>
      </div>
    </div>
  );
}
