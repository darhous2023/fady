import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import { categories } from "./schema/categories";
import { settings } from "./schema/settings";

config({ path: ".env.local" });

const client = postgres(process.env.MIGRATION_DATABASE_URL!, { max: 1 });
const db = drizzle(client);

async function seed() {
  console.log("🌱 Seeding elfady database...");

  // Categories
  console.log("  → Categories...");
  await db
    .insert(categories)
    .values([
      { name_ar: "تويوتا", slug: "toyota", sort_order: 1, is_active: true },
      { name_ar: "هيونداي", slug: "hyundai", sort_order: 2, is_active: true },
      { name_ar: "كيا", slug: "kia", sort_order: 3, is_active: true },
      { name_ar: "شيفروليه", slug: "chevrolet", sort_order: 4, is_active: true },
      { name_ar: "نيسان", slug: "nissan", sort_order: 5, is_active: true },
      { name_ar: "أم جي", slug: "mg", sort_order: 6, is_active: true },
    ])
    .onConflictDoNothing();

  // Settings
  console.log("  → Settings...");
  await db
    .insert(settings)
    .values([
      { key: "whatsapp_number", value: "+201555557745" },
      { key: "store_name_ar", value: "الفادي" },
      { key: "store_tagline_ar", value: "معرض سيارات — المهندسين، شارع أحمد عرابي" },
      { key: "facebook_url", value: "" },
    ])
    .onConflictDoNothing();

  console.log("✅ Seed complete!");
  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
