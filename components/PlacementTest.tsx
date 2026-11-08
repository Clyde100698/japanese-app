"use client";
import { useEffect, useState } from "react";
import { loadDeck, type DeckCard } from "@/lib/decks";
import { makeChoices, shuffle } from "@/lib/quiz";
import { speak } from "@/lib/speech";
import { useSettings } from "@/lib/settings";
import { setMeta } from "@/lib/db";

interface Question {
  level: string; // "Kana", "N5", "N4", "N3", "N2"
  card: DeckCard;
  options: DeckCard[];
}

interface Props {
  onDone: (placedStageId: string) => void;
  onCancel: () => void;
}

export default function PlacementTest({ onDone, onCancel }: Props) {
  const [settings] = useSettings();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [curr, setCurr] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { correct: number; total: number }>>({});
  const [finished, setFinished] = useState(false);
  const [placedStage, setPlacedStage] = useState<string>("hiragana");

  useEffect(() => {
    (async () => {
      const qList: Question[] = [];
      const testPlan = [
        { level: "Kana", deckId: "hiragana", count: 3 },
        { level: "Kana", deckId: "katakana", count: 2 },
        { level: "N5", deckId: "vocab-n5", count: 4 },
        { level: "N4", deckId: "vocab-n4", count: 4 },
        { level: "N3", deckId: "vocab-n3", count: 4 },
        { level: "N2", deckId: "vocab-n2", count: 3 },
      ];

      for (const t of testPlan) {
        try {
          const cards = await loadDeck(t.deckId);
          if (cards.length < 5) continue;
          const pickedCards = shuffle(cards).slice(0, t.count);
          for (const card of pickedCards) {
            const options = makeChoices(card, cards, "front-to-answer", 4);
            qList.push({ level: t.level, card, options });
          }
        } catch {
          // ignore
        }
      }

      setQuestions(qList);
      setLoading(false);
    })();
  }, []);

  const handleAnswer = (option: DeckCard) => {
    if (picked) return;
    const q = questions[curr];
    const isCorrect = option.id === q.card.id;
    setPicked(option.id);

    setScores((prev) => {
      const curLevel = prev[q.level] || { correct: 0, total: 0 };
      return {
        ...prev,
        [q.level]: { correct: curLevel.correct + (isCorrect ? 1 : 0), total: curLevel.total + 1 },
      };
    });

    if (isCorrect) {
      speak(q.card.speak, settings.speechRate);
    }

    setTimeout(() => {
      if (curr + 1 >= questions.length) {
        // Calculate placement
        const s = {
          ...scores,
          [q.level]: {
            correct: (scores[q.level]?.correct ?? 0) + (isCorrect ? 1 : 0),
            total: (scores[q.level]?.total ?? 0) + 1,
          },
        };
        // Criteria
        const kanaPct = (s["Kana"]?.correct ?? 0) / (s["Kana"]?.total || 1);
        const n5Pct = (s["N5"]?.correct ?? 0) / (s["N5"]?.total || 1);
        const n4Pct = (s["N4"]?.correct ?? 0) / (s["N4"]?.total || 1);
        const n3Pct = (s["N3"]?.correct ?? 0) / (s["N3"]?.total || 1);

        let placed = "hiragana";
        if (kanaPct < 0.8) {
          placed = "hiragana";
        } else if (n5Pct < 0.75) {
          placed = "vocab-n5";
        } else if (n4Pct < 0.75) {
          placed = "n4";
        } else if (n3Pct < 0.75) {
          placed = "n3";
        } else {
          placed = "n2";
        }

        setPlacedStage(placed);
        setFinished(true);
      } else {
        setPicked(null);
        setCurr((c) => c + 1);
      }
    }, 700);
  };

  const applyPlacement = async () => {
    await setMeta("user_placement_level", placedStage);
    onDone(placedStage);
  };

  if (loading) return <p className="p-4 text-slate-500">Preparing placement test questions…</p>;
  if (!questions.length) return <p className="p-4 text-rose-600">Failed to load questions. Please try again.</p>;

  if (finished) {
    const stageNames: Record<string, string> = {
      hiragana: "Hiragana & Katakana",
      "vocab-n5": "JLPT N5 (Beginner)",
      n4: "JLPT N4 (Upper Beginner)",
      n3: "JLPT N3 (Intermediate)",
      n2: "JLPT N2 (Upper Intermediate)",
    };

    return (
      <div className="pt-6 text-center">
        <div className="text-6xl">🎯</div>
        <h2 className="mt-3 text-2xl font-bold">Placement Complete!</h2>
        <p className="mt-2 text-sm text-slate-600">Based on your tap responses, your recommended starting level is:</p>
        <div className="mx-auto my-4 max-w-xs rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
          <span className="text-2xl font-extrabold text-rose-700">{stageNames[placedStage] ?? placedStage}</span>
        </div>
        <p className="text-xs text-slate-500">All earlier lessons will be marked as cleared for you.</p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={applyPlacement}
            className="min-h-12 w-full rounded-full bg-rose-600 px-6 font-semibold text-white active:bg-rose-700"
          >
            Start at {stageNames[placedStage]}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 w-full rounded-full bg-slate-100 font-medium text-slate-700"
          >
            Keep current progress
          </button>
        </div>
      </div>
    );
  }

  const q = questions[curr];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <button type="button" onClick={onCancel} className="min-h-11 px-1">
          ✕ Cancel
        </button>
        <span>
          Question {curr + 1} of {questions.length} ({q.level})
        </span>
      </div>

      <div className="flex min-h-36 flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow ring-1 ring-slate-200">
        <span className="text-5xl font-medium" lang="ja">
          {q.card.front}
        </span>
        {q.card.reading && <span className="mt-1 text-sm text-slate-500">{q.card.reading}</span>}
        <span className="mt-3 text-xs text-slate-400">What does this mean?</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {q.options.map((opt) => {
          const isSelected = picked === opt.id;
          const isCorrect = opt.id === q.card.id;
          const style = picked
            ? isCorrect
              ? "bg-emerald-100 ring-emerald-500 text-emerald-900"
              : isSelected
              ? "bg-rose-100 ring-rose-500 text-rose-900"
              : "bg-white opacity-40 ring-slate-200"
            : "bg-white ring-slate-200 active:bg-rose-50";

          return (
            <button
              key={opt.id}
              type="button"
              disabled={!!picked}
              onClick={() => handleAnswer(opt)}
              className={`min-h-16 rounded-2xl p-3 text-sm font-semibold shadow-sm ring-1 transition-all ${style}`}
            >
              {opt.answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}
