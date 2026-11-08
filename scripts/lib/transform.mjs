// Pure transformation functions for the data pipeline (unit-tested against fixtures).

const POS_LABEL = {
  n: "noun", "n-adv": "adverbial noun", "n-t": "temporal noun", "n-suf": "noun suffix", "n-pref": "noun prefix",
  pn: "pronoun", num: "numeral", ctr: "counter", adv: "adverb", "adv-to": "adverb (to)", conj: "conjunction",
  int: "interjection", exp: "expression", prt: "particle", pref: "prefix", suf: "suffix", aux: "auxiliary",
  "aux-v": "auxiliary verb", "aux-adj": "auxiliary adjective", "adj-i": "i-adjective", "adj-na": "na-adjective",
  "adj-no": "no-adjective", "adj-pn": "prenominal", "adj-t": "taru-adjective", "adj-f": "noun/verb modifier",
  v1: "ichidan verb", "v1-s": "ichidan verb", vs: "suru verb", "vs-i": "suru verb", "vs-s": "suru verb", vk: "kuru verb",
  vi: "intransitive", vt: "transitive", cop: "copula", unc: "unclassified",
};

export function posLabel(tag) {
  if (POS_LABEL[tag]) return POS_LABEL[tag];
  if (/^v5/.test(tag)) return "godan verb";
  if (/^v/.test(tag)) return "verb";
  return tag;
}

const JLPT_NAME = { 1: "N1", 2: "N2", 3: "N3", 4: "N4", 5: "N5" };
export const levelName = (n) => JLPT_NAME[n];

/**
 * Index the Tanos (Bluskyo conversion) vocab list: { "挨拶": [{reading, level}] } to a flat array.
 * A word listed under several levels keeps its easiest level (highest N number).
 */
export function flattenTanosVocab(raw) {
  const best = new Map();
  for (const [headword, entries] of Object.entries(raw)) {
    for (const { reading, level } of entries) {
      const key = `${headword}\t${reading}`;
      const prev = best.get(key);
      if (!prev || level > prev.level) best.set(key, { headword, reading, level });
    }
  }
  return [...best.values()];
}

const kanaOnly = (s) => /^[\u3040-\u30ffー]+$/.test(s);
const toHira = (s) => s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCodePoint(c.codePointAt(0) - 0x60));

/** Index JMdict entries by every kanji and kana spelling. */
export function indexJmdict(words) {
  const idx = new Map();
  const add = (k, w) => {
    if (!idx.has(k)) idx.set(k, []);
    idx.get(k).push(w);
  };
  for (const w of words) {
    for (const k of w.kanji ?? []) add(k.text, w);
    for (const k of w.kana ?? []) add(k.text, w);
  }
  return idx;
}

function scoreMatch(w, headword, reading) {
  const kanji = (w.kanji ?? []).find((k) => k.text === headword);
  const kana = (w.kana ?? []).find((k) => toHira(k.text) === toHira(reading));
  let s = 0;
  if (kanji) s += 4;
  if (kana) s += 4;
  if (kanji?.common) s += 1;
  if (kana?.common) s += 1;
  if (!kanji && kanaOnly(headword) && kana) s += 4; // kana-only headword
  return s;
}

/** Look up one Tanos entry in JMdict; returns the best entry or undefined. */
export function matchEntry(idx, headword, reading) {
  const cands = idx.get(headword) ?? [];
  let best;
  let bestScore = 0;
  for (const w of cands) {
    const s = scoreMatch(w, headword, reading);
    if (s > bestScore) { best = w; bestScore = s; }
  }
  // Require the reading to agree whenever the headword has kanji
  if (best && !kanaOnly(headword) && !(best.kana ?? []).some((k) => toHira(k.text) === toHira(reading))) return undefined;
  return best;
}

/** Build the compact word record for the app. */
export function toWord(entry, headword, reading, level) {
  const kanjiForm = (entry.kanji ?? []).find((k) => k.text === headword);
  const kanaForm = (entry.kana ?? []).find((k) => toHira(k.text) === toHira(reading)) ?? entry.kana?.[0];
  const senses = entry.sense ?? [];
  const meanings = [];
  for (const s of senses.slice(0, 4)) {
    const g = (s.gloss ?? []).filter((x) => !x.lang || x.lang === "eng").map((x) => x.text);
    if (g.length) meanings.push(g.slice(0, 3).join(", "));
  }
  const pos = [...new Set(senses.flatMap((s) => s.partOfSpeech ?? []).map(posLabel))].slice(0, 3);
  const usuallyKana = senses.some((s) => (s.misc ?? []).includes("uk"));
  return {
    id: String(entry.id),
    hw: headword,
    ...(kanjiForm && !usuallyKana ? { kanji: kanjiForm.text } : {}),
    kana: kanaForm.text,
    meanings: meanings.slice(0, 4),
    pos,
    common: !!(kanaForm?.common || kanjiForm?.common),
    level: levelName(level),
  };
}

/** Group a Tanos vocab list into JMdict-backed words per level. Returns { words: {N5:[...]}, unmatched: [...] }. */
export function buildWords(jmdictWords, tanosRaw) {
  const idx = indexJmdict(jmdictWords);
  const seen = new Set();
  const words = { N5: [], N4: [], N3: [], N2: [], N1: [] };
  const unmatched = [];
  for (const { headword, reading, level } of flattenTanosVocab(tanosRaw)) {
    const e = matchEntry(idx, headword, reading);
    if (!e || !e.sense?.length) { unmatched.push(`${headword}（${reading}）`); continue; }
    if (seen.has(e.id)) {
      continue; // already added, possibly at an easier level
    }
    seen.add(e.id);
    words[levelName(level)].push(toWord(e, headword, reading, level));
  }
  // Common words first within a level, then by entry id for stable output
  for (const l of Object.keys(words)) words[l].sort((a, b) => Number(b.common) - Number(a.common) || Number(a.id) - Number(b.id));
  return { words, unmatched };
}

/** Jōyō = school grades 1-6 plus 8 (secondary school). 9-10 are jinmeiyō (names), excluded. */
export const isJoyo = (grade) => (grade >= 1 && grade <= 6) || grade === 8;

export function buildKanji(characters, tanosKanji) {
  const out = { N5: [], N4: [], N3: [], N2: [], N1: [] };
  const joyo = [];
  for (const ch of characters) {
    const grade = ch.misc?.grade;
    if (!isJoyo(grade)) continue;
    const groups = ch.readingMeaning?.groups ?? [];
    const readings = groups.flatMap((g) => g.readings ?? []);
    const meanings = groups.flatMap((g) => g.meanings ?? []).filter((m) => !m.lang || m.lang === "en").map((m) => m.value);
    const listed = tanosKanji[ch.literal];
    const level = listed ? levelName(listed) : "N1";
    const rec = {
      c: ch.literal,
      on: readings.filter((r) => r.type === "ja_on").map((r) => r.value),
      kun: readings.filter((r) => r.type === "ja_kun").map((r) => r.value),
      meanings: meanings.slice(0, 5),
      strokes: ch.misc?.strokeCounts?.[0] ?? 0,
      grade,
      level,
      ...(listed ? {} : { levelSource: "assumed" }), // jōyō but absent from the Tanos list: shown at N1
    };
    out[level].push(rec);
    joyo.push(ch.literal);
  }
  for (const l of Object.keys(out)) out[l].sort((a, b) => (a.grade ?? 9) - (b.grade ?? 9) || a.strokes - b.strokes);
  return { kanji: out, joyo };
}

// ---- Tatoeba -------------------------------------------------------------

const codePoints = (s) => [...s].length;

/** Short, clean, owned sentence pair? */
export function goodPair(ja, en) {
  const n = codePoints(ja);
  if (n < 5 || n > 22) return false;
  if (!/[。？！]$/.test(ja)) return false;
  if (/[A-Za-z0-9０-９Ａ-Ｚａ-ｚ「」『』（）()\[\]]/.test(ja)) return false;
  if (en.length < 12 || en.length > 90 || en.split(/\s+/).length > 14) return false;
  if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(en)) return false;
  return true;
}

/** Index surfaces of vocab (N5-N3 by default) for substring linking. */
export function surfaceIndex(tanosFlat) {
  const map = new Map();
  for (const { headword, reading, level } of tanosFlat) {
    const id = headword; // sentences link to vocab by headword
    const surfaces = new Set([headword]);
    if (kanaOnly(headword) && [...headword].length < 3) continue; // too ambiguous (は, あの...)
    for (const s of surfaces) {
      if ([...s].length < 2 && !/[\u4e00-\u9fff]/.test(s)) continue;
      if (!map.has(s) || map.get(s).level < level) map.set(s, { id, level });
    }
  }
  return map;
}

export function linkSentence(ja, surfaces) {
  const chars = [...ja];
  const found = new Map();
  for (let i = 0; i < chars.length; i++) {
    for (let len = Math.min(8, chars.length - i); len >= 1; len--) {
      const s = chars.slice(i, i + len).join("");
      const hit = surfaces.get(s);
      if (hit) { found.set(hit.id, hit.level); i += len - 1; break; }
    }
  }
  return found; // Map id -> level
}
