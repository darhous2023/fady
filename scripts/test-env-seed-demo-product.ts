// Seeds one demo active product (used car) into the isolated test-harness
// store DB so Station 6's write-path/critical-journey Playwright tests have
// a real product to browse/book/review against. Additive only -- never run
// against a real (non-isolated) DATABASE_URL. Station 4's shared bootstrap
// (test-env-bootstrap-db.ts) + baseline seed (npm run db:seed) create the
// schema + categories this depends on; this script only adds one more row
// on top, it doesn't touch either of those.
//
// Run: npx tsx scripts/test-env-seed-demo-product.ts
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { db } = await import("../src/lib/db/drizzle/connection");
  const { products, categories } = await import("../src/lib/db/drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const [toyota] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, "toyota")).limit(1);
  if (!toyota) throw new Error("Category 'toyota' not found -- run `npm run db:seed` first");

  const [product] = await db
    .insert(products)
    .values({
      name_ar: "تويوتا كورولا 2020 — عربة اختبار E2E",
      slug: "e2e-test-corolla-2020",
      description_ar: "عربة تجريبية لاختبارات Station 6 الآلية فقط.",
      category_id: toyota.id,
      quality_tier: "original",
      price: "550000",
      status: "active",
      make: "Toyota",
      model: "Corolla",
      year: 2020,
      mileage_km: 45000,
      transmission: "أوتوماتيك",
    })
    .onConflictDoNothing()
    .returning({ id: products.id, slug: products.slug });

  if (product) {
    console.log(`DEMO_PRODUCT_ID=${product.id}`);
    console.log(`DEMO_PRODUCT_SLUG=${product.slug}`);
  } else {
    console.log("Demo product already exists (onConflictDoNothing) -- looking it up");
    const [existing] = await db.select({ id: products.id, slug: products.slug }).from(products).where(eq(products.slug, "e2e-test-corolla-2020")).limit(1);
    console.log(`DEMO_PRODUCT_ID=${existing.id}`);
    console.log(`DEMO_PRODUCT_SLUG=${existing.slug}`);
  }
}

main().catch((err) => {
  console.error("Failed to seed demo product:", err);
  process.exit(1);
});
