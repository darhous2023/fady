// Samples one main image per brand (up to all public brands) and does a
// real HEAD request against its remoteUrl (the only URL actually rendered
// today — objectStorageUrl is null until the image-migration step runs).
// Read-only, no writes. Reports a hit-rate, not a full 60K-link crawl.
import { config } from "dotenv";
config({ path: ".env.local" });
export {};

async function main() {
  const { carsDb } = await import("../src/lib/cars/db");
  const { carsCanonical, carsBrands, carsCanonicalImages, carsImages } = await import("../src/lib/db/carsCatalog/schema");
  const { eq, and, sql } = await import("drizzle-orm");

  const brands = await carsDb.select({ id: carsBrands.id, nameEn: carsBrands.nameEn }).from(carsBrands).where(eq(carsBrands.isPublic, true));

  const results: { brand: string; url: string | null; status: number | string }[] = [];

  for (const brand of brands) {
    const [row] = await carsDb
      .select({ url: carsImages.remoteUrl, key: carsCanonical.normalizedKey })
      .from(carsCanonical)
      .innerJoin(carsCanonicalImages, and(eq(carsCanonicalImages.canonicalKey, carsCanonical.normalizedKey), eq(carsCanonicalImages.isMain, true)))
      .innerJoin(carsImages, eq(carsImages.id, carsCanonicalImages.imageId))
      .where(and(eq(carsCanonical.brandId, brand.id), eq(carsCanonical.publicationEligible, true), eq(carsCanonical.adminHidden, false)))
      .limit(1);

    if (!row?.url) { results.push({ brand: brand.nameEn, url: null, status: "no-image-row" }); continue; }

    try {
      const res = await fetch(row.url, { method: "HEAD", signal: AbortSignal.timeout(6000) });
      results.push({ brand: brand.nameEn, url: row.url, status: res.status });
    } catch (e) {
      results.push({ brand: brand.nameEn, url: row.url, status: "fetch-error: " + (e instanceof Error ? e.message : String(e)) });
    }
  }

  const okCount = results.filter((r) => r.status === 200).length;
  const failCount = results.length - okCount;
  const failures = results.filter((r) => r.status !== 200);

  console.log(JSON.stringify({
    sampledBrands: results.length,
    okCount,
    failCount,
    hitRatePct: Math.round((okCount / results.length) * 1000) / 10,
    failures,
  }, null, 2));

  process.exit(0);
}

main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
