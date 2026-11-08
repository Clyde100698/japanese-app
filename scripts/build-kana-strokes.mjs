// KanjiVG stroke order for kana (U+3041-3096, U+30A1-30FA, U+30FC) -> public/data/kana-strokes.json
// KanjiVG (c) Ulrich Apel, CC BY-SA 3.0: https://kanjivg.tagaini.net/
import { writeJson } from "./lib/common.mjs";
import { fetchStrokes, pool } from "./lib/kanjivg.mjs";

const codes = [];
for (let c = 0x3041; c <= 0x3096; c++) codes.push(c);
for (let c = 0x30a1; c <= 0x30fa; c++) codes.push(c);
codes.push(0x30fc);

const result = {};
const failures = await pool(codes, 8, async (code) => {
  const strokes = await fetchStrokes(code);
  if (!strokes.length) throw new Error("no strokes");
  result[String.fromCodePoint(code)] = strokes;
});
const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.codePointAt(0) - b.codePointAt(0)));
writeJson("kana-strokes.json", sorted);
console.log(`  ${Object.keys(sorted).length} kana characters`);
if (failures.length) console.warn("  missing:", failures.join("; "));
