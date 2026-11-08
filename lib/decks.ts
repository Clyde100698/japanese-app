"use client";
// Deck abstraction: every study source becomes a list of DeckCards that the SRS, quizzes and
// dashboard consume. Content is static JSON under /data (bundled, cached by the service worker).
import { loadJson } from "./useJson";
import type { KanaData } from "./kana";

export type Level = "N5" | "N4" | "N3" | "N2" | "N1";
export const LEVELS: Level[] = ["N5", "N4", "N3", "N2", "N1"];

export interface DeckCard {
  id: string;
  kind: "kana" | "word" | "kanji" | "grammar" | "phrase" | "particle";
  /** Shown on the front of a flashcard. */
  front: string;
  /** Optional reading (kana) shown with furigana / under the front. */
  reading?: string;
  romaji?: string;
  /** English answer shown on the back. */
  answer: string;
  detail?: string;
  /** Text to send to speech synthesis. */
  speak: string;
}

export interface DeckInfo {
  id: string;
  label: string;
  ja: string;
  kind: DeckCard["kind"];
  level?: Level;
}

export const DECKS: DeckInfo[] = [
  { id: "hiragana", label: "Hiragana", ja: "ひらがな", kind: "kana" },
  { id: "katakana", label: "Katakana", ja: "カタカナ", kind: "kana" },
  { id: "phrases", label: "Spoken phrases", ja: "会話", kind: "phrase" },
  { id: "particles", label: "Particles", ja: "助詞", kind: "particle" },
  ...(["N5", "N4", "N3", "N2", "N1"] as Level[]).flatMap<DeckInfo>((l) => [
    { id: `vocab-${l.toLowerCase()}`, label: `Vocab ${l}`, ja: "単語", kind: "word", level: l },
    { id: `kanji-${l.toLowerCase()}`, label: `Kanji ${l}`, ja: "漢字", kind: "kanji", level: l },
    { id: `grammar-${l.toLowerCase()}`, label: `Grammar ${l}`, ja: "文法", kind: "grammar", level: l },
  ]),
];

export const deckInfo = (id: string) => DECKS.find((d) => d.id === id);

// ---- raw content shapes ---------------------------------------------------
export interface Example { ja: string; romaji: string; en: string }
export interface Word { id: string; kanji?: string; kana: string; meanings: string[]; pos: string[]; common: boolean; level: Level }
export interface Kanji { c: string; on: string[]; kun: string[]; meanings: string[]; strokes: number; grade?: number; level: Level }
export interface Grammar { id: string; level: Level; pattern: string; meaning: string; explanation: string; examples: Example[]; mistakes: string[]; needs_review?: boolean }
export interface Phrase { id: string; ja: string; romaji: string; en: string; category: string; needs_review?: boolean }
export interface Particle { id: string; particle: string; romaji: string; role: string; explanation: string; examples: Example[]; needs_review?: boolean }
export interface Sentence { id: string; ja: string; en: string; words?: string[] }

export async function loadDeck(id: string): Promise<DeckCard[]> {
  const info = deckInfo(id);
  if (!info) return [];
  if (info.kind === "kana") {
    const data = await loadJson<KanaData>("/data/kana.json");
    return data.items
      .filter((k) => k.script === id && k.group !== "special")
      .map((k) => ({
        id: k.id, kind: "kana" as const, front: k.kana, answer: k.romaji, romaji: k.romaji,
        detail: k.mnemonic, speak: k.kana,
      }));
  }
  if (info.kind === "phrase") {
    const rows = await loadJson<Phrase[]>("/data/phrases.json");
    return rows.map((p) => ({ id: `phrase-${p.id}`, kind: "phrase" as const, front: p.ja, romaji: p.romaji, answer: p.en, detail: p.category, speak: p.ja }));
  }
  if (info.kind === "particle") {
    const rows = await loadJson<Particle[]>("/data/particles.json");
    return rows.map((p) => ({ id: `particle-${p.id}`, kind: "particle" as const, front: p.particle, romaji: p.romaji, answer: p.role, detail: p.explanation, speak: p.particle }));
  }
  const lv = info.level!.toLowerCase();
  if (info.kind === "word") {
    const rows = await loadJson<Word[]>(`/data/words-${lv}.json`);
    return rows.map((w) => ({
      id: `word-${w.id}`, kind: "word" as const, front: w.kanji ?? w.kana, reading: w.kanji ? w.kana : undefined,
      answer: w.meanings.slice(0, 3).join("; "), detail: w.pos.join(", "), speak: w.kana,
    }));
  }
  if (info.kind === "kanji") {
    const rows = await loadJson<Kanji[]>(`/data/kanji-${lv}.json`);
    return rows.map((k) => ({
      id: `kanji-${k.c}`, kind: "kanji" as const, front: k.c, answer: k.meanings.slice(0, 3).join(", "),
      reading: k.kun[0]?.replace(/[.-]/g, "") ?? k.on[0],
      detail: `On: ${k.on.join("、") || "-"}\nKun: ${k.kun.join("、") || "-"}\n${k.strokes} strokes`,
      speak: k.kun[0]?.replace(/[.-]/g, "") ?? k.on[0] ?? k.c,
    }));
  }
  const rows = await loadJson<Grammar[]>("/data/grammar.json");
  return rows.filter((g) => g.level === info.level).map((g) => ({
    id: `grammar-${g.id}`, kind: "grammar" as const, front: g.pattern, answer: g.meaning,
    detail: `${g.explanation}\n\n${g.examples[0]?.ja ?? ""}\n${g.examples[0]?.en ?? ""}`, speak: g.examples[0]?.ja ?? g.pattern,
  }));
}

/** Decks whose content files are present (safe to offer in the UI). */
export async function deckAvailable(id: string): Promise<boolean> {
  try {
    return (await loadDeck(id)).length > 0;
  } catch {
    return false;
  }
}
