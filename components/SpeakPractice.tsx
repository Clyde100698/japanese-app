"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DeckCard } from "@/lib/decks";
import { judge, type Verdict } from "@/lib/speechMatch";
import { listenOnce, recognitionSupported, type ListenError, type Listener } from "@/lib/recognition";
import { shuffle } from "@/lib/quiz";
import { speak, ttsSupported } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { addPractice } from "@/lib/db";
import { useAvailableDecks } from "@/lib/useDecks";

const ERR: Record<ListenError, string> = {
  unsupported: "", "not-allowed": "Microphone permission was blocked. Allow it in your browser's site settings.",
  "no-speech": "I didn't hear anything. Tap the mic and try again.", network: "Speech recognition needs an internet connection.",
  aborted: "", unknown: "Something went wrong. Try again.",
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

  useEffect(() => { setSupported(recognitionSupported()); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const cards = useMemo(() => {
    const d = decks?.find((x) => x.info.id === deckId) ?? decks?.[0];
    return d ? shuffle(d.cards).slice(0, 50) : [];
  }, [decks, deckId]);
  const card: DeckCard | undefined = cards[i % Math.max(1, cards.length)];

  const reset = () => { setHeard(null); setVerdict(null); setErr(""); };
  const next = () => { reset(); setI((n) => n + 1); };

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
        if (j.verdict === "great") { setGood((g) => g + 1); void addPractice(1, 1, 3); }
      },
      onError: (e) => setErr(ERR[e]),
      onEnd: () => setListening(false),
    });
  };

  useEffect(() => () => lis.current?.stop(), []);

  if (!decks) return <p className="text-slate-500">Loading…</p>;
  if (!card) return <p className="text-slate-500">No content to practise yet.</p>;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <select value={deckId} onChange={(e) => { setDeckId(e.target.value); setI(0); reset(); }} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm" aria-label="Practice set">
          {decks.map((d) => <option key={d.info.id} value={d.info.id}>{d.info.label}</option>)}
        </select>
        <span className="text-sm text-slate-500">{good} great ✓</span>
      </div>

      <div className="rounded-3xl bg-white p-6 text-center shadow ring-1 ring-slate-200">
        <p className="text-4xl font-medium leading-snug" lang="ja">{card.front}</p>
        {card.reading && <p className="mt-1 text-slate-500" lang="ja">{card.reading}</p>}
        {settings.showRomaji && card.romaji && <p className="mt-2 text-slate-500">{card.romaji}</p>}
        <p className="mt-2 text-lg font-semibold text-rose-700">{card.answer}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button disabled={!ttsSupported()} onClick={() => speak(card.speak, settings.speechRate)} className="min-h-12 rounded-full bg-rose-600 px-5 font-semibold text-white disabled:opacity-40">🔊 Listen</button>
          <button disabled={!ttsSupported()} onClick={() => speak(card.speak, 0.5)} className="min-h-12 rounded-full bg-slate-100 px-5 font-semibold disabled:opacity-40">🐢 Slow</button>
        </div>
      </div>

      <div className="mt-5 text-center">
        {supported ? (
          <>
            <button onClick={start} disabled={listening} aria-label="Speak" className={`size-24 rounded-full text-4xl text-white shadow-lg ${listening ? "animate-pulse bg-rose-400" : "bg-rose-600 active:bg-rose-700"}`}>🎤</button>
            <p className="mt-2 text-sm text-slate-500">{listening ? "Listening…" : "Tap the mic and say it"}</p>
          </>
        ) : (
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-medium">Speech recognition isn&apos;t available in this browser.</p>
            <p className="mt-1">Listen, say it out loud, then rate yourself. Chrome or Safari on your phone can check your voice.</p>
            <div className="mt-3 flex justify-center gap-2">
              <button onClick={() => { setGood((g) => g + 1); void addPractice(1, 1, 3); next(); }} className="min-h-11 rounded-full bg-emerald-600 px-5 font-semibold text-white">I said it ✓</button>
              <button onClick={() => speak(card.speak, settings.speechRate)} className="min-h-11 rounded-full bg-white px-5 font-semibold">Hear again</button>
            </div>
          </div>
        )}
      </div>

      {err && <p className="mt-3 text-center text-sm text-rose-700" role="alert">{err}</p>}
      {verdict && (
        <div className={`mt-4 rounded-2xl p-4 text-center ${verdict.v === "great" ? "bg-emerald-50 text-emerald-900" : verdict.v === "close" ? "bg-amber-50 text-amber-900" : "bg-rose-50 text-rose-900"}`} role="status">
          <p className="text-lg font-semibold">{verdict.v === "great" ? "すごい! Great!" : verdict.v === "close" ? "Almost! Try once more" : "Not quite. Listen and try again"}</p>
          <p className="mt-1 text-sm">I heard: <span lang="ja">{heard}</span> ({Math.round(verdict.score * 100)}%)</p>
        </div>
      )}
      <div className="mt-5 flex justify-center">
        <button onClick={next} className="min-h-12 rounded-full bg-slate-800 px-8 font-semibold text-white">Next →</button>
      </div>
    </div>
  );
}

