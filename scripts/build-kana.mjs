// Generates public/data/kana.json from the hand-curated source table.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASIC_ROWS, DAKUTEN_ROWS, COMBO_ROWS, VOICED, SMALL_YA,
  ROMAJI_DISPLAY, SPECIAL, LONG_VOWEL_NOTES, CONFUSABLES,
} from "./data/kana-source.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = [];
const hiraBase = {}; // romaji -> [hira, kata]
const SCRIPTS = [["hiragana", 0], ["katakana", 1]];

for (const { row, items } of BASIC_ROWS) {
  for (const [romaji, h, k, mh, mk] of items) {
    hiraBase[romaji] = [h, k];
    out.push({ id: `hira-${romaji}`, script: "hiragana", kana: h, romaji, group: "basic", row, mnemonic: mh });
    out.push({ id: `kata-${romaji}`, script: "katakana", kana: k, romaji, group: "basic", row, mnemonic: mk });
  }
}

for (const { row, group, pairs } of DAKUTEN_ROWS) {
  for (const [base, voiced] of pairs) {
    const [h, k] = VOICED[voiced];
    const romaji = ROMAJI_DISPLAY[voiced] ?? voiced;
    const mark = group === "handakuten" ? "a small circle (handakuten)" : "two small dashes (dakuten)";
    for (const [script, i] of SCRIPTS) {
      const baseKana = hiraBase[base][i];
      const kana = i === 0 ? h : k;
      const extra = voiced === "ji2" || voiced === "zu2"
        ? " Rare: sounds the same as じ / ず and is only used in a few words."
        : "";
      out.push({
        id: `${i === 0 ? "hira" : "kata"}-${voiced}`, script, kana, romaji, group, row,
        mnemonic: `${baseKana} + ${mark} = ${kana}.${extra}`,
        ...(voiced === "ji2" || voiced === "zu2" ? { needs_review: false } : {}),
      });
    }
  }
}

for (const { row, base, out: outs } of COMBO_ROWS) {
  // base kana: for gi/ji/bi/pi, look up voiced; otherwise basic
  const baseKana = (i) => (hiraBase[base] ?? VOICED[base])[i];
  ["ya", "yu", "yo"].forEach((y, idx) => {
    const romaji = outs[idx];
    for (const [script, i] of SCRIPTS) {
      const kana = baseKana(i) + SMALL_YA[y][i];
      out.push({
        id: `${i === 0 ? "hira" : "kata"}-${romaji}`, script, kana, romaji, group: "combo", row,
        mnemonic: `${baseKana(i)} + small ${SMALL_YA[y][i]} = ${kana} (${romaji}). One syllable, not two.`,
      });
    }
  });
}

for (const s of SPECIAL) out.push({ ...s, group: "special" });

for (const item of out) {
  const c = CONFUSABLES[item.kana];
  if (c) item.confusable = c;
}

const dir = join(root, "public", "data");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "kana.json"), JSON.stringify({ items: out, longVowelNotes: LONG_VOWEL_NOTES }));
console.log(`kana.json: ${out.length} entries`);

