// Dashboard & Learning Path calculations (streak, XP, mastery, weak spots, badges).
import type { DailyStat, ReviewLog } from "./db";
import type { SrsCard } from "./sm2";
import type { DeckCard } from "./decks";

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  progress?: { current: number; total: number };
}

export interface MasteryBreakdown {
  total: number;
  mastered: number; // interval >= 21
  learning: number; // in SRS, interval < 21
  unseen: number;
  percentage: number;
}

export function computeStreak(daily: DailyStat[], nowMs = Date.now()): { current: number; longest: number } {
  if (!daily.length) return { current: 0, longest: 0 };
  const days = new Set(daily.filter((d) => d.reviews > 0).map((d) => d.day));
  if (!days.size) return { current: 0, longest: 0 };

  const pad = (n: number) => String(n).padStart(2, "0");
  const toDayStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const today = new Date(nowMs);
  const todayStr = toDayStr(today);
  const yesterday = new Date(nowMs - 86_400_000);
  const yesterdayStr = toDayStr(yesterday);

  // Current streak
  let cur = 0;
  let check = days.has(todayStr) ? today : days.has(yesterdayStr) ? yesterday : null;
  if (check) {
    const d = new Date(check);
    while (days.has(toDayStr(d))) {
      cur++;
      d.setDate(d.getDate() - 1);
    }
  }

  // Longest streak
  const sorted = [...days].sort();
  let longest = 0;
  let running = 0;
  let prevDate: Date | null = null;

  for (const s of sorted) {
    const parts = s.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    if (prevDate) {
      const diff = Math.round((d.getTime() - prevDate.getTime()) / 86_400_000);
      if (diff === 1) running++;
      else running = 1;
    } else {
      running = 1;
    }
    if (running > longest) longest = running;
    prevDate = d;
  }

  return { current: cur, longest };
}

export function computeTotalXp(daily: DailyStat[]): number {
  return daily.reduce((acc, d) => acc + (d.xp || 0), 0);
}

export function computeLevel(totalXp: number): { level: number; currentXp: number; nextLevelXp: number; progress: number } {
  // Level threshold: L1 = 0, L2 = 100, L3 = 250, L4 = 450, etc. (formula: 50 * level^2 - 50 * level)
  let level = 1;
  const xpForLevel = (lvl: number) => Math.round(35 * Math.pow(lvl, 1.6));
  while (totalXp >= xpForLevel(level + 1)) {
    level++;
  }
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const currentXp = totalXp - base;
  const span = next - base;
  const progress = Math.min(100, Math.max(0, Math.round((currentXp / span) * 100)));
  return { level, currentXp: totalXp, nextLevelXp: next, progress };
}

export function computeMastery(allIds: string[], cards: Map<string, SrsCard>): MasteryBreakdown {
  const total = allIds.length;
  if (!total) return { total: 0, mastered: 0, learning: 0, unseen: 0, percentage: 0 };
  let mastered = 0;
  let learning = 0;
  for (const id of allIds) {
    const c = cards.get(id);
    if (!c) continue;
    if (c.interval >= 21) mastered++;
    else learning++;
  }
  const unseen = total - mastered - learning;
  const percentage = Math.round(((mastered * 1 + learning * 0.4) / total) * 100);
  return { total, mastered, learning, unseen, percentage };
}

export interface WeakSpot {
  cardId: string;
  lapses: number;
  ease: number;
  front: string;
  answer: string;
  speak: string;
}

export function findWeakSpots(cards: Map<string, SrsCard>, deckLookup: (id: string) => DeckCard | undefined, limit = 8): WeakSpot[] {
  const candidates: WeakSpot[] = [];
  for (const [id, c] of cards.entries()) {
    if (c.lapses >= 1 || c.ease < 2.2) {
      const d = deckLookup(id);
      if (d) {
        candidates.push({
          cardId: id,
          lapses: c.lapses,
          ease: c.ease,
          front: d.front,
          answer: d.answer,
          speak: d.speak,
        });
      }
    }
  }
  // Sort primarily by lapses descending, then ease ascending
  return candidates.sort((a, b) => b.lapses - a.lapses || a.ease - b.ease).slice(0, limit);
}

export function evaluateBadges(
  daily: DailyStat[],
  cards: Map<string, SrsCard>,
  logs: ReviewLog[],
  kanaIds: Set<string>,
  kanjiIds: Set<string>,
  wordIds: Set<string>,
): Badge[] {
  const totalReviews = daily.reduce((s, d) => s + (d.reviews || 0), 0);
  const totalXp = computeTotalXp(daily);
  const { current: streak } = computeStreak(daily);

  let kanaCount = 0;
  let kanjiCount = 0;
  let wordCount = 0;
  for (const id of cards.keys()) {
    if (kanaIds.has(id)) kanaCount++;
    else if (kanjiIds.has(id)) kanjiCount++;
    else if (wordIds.has(id)) wordCount++;
  }

  const defs: { id: string; name: string; desc: string; icon: string; check: () => boolean; progress: { current: number; total: number } }[] = [
    {
      id: "first-step",
      name: "First Steps",
      desc: "Complete your first review",
      icon: "🐣",
      check: () => totalReviews >= 1,
      progress: { current: Math.min(1, totalReviews), total: 1 },
    },
    {
      id: "streak-3",
      name: "Fire Starter",
      desc: "Reach a 3-day review streak",
      icon: "🔥",
      check: () => streak >= 3,
      progress: { current: Math.min(3, streak), total: 3 },
    },
    {
      id: "streak-7",
      name: "Unstoppable",
      desc: "Reach a 7-day review streak",
      icon: "⚡",
      check: () => streak >= 7,
      progress: { current: Math.min(7, streak), total: 7 },
    },
    {
      id: "kana-50",
      name: "Kana Master",
      desc: "Learn 50 Hiragana or Katakana characters",
      icon: "🏯",
      check: () => kanaCount >= 50,
      progress: { current: Math.min(50, kanaCount), total: 50 },
    },
    {
      id: "kanji-25",
      name: "Kanji Explorer",
      desc: "Learn 25 Kanji characters",
      icon: "🌸",
      check: () => kanjiCount >= 25,
      progress: { current: Math.min(25, kanjiCount), total: 25 },
    },
    {
      id: "words-100",
      name: "Word Hunter",
      desc: "Learn 100 Japanese vocabulary words",
      icon: "📚",
      check: () => wordCount >= 100,
      progress: { current: Math.min(100, wordCount), total: 100 },
    },
    {
      id: "reviews-100",
      name: "Centurion",
      desc: "Complete 100 total reviews",
      icon: "🏆",
      check: () => totalReviews >= 100,
      progress: { current: Math.min(100, totalReviews), total: 100 },
    },
    {
      id: "xp-500",
      name: "XP Master",
      desc: "Accumulate 500 XP from reviews & quizzes",
      icon: "💎",
      check: () => totalXp >= 500,
      progress: { current: Math.min(500, totalXp), total: 500 },
    },
  ];

  return defs.map((b) => ({
    id: b.id,
    name: b.name,
    desc: b.desc,
    icon: b.icon,
    unlocked: b.check(),
    progress: b.progress,
  }));
}
