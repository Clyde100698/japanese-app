import { describe, expect, it } from "vitest";
import { chunkJapanese, isSameSentence, makeChoices, quizXp, shuffle, speedScore } from "../lib/quiz";
import type { DeckCard } from "../lib/decks";

const mk = (id: string, front: string, answer: string): DeckCard => ({ id, kind: "kana", front, answer, speak: front });
const pool = [mk("a", "あ", "a"), mk("i", "い", "i"), mk("u", "う", "u"), mk("e", "え", "e"), mk("j1", "じ", "ji"), mk("j2", "ぢ", "ji")];
const seeded = () => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };

describe("quiz helpers", () => {
  it("shuffle keeps all items", () => {
    expect(shuffle([1, 2, 3, 4, 5], seeded()).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("choices include the answer, have no duplicate option text", () => {
    for (const c of pool) {
      const ch = makeChoices(c, pool, "front-to-answer", 4, seeded());
      expect(ch.some((x) => x.id === c.id)).toBe(true);
      const texts = ch.map((x) => x.answer);
      expect(new Set(texts).size).toBe(texts.length);
      expect(ch.length).toBe(4);
    }
  });

  it("choices shrink gracefully when the pool is small", () => {
    expect(makeChoices(pool[0], pool.slice(0, 2), "front-to-answer", 4).length).toBe(2);
  });

  it("chunking is lossless", () => {
    for (const s of ["私は学生です。", "これはペンですか。", "わたしはまいにちがっこうへいきます。", "ありがとうございます"]) {
      expect(chunkJapanese(s).join("")).toBe(s);
    }
  });

  it("chunking splits at particles", () => {
    expect(chunkJapanese("私は学生です。")).toEqual(["私は", "学生です。"]);
  });

  it("sentence check", () => {
    expect(isSameSentence(["私は", "学生です。"], "私は学生です。")).toBe(true);
    expect(isSameSentence(["学生です。", "私は"], "私は学生です。")).toBe(false);
  });

  it("xp and speed scoring", () => {
    expect(quizXp(5, 5)).toBe(15);
    expect(quizXp(3, 5)).toBe(6);
    expect(speedScore([true, true, false, true])).toBe(10 + 12 + 10);
  });
});

