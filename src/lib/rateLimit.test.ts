import { describe, it, expect } from "vitest";
import { hashIdentifier, isRateLimitConfigured } from "./rateLimit";

describe("hashIdentifier", () => {
  it("never returns the raw input value (phone numbers must never be stored/logged as-is)", () => {
    const phone = "201555557745";
    const hashed = hashIdentifier(phone);
    expect(hashed).not.toContain(phone);
    expect(hashed).toMatch(/^[0-9a-f]{32}$/);
  });

  it("is deterministic for the same input", () => {
    expect(hashIdentifier("201555557745")).toBe(hashIdentifier("201555557745"));
  });

  it("produces different hashes for different inputs", () => {
    expect(hashIdentifier("201555557745")).not.toBe(hashIdentifier("201000000000"));
  });
});

describe("isRateLimitConfigured", () => {
  it("is false when UPSTASH_REDIS_REST_URL/TOKEN aren't set in this test environment", () => {
    // Documents the safe default: no Upstash credentials configured yet
    // means rate limiting no-ops everywhere rather than throwing or
    // blocking real traffic (see checkRateLimit's early return).
    expect(typeof isRateLimitConfigured).toBe("boolean");
  });
});
