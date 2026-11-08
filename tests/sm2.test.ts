import { describe, expect, it } from "vitest";
import {
  buildQueue, DAY_MS, endOfDay, isDue, LEARN_STEP_MS, MIN_EASE, previewLabel, review, START_EASE,
  type Grade, type SrsCard,
} from "../lib/sm2";
import { pickLatest, remoteWins } from "../lib/merge";

const NOW = new Date(2026, 0, 15, 12, 0, 0).getTime();
const run = (grades: Grade[], start?: SrsCard) =>
  grades.reduce<SrsCard | undefined>((c, g, i) => review(c, "x", g, NOW + i * DAY_MS), start) as SrsCard;

describe("SM-2 review", () => {
  it("first good review schedules 1 day, then 6 days, then interval*ease", () => {
    const a = review(undefined, "x", "good", NOW);
    expect(a.interval).toBe(1);
    expect(a.reps).toBe(1);
    expect(a.due).toBe(NOW + DAY_MS);
    const b = review(a, "x", "good", NOW);
    expect(b.interval).toBe(6);
    const c = review(b, "x", "good", NOW);
    expect(c.interval).toBe(Math.round(6 * c.ease));
    expect(c.phase).toBe("review");
  });

  it("good keeps ease; easy raises it; hard lowers it", () => {
    const base = run(["good", "good"]);
    expect(review(base, "x", "good", NOW).ease).toBe(base.ease);
    expect(review(base, "x", "easy", NOW).ease).toBeCloseTo(base.ease + 0.1, 5);
    expect(review(base, "x", "hard", NOW).ease).toBeCloseTo(base.ease - 0.14, 5);
  });

  it("new cards start at ease 2.5", () => {
    expect(review(undefined, "x", "good", NOW).ease).toBe(START_EASE);
  });

  it("again resets reps, uses a 10-minute step and lowers ease", () => {
    const known = run(["good", "good", "good"]);
    const lapsed = review(known, "x", "again", NOW);
    expect(lapsed.reps).toBe(0);
    expect(lapsed.interval).toBe(0);
    expect(lapsed.phase).toBe("learning");
    expect(lapsed.due).toBe(NOW + LEARN_STEP_MS);
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.ease).toBeCloseTo(known.ease - 0.2, 5);
  });

  it("failing a brand-new card is not counted as a lapse", () => {
    expect(review(undefined, "x", "again", NOW).lapses).toBe(0);
  });

  it("recovers after a lapse: first pass is 1 day again", () => {
    const lapsed = review(run(["good", "good", "good"]), "x", "again", NOW);
    expect(review(lapsed, "x", "good", NOW).interval).toBe(1);
  });

  it("ease never drops below 1.3", () => {
    let c = review(undefined, "x", "good", NOW);
    for (let i = 0; i < 30; i++) c = review(c, "x", i % 2 ? "hard" : "again", NOW);
    expect(c.ease).toBe(MIN_EASE);
  });

  it("intervals grow monotonically on repeated good/easy", () => {
    let c = review(undefined, "x", "easy", NOW);
    let last = c.interval;
    for (let i = 0; i < 8; i++) {
      c = review(c, "x", i % 2 ? "good" : "easy", NOW);
      expect(c.interval).toBeGreaterThan(last);
      last = c.interval;
    }
  });

  it("hard after rep 2 grows by ~1.2x and at least 1 day", () => {
    const base = run(["good", "good", "good", "good"]);
    const h = review(base, "x", "hard", NOW);
    expect(h.interval).toBe(Math.max(base.interval + 1, Math.round(base.interval * 1.2)));
  });

  it("easy first interval is 4 days", () => {
    expect(review(undefined, "x", "easy", NOW).interval).toBe(4);
  });

  it("is pure: does not mutate input", () => {
    const a = review(undefined, "x", "good", NOW);
    const copy = { ...a };
    review(a, "x", "again", NOW);
    expect(a).toEqual(copy);
  });

  it("previewLabel formats intervals", () => {
    expect(previewLabel(undefined, "x", "again", NOW)).toBe("10m");
    expect(previewLabel(undefined, "x", "good", NOW)).toBe("1d");
  });
});

describe("due and queue", () => {
  const card = (id: string, due: number, phase: SrsCard["phase"] = "review"): SrsCard => ({
    id, ease: 2.5, interval: 1, reps: 1, lapses: 0, due, phase, updatedAt: NOW,
  });

  it("review cards are due any time on their due day; learning cards at their time", () => {
    expect(isDue(card("a", endOfDay(NOW)), NOW)).toBe(true);
    expect(isDue(card("a", endOfDay(NOW) + 1), NOW)).toBe(false);
    expect(isDue(card("a", NOW + 1000, "learning"), NOW)).toBe(false);
    expect(isDue(card("a", NOW - 1, "learning"), NOW)).toBe(true);
  });

  it("queue: due oldest first, new capped by the daily limit", () => {
    const cards = new Map([card("a", NOW - 2 * DAY_MS), card("b", NOW - 5 * DAY_MS), card("c", NOW + 9 * DAY_MS)].map((c) => [c.id, c]));
    const q = buildQueue(["a", "b", "c", "d", "e", "f"], cards, { now: NOW, newLimit: 2, newDoneToday: 0 });
    expect(q.due).toEqual(["b", "a"]);
    expect(q.fresh).toEqual(["d", "e"]);
  });

  it("queue respects new cards already done today", () => {
    const q = buildQueue(["a", "b", "c"], new Map(), { now: NOW, newLimit: 3, newDoneToday: 2 });
    expect(q.fresh).toEqual(["a"]);
    expect(buildQueue(["a"], new Map(), { now: NOW, newLimit: 3, newDoneToday: 5 }).fresh).toEqual([]);
  });
});

describe("latest-timestamp merge", () => {
  it("newer remote wins, older remote loses, ties keep local", () => {
    expect(remoteWins({ updatedAt: 5 }, { updatedAt: 6 })).toBe(true);
    expect(remoteWins({ updatedAt: 5 }, { updatedAt: 4 })).toBe(false);
    expect(remoteWins({ updatedAt: 5 }, { updatedAt: 5 })).toBe(false);
    expect(remoteWins(undefined, { updatedAt: 1 })).toBe(true);
    expect(pickLatest({ updatedAt: 5, v: "l" }, { updatedAt: 9, v: "r" }).v).toBe("r");
  });
});

