// SM-2 spaced repetition. Pure functions, no I/O, no time access: pass `now` in.
//
// Based on SuperMemo SM-2 with four buttons mapped to quality scores:
//   again = 1, hard = 3, good = 4, easy = 5
// Deviations from the original, chosen to behave well on a phone:
//   * "again" (q < 3) puts the card back in a 10-minute learning step instead of "tomorrow",
//     resets repetitions, and lowers ease by 0.2 (a lapse penalty).
//   * "hard" after the 2nd repetition grows the interval by 1.2x instead of by the ease factor.
//   * "easy" gets a 1.3x bonus on top of the ease factor, and a 4-day first interval.

export type Grade = "again" | "hard" | "good" | "easy";
export type CardPhase = "learning" | "review";

export const DAY_MS = 86_400_000;
export const LEARN_STEP_MS = 10 * 60_000;
export const START_EASE = 2.5;
export const MIN_EASE = 1.3;

export const QUALITY: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 };
export const GRADES: Grade[] = ["again", "hard", "good", "easy"];

export interface SrsCard {
  id: string;
  ease: number;
  /** Days until next review (0 while in the learning step). */
  interval: number;
  /** Consecutive successful reviews. */
  reps: number;
  lapses: number;
  /** Epoch ms when the card is next due. */
  due: number;
  phase: CardPhase;
  /** Epoch ms of the last change; used for last-write-wins sync. */
  updatedAt: number;
}

export function createInitialCard(id: string, now = Date.now()): SrsCard {
  return {
    id,
    ease: START_EASE,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now,
    phase: "learning",
    updatedAt: now,
  };
}

export const createCard = createInitialCard;

export function review(prev: SrsCard | undefined, id: string, grade: Grade, now: number): SrsCard {
  const q = QUALITY[grade];
  const base: SrsCard = prev ?? {
    id,
    ease: START_EASE,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now,
    phase: "learning",
    updatedAt: now,
  };

  if (q < 3) {
    const wasKnown = base.phase === "review";
    return {
      ...base,
      ease: Math.max(MIN_EASE, round2(base.ease - 0.2)),
      interval: 0,
      reps: 0,
      lapses: base.lapses + (wasKnown ? 1 : 0),
      due: now + LEARN_STEP_MS,
      phase: "learning",
      updatedAt: now,
    };
  }

  let interval: number;
  if (base.reps === 0) interval = grade === "easy" ? 4 : 1;
  else if (base.reps === 1) interval = grade === "easy" ? 8 : 6;
  else if (grade === "hard") interval = Math.round(base.interval * 1.2);
  else interval = Math.round(base.interval * base.ease * (grade === "easy" ? 1.3 : 1));
  interval = Math.max(1, interval);
  // Never shrink an established interval on a pass
  if (base.reps >= 2) interval = Math.max(interval, base.interval + 1);

  const ease = Math.max(MIN_EASE, round2(base.ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  return {
    ...base,
    ease,
    interval,
    reps: base.reps + 1,
    due: now + interval * DAY_MS,
    phase: "review",
    updatedAt: now,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Local end of the day containing `now` (23:59:59.999). */
export function endOfDay(now: number): number {
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

/** Learning cards are due at their exact time; review cards are due any time on their due day. */
export function isDue(card: SrsCard, now: number): boolean {
  return card.phase === "learning" ? card.due <= now : card.due <= endOfDay(now);
}

/** Human label for the interval a grade would produce, e.g. "10m", "1d", "3w". */
export function previewLabel(prev: SrsCard | undefined, id: string, grade: Grade, now: number): string {
  const next = review(prev, id, grade, now);
  if (next.phase === "learning") return "10m";
  const d = next.interval;
  if (d < 30) return `${d}d`;
  if (d < 365) return `${Math.round(d / 30)}mo`;
  return `${(d / 365).toFixed(1)}y`;
}

export interface QueueOptions {
  now: number;
  /** Max brand-new cards introduced per day. */
  newLimit: number;
  /** New cards already introduced today. */
  newDoneToday: number;
}

/** Due cards first (oldest due first), then new cards in deck order up to the remaining daily limit. */
export function buildQueue(
  deckIds: string[],
  cards: Map<string, SrsCard>,
  { now, newLimit, newDoneToday }: QueueOptions,
): { due: string[]; fresh: string[] } {
  const due = deckIds
    .filter((id) => {
      const c = cards.get(id);
      return c && isDue(c, now);
    })
    .sort((a, b) => cards.get(a)!.due - cards.get(b)!.due);
  const room = Math.max(0, newLimit - newDoneToday);
  const fresh = deckIds.filter((id) => !cards.has(id)).slice(0, room);
  return { due, fresh };
}

