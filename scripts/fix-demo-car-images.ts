// One-off fix: the original demo seed used random Unsplash car photos that didn't
// match their labeled make/model (e.g. a Kia listing showing a Ford Mustang photo).
// Replaces product_images for the 6 seeded demo cars with verified matching photos.
// Run once: npx tsx scripts/fix-demo-car-images.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { products, productImages } from "../src/lib/db/drizzle/schema/products";

const client = postgres(process.env.MIGRATION_DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const FIXED_IMAGES: Record<string, string> = {
  toyota: "https://images.unsplash.com/photo-1559385988-439b04de16f8?w=1400&q=80",
  hyundai: "https://images.unsplash.com/photo-1569173455238-b885a4cad163?w=1400&q=80",
  kia: "https://images.unsplash.com/photo-1561299593-7633f311838a?w=1400&q=80",
  chevrolet: "https://images.unsplash.com/photo-1575028401612-46bedd08ec81?w=1400&q=80",
  nissan: "https://images.unsplash.com/photo-1559095380-3a7d465772a5?w=1400&q=80",
  mg: "https://images.unsplash.com/photo-1573710459621-bb101783ca0f?w=1400&q=80",
};

async function main() {
  const rows = await db.select().from(products);
  for (const p of rows) {
    if (!p.make || !FIXED_IMAGES[p.make]) continue;
    const url = FIXED_IMAGES[p.make];
    const existingImages = await db.select().from(productImages).where(eq(productImages.product_id, p.id));
    if (existingImages.length === 0) continue;
    // Replace the first (primary) image; leave any additional images untouched.
    await db.update(productImages).set({ url }).where(eq(productImages.id, existingImages[0].id));
    console.log("fixed:", p.name_ar, "->", url);
  }
  console.log("Done.");
  await client.end();
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
