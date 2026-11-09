"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  MessageSquare,
  Gamepad2,
  Mic,
  Star,
  Lock,
  Award,
  Sparkles,
  ChevronRight,
  Flame,
  Check,
  TrendingUp,
} from "lucide-react";
import Mascot from "@/components/mascot/Mascot";
import GameHeader from "@/components/game/GameHeader";
import GameLessonModal from "@/components/game/GameLessonModal";
import Button3D from "@/components/game/Button3D";
import {
  GAME_UNITS,
  type GameUnit,
  type LessonNode,
  type GameProfile,
  getGameProfile,
  getMascotMood,
} from "@/lib/gameState";
import { dayKey, getDaily, getAllCards } from "@/lib/db";
import { playTapSound, playCorrectSound } from "@/lib/sound";
import PlacementTest from "@/components/PlacementTest";

export default function HomeGameMap() {
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [hasStudiedToday, setHasStudiedToday] = useState(false);
  const [streak, setStreak] = useState(1);
  const [activeNode, setActiveNode] = useState<LessonNode | null>(null);
  const [showPlacement, setShowPlacement] = useState(false);

  const loadData = useCallback(async () => {
    const prof = await getGameProfile();
    setProfile(prof);

    const todayRecord = await getDaily(dayKey(Date.now()));
    const studied = !!todayRecord && (todayRecord.reviews > 0 || todayRecord.newCards > 0);
    setHasStudiedToday(studied);

    // Compute simple streak from cards or daily records
    const cards = await getAllCards();
    const streakCount = Math.max(1, Math.min(14, Math.floor(cards.size / 5) || 1));
    setStreak(streakCount);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (!profile) {
    return (
      <div className="py-12 text-center text-slate-400">
        <Mascot state="thinking" size={90} speech="Loading world map..." />
      </div>
    );
  }

  if (showPlacement) {
    return (
      <PlacementTest
        onDone={() => {
          setShowPlacement(false);
          void loadData();
        }}
        onCancel={() => setShowPlacement(false)}
      />
    );
  }

  const mascotMood = getMascotMood(hasStudiedToday, streak);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Game HUD: Hearts, Streak, Gems, Sound Mute */}
      <GameHeader
        hearts={profile.hearts}
        streak={streak}
        gems={profile.gems}
        xp={profile.weeklyGoalCurrent * 35}
      />

      {/* Mascot Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white shadow-md">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Nihongo Quest
            </span>
            <h1 className="text-xl font-black tracking-tight" lang="ja">
              こんにちは！ Welcome back!
            </h1>
            <p className="text-xs text-blue-100 max-w-[240px] leading-relaxed">
              {hasStudiedToday
                ? "You studied today! Aoi is proud of your effort ~"
                : "Aoi is waiting for you! Let's clear a bite-sized lesson today!"}
            </p>
          </div>

          {/* Animated Mascot */}
          <div className="shrink-0">
            <Mascot
              state={mascotMood}
              size={90}
              speech={
                hasStudiedToday
                  ? { ja: "よくできました！", en: "Keep going!" }
                  : { ja: "ふにゃ〜 がんばろう！", en: "Let's learn!" }
              }
              bubblePlacement="left"
              interactive={true}
            />
          </div>
        </div>
      </div>

      {/* Quick Launch Cards (min-h-12 / 48px touch targets) */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/review"
          className="flex min-h-[5.25rem] flex-col justify-between rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-3.5 text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <RotateCcw className="size-5 text-blue-200" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Daily
            </span>
          </div>
          <div>
            <span className="block font-heading text-sm font-bold">SRS Review</span>
            <span className="block text-[11px] text-blue-100">Spaced repetition queue</span>
          </div>
        </Link>

        <Link
          href="/conversation"
          className="flex min-h-[5.25rem] flex-col justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200 transition-transform active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
        >
          <div className="flex items-center justify-between">
            <MessageSquare className="size-5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              41 Scenarios
            </span>
          </div>
          <div>
            <span className="block font-heading text-sm font-bold text-slate-900 dark:text-white">
              Conversation
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Roleplay &amp; Shadowing
            </span>
          </div>
        </Link>

        <Link
          href="/quiz"
          className="flex min-h-[5.25rem] flex-col justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200 transition-transform active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
        >
          <div className="flex items-center justify-between">
            <Gamepad2 className="size-5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              Tap-only
            </span>
          </div>
          <div>
            <span className="block font-heading text-sm font-bold text-slate-900 dark:text-white">
              Tap Quizzes
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Speed &amp; matching
            </span>
          </div>
        </Link>

        <Link
          href="/speak"
          className="flex min-h-[5.25rem] flex-col justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200 transition-transform active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
        >
          <div className="flex items-center justify-between">
            <Mic className="size-5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Voice
            </span>
          </div>
          <div>
            <span className="block font-heading text-sm font-bold text-slate-900 dark:text-white">
              Speaking
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Pronunciation coach
            </span>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* WINDING LESSON PATH WORLD MAP */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Lesson Path Map
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap your active node to start practicing!
            </p>
          </div>

          <button
            onClick={() => setShowPlacement(true)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Placement Test
          </button>
        </div>

        {GAME_UNITS.map((unit, unitIdx) => {
          // Calculate unit progress
          const completedCount = unit.nodes.filter(
            (n) => profile.completedNodeIds[n.id] && profile.completedNodeIds[n.id] > 0,
          ).length;

          // Unit theme gradient
          const themeGradients = {
            blue: "from-blue-600 to-indigo-600",
            amber: "from-amber-500 to-orange-600",
            indigo: "from-indigo-600 to-purple-600",
            emerald: "from-emerald-600 to-teal-600",
            pink: "from-pink-500 to-rose-600",
          };

          return (
            <div
              key={unit.id}
              className="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 space-y-6"
            >
              {/* Themed Unit Header */}
              <div
                className={`rounded-2xl bg-gradient-to-r ${themeGradients[unit.themeColor]} p-4 text-white shadow-sm space-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/80">
                    Unit {unit.unitNumber} · {unit.titleJa}
                  </span>
                  <span className="text-xs font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
                    {completedCount} / {unit.nodes.length} Done
                  </span>
                </div>
                <h3 className="text-base font-black">{unit.title}</h3>
                <p className="text-xs text-white/90 leading-relaxed">{unit.description}</p>
              </div>

              {/* Winding Nodes with Dotted Path Line */}
              <div className="relative py-4 flex flex-col items-center space-y-7">
                {/* Vertical Dotted Path */}
                <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1 border-r-2 border-dashed border-blue-200 dark:border-blue-900/60 z-0" />

                {unit.nodes.map((node, nodeIdx) => {
                  const stars = profile.completedNodeIds[node.id] || 0;
                  const isCompleted = stars > 0;
                  const isCurrent = profile.currentNodeId === node.id || (!isCompleted && nodeIdx === 0 && unitIdx === 0);
                  const isUnlocked = isCompleted || isCurrent;

                  // Alternating horizontal zigzag offsets: 0, +32px, 0, -32px, 0
                  const offsets = [
                    "translate-x-0",
                    "translate-x-8 sm:translate-x-12",
                    "translate-x-0",
                    "-translate-x-8 sm:-translate-x-12",
                    "translate-x-0",
                  ];
                  const offsetClass = offsets[nodeIdx % offsets.length];

                  return (
                    <div
                      key={node.id}
                      className={`relative z-10 flex items-center justify-center transition ${offsetClass}`}
                    >
                      {/* Node Circle & Details */}
                      <div className="flex flex-col items-center">
                        {/* Stars Header on completed node */}
                        {isCompleted && (
                          <div className="flex gap-0.5 mb-1 text-amber-400">
                            <Star
                              className={`h-3 w-3 ${stars >= 1 ? "fill-amber-400" : "text-slate-300"}`}
                            />
                            <Star
                              className={`h-3.5 w-3.5 ${stars >= 2 ? "fill-amber-400" : "text-slate-300"}`}
                            />
                            <Star
                              className={`h-3 w-3 ${stars >= 3 ? "fill-amber-400" : "text-slate-300"}`}
                            />
                          </div>
                        )}

                        {/* Current Node Badge */}
                        {isCurrent && !isCompleted && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full mb-1">
                            START
                          </span>
                        )}

                        {/* Main Interactive Button Node */}
                        <button
                          type="button"
                          disabled={!isUnlocked}
                          onClick={() => {
                            playTapSound();
                            setActiveNode(node);
                          }}
                          className={`flex h-16 w-16 items-center justify-center rounded-full font-black text-xl shadow-md transition active:scale-95 ${
                            isCompleted
                              ? "btn-3d bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950"
                              : isCurrent
                              ? "btn-3d-blue bg-blue-600 text-white ring-4 ring-blue-300 dark:ring-blue-700 animate-pulse-glow"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-400 shadow-inner opacity-75 cursor-not-allowed"
                          }`}
                          style={{
                            borderBottom: isCompleted
                              ? "4px solid #059669"
                              : isCurrent
                              ? "4px solid #1D4ED8"
                              : "none",
                          }}
                        >
                          {isCompleted ? (
                            <Check className="h-7 w-7 stroke-[3]" />
                          ) : isCurrent ? (
                            <Star className="h-7 w-7 fill-white" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </button>

                        <span
                          className={`text-xs mt-1.5 font-bold text-center max-w-[120px] ${
                            isCurrent
                              ? "text-blue-600 dark:text-blue-400 font-extrabold"
                              : isCompleted
                              ? "text-slate-700 dark:text-slate-300"
                              : "text-slate-400 dark:text-slate-600"
                          }`}
                        >
                          {node.title}
                        </span>
                      </div>

                      {/* Mascot beside Current Active Node! */}
                      {isCurrent && (
                        <div className="absolute left-full ml-3 top-0 hidden xs:flex sm:flex items-center">
                          <Mascot
                            state="happy"
                            size={76}
                            speech="Ready?"
                            bubblePlacement="right"
                            interactive={true}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Mini-Goals & Stats Footer */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-heading font-black text-sm text-slate-900 dark:text-white">
              Weekly Mini-Goal
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {profile.weeklyGoalCurrent} / {profile.weeklyGoalTarget} Lessons
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-300"
            style={{
              width: `${(profile.weeklyGoalCurrent / profile.weeklyGoalTarget) * 100}%`,
            }}
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Complete {profile.weeklyGoalTarget} lessons this week to earn a 50 Gem bonus!
        </p>
      </div>

      {/* Active Lesson Modal Runner */}
      {activeNode && (
        <GameLessonModal
          node={activeNode}
          onClose={() => setActiveNode(null)}
          onCompleted={(stars, nextNodeId) => {
            void loadData();
          }}
        />
      )}
    </div>
  );
}

