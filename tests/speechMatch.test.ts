import { describe, expect, it } from "vitest";
import { judge, normalizeJa, similarity } from "../lib/speechMatch";

describe("speech matching", () => {
  it("normalises katakana, punctuation and spaces", () => {
    expect(normalizeJa("コーヒー。")).toBe("こひ");
    expect(normalizeJa("こんにちは！")).toBe("こんにちは");
  });
  it("identical and different strings", () => {
    expect(similarity("ありがとう", "アリガトウ")).toBe(1);
    expect(similarity("あ", "い")).toBe(0);
  });
  it("verdict thresholds", () => {
    expect(judge(["ありがとうございます"], ["ありがとうございます"]).verdict).toBe("great");
    expect(judge(["ありがとうござます"], ["ありがとうございます"]).verdict).toBe("great");
    expect(judge(["ありがとう"], ["ありがとうございます"]).verdict).toBe("retry");
    expect(judge(["おはよう", "こんにちは"], ["こんにちは"]).verdict).toBe("great");
    expect(judge([], ["あ"]).verdict).toBe("retry");
  });
});

