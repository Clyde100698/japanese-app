import { describe, it, expect } from "vitest";
import { SCENARIOS } from "../scripts/data/scenarios-source.mjs";
import { computeConversationBadges, type Scenario, type ScenarioProgress } from "../lib/scenarios";

const typedScenarios = SCENARIOS as unknown as Scenario[];

describe("Scenario Conversation Mode Datasets & Logic", () => {
  it("contains at least 40 scripted scenarios covering N5 through N1", () => {
    expect(typedScenarios.length).toBeGreaterThanOrEqual(40);

    const levels = new Set(typedScenarios.map((s) => s.level));
    expect(levels.has("N5")).toBe(true);
    expect(levels.has("N4")).toBe(true);
    expect(levels.has("N3")).toBe(true);
    expect(levels.has("N2")).toBe(true);
    expect(levels.has("N1")).toBe(true);
  });

  it("every scenario has complete metadata and valid key phrases", () => {
    for (const s of typedScenarios) {
      expect(s.id).toBeDefined();
      expect(s.title).toBeTruthy();
      expect(s.titleJa).toBeTruthy();
      expect(s.category).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.keyPhrases.length).toBeGreaterThanOrEqual(2);

      for (const kp of s.keyPhrases) {
        expect(kp.id).toBeTruthy();
        expect(kp.front).toBeTruthy();
        expect(kp.answer).toBeTruthy();
      }
    }
  });

  it("every dialogue turn has Japanese, reading, romaji, English, and politeness level", () => {
    for (const s of typedScenarios) {
      expect(s.lines.length).toBeGreaterThanOrEqual(2);

      for (const line of s.lines) {
        expect(["other", "learner"]).toContain(line.speaker);
        expect(line.speakerName).toBeTruthy();
        expect(line.ja).toBeTruthy();
        expect(line.reading).toBeTruthy();
        expect(line.romaji).toBeTruthy();
        expect(line.en).toBeTruthy();
        expect(["casual", "polite", "keigo"]).toContain(line.politeness);

        if (line.speaker === "learner" && line.options) {
          expect(line.options.length).toBeGreaterThanOrEqual(1);
          const hasCorrect = line.options.some((o) => o.isCorrect);
          expect(hasCorrect).toBe(true);

          for (const opt of line.options) {
            expect(opt.ja).toBeTruthy();
            expect(opt.en).toBeTruthy();
            expect(opt.explanation).toBeTruthy();
          }
        }
      }
    }
  });

  it("computes conversation badges accurately from scenario completions", () => {
    const mockProgress: ScenarioProgress = {
      completedIds: [typedScenarios[0].id],
      watchCount: 1,
      roleplayCount: 1,
      fillCount: 0,
      shadowCount: 0,
      addedPhrases: [],
    };

    const badges = computeConversationBadges(typedScenarios, mockProgress);
    const firstWords = badges.find((b) => b.id === "first_convo");
    expect(firstWords).toBeDefined();
    expect(firstWords?.unlocked).toBe(true);

    const n5Diplomat = badges.find((b) => b.id === "n5_diplomat");
    expect(n5Diplomat).toBeDefined();
    expect(n5Diplomat?.unlocked).toBe(false);
  });
});
