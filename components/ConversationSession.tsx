"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Volume2,
  Mic,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  BookOpen,
  Sparkles,
  Info,
  Layers,
  Award,
} from "lucide-react";
import type { Scenario, DialogueLine, DialogueOption } from "@/lib/scenarios";
import { recordScenarioCompletion, addKeyPhrasesToSrs } from "@/lib/scenarios";
import { speak, ttsSupported } from "@/lib/speech";
import { listenOnce, recognitionSupported, type ListenError } from "@/lib/recognition";
import { judge } from "@/lib/speechMatch";
import { chunkJapanese, shuffle } from "@/lib/quiz";
import Furigana from "./Furigana";

export type SessionMode = "watch" | "roleplay" | "fill" | "shadow";

interface Props {
  scenario: Scenario;
  initialMode?: SessionMode;
  onExit: () => void;
}

export default function ConversationSession({ scenario, initialMode = "watch", onExit }: Props) {
  const [mode, setMode] = useState<SessionMode>(initialMode);
  const [lineIdx, setLineIdx] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);

  // Visibility toggles
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);

  // Role-play state
  const [selectedOption, setSelectedOption] = useState<DialogueOption | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Fill-the-line state
  const [placedTokens, setPlacedTokens] = useState<string[]>([]);
  const [tokenBank, setTokenBank] = useState<string[]>([]);
  const [fillVerdict, setFillVerdict] = useState<"ok" | "bad" | null>(null);

  // Shadowing & speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [listenError, setListenError] = useState<string | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [shadowScore, setShadowScore] = useState<{ score: number; verdict: string } | null>(null);

  // Completion state
  const [isCompleted, setIsCompleted] = useState(false);
  const [phrasesAdded, setPhrasesAdded] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const currentLine: DialogueLine | undefined = scenario.lines[lineIdx];
  const isLearner = currentLine?.speaker === "learner";

  // Setup fill-the-line tokens when entering a learner line in 'fill' mode
  useEffect(() => {
    if (mode === "fill" && currentLine && isLearner) {
      const correctOption = currentLine.options?.find((o) => o.isCorrect) || currentLine.options?.[0];
      const targetJa = correctOption?.ja || currentLine.ja;
      const chunks = chunkJapanese(targetJa);
      setTokenBank(shuffle(chunks));
      setPlacedTokens([]);
      setFillVerdict(null);
    }
  }, [mode, lineIdx, currentLine, isLearner]);

  // Audio playback helper
  const playLineAudio = useCallback(
    (text: string) => {
      speak(text, speechRate);
    },
    [speechRate],
  );

  // Watch mode auto-advance
  useEffect(() => {
    if (mode !== "watch" || !isPlayingAuto || !currentLine) return;

    playLineAudio(currentLine.ja);
    const textLength = currentLine.ja.length;
    const readDelay = Math.max(2800, textLength * 280);

    const timer = setTimeout(() => {
      if (lineIdx < scenario.lines.length - 1) {
        setLineIdx((prev) => prev + 1);
      } else {
        setIsPlayingAuto(false);
        setIsCompleted(true);
        recordScenarioCompletion(scenario.id, "watch");
      }
    }, readDelay);

    return () => clearTimeout(timer);
  }, [mode, isPlayingAuto, lineIdx, currentLine, scenario, playLineAudio]);

  // Handle speaker transition in roleplay mode
  useEffect(() => {
    if (mode === "roleplay" && currentLine && !isLearner) {
      playLineAudio(currentLine.ja);
    }
  }, [mode, lineIdx, currentLine, isLearner, playLineAudio]);

  // Advance to next line
  const advance = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setSpokenTranscript(null);
    setShadowScore(null);
    setFillVerdict(null);
    setListenError(null);

    if (lineIdx < scenario.lines.length - 1) {
      setLineIdx((idx) => idx + 1);
    } else {
      setIsCompleted(true);
      recordScenarioCompletion(scenario.id, mode);
    }
  };

  // Previous line
  const goBack = () => {
    if (lineIdx > 0) {
      setSelectedOption(null);
      setShowExplanation(false);
      setSpokenTranscript(null);
      setShadowScore(null);
      setFillVerdict(null);
      setListenError(null);
      setLineIdx((idx) => idx - 1);
    }
  };

  // Roleplay option selection
  const handleSelectOption = (opt: DialogueOption) => {
    setSelectedOption(opt);
    setShowExplanation(true);
    playLineAudio(opt.ja);
    if (opt.reaction) {
      setTimeout(() => {
        playLineAudio(opt.reaction!.ja);
      }, 1500);
    }
  };

  // Speech Recognition listener
  const startVoiceInput = () => {
    if (!recognitionSupported()) {
      setListenError("Speech recognition is not supported in this browser.");
      return;
    }
    setIsListening(true);
    setListenError(null);

    listenOnce({
      onResult: (alternatives) => {
        setIsListening(false);
        const top = alternatives[0] || "";
        setSpokenTranscript(top);

        if (mode === "roleplay" && currentLine?.options) {
          // Find matching option
          let bestOpt: DialogueOption | null = null;
          let highestScore = 0;
          for (const opt of currentLine.options) {
            const res = judge(alternatives, [opt.ja, opt.reading]);
            if (res.score > highestScore) {
              highestScore = res.score;
              bestOpt = opt;
            }
          }
          if (bestOpt && highestScore >= 0.5) {
            handleSelectOption(bestOpt);
          } else {
            setListenError("Could not match your speech with any option. Try tapping your choice!");
          }
        } else if (mode === "shadow" && currentLine) {
          const res = judge(alternatives, [currentLine.ja, currentLine.reading]);
          setShadowScore({ score: Math.round(res.score * 100), verdict: res.verdict });
        }
      },
      onError: (err: ListenError) => {
        setIsListening(false);
        setListenError(
          err === "not-allowed"
            ? "Microphone access was denied. Please allow microphone permissions."
            : err === "no-speech"
            ? "No speech detected. Please speak closer to the microphone."
            : "Listening was interrupted. Tap to try again.",
        );
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  // Fill the line: check answer
  const checkFillAnswer = () => {
    if (!currentLine) return;
    const correctOption = currentLine.options?.find((o) => o.isCorrect) || currentLine.options?.[0];
    const targetJa = correctOption?.ja || currentLine.ja;
    const formed = placedTokens.join("");
    const isOk = formed === targetJa.replace(/[\s、。！？]/g, "");
    setFillVerdict(isOk ? "ok" : "bad");
    playLineAudio(targetJa);
  };

  // Add key phrases to SRS
  const handleAddPhrases = async () => {
    if (phrasesAdded || scenario.keyPhrases.length === 0) return;
    const added = await addKeyPhrasesToSrs(scenario.keyPhrases);
    setAddedCount(added);
    setPhrasesAdded(true);
  };

  // Render Completion Screen
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto min-h-[70vh]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800">
          <Award className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Scenario Completed!</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400" lang="ja">
          {scenario.titleJa} ({scenario.title})
        </p>

        <div className="mt-6 w-full rounded-2xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm text-left">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Key Phrases in this Scenario
          </h3>
          <div className="mt-3 space-y-2.5">
            {scenario.keyPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2.5 ring-1 ring-slate-200/50 dark:ring-slate-800"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100" lang="ja">
                    {phrase.front}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{phrase.answer}</p>
                </div>
                <button
                  onClick={() => playLineAudio(phrase.front)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  aria-label="Listen"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 w-full space-y-3">
          <button
            onClick={handleAddPhrases}
            disabled={phrasesAdded}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 dark:bg-blue-500 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] disabled:bg-emerald-600 transition"
          >
            {phrasesAdded ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>{addedCount > 0 ? `Added ${addedCount} phrases to SRS!` : "Phrases already in SRS queue"}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Add {scenario.keyPhrases.length} Key Phrases to Review Queue</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setLineIdx(0);
                setIsCompleted(false);
                setSelectedOption(null);
                setPlacedTokens([]);
              }}
              className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-200 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Practice Again
            </button>
            <button
              onClick={onExit}
              className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-200 transition"
            >
              <Layers className="h-4 w-4" />
              Scenario Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] pb-12 max-w-lg mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Scenarios
        </button>

        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
          {scenario.level} · {scenario.category}
        </span>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-4 text-xs font-semibold">
        {[
          { key: "watch", label: "Watch" },
          { key: "roleplay", label: "Role-play" },
          { key: "fill", label: "Fill line" },
          { key: "shadow", label: "Shadow" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setMode(t.key as SessionMode);
              setIsPlayingAuto(false);
            }}
            className={`min-h-9 rounded-lg transition py-1 ${
              mode === t.key
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Progress & Speed bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-3">
        <span>
          Line {lineIdx + 1} of {scenario.lines.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFurigana((v) => !v)}
            className={`px-2 py-0.5 rounded ${
              showFurigana ? "text-blue-600 dark:text-blue-400 font-medium" : "opacity-50"
            }`}
          >
            ふりがな
          </button>
          <button
            onClick={() => setShowRomaji((v) => !v)}
            className={`px-2 py-0.5 rounded ${
              showRomaji ? "text-blue-600 dark:text-blue-400 font-medium" : "opacity-50"
            }`}
          >
            Romaji
          </button>
          <button
            onClick={() => setShowEnglish((v) => !v)}
            className={`px-2 py-0.5 rounded ${
              showEnglish ? "text-blue-600 dark:text-blue-400 font-medium" : "opacity-50"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setSpeechRate((r) => (r === 0.9 ? 1.0 : r === 1.0 ? 0.75 : 0.9))}
            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
          >
            {speechRate}x
          </button>
        </div>
      </div>

      {/* Main Dialogue Card */}
      <div className="flex-1 space-y-4">
        {currentLine && (
          <div
            className={`rounded-3xl p-5 shadow-sm ring-1 transition ${
              isLearner
                ? "bg-blue-50/50 dark:bg-blue-950/20 ring-blue-200 dark:ring-blue-900"
                : "bg-white dark:bg-slate-800 ring-slate-200 dark:ring-slate-700"
            }`}
          >
            {/* Speaker Tag */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {currentLine.speakerNameJa} ({currentLine.speakerName})
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                {currentLine.politeness}
              </span>
            </div>

            {/* Japanese Text with Furigana */}
            <div className="my-2" lang="ja">
              <Furigana text={currentLine.ja} reading={currentLine.reading} show={showFurigana} big />
            </div>

            {showRomaji && currentLine.romaji && (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{currentLine.romaji}</p>
            )}

            {showEnglish && (
              <p className="text-base text-slate-700 dark:text-slate-300 mt-2 font-medium">{currentLine.en}</p>
            )}

            {/* Listen button */}
            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => playLineAudio(currentLine.ja)}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 active:scale-95 transition"
              >
                <Volume2 className="h-4 w-4" />
                Listen
              </button>
            </div>
          </div>
        )}

        {/* Mode-Specific Interaction Area */}

        {/* 1. Watch Mode Controls */}
        {mode === "watch" && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={goBack}
              disabled={lineIdx === 0}
              className="flex min-h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 disabled:opacity-40"
              aria-label="Previous line"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsPlayingAuto((p) => !p)}
              className="flex min-h-14 px-6 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white font-semibold shadow-md active:scale-95 transition"
            >
              {isPlayingAuto ? (
                <>
                  <Pause className="h-5 w-5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>
            <button
              onClick={advance}
              className="flex min-h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
              aria-label="Next line"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* 2. Role-play Mode Interaction */}
        {mode === "roleplay" && (
          <div className="space-y-3 pt-2">
            {isLearner && currentLine?.options ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Your Turn: Choose or Speak your reply
                  </p>
                  {recognitionSupported() && (
                    <button
                      onClick={startVoiceInput}
                      disabled={isListening}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isListening
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <Mic className="h-3.5 w-3.5" />
                      {isListening ? "Listening..." : "Speak Reply"}
                    </button>
                  )}
                </div>

                {listenError && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-xl">
                    {listenError}
                  </p>
                )}

                <div className="space-y-2">
                  {currentLine.options.map((opt) => {
                    const isSelected = selectedOption?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-3.5 rounded-2xl shadow-sm ring-1 transition ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-600 text-blue-950 dark:text-blue-200"
                            : "bg-white dark:bg-slate-800 ring-slate-200 dark:ring-slate-700 text-slate-900 dark:text-slate-100 hover:ring-blue-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-base font-semibold" lang="ja">
                            {opt.ja}
                          </p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                            {opt.politeness}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.en}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Nuance & Cultural Explanation */}
                {selectedOption && showExplanation && (
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-4 ring-1 ring-slate-200 dark:ring-slate-700 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      <Info className="h-4 w-4" />
                      Cultural & Politeness Nuance
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{selectedOption.explanation}</p>

                    {selectedOption.reaction && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {selectedOption.reaction.speakerJa}&apos;s Reaction:
                        </span>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5" lang="ja">
                          {selectedOption.reaction.ja}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedOption.reaction.en}</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={advance}
                  disabled={!selectedOption}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white font-semibold disabled:opacity-40 transition shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="pt-4">
                <button
                  onClick={advance}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white font-semibold shadow-sm"
                >
                  <span>Next Turn</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. Fill-the-line Mode Interaction */}
        {mode === "fill" && isLearner && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tap the words below in order to build your response
            </p>

            {/* Placed tokens container */}
            <div
              className={`flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3.5 transition-colors ${
                fillVerdict === "ok"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                  : fillVerdict === "bad"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20"
                  : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
              }`}
              lang="ja"
            >
              {placedTokens.length === 0 && (
                <span className="w-full text-center text-sm text-slate-400">Tap tiles to assemble</span>
              )}
              {placedTokens.map((token, i) => (
                <button
                  key={`${token}-${i}`}
                  onClick={() => {
                    setPlacedTokens(placedTokens.filter((_, idx) => idx !== i));
                    setTokenBank([...tokenBank, token]);
                  }}
                  className="min-h-10 rounded-xl bg-white dark:bg-slate-800 px-3 py-1.5 text-base font-medium shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 text-slate-900 dark:text-slate-100"
                >
                  {token}
                </button>
              ))}
            </div>

            {/* Word Bank */}
            <div className="flex flex-wrap justify-center gap-2" lang="ja">
              {tokenBank.map((token, i) => (
                <button
                  key={`${token}-${i}`}
                  onClick={() => {
                    setPlacedTokens([...placedTokens, token]);
                    setTokenBank(tokenBank.filter((_, idx) => idx !== i));
                  }}
                  className="min-h-10 rounded-xl bg-white dark:bg-slate-800 px-3 py-1.5 text-base font-medium shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 text-slate-900 dark:text-slate-100 active:bg-blue-50 dark:active:bg-blue-950/40"
                >
                  {token}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={checkFillAnswer}
                disabled={placedTokens.length === 0}
                className="flex-1 min-h-12 rounded-2xl bg-blue-600 text-white font-semibold disabled:opacity-40 shadow-sm"
              >
                Check
              </button>
              <button
                onClick={advance}
                disabled={fillVerdict !== "ok"}
                className="flex-1 min-h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* 4. Shadowing Mode Interaction */}
        {mode === "shadow" && currentLine && (
          <div className="space-y-4 pt-2">
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 text-center space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Shadowing Practice
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                1. Tap &quot;Listen&quot; to hear native pacing · 2. Tap &quot;Shadow with Mic&quot; and repeat the sentence
                immediately
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => playLineAudio(currentLine.ja)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 active:scale-95 transition"
                >
                  <Volume2 className="h-4 w-4" />
                  Listen
                </button>

                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-sm transition active:scale-95 ${
                    isListening ? "bg-rose-500 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  <span>{isListening ? "Listening..." : "Shadow with Mic"}</span>
                </button>
              </div>

              {listenError && (
                <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-xl">{listenError}</p>
              )}

              {spokenTranscript && (
                <div className="pt-2 text-left bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl ring-1 ring-slate-200/50 dark:ring-slate-800">
                  <span className="text-xs font-semibold text-slate-400">What we heard:</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100" lang="ja">
                    {spokenTranscript}
                  </p>
                </div>
              )}

              {shadowScore && (
                <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                  <CheckCircle2
                    className={`h-5 w-5 ${shadowScore.score >= 80 ? "text-emerald-500" : "text-amber-500"}`}
                  />
                  <span>Pronunciation accuracy: {shadowScore.score}%</span>
                </div>
              )}
            </div>

            <button
              onClick={advance}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white font-semibold shadow-sm"
            >
              <span>Next Line</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

