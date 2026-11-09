import { describe, it, expect } from "vitest";
import { getMascotMood } from "../lib/gameState";

describe("Game State & Mascot Mood", () => {
  it("determines sleepy mood when user has not studied today", () => {
    expect(getMascotMood(false, 0)).toBe("sleepy");
    expect(getMascotMood(false, 10)).toBe("sleepy");
  });

  it("determines happy mood when user has studied today", () => {
    expect(getMascotMood(true, 1)).toBe("happy");
    expect(getMascotMood(true, 3)).toBe("happy");
  });

  it("determines proud mood on long streak (>= 5 days) after studying", () => {
    expect(getMascotMood(true, 5)).toBe("proud");
    expect(getMascotMood(true, 14)).toBe("proud");
  });
});
