"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  Heart,
  Star,
  Volume2,
  Sparkles,
  X,
  ArrowRight,
  RotateCcw,
  Award,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import Mascot, { type MascotState } from "@/components/mascot/Mascot";
import Button3D from "@/components/game/Button3D";
import {
  playTapSound,
  playCorrectSound,
  playWrongSound,
  playCelebrateSound,
  playMascotSqueak,
  triggerHaptic,
} from "@/lib/sound";
import {
  type LessonNode,
  type GameProfile,
  getGameProfile,
  deductHeart,
  refillHearts,
  completeGameNode,
} from "@/lib/gameState";
import { loadDeck, type DeckCard } from "@/lib/decks";
import { speak } from "@/lib/speech";
import { shuffle } from "@/lib/quiz";
import { createInitialCard, review } from "@/lib/sm2";
import { getCard, setCard, recordReview } from "@/lib/db";

interface Props {
  node: LessonNode;
  onClose: () => void;
  onCompleted: (stars: 1 | 2 | 3, nextNodeId: string | null) => void;
}

type Step = "gadget" | "quiz" | "no_hearts" | "victory";

interface Question {
  card: DeckCard;
  prompt: string;
  subPrompt?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function GameLessonModal({ node, onClose, onCompleted }: Props) {
  const [step, setStep] = useState<Step>("gadget");
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<"ok" | "bad" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("gadget");
  const [mascotSpeech, setMascotSpeech] = useState<
    string | { ja: string; en: string; romaji?: string }
  >({
    ja: "今日の道具はこれ！",
    en: "Here is today's lesson gadget!",
    romaji: "Kyou no dougu wa kore!",
  });

  // Load profile on mount
  useEffect(() => {
    void getGameProfile().then(setProfile);
  }, []);

  // Load deck & prepare questions
  useEffect(() => {
    (async () => {
      const deckId = node.deckId || "hiragana";
      const loaded = await loadDeck(deckId);
      if (!loaded.length) return;
      setCards(loaded);

      // Select specific cards based on node title or shuffle a subset
      let subset: DeckCard[] = [];
      if (node.title.includes("あいうえお")) {
        subset = loaded.filter((c) => ["あ", "い", "う", "え", "お"].includes(c.front));
      } else if (node.title.includes("かきくけこ")) {
        subset = loaded.filter((c) => ["か", "き", "く", "け", "こ"].includes(c.front));
      } else if (node.title.includes("さしすせそ")) {
        subset = loaded.filter((c) => ["さ", "し", "す", "せ", "そ"].includes(c.front));
      } else if (node.title.includes("たちつてと")) {
        subset = loaded.filter((c) => ["た", "ち", "つ", "て", "と"].includes(c.front));
      } else if (node.title.includes("なにぬねの")) {
        subset = loaded.filter((c) => ["な", "に", "ぬ", "ね", "の"].includes(c.front));
      } else if (node.title.includes("はひふへほ")) {
        subset = loaded.filter((c) => ["は", "ひ", "ふ", "へ", "ほ"].includes(c.front));
      } else if (node.title.includes("まみむめも")) {
        subset = loaded.filter((c) =>
          ["ま", "み", "む", "め", "も", "や", "ゆ", "よ"].includes(c.front),
        );
      } else if (node.title.includes("らりるれろ")) {
        subset = loaded.filter((c) =>
          ["ら", "り", "る", "れ", "ろ", "わ", "を", "ん"].includes(c.front),
        );
      }

      if (subset.length < 3) {
        subset = shuffle(loaded).slice(0, node.totalQuestions);
      }

      // Generate questions
      const generated: Question[] = subset.map((c) => {
        // Collect 3 distractor answers
        const otherCards = loaded.filter((o) => o.id !== c.id);
        const distractors = shuffle(otherCards).slice(0, 3);
        const allOpts = shuffle([c.answer, ...distractors.map((d) => d.answer)]);

        return {
          card: c,
          prompt: c.front,
          subPrompt: c.romaji || c.reading,
          options: allOpts,
          correctAnswer: c.answer,
          explanation: c.detail || `Sound: ${c.romaji || c.reading || c.front}`,
        };
      });

      setQuestions(generated);
    })();
  }, [node]);

  // Trigger gadget reveal sound on mount
  useEffect(() => {
    if (step === "gadget") {
      playMascotSqueak();
    }
  }, [step]);

  const currentQ = questions[qIndex];

  // Start the quiz
  const handleStart = () => {
    playTapSound();
    if (!profile || profile.hearts <= 0) {
      setStep("no_hearts");
      return;
    }
    setStep("quiz");
    setMascotState("thinking");
    setMascotSpeech({
      ja: "がんばって！",
      en: "Tap your answer!",
      romaji: "Ganbatte!",
    });
    if (questions[0]) {
      speak(questions[0].card.speak, 0.9);
    }
  };

  // Answer handler
  const handleAnswer = async (opt: string) => {
    if (selectedOption || !currentQ || !profile) return;
    setSelectedOption(opt);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
      triggerHaptic("success");
      setVerdict("ok");
      setCorrectCount((c) => c + 1);
      setMascotState("cheering");
      setMascotSpeech({
        ja: "すごい！ 正解！",
        en: "Awesome! You got it right!",
        romaji: "Sugoi! Seikai!",
      });

      // Queue card into SRS / record correct
      try {
        const existing = await getCard(currentQ.card.id);
        const now = Date.now();
        const base = existing || createInitialCard(currentQ.card.id, now);
        const updated = review(base, currentQ.card.id, "good", now);
        await setCard(updated);
        await recordReview(base, updated, "good", now);
      } catch (err) {
        console.warn("SRS save error", err);
      }
    } else {
      playWrongSound();
      triggerHaptic("warning");
      setVerdict("bad");
      setMascotState("sad");
      setMascotSpeech({
        ja: "だいじょうぶ！",
        en: "Almost! Check the hint below.",
        romaji: "Daijoubu!",
      });

      // Deduct heart
      const nextHearts = await deductHeart();
      setProfile((p) => (p ? { ...p, hearts: nextHearts } : null));

      // Queue card into SRS as again
      try {
        const existing = await getCard(currentQ.card.id);
        const now = Date.now();
        const base = existing || createInitialCard(currentQ.card.id, now);
        const updated = review(base, currentQ.card.id, "again", now);
        await setCard(updated);
        await recordReview(base, updated, "again", now);
      } catch (err) {
        console.warn("SRS save error", err);
      }
    }
  };

  // Move to next question or victory
  const handleNext = () => {
    playTapSound();
    if (!profile) return;

    if (profile.hearts <= 0) {
      setStep("no_hearts");
      return;
    }

    if (qIndex + 1 < questions.length) {
      const nextIdx = qIndex + 1;
      setQIndex(nextIdx);
      setSelectedOption(null);
      setVerdict(null);
      setMascotState("thinking");
      setMascotSpeech({
        ja: "次はこれ！",
        en: "Here is the next one!",
        romaji: "Tsugi wa kore!",
      });
      if (questions[nextIdx]) {
        speak(questions[nextIdx].card.speak, 0.9);
      }
    } else {
      // Finished all questions!
      finishLesson();
    }
  };

  // Finish lesson with celebration
  const finishLesson = async () => {
    setStep("victory");
    playCelebrateSound();
    setMascotState("cheering");
    setMascotSpeech({
      ja: "よくできました！",
      en: "Lesson Complete! Fantastic job!",
      romaji: "Yoku dekimashita!",
    });

    // Fire confetti burst!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2563EB", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6"],
    });

    // Calculate stars
    const total = Math.max(1, questions.length);
    const accuracy = correctCount / total;
    let starsAwarded: 1 | 2 | 3 = 1;
    if (accuracy >= 0.99) starsAwarded = 3;
    else if (accuracy >= 0.75) starsAwarded = 2;

    const { nextNodeId, newProfile } = await completeGameNode(
      node.id,
      starsAwarded,
      node.xpReward,
      node.gemReward,
    );
    setProfile(newProfile);
    onCompleted(starsAwarded, nextNodeId);
  };

  // Refill hearts using gems
  const handleRefillHearts = async () => {
    playCelebrateSound();
    const newHearts = await refillHearts();
    setProfile((p) => (p ? { ...p, hearts: newHearts } : null));
    setStep("quiz");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800">
        {/* ========================================================================= */}
        {/* STEP 1: GADGET REVEAL ("今日の道具はこれ！") */}
        {/* ========================================================================= */}
        {step === "gadget" && (
          <div className="p-6 text-center space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-3 py-1 rounded-full">
                Lesson Briefing
              </span>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mascot in Gadget State with rotating sunburst rays */}
            <div className="relative flex justify-center py-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-44 w-44 rounded-full bg-gradient-to-r from-amber-300/30 via-blue-400/20 to-pink-300/30 blur-xl animate-pulse" />
              </div>
              <Mascot
                state="gadget"
                size={140}
                speech={mascotSpeech}
                bubblePlacement="top"
                interactive={true}
              />
            </div>

            {/* Node Info Box */}
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {node.titleJa}
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {node.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {questions.length} bite-sized exercises · Tap to answer
              </p>

              {/* Rewards preview */}
              <div className="flex items-center justify-center gap-3 pt-3">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full ring-1 ring-amber-300/40">
                  <Sparkles className="h-3.5 w-3.5" />
                  +{node.xpReward} XP
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full ring-1 ring-blue-300/40">
                  💎 +{node.gemReward} Gems
                </span>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <Button3D
                variant="primary"
                fullWidth
                size="lg"
                iconRight={<ArrowRight className="h-5 w-5" />}
                onClick={handleStart}
              >
                Start Lesson!
              </Button3D>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: QUIZ RUNNER (100% TAP INPUT) */}
        {/* ========================================================================= */}
        {step === "quiz" && currentQ && (
          <div className="p-5 space-y-4">
            {/* Top Bar with progress & hearts */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="h-3 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((qIndex + 1) / Math.max(1, questions.length)) * 100}%`,
                  }}
                />
              </div>

              {/* Hearts Indicator */}
              <div className="flex items-center gap-1 text-xs font-black text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full ring-1 ring-rose-200 dark:ring-rose-900">
                <Heart className="h-4 w-4 fill-rose-500" />
                <span>{profile?.hearts ?? 5}</span>
              </div>
            </div>

            {/* Prompt & Mascot Assistant */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Select the correct match
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h3
                    className="text-3xl font-black text-slate-900 dark:text-slate-100"
                    lang="ja"
                  >
                    {currentQ.prompt}
                  </h3>
                  <button
                    onClick={() => speak(currentQ.card.speak, 0.9)}
                    className="p-1 text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition"
                    aria-label="Play sound"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
                {currentQ.subPrompt && (
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {currentQ.subPrompt}
                  </p>
                )}
              </div>

              {/* Reactive Mascot in corner */}
              <Mascot
                state={mascotState}
                size={70}
                speech={mascotSpeech}
                bubblePlacement="bottom"
                interactive={true}
              />
            </div>

            {/* 4 Chunky 3D Option Buttons */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;
                let btnVariant: "neutral" | "success" | "sakura" = "neutral";
                let customStyle = "";

                if (selectedOption) {
                  if (isCorrect) {
                    btnVariant = "success";
                  } else if (isSelected) {
                    customStyle =
                      "bg-rose-500 text-white border-b-4 border-rose-700 shadow-md";
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(opt)}
                    className={`btn-3d w-full p-3.5 rounded-2xl text-left font-bold text-sm transition flex items-center justify-between ${
                      btnVariant === "success"
                        ? "btn-3d-emerald"
                        : customStyle || "btn-3d-neutral"
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedOption && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Feedback Bar */}
            {verdict && (
              <div
                className={`rounded-2xl p-4 flex items-center justify-between transition animate-fade-in ${
                  verdict === "ok"
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200"
                }`}
              >
                <div>
                  <p className="font-extrabold text-sm flex items-center gap-1.5">
                    {verdict === "ok" ? "🎉 Perfect!" : "💡 Answer:"}
                    {verdict === "bad" && (
                      <span className="font-black underline">{currentQ.correctAnswer}</span>
                    )}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">{currentQ.explanation}</p>
                </div>
                <Button3D
                  variant={verdict === "ok" ? "success" : "neutral"}
                  size="sm"
                  onClick={handleNext}
                >
                  Continue
                </Button3D>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP: OUT OF HEARTS (FRIENDLY & NON-PUNISHING) */}
        {/* ========================================================================= */}
        {step === "no_hearts" && (
          <div className="p-6 text-center space-y-5">
            <div className="flex justify-center">
              <Mascot
                state="sleepy"
                size={120}
                speech={{
                  ja: "ふにゃ〜 休もう！",
                  en: "Aoi needs a breather!",
                  romaji: "Funyaa~ Yasumou!",
                }}
                bubblePlacement="top"
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Out of Hearts!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Hearts regenerate 1 every 30 minutes, or you can refill 5 hearts instantly
                using 50 gems.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button3D
                variant="accent"
                fullWidth
                size="md"
                onClick={handleRefillHearts}
              >
                💎 Refill All 5 Hearts (Free)
              </Button3D>
              <Button3D variant="neutral" fullWidth size="md" onClick={onClose}>
                Take a Break
              </Button3D>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: VICTORY & REWARDS CELEBRATION */}
        {/* ========================================================================= */}
        {step === "victory" && (
          <div className="p-6 text-center space-y-5">
            <span className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              Lesson Complete!
            </span>

            {/* Mascot Celebrating */}
            <div className="flex justify-center">
              <Mascot
                state="cheering"
                size={130}
                speech={mascotSpeech}
                bubblePlacement="top"
                interactive={true}
              />
            </div>

            {/* Golden Stars Rating */}
            <div className="flex justify-center items-center gap-2 text-amber-400 pt-1">
              <Star
                className="h-8 w-8 fill-amber-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <Star
                className="h-10 w-10 fill-amber-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <Star
                className={`h-8 w-8 animate-bounce ${
                  correctCount === questions.length ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                }`}
                style={{ animationDelay: "300ms" }}
              />
            </div>

            {/* Rewards Breakdown Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400">XP</span>
                <p className="text-base font-black text-amber-500">+{node.xpReward}</p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400">Score</span>
                <p className="text-base font-black text-emerald-500">
                  {correctCount}/{questions.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400">Gems</span>
                <p className="text-base font-black text-blue-500">+{node.gemReward}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button3D variant="primary" fullWidth size="lg" onClick={onClose}>
                Back to Map
              </Button3D>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
