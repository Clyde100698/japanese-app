// Pure helpers for judging spoken answers. No browser APIs, so they are unit-testable.

/** Katakana to hiragana, strip spaces/punctuation, lowercase Latin. */
export function normalizeJa(s: string): string {
  return [...s.normalize("NFKC")]
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code >= 0x30a1 && code <= 0x30f6 ? String.fromCodePoint(code - 0x60) : c.toLowerCase();
    })
    .join("")
    .replace(/[\s、。，．,.!?！？「」『』・~〜ー-]/g, "");
}

export function levenshtein(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  let prev = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i++) {
    const cur = [i];
    for (let j = 1; j <= y.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[y.length];
}

/** 0..1 similarity of two Japanese strings after normalisation. */
export function similarity(a: string, b: string): number {
  const x = normalizeJa(a);
  const y = normalizeJa(b);
  if (!x && !y) return 1;
  const max = Math.max([...x].length, [...y].length);
  return max === 0 ? 1 : 1 - levenshtein(x, y) / max;
}

export type Verdict = "great" | "close" | "retry";

/** Best score across the recogniser's alternatives and all accepted target spellings. */
export function judge(heard: readonly string[], targets: readonly string[]): { score: number; verdict: Verdict; best: string } {
  let score = 0;
  let best = heard[0] ?? "";
  for (const h of heard) for (const t of targets) {
    const s = similarity(h, t);
    if (s > score) { score = s; best = h; }
  }
  return { score, best, verdict: score >= 0.85 ? "great" : score >= 0.6 ? "close" : "retry" };
}

