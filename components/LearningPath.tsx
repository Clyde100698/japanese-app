"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCards, getMeta } from "@/lib/db";
import { loadDeck } from "@/lib/decks";
import { computeMastery } from "@/lib/progress";
import PlacementTest from "./PlacementTest";

export interface PathStage {
  id: string;
  deckId: string;
  title: string;
  ja: string;
  desc: string;
  type: "kana" | "vocab" | "grammar" | "kanji" | "bundle";
  learnHref?: string;
  reviewDeck?: string;
}

const STAGES: PathStage[] = [
  { id: "hiragana", deckId: "hiragana", title: "Hiragana", ja: "ひらがな", desc: "46 basic syllables + sounds", type: "kana", learnHref: "/learn?script=hiragana", reviewDeck: "hiragana" },
  { id: "katakana", deckId: "katakana", title: "Katakana", ja: "カタカナ", desc: "Loanwords & foreign names", type: "kana", learnHref: "/learn?script=katakana", reviewDeck: "katakana" },
  { id: "vocab-n5", deckId: "vocab-n5", title: "N5 Vocabulary", ja: "N5 単語", desc: "Core daily words & greetings", type: "vocab", reviewDeck: "vocab-n5" },
  { id: "grammar-n5", deckId: "grammar-n5", title: "N5 Grammar", ja: "N5 文法", desc: "Essential sentence structures", type: "grammar", reviewDeck: "grammar-n5" },
  { id: "kanji-n5", deckId: "kanji-n5", title: "N5 Kanji", ja: "N5 漢字", desc: "First 100 essential characters", type: "kanji", reviewDeck: "kanji-n5" },
  { id: "n4", deckId: "vocab-n4", title: "JLPT N4", ja: "N4 コース", desc: "Elementary Japanese (vocab & grammar)", type: "bundle", reviewDeck: "vocab-n4" },
  { id: "n3", deckId: "vocab-n3", title: "JLPT N3", ja: "N3 コース", desc: "Intermediate Japanese bridge", type: "bundle", reviewDeck: "vocab-n3" },
  { id: "n2", deckId: "vocab-n2", title: "JLPT N2", ja: "N2 コース", desc: "Advanced conversational & work Japanese", type: "bundle", reviewDeck: "vocab-n2" },
  { id: "n1", deckId: "vocab-n1", title: "JLPT N1", ja: "N1 コース", desc: "Fluent, academic & formal Japanese", type: "bundle", reviewDeck: "vocab-n1" },
];

export default function LearningPath() {
  const [mastery, setMastery] = useState<Record<string, number>>({});
  const [testing, setTesting] = useState(false);
  const [placement, setPlacement] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cards = await getAllCards();
      const userLevel = (await getMeta<string>("user_placement_level")) || null;
      setPlacement(userLevel);

      const map: Record<string, number> = {};
      for (const st of STAGES) {
        try {
          const list = await loadDeck(st.deckId);
          if (list.length) {
            const b = computeMastery(list.map((c) => c.id), cards);
            map[st.id] = b.percentage;
          }
        } catch {
          // deck loading
        }
      }
      setMastery(map);
    })();
  }, []);

  if (testing) {
    return (
      <PlacementTest
        onDone={(placedId) => {
          setPlacement(placedId);
          setTesting(false);
        }}
        onCancel={() => setTesting(false)}
      />
    );
  }

  const stageOrder = STAGES.map((s) => s.id);
  const placementIndex = placement ? stageOrder.indexOf(placement) : 0;

  return (
    <div>
      {/* Placement Test Banner */}
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 p-4 text-white shadow-md">
        <div>
          <span className="block text-sm font-bold">Already know some Japanese?</span>
          <span className="block text-xs text-sky-100">Take a 2-minute tap test to skip ahead.</span>
        </div>
        <button
          type="button"
          onClick={() => setTesting(true)}
          className="min-h-11 shrink-0 rounded-full bg-white px-4 text-xs font-bold text-sky-800 shadow active:bg-sky-50"
        >
          Placement Test 🎯
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Learning Path</h2>
        {placement && (
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Placed at {STAGES.find((s) => s.id === placement)?.title}
          </span>
        )}
      </div>

      <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-0.5 before:bg-slate-200">
        {STAGES.map((st, i) => {
          const pct = mastery[st.id] ?? 0;
          const isSkipped = i < placementIndex;
          const isCurrent = i === placementIndex;

          return (
            <li
              key={st.id}
              className={`relative flex flex-col rounded-3xl bg-white p-4 shadow-sm ring-1 transition-all ${
                isCurrent
                  ? "ring-2 ring-rose-500 shadow-md"
                  : isSkipped
                  ? "ring-emerald-200 bg-emerald-50/20"
                  : "ring-slate-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold shadow-sm ${
                    pct >= 80 || isSkipped
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {isSkipped ? "✓" : i + 1}
                </span>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                    <span className="text-sm font-medium text-slate-400" lang="ja">
                      {st.ja}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{st.desc}</p>

                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isSkipped ? "bg-emerald-400" : "bg-rose-500"
                        }`}
                        style={{ width: `${isSkipped ? 100 : pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {isSkipped ? "Cleared" : `${pct}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-2.5">
                {st.learnHref ? (
                  <Link
                    href={st.learnHref}
                    className="flex min-h-10 flex-1 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 active:bg-slate-200"
                  >
                    📖 Learn Charts
                  </Link>
                ) : null}
                <Link
                  href="/review"
                  className="flex min-h-10 flex-1 items-center justify-center rounded-xl bg-rose-50 text-xs font-semibold text-rose-700 active:bg-rose-100"
                >
                  🔁 Review Cards
                </Link>
                <Link
                  href="/quiz"
                  className="flex min-h-10 flex-1 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 active:bg-slate-200"
                >
                  🎮 Tap Quiz
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
