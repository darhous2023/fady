// Read-only categorization of all cars-catalog canonical rows for Station 2.
// Real counts from the live Neon DB, not estimates. Never writes.
import { config } from "dotenv";
config({ path: ".env.local" });
export {};

async function main() {
  const { carsDb } = await import("../src/lib/cars/db");
  const { carsCanonical, carsBrands, carsModels, carsCanonicalImages } = await import("../src/lib/db/carsCatalog/schema");
  const { sql, eq, and, isNull } = await import("drizzle-orm");

  const [{ total }] = await carsDb.select({ total: sql<number>`count(*)::int` }).from(carsCanonical);
  const [{ eligible }] = await carsDb.select({ eligible: sql<number>`count(*)::int` }).from(carsCanonical).where(eq(carsCanonical.publicationEligible, true));
  const [{ hidden }] = await carsDb.select({ hidden: sql<number>`count(*)::int` }).from(carsCanonical).where(eq(carsCanonical.adminHidden, true));
  const [{ eligibleAndHidden }] = await carsDb.select({ eligibleAndHidden: sql<number>`count(*)::int` }).from(carsCanonical)
    .where(and(eq(carsCanonical.publicationEligible, true), eq(carsCanonical.adminHidden, true)));
  const [{ liveVisible }] = await carsDb.select({ liveVisible: sql<number>`count(*)::int` }).from(carsCanonical)
    .where(and(eq(carsCanonical.publicationEligible, true), eq(carsCanonical.adminHidden, false)));

  const [{ noBrand }] = await carsDb.select({ noBrand: sql<number>`count(*)::int` }).from(carsCanonical).where(isNull(carsCanonical.brandId));
  const [{ noModel }] = await carsDb.select({ noModel: sql<number>`count(*)::int` }).from(carsCanonical).where(isNull(carsCanonical.modelId));

  const reasonRows = await carsDb
    .select({ reason: carsCanonical.publicationReason, count: sql<number>`count(*)::int` })
    .from(carsCanonical)
    .where(eq(carsCanonical.publicationEligible, false))
    .groupBy(carsCanonical.publicationReason)
    .orderBy(sql`count(*) desc`);

  // Ineligible rows with zero images vs. ineligible rows that DO have images
  // (i.e. images exist but something else about the row disqualifies it).
  const withImageSub = carsDb.selectDistinct({ key: carsCanonicalImages.canonicalKey }).from(carsCanonicalImages).as("with_image");
  const [{ ineligibleNoImage }] = await carsDb
    .select({ ineligibleNoImage: sql<number>`count(*)::int` })
    .from(carsCanonical)
    .leftJoin(withImageSub, eq(withImageSub.key, carsCanonical.normalizedKey))
    .where(and(eq(carsCanonical.publicationEligible, false), isNull(withImageSub.key)));

  const [{ eligibleNoImage }] = await carsDb
    .select({ eligibleNoImage: sql<number>`count(*)::int` })
    .from(carsCanonical)
    .leftJoin(withImageSub, eq(withImageSub.key, carsCanonical.normalizedKey))
    .where(and(eq(carsCanonical.publicationEligible, true), eq(carsCanonical.adminHidden, false), isNull(withImageSub.key)));

  const [{ totalBrands }] = await carsDb.select({ totalBrands: sql<number>`count(*)::int` }).from(carsBrands);
  const [{ publicBrands }] = await carsDb.select({ publicBrands: sql<number>`count(*)::int` }).from(carsBrands).where(eq(carsBrands.isPublic, true));
  const [{ totalModels }] = await carsDb.select({ totalModels: sql<number>`count(*)::int` }).from(carsModels);
  const [{ hiddenModels }] = await carsDb.select({ hiddenModels: sql<number>`count(*)::int` }).from(carsModels).where(eq(carsModels.adminHidden, true));

  // Duplicate displayName+year combos (approximation of "duplicate listing").
  const dupes = await carsDb
    .select({ displayName: carsCanonical.displayName, year: carsCanonical.year, count: sql<number>`count(*)::int` })
    .from(carsCanonical)
    .groupBy(carsCanonical.displayName, carsCanonical.year)
    .having(sql`count(*) > 1`)
    .orderBy(sql`count(*) desc`)
    .limit(10);
  const [{ dupeGroupsTotal }] = await carsDb
    .select({ dupeGroupsTotal: sql<number>`count(*)::int` })
    .from(
      carsDb.select({ displayName: carsCanonical.displayName, year: carsCanonical.year })
        .from(carsCanonical).groupBy(carsCanonical.displayName, carsCanonical.year).having(sql`count(*) > 1`).as("g")
    );

  console.log(JSON.stringify({
    totalCanonicalCars: total,
    publicationEligible: eligible,
    adminHidden: hidden,
    eligibleAndAdminHidden: eligibleAndHidden,
    liveVisibleToCustomers: liveVisible,
    ineligible: total - eligible,
    ineligibleReasons: reasonRows,
    ineligibleWithZeroImages: ineligibleNoImage,
    eligibleVisibleButZeroImages: eligibleNoImage,
    missingBrandId: noBrand,
    missingModelId: noModel,
    brands: { total: totalBrands, public: publicBrands, logoOnlyOrEmpty: totalBrands - publicBrands },
    models: { total: totalModels, adminHidden: hiddenModels },
    duplicateDisplayNameYearGroups: dupeGroupsTotal,
    sampleDuplicateGroups: dupes,
  }, null, 2));

  process.exit(0);
}

main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
