// Shared KanjiVG parsing for the kana and kanji stroke builders.
import { download } from "./common.mjs";

export const KVG_BASE = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";

/** Extract stroke path data (in stroke order) from a KanjiVG SVG. */
export function parseStrokes(svg) {
  const strokes = [];
  const re = /<path\b[^>]*\bid="kvg:[0-9a-f]+-s(\d+)"[^>]*\bd="([^"]+)"/g;
  let m;
  while ((m = re.exec(svg))) strokes[Number(m[1]) - 1] = m[2];
  return strokes.filter(Boolean);
}

export async function fetchStrokes(codePoint) {
  const name = codePoint.toString(16).padStart(5, "0") + ".svg";
  const buf = await download(KVG_BASE + name, `kanjivg/${name}`, { valid: (b) => b.length > 20 && b.toString("utf8", 0, 300).includes("<") });
  return parseStrokes(buf.toString("utf8"));
}

/** Run async work over items with limited concurrency. Failures are collected, not thrown. */
export async function pool(items, limit, fn) {
  const queue = [...items];
  const failures = [];
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (queue.length) {
        const item = queue.shift();
        try { await fn(item); } catch (e) { failures.push(`${item}: ${e.message}`); }
      }
    }),
  );
  return failures;
}

