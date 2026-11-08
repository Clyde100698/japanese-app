import { download, isJson, readCachedJson } from "./common.mjs";

const BASE = "https://raw.githubusercontent.com/Bluskyo/JLPT_Vocabulary/main/data/";

/**
 * Tanos JLPT lists (Jonathan Waller, CC BY), via the Bluskyo/JLPT_Vocabulary conversion to JSON.
 * tanos.co.uk itself only offers PDF/Anki downloads, so this converted copy is used for level data.
 * Note: the JLPT does not publish official lists; these are a widely used community reference.
 */
export async function getTanosVocab() {
  await download(BASE + "vocab/results/JLPT_vocab_ALL.json", "tanos-vocab.json", { valid: isJson });
  return readCachedJson("tanos-vocab.json"); // { headword: [{reading, level}] }, level 1..5 = N1..N5
}

export async function getTanosKanji() {
  await download(BASE + "kanji/results/JLPT_kanji_ALL.json", "tanos-kanji.json", { valid: isJson });
  return readCachedJson("tanos-kanji.json"); // { "字": level }
}

