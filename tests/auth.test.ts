import { describe, it, expect, beforeEach } from "vitest";
import { hashPin, MAX_ATTEMPTS, COOLDOWN_SECONDS } from "../lib/auth";

describe("auth PIN & lockout logic", () => {
  it("computes deterministic SHA-256 hash for 6-digit PINs", async () => {
    const hash1 = await hashPin("123456");
    const hash2 = await hashPin("123456");
    const hashOther = await hashPin("654321");

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
    expect(hash1).not.toBe(hashOther);
  });

  it("produces correct known SHA-256 hash", async () => {
    // SHA-256("000000") in UTF-8
    const hash = await hashPin("000000");
    expect(hash).toBe("91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203");
  });

  it("has correct MAX_ATTEMPTS and COOLDOWN_SECONDS configuration", () => {
    expect(MAX_ATTEMPTS).toBe(5);
    expect(COOLDOWN_SECONDS).toBe(60);
  });
});
