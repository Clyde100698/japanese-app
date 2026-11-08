// KanjiVG stroke order for jōyō kanji -> public/data/kanji-strokes.json (needs joyo.json from build-kanji)
// KanjiVG (c) Ulrich Apel, CC BY-SA 3.0
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OUT, writeJson } from "./lib/common.mjs";
import { fetchStrokes, pool } from "./lib/kanjivg.mjs";

const joyo = JSON.parse(readFileSync(join(OUT, "joyo.json"), "utf8"));
const result = {};
const failures = await pool(joyo, 8, async (ch) => {
  const strokes = await fetchStrokes(ch.codePointAt(0));
  if (strokes.length) result[ch] = strokes;
  else throw new Error("no strokes");
});
writeJson("kanji-strokes.json", result);
console.log(`  ${Object.keys(result).length}/${joyo.length} jōyō kanji have stroke data`);
if (failures.length) console.warn(`  ${failures.length} missing, e.g. ${failures.slice(0, 5).join("; ")}`);

