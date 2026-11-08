"use client";
import { useEffect, useState } from "react";
import { getAllCards, getAllDaily, getAllLogs, getDaily, dayKey } from "@/lib/db";
import { loadDeck, type DeckCard } from "@/lib/decks";
import {
  computeLevel,
  computeMastery,
  computeStreak,
  computeTotalXp,
  evaluateBadges,
  findWeakSpots,
  type Badge,
  type MasteryBreakdown,
  type WeakSpot,
} from "@/lib/progress";
import { speak } from "@/lib/speech";
import { useSettings } from "@/lib/settings";

interface CategoryStat {
  id: string;
  label: string;
  stats: MasteryBreakdown;
}

export default function Dashboard() {
  const [settings] = useSettings();
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [totalXp, setTotalXp] = useState(0);
  const [todayDone, setTodayDone] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, currentXp: 0, nextLevelXp: 100, progress: 0 });
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [weakSpots, setWeakSpots] = useState<WeakSpot[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [cards, daily, logs, todayStat] = await Promise.all([
        getAllCards(),
        getAllDaily(),
        getAllLogs(),
        getDaily(dayKey(Date.now())),
      ]);
      if (!alive) return;

      const st = computeStreak(daily);
      setStreak(st);

      const xp = computeTotalXp(daily);
      setTotalXp(xp);
      setLevelInfo(computeLevel(xp));
      setTodayDone(todayStat?.reviews ?? 0);

      // Load deck cards for category mastery & weak spot lookups
      const allDecksToLoad = [
        { id: "hiragana", label: "Hiragana" },
        { id: "katakana", label: "Katakana" },
        { id: "vocab-n5", label: "N5 Vocab" },
        { id: "kanji-n5", label: "N5 Kanji" },
        { id: "vocab-n4", label: "N4 Vocab" },
        { id: "kanji-n4", label: "N4 Kanji" },
        { id: "vocab-n3", label: "N3 Vocab" },
        { id: "kanji-n3", label: "N3 Kanji" },
        { id: "vocab-n2", label: "N2 Vocab" },
        { id: "vocab-n1", label: "N1 Vocab" },
      ];

      const deckMap = new Map<string, DeckCard>();
      const catStats: CategoryStat[] = [];
      const kanaSet = new Set<string>();
      const kanjiSet = new Set<string>();
      const wordSet = new Set<string>();

      for (const d of allDecksToLoad) {
        try {
          const list = await loadDeck(d.id);
          const ids = list.map((c) => {
            deckMap.set(c.id, c);
            if (c.kind === "kana") kanaSet.add(c.id);
            else if (c.kind === "kanji") kanjiSet.add(c.id);
            else if (c.kind === "word") wordSet.add(c.id);
            return c.id;
          });
          if (ids.length > 0) {
            catStats.push({
              id: d.id,
              label: d.label,
              stats: computeMastery(ids, cards),
            });
          }
        } catch {
          // deck data may still be loading or partial
        }
      }

      setCategories(catStats);
      setWeakSpots(findWeakSpots(cards, (id) => deckMap.get(id)));
      setBadges(evaluateBadges(daily, cards, logs, kanaSet, kanjiSet, wordSet));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p className="p-4 text-slate-500">Calculating your stats…</p>;

  const goalProgress = Math.min(100, Math.round((todayDone / Math.max(1, settings.dailyGoal)) * 100));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Progress Dashboard</h1>

      {/* Top Header Card */}
      <section className="rounded-3xl bg-gradient-to-br from-rose-600 to-rose-700 p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-200">Level {levelInfo.level}</span>
            <h2 className="text-3xl font-extrabold">{totalXp.toLocaleString()} XP</h2>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/20 px-3 py-2 text-center backdrop-blur">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="block text-lg font-bold leading-none">{streak.current}</span>
              <span className="text-[10px] uppercase tracking-wide text-rose-100">day streak</span>
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-rose-200">
            <span>Level {levelInfo.level}</span>
            <span>Level {levelInfo.level + 1} ({levelInfo.nextLevelXp} XP)</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/20">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${levelInfo.progress}%` }} />
          </div>
        </div>

        {/* Daily Goal */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-xs">
          <span>Today&apos;s goal: {todayDone} / {settings.dailyGoal} reviews</span>
          <span className="font-semibold text-rose-200">{goalProgress}%</span>
        </div>
      </section>

      {/* Weak Spots Section */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800">🎯 Weak Spots</h2>
          <span className="text-xs text-slate-500">Tap to listen &amp; reinforce</span>
        </div>
        {weakSpots.length === 0 ? (
          <p className="mt-2 text-sm text-emerald-700">No weak spots detected! Keep up the good work.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {weakSpots.map((w) => (
              <button
                key={w.cardId}
                type="button"
                onClick={() => speak(w.speak, settings.speechRate)}
                className="flex flex-col items-start rounded-xl border border-rose-100 bg-rose-50/50 p-2.5 text-left active:bg-rose-100"
              >
                <div className="flex w-full items-baseline justify-between">
                  <span className="text-xl font-bold text-slate-900" lang="ja">
                    {w.front}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600">{w.lapses} lapses</span>
                </div>
                <span className="line-clamp-1 text-xs text-slate-600">{w.answer}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Mastery Per Level & Category */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 font-bold text-slate-800">📊 Mastery by Level</h2>
        <div className="space-y-3">
          {categories.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{c.label}</span>
                <span className="text-slate-500">
                  {c.stats.mastered} mastered · {c.stats.learning} learning ({c.stats.percentage}%)
                </span>
              </div>
              <div className="mt-1 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${(c.stats.mastered / Math.max(1, c.stats.total)) * 100}%` }}
                  title="Mastered"
                />
                <div
                  className="bg-sky-400 transition-all"
                  style={{ width: `${(c.stats.learning / Math.max(1, c.stats.total)) * 100}%` }}
                  title="Learning"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badges & Achievements */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 font-bold text-slate-800">🏅 Badges &amp; Achievements</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`flex items-start gap-2.5 rounded-2xl p-3 border transition-all ${
                b.unlocked
                  ? "border-amber-200 bg-amber-50/50 shadow-sm"
                  : "border-slate-200 bg-slate-50 opacity-60"
              }`}
            >
              <span className="text-2xl">{b.icon}</span>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-slate-900">{b.name}</h3>
                <p className="text-[11px] leading-tight text-slate-600">{b.desc}</p>
                {b.progress && !b.unlocked && (
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${(b.progress.current / b.progress.total) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
