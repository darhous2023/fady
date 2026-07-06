import { describe, it, expect, beforeAll, afterAll } from "vitest";

// Station 6 write-path test: confirms an admin field override on a synced
// canonical_cars row survives a re-sync overwriting the raw field, the exact
// guarantee adminRepository.ts's file header documents but that
// repository.test.ts only proves at the pure-function (applyCarOverrides)
// level, not against a real database round-trip.
//
// SAFETY: only runs when E2E_ISOLATED_CARS_DB=true is explicitly set (see
// .github/workflows/e2e-smoke.yml) -- this test mutates canonical_cars.
// It must never run against a real CARS_DATABASE_URL by accident, so it's
// skipped by default in every other context (local dev, plain `npm test`).
const isolated = process.env.E2E_ISOLATED_CARS_DB === "true";

describe.skipIf(!isolated)("admin_overrides survive a simulated re-sync (isolated cars-catalog branch only)", () => {
  let normalizedKey: string;
  let originalDisplayName: string;

  beforeAll(async () => {
    const { carsDb } = await import("./db");
    const { carsCanonical } = await import("../db/carsCatalog/schema");
    const [row] = await carsDb.select({ normalizedKey: carsCanonical.normalizedKey, displayName: carsCanonical.displayName }).from(carsCanonical).limit(1);
    if (!row) throw new Error("Isolated cars-catalog branch has zero canonical_cars rows -- expected a real-data branch of fady-cars-catalog");
    normalizedKey = row.normalizedKey;
    originalDisplayName = row.displayName;
  });

  afterAll(async () => {
    if (!normalizedKey) return;
    const { adminClearCarFieldOverride } = await import("./adminRepository");
    const { carsDb } = await import("./db");
    const { carsCanonical } = await import("../db/carsCatalog/schema");
    const { eq } = await import("drizzle-orm");
    await adminClearCarFieldOverride(normalizedKey, "displayName");
    await carsDb.update(carsCanonical).set({ displayName: originalDisplayName }).where(eq(carsCanonical.normalizedKey, normalizedKey));
  });

  it("keeps the admin override value after the raw field is overwritten the way a re-sync would", async () => {
    const { adminSetCarFieldOverride } = await import("./adminRepository");
    const { getCanonicalCarDetail } = await import("./repository");
    const { carsDb } = await import("./db");
    const { carsCanonical } = await import("../db/carsCatalog/schema");
    const { eq } = await import("drizzle-orm");

    await adminSetCarFieldOverride(normalizedKey, "displayName", "Station 6 Override Value", "e2e-test");

    // Simulate exactly what the scraping project's sync engine does on
    // re-sync: an ON CONFLICT DO UPDATE that overwrites the raw synced
    // field directly (see steps.ts referenced in adminRepository.ts's
    // header) -- never the override table itself.
    await carsDb.update(carsCanonical).set({ displayName: "Re-synced Raw Value From Source" }).where(eq(carsCanonical.normalizedKey, normalizedKey));

    const detail = await getCanonicalCarDetail(normalizedKey);
    expect(detail).not.toBeNull();
    expect(detail!.displayName).toBe("Station 6 Override Value");
  });
});
