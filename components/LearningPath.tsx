"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, Check, BookOpen, RotateCcw, Gamepad2, ArrowRight } from "lucide-react";
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
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md dark:from-blue-700 dark:to-indigo-800">
        <div>
          <span className="block font-heading text-sm font-bold">Already know some Japanese?</span>
          <span className="block text-xs text-blue-100">Take a 2-minute tap test to skip ahead.</span>
        </div>
        <button
          type="button"
          onClick={() => setTesting(true)}
          className="flex min-h-12 shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-bold text-blue-700 shadow active:bg-blue-50 dark:bg-slate-900 dark:text-blue-400 dark:active:bg-slate-800"
        >
          <Target className="size-4" />
          <span>Placement Test</span>
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Learning Path</h2>
        {placement && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            Placed at {STAGES.find((s) => s.id === placement)?.title}
          </span>
        )}
      </div>

      <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {STAGES.map((st, i) => {
          const pct = mastery[st.id] ?? 0;
          const isSkipped = i < placementIndex;
          const isCurrent = i === placementIndex;

          return (
            <li
              key={st.id}
              className={`relative flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 transition-all dark:bg-slate-900 ${
                isCurrent
                  ? "ring-2 ring-blue-500 shadow-md dark:ring-blue-400"
                  : isSkipped
                  ? "ring-emerald-200 bg-emerald-50/20 dark:ring-emerald-900/40 dark:bg-emerald-950/20"
                  : "ring-slate-200 dark:ring-slate-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold shadow-sm ${
                    pct >= 80 || isSkipped
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {isSkipped ? <Check className="size-5" /> : i + 1}
                </span>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">{st.title}</h3>
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500" lang="ja">
                      {st.ja}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{st.desc}</p>

                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isSkipped ? "bg-emerald-400" : "bg-blue-600 dark:bg-blue-400"
                        }`}
                        style={{ width: `${isSkipped ? 100 : pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {isSkipped ? "Cleared" : `${pct}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (48px tap targets) */}
              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                {st.learnHref ? (
                  <Link
                    href={st.learnHref}
                    className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
                  >
                    <BookOpen className="size-3.5" />
                    <span>Learn</span>
                  </Link>
                ) : null}
                <Link
                  href="/review"
                  className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 text-xs font-semibold text-blue-700 active:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:active:bg-blue-900/60"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Review</span>
                </Link>
                <Link
                  href="/quiz"
                  className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
                >
                  <Gamepad2 className="size-3.5" />
                  <span>Quiz</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
