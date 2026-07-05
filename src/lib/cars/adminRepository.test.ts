import { describe, it, expect } from "vitest";
import { isOverridableCarField, isAdminCreatedId } from "./adminRepository";

describe("isOverridableCarField", () => {
  it("accepts every field the sync engine overwrites on re-sync", () => {
    for (const f of ["displayName", "year", "bodyType", "engine", "transmission", "fuelType", "drivetrain", "seatingCapacity", "doors", "powerHp", "torqueNm"]) {
      expect(isOverridableCarField(f)).toBe(true);
    }
  });

  it("rejects fields the sync engine never touches (safe for direct writes)", () => {
    expect(isOverridableCarField("nameAr")).toBe(false);
    expect(isOverridableCarField("adminHidden")).toBe(false);
    expect(isOverridableCarField("adminNotes")).toBe(false);
  });

  it("rejects unknown/arbitrary field names", () => {
    expect(isOverridableCarField("dropTableCars")).toBe(false);
    expect(isOverridableCarField("")).toBe(false);
  });
});

describe("isAdminCreatedId", () => {
  it("recognizes the admin- id prefix used for admin-created rows", () => {
    expect(isAdminCreatedId("admin-3fa85f64-5717-4562-b3fc-2c963f66afa6")).toBe(true);
  });

  it("rejects sync-derived ids (cuids, normalizedKeys) so they can never be hard-deleted", () => {
    expect(isAdminCreatedId("ckv8x2z9q0000gzucv5f5a2e3")).toBe(false);
    expect(isAdminCreatedId("bmw|5-series|2024|sedan")).toBe(false);
  });

  it("only matches the prefix, not the substring anywhere in the id", () => {
    expect(isAdminCreatedId("not-admin-created")).toBe(false);
  });
});
