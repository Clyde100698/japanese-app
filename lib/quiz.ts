// Pure quiz helpers (no browser APIs) so they can be unit-tested.
import type { DeckCard } from "./decks";

export type Rng = () => number;

export function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type Direction = "front-to-answer" | "answer-to-front";

/** What the learner sees for a card as an option (text must be unique among the options). */
export function optionText(card: DeckCard, dir: Direction): string {
  return dir === "front-to-answer" ? card.answer : card.front;
}

/** The correct card plus up to n-1 distractors with distinct option text, shuffled. */
export function makeChoices(card: DeckCard, pool: readonly DeckCard[], dir: Direction, n = 4, rng: Rng = Math.random): DeckCard[] {
  const seen = new Set([optionText(card, dir)]);
  const out: DeckCard[] = [card];
  // Prefer distractors of similar shape (same kind, similar length) so they are plausible
  const candidates = shuffle(pool.filter((c) => c.id !== card.id && c.kind === card.kind), rng);
  for (const c of candidates) {
    if (out.length >= n) break;
    const t = optionText(c, dir);
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(c);
  }
  return shuffle(out, rng);
}

const PARTICLES = new Set(["は", "が", "を", "に", "で", "と", "も", "の", "へ", "や", "か", "から", "まで"]);

/**
 * Split a Japanese sentence into tappable chunks. Heuristic: break after particles, commas and
 * common sentence endings. Joining the chunks always reproduces the original sentence.
 */
export function chunkJapanese(ja: string): string[] {
  const chars = [...ja];
  const chunks: string[] = [];
  let cur = "";
  for (let i = 0; i < chars.length; i++) {
    cur += chars[i];
    const next = chars[i + 1];
    const isPunct = "、。！？!?,.".includes(chars[i]);
    // で followed by す/し is part of です/でした, not the particle
    const isParticle = PARTICLES.has(chars[i]) && cur.length > 1 && !(chars[i] === "で" && "すし".includes(next ?? "x"));
    const endsPolite = /(です|ます|ません|でした|ました|ですか|ますか)$/.test(cur) && !/^[ぁ-ん]/.test(next ?? "" ) ;
    if (isPunct || (isParticle && next && !"ぁゃゅょっ".includes(next)) || endsPolite) {
      if (isParticle && next && PARTICLES.has(chars[i] + next)) continue; // から / まで
      chunks.push(cur);
      cur = "";
    }
  }
  if (cur) chunks.push(cur);
  // Merge lone punctuation into the previous chunk
  const merged: string[] = [];
  for (const c of chunks) {
    if (merged.length && /^[、。！？!?,.]+$/.test(c)) merged[merged.length - 1] += c;
    else merged.push(c);
  }
  return merged;
}

export function isSameSentence(picked: readonly string[], target: string): boolean {
  return picked.join("") === target;
}

/** XP for a finished practice round: 2 per correct answer, bonus for perfect rounds. */
export function quizXp(correct: number, total: number): number {
  return correct * 2 + (total > 0 && correct === total ? 5 : 0);
}

/** Speed round scoring: each correct answer scores 10 plus a streak bonus (max +10). */
export function speedScore(results: readonly boolean[]): number {
  let streak = 0;
  let score = 0;
  for (const ok of results) {
    if (ok) {
      streak++;
      score += 10 + Math.min(10, (streak - 1) * 2);
    } else streak = 0;
  }
  return score;
}
