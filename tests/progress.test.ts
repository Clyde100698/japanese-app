import { describe, expect, it } from "vitest";
import { computeLevel, computeMastery, computeStreak, computeTotalXp } from "../lib/progress";
import type { DailyStat } from "../lib/db";
import type { SrsCard } from "../lib/sm2";

describe("progress & stats calculations", () => {
  it("computes streak correctly across days", () => {
    const now = new Date("2026-11-08T12:00:00Z").getTime();
    const stats: DailyStat[] = [
      { day: "2026-11-08", reviews: 5, newCards: 2, correct: 5, xp: 25, updatedAt: now },
      { day: "2026-11-07", reviews: 10, newCards: 5, correct: 9, xp: 45, updatedAt: now - 86400000 },
      { day: "2026-11-06", reviews: 8, newCards: 3, correct: 8, xp: 40, updatedAt: now - 86400000 * 2 },
    ];
    const { current, longest } = computeStreak(stats, now);
    expect(current).toBe(3);
    expect(longest).toBe(3);
  });

  it("handles broken streak", () => {
    const now = new Date("2026-11-08T12:00:00Z").getTime();
    const stats: DailyStat[] = [
      { day: "2026-11-08", reviews: 5, newCards: 0, correct: 5, xp: 25, updatedAt: now },
      // 2026-11-07 skipped!
      { day: "2026-11-06", reviews: 8, newCards: 3, correct: 8, xp: 40, updatedAt: now - 86400000 * 2 },
      { day: "2026-11-05", reviews: 8, newCards: 3, correct: 8, xp: 40, updatedAt: now - 86400000 * 3 },
    ];
    const { current, longest } = computeStreak(stats, now);
    expect(current).toBe(1);
    expect(longest).toBe(2);
  });

  it("calculates total XP and levels", () => {
    const stats: DailyStat[] = [
      { day: "2026-11-08", reviews: 5, newCards: 0, correct: 5, xp: 120, updatedAt: 0 },
      { day: "2026-11-07", reviews: 10, newCards: 0, correct: 10, xp: 80, updatedAt: 0 },
    ];
    expect(computeTotalXp(stats)).toBe(200);
    const lvl = computeLevel(200);
    expect(lvl.level).toBeGreaterThanOrEqual(2);
  });

  it("computes mastery breakdown", () => {
    const cards = new Map<string, SrsCard>([
      ["a", { id: "a", interval: 30, reps: 5, ease: 2.5, lapses: 0, due: 0, phase: "review", updatedAt: 0 }],
      ["b", { id: "b", interval: 5, reps: 2, ease: 2.5, lapses: 0, due: 0, phase: "review", updatedAt: 0 }],
    ]);
    const breakdown = computeMastery(["a", "b", "c", "d"], cards);
    expect(breakdown.total).toBe(4);
    expect(breakdown.mastered).toBe(1);
    expect(breakdown.learning).toBe(1);
    expect(breakdown.unseen).toBe(2);
    expect(breakdown.percentage).toBe(35); // (1*1 + 1*0.4) / 4 = 1.4/4 = 35%
  });
});
