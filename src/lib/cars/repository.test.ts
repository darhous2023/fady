import { describe, it, expect } from "vitest";
import { applyCarOverrides } from "./repository";

describe("applyCarOverrides", () => {
  const baseCar = { displayName: "BMW 5 Series", year: 2022, powerHp: 250, nameAr: "بي ام دبليو" };

  it("returns the row unchanged when there are no overrides", () => {
    expect(applyCarOverrides(baseCar, [])).toEqual(baseCar);
  });

  it("applies a text override for an overridable field", () => {
    const result = applyCarOverrides(baseCar, [{ field: "displayName", overrideValue: "BMW 5 Series (2024 facelift)" }]);
    expect(result.displayName).toBe("BMW 5 Series (2024 facelift)");
  });

  it("coerces numeric fields (year, powerHp, etc.) back from stored text", () => {
    const result = applyCarOverrides(baseCar, [{ field: "year", overrideValue: "2024" }]);
    expect(result.year).toBe(2024);
    expect(typeof result.year).toBe("number");
  });

  it("ignores overrides for fields not in the overridable allowlist (defense in depth)", () => {
    const result = applyCarOverrides(baseCar, [{ field: "nameAr", overrideValue: "اسم مزيف" }]);
    expect(result.nameAr).toBe("بي ام دبليو");
  });

  it("does not mutate the original row object", () => {
    const original = { ...baseCar };
    applyCarOverrides(baseCar, [{ field: "year", overrideValue: "1999" }]);
    expect(baseCar).toEqual(original);
  });
});
