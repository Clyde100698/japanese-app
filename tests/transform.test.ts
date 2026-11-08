import { describe, expect, it } from "vitest";
import { buildKanji, buildWords, flattenTanosVocab, goodPair, linkSentence, surfaceIndex } from "../scripts/lib/transform.mjs";

const jm = [
  { id: 1, kanji: [{ text: "学生", common: true }], kana: [{ text: "がくせい", common: true }], sense: [{ partOfSpeech: ["n"], misc: [], gloss: [{ lang: "eng", text: "student" }, { lang: "eng", text: "pupil" }] }] },
  { id: 2, kanji: [{ text: "綺麗", common: false }], kana: [{ text: "きれい", common: true }], sense: [{ partOfSpeech: ["adj-na"], misc: ["uk"], gloss: [{ lang: "eng", text: "pretty" }] }] },
  { id: 3, kanji: [], kana: [{ text: "ありがとう", common: true }], sense: [{ partOfSpeech: ["int"], misc: [], gloss: [{ lang: "eng", text: "thank you" }] }] },
  { id: 4, kanji: [{ text: "生" }], kana: [{ text: "なま" }], sense: [{ partOfSpeech: ["n"], gloss: [{ lang: "eng", text: "raw" }] }] },
];

describe("data transforms", () => {
  it("keeps the easiest level for a word listed twice", () => {
    const flat = flattenTanosVocab({ 学生: [{ reading: "がくせい", level: 3 }, { reading: "がくせい", level: 5 }] });
    expect(flat).toEqual([{ headword: "学生", reading: "がくせい", level: 5 }]);
  });

  it("builds words per level with meanings, pos and the usually-kana rule", () => {
    const { words, unmatched } = buildWords(jm, {
      学生: [{ reading: "がくせい", level: 5 }],
      綺麗: [{ reading: "きれい", level: 4 }],
      ありがとう: [{ reading: "ありがとう", level: 5 }],
      生: [{ reading: "せい", level: 3 }], // wrong reading must not match
      幽霊: [{ reading: "ゆうれい", level: 1 }], // absent from JMdict
    });
    expect(words.N5.map((w: { kana: string }) => w.kana).sort()).toEqual(["ありがとう", "がくせい"]);
    const student = words.N5.find((w: { id: string }) => w.id === "1");
    expect(student).toMatchObject({ kanji: "学生", hw: "学生", meanings: ["student, pupil"], pos: ["noun"], common: true, level: "N5" });
    expect((words.N4[0] as { kanji?: string }).kanji).toBeUndefined(); // 綺麗 is usually written in kana
    expect(unmatched).toContain("幽霊（ゆうれい）");
    expect(unmatched).toContain("生（せい）");
  });

  it("keeps only jōyō kanji and assigns levels", () => {
    const ch = (literal: string, grade: number, on: string[], kun: string[]) => ({
      literal, misc: { grade, strokeCounts: [4] },
      readingMeaning: { groups: [{ readings: [...on.map((v) => ({ type: "ja_on", value: v })), ...kun.map((v) => ({ type: "ja_kun", value: v }))], meanings: [{ lang: "en", value: "thing" }] }] },
    });
    const { kanji, joyo } = buildKanji([ch("日", 1, ["ニチ"], ["ひ"]), ch("鬱", 9, ["ウツ"], []), ch("亜", 8, ["ア"], [])], { 日: 5 });
    expect(joyo).toEqual(["日", "亜"]);
    expect(kanji.N5[0]).toMatchObject({ c: "日", on: ["ニチ"], kun: ["ひ"], level: "N5", strokes: 4 });
    expect(kanji.N1[0]).toMatchObject({ c: "亜", levelSource: "assumed" });
  });

  it("filters Tatoeba pairs", () => {
    expect(goodPair("私は学生です。", "I am a student.")).toBe(true);
    expect(goodPair("私は学生です", "I am a student.")).toBe(false); // no final punctuation
    expect(goodPair("私はABCです。", "I am ABC, really.")).toBe(false);
    expect(goodPair("あ。", "Oh.")).toBe(false);
  });

  it("links sentences to headwords, skipping ambiguous short kana", () => {
    const s = surfaceIndex([
      { headword: "学生", reading: "がくせい", level: 5 },
      { headword: "は", reading: "は", level: 5 },
      { headword: "ありがとう", reading: "ありがとう", level: 5 },
    ]);
    expect([...linkSentence("私は学生です。", s).keys()]).toEqual(["学生"]);
    expect([...linkSentence("ありがとう。", s).keys()]).toEqual(["ありがとう"]);
  });
});

