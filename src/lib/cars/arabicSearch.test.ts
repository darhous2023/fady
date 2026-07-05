import { describe, it, expect } from "vitest";
import { normalizeArabic, normalizeQuery, expandQueryWithAliases } from "./arabicSearch";

describe("normalizeArabic", () => {
  it("folds alif variants to a single form", () => {
    expect(normalizeArabic("أحمد")).toBe(normalizeArabic("احمد"));
    expect(normalizeArabic("إحمد")).toBe(normalizeArabic("احمد"));
    expect(normalizeArabic("آحمد")).toBe(normalizeArabic("احمد"));
  });

  it("folds taa marbuta to haa", () => {
    expect(normalizeArabic("سيارة")).toBe(normalizeArabic("سياره"));
  });

  it("folds alif maqsura to yaa", () => {
    expect(normalizeArabic("علي")).toBe(normalizeArabic("على"));
  });

  it("strips diacritics", () => {
    expect(normalizeArabic("سَيَّارَة")).toBe(normalizeArabic("سيارة"));
  });

  it("lowercases the result", () => {
    expect(normalizeArabic("ABC")).toBe("abc");
  });
});

describe("normalizeQuery", () => {
  it("applies Arabic normalization only when the query contains Arabic script", () => {
    expect(normalizeQuery("بي ام دبليو")).toBe(normalizeArabic("بي ام دبليو"));
  });

  it("lowercases plain Latin queries without Arabic-specific folding", () => {
    expect(normalizeQuery("BMW")).toBe("bmw");
  });
});

describe("expandQueryWithAliases", () => {
  it("maps a known Arabic brand alias to its English source name", () => {
    expect(expandQueryWithAliases("بي ام دبليو")).toBe("BMW");
    expect(expandQueryWithAliases("مرسيدس")).toBe("Mercedes-Benz");
    expect(expandQueryWithAliases("تويوتا")).toBe("Toyota");
  });

  it("returns the original query unchanged when no alias matches", () => {
    expect(expandQueryWithAliases("some random text")).toBe("some random text");
  });

  it("prefers an admin-supplied extra alias over the default table when both could match", () => {
    const result = expandQueryWithAliases("كيا", { "كيا": "Kia Motors Corp" });
    expect(result).toBe("Kia Motors Corp");
  });

  it("never mutates the original source name — only returns a mapped value", () => {
    const original = "بي ام دبليو";
    expandQueryWithAliases(original);
    expect(original).toBe("بي ام دبليو");
  });
});
