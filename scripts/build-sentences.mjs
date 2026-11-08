// Tatoeba Japanese-English pairs -> public/data/sentences.json, linked to JLPT vocab by headword.
// Tatoeba (c) contributors, CC BY 2.0 FR: https://tatoeba.org/
import bz2 from "unbzip2-stream";
import { Readable } from "node:stream";
import { download, isBz2, writeJson } from "./lib/common.mjs";
import { getTanosVocab } from "./lib/tanos.mjs";
import { flattenTanosVocab, goodPair, levelName, linkSentence, surfaceIndex } from "./lib/transform.mjs";

const BASE = "https://downloads.tatoeba.org/exports/per_language/";
const MAX_TOTAL = 4000;
const MAX_PER_WORD = 3;

function forEachLine(buf, fn) {
  return new Promise((resolve, reject) => {
    let tail = "";
    const stream = Readable.from([buf]).pipe(bz2());
    stream.on("data", (chunk) => {
      const lines = (tail + chunk.toString("utf8")).split("\n");
      tail = lines.pop();
      for (const l of lines) fn(l.split("\t"));
    });
    stream.on("end", () => {
      if (tail) fn(tail.split("\t"));
      resolve();
    });
    stream.on("error", reject);
  });
}

console.log("Tatoeba: downloading Japanese sentences, links, English sentences...");
const [jpnBuf, linkBuf, engBuf] = await Promise.all([
  download(BASE + "jpn/jpn_sentences_detailed.tsv.bz2", "tatoeba-jpn.tsv.bz2", { valid: isBz2 }),
  download(BASE + "jpn/jpn-eng_links.tsv.bz2", "tatoeba-links.tsv.bz2", { valid: isBz2 }),
  download(BASE + "eng/eng_sentences.tsv.bz2", "tatoeba-eng.tsv.bz2", { valid: isBz2 }),
]);

// 1. Japanese candidates: short, clean, and owned by a user (not orphaned)
const jpn = new Map();
await forEachLine(jpnBuf, ([id, lang, text, user]) => {
  if (lang !== "jpn" || !text || !user || user === "\\N") return;
  const n = [...text].length;
  if (n >= 5 && n <= 22 && /[。？！]$/.test(text)) jpn.set(id, text);
});

// 2. Translation links
const links = new Map();
await forEachLine(linkBuf, ([j, e]) => {
  if (jpn.has(j) && e) (links.get(j) ?? links.set(j, []).get(j)).push(e);
});
const wantedEng = new Set([...links.values()].flat());

// 3. English texts for linked sentences
const eng = new Map();
await forEachLine(engBuf, ([id, lang, text]) => {
  if (lang === "eng" && wantedEng.has(id)) eng.set(id, text);
});

// 4. Quality filter + vocabulary linking
const tanos = flattenTanosVocab(await getTanosVocab());
const surfaces = surfaceIndex(tanos);
const candidates = [];
for (const [id, ja] of jpn) {
  const en = (links.get(id) ?? []).map((e) => eng.get(e)).find((t) => t && goodPair(ja, t));
  if (!en) continue;
  const found = linkSentence(ja, surfaces);
  if (!found.size) continue;
  const levels = [...found.values()];
  const hardest = Math.min(...levels); // 1 = N1 ... 5 = N5
  // Prefer short sentences made of easy words
  const score = levels.reduce((s, l) => s + l, 0) / levels.length * 3 - [...ja].length * 0.3 + Math.min(found.size, 4);
  candidates.push({ id: `t${id}`, ja, en, words: [...found.keys()], level: levelName(hardest), score });
}
candidates.sort((a, b) => b.score - a.score);

const perWord = new Map();
const kept = [];
for (const c of candidates) {
  if (kept.length >= MAX_TOTAL) break;
  if (!c.words.some((w) => (perWord.get(w) ?? 0) < MAX_PER_WORD)) continue;
  for (const w of c.words) perWord.set(w, (perWord.get(w) ?? 0) + 1);
  const { score: _s, ...rest } = c;
  kept.push(rest);
}
writeJson("sentences.json", kept);
console.log(`  ${kept.length} sentences from ${jpn.size} candidates, linked to ${perWord.size} headwords`);
