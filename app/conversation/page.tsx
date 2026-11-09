"use client";
import { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  Play,
  Mic,
  BookOpen,
  Filter,
  ChevronRight,
  Headphones,
  Search,
} from "lucide-react";
import type { Scenario, ScenarioProgress, ConversationBadge } from "@/lib/scenarios";
import { loadScenarios, getScenarioProgress, computeConversationBadges } from "@/lib/scenarios";
import ConversationSession, { type SessionMode } from "@/components/ConversationSession";
import Mascot from "@/components/mascot/Mascot";

export default function ConversationPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [progress, setProgress] = useState<ScenarioProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Active scenario state
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activeMode, setActiveMode] = useState<SessionMode>("roleplay");

  // Filter state
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    async function init() {
      const [list, prog] = await Promise.all([loadScenarios(), getScenarioProgress()]);
      setScenarios(list);
      setProgress(prog);
      setLoading(false);
    }
    init();
  }, []);

  const completedSet = useMemo(() => new Set(progress?.completedIds || []), [progress]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    scenarios.forEach((s) => set.add(s.category));
    return ["All", ...Array.from(set)];
  }, [scenarios]);

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      if (selectedLevel !== "All" && s.level !== selectedLevel) return false;
      if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.titleJa.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [scenarios, selectedLevel, selectedCategory, searchQuery]);

  const badges: ConversationBadge[] = useMemo(() => {
    if (!progress) return [];
    return computeConversationBadges(scenarios, progress);
  }, [scenarios, progress]);

  // Refresh progress when returning from a session
  const handleExitSession = async () => {
    setActiveScenario(null);
    const updated = await getScenarioProgress();
    setProgress(updated);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500">Loading conversation scenarios...</p>
        </div>
      </div>
    );
  }

  // Active session view
  if (activeScenario) {
    return (
      <ConversationSession
        scenario={activeScenario}
        initialMode={activeMode}
        onExit={handleExitSession}
      />
    );
  }

  const completedCount = completedSet.size;
  const totalCount = scenarios.length;
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          Conversation Scenarios
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Scripted branching dialogues from N5 to N1. Tap to reply or speak with your voice.
        </p>
      </div>

      {/* Progress & Badges Card with Mascot */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Conversation Cafe
            </span>
            <div className="text-2xl font-black">
              {completedCount} / {totalCount} Completed
            </div>
            <p className="text-xs text-blue-100 max-w-[200px]">
              Tap or speak your replies in 41 branching real-world dialogues.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2">
            <Mascot
              state="happy"
              size={80}
              speech={{ ja: "話そう！", en: "Let's chat!" }}
              bubblePlacement="left"
              interactive={true}
            />
            <button
              onClick={() => setShowBadges((v) => !v)}
              className="flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[11px] font-bold hover:bg-white/30 transition"
            >
              <Award className="h-3.5 w-3.5" />
              <span>{unlockedBadgesCount} / {badges.length} Badges</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-blue-950/40 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.round((completedCount / (totalCount || 1)) * 100)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-blue-100 font-medium">
          <span>{progress?.addedPhrases.length || 0} phrases in SRS queue</span>
          <span>{Math.round((completedCount / (totalCount || 1)) * 100)}% path complete</span>
        </div>
      </div>

      {/* Badges Drawer / Expandable List */}
      {showBadges && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              Conversation Badges
            </h3>
            <button
              onClick={() => setShowBadges(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`flex items-start gap-3 rounded-2xl p-3 ring-1 transition ${
                  b.unlocked
                    ? "bg-amber-50/60 dark:bg-amber-950/20 ring-amber-200 dark:ring-amber-800"
                    : "bg-slate-50 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 opacity-60"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                    b.unlocked
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  }`}
                >
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{b.name}</p>
                    {b.unlocked && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{b.desc}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.round((b.progress.current / b.progress.total) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {b.progress.current}/{b.progress.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search scenarios by title, situation, keyword..."
          className="w-full rounded-2xl bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {["All", "N5", "N4", "N3", "N2", "N1"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`min-h-9 px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition ${
              selectedLevel === lvl
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {lvl === "All" ? "All Levels" : lvl}
          </button>
        ))}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`min-h-8 px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition ${
              selectedCategory === cat
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Cards Grid */}
      <div className="space-y-3">
        {filteredScenarios.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-800 p-8 text-center ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
            <p className="text-sm text-slate-500">No scenarios found matching your filters.</p>
          </div>
        ) : (
          filteredScenarios.map((sc) => {
            const isDone = completedSet.has(sc.id);
            return (
              <div
                key={sc.id}
                className="rounded-3xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {sc.level}
                      </span>
                      <span className="text-xs font-medium text-slate-400">·</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {sc.category}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{sc.title}</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5" lang="ja">
                      {sc.titleJa}
                    </p>
                  </div>

                  {isDone && (
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-900 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Done</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {sc.description}
                </p>

                {/* Action Launch Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-400">
                    {sc.lines.length} turns · {sc.keyPhrases.length} key phrases
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setActiveScenario(sc);
                        setActiveMode("roleplay");
                      }}
                      className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-blue-600 dark:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>Role-play</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveScenario(sc);
                        setActiveMode("watch");
                      }}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 active:scale-95 transition"
                      aria-label="Watch mode"
                      title="Watch auto-advance"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

