import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import { categories } from "./schema/categories";
import { shippingZones } from "./schema/shipping";
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

  // Shipping zones
  console.log("  → Shipping zones...");
  await db
    .insert(shippingZones)
    .values([
      // Port Said (free)
      { governorate_ar: "بورسعيد", cost: "0" },
      // Cairo & Alexandria
      { governorate_ar: "القاهرة", cost: "50" },
      { governorate_ar: "الإسكندرية", cost: "50" },
      { governorate_ar: "الجيزة", cost: "50" },
      // Delta
      { governorate_ar: "الدقهلية", cost: "50" },
      { governorate_ar: "الغربية", cost: "50" },
      { governorate_ar: "المنوفية", cost: "50" },
      { governorate_ar: "البحيرة", cost: "50" },
      { governorate_ar: "الشرقية", cost: "50" },
      { governorate_ar: "كفر الشيخ", cost: "50" },
      { governorate_ar: "دمياط", cost: "50" },
      // Canal
      { governorate_ar: "الإسماعيلية", cost: "50" },
      { governorate_ar: "السويس", cost: "50" },
      // Upper Egypt
      { governorate_ar: "أسيوط", cost: "100" },
      { governorate_ar: "سوهاج", cost: "100" },
      { governorate_ar: "قنا", cost: "100" },
      { governorate_ar: "الأقصر", cost: "100" },
      { governorate_ar: "أسوان", cost: "100" },
      { governorate_ar: "المنيا", cost: "100" },
      { governorate_ar: "بني سويف", cost: "100" },
      { governorate_ar: "الفيوم", cost: "100" },
      // Other
      { governorate_ar: "القليوبية", cost: "50" },
      { governorate_ar: "شمال سيناء", cost: "100" },
      { governorate_ar: "جنوب سيناء", cost: "100" },
      { governorate_ar: "البحر الأحمر", cost: "100" },
      { governorate_ar: "الوادي الجديد", cost: "100" },
      { governorate_ar: "مطروح", cost: "100" },
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
      { key: "instagram_url", value: "" },
      { key: "facebook_url", value: "" },
      { key: "tiktok_url", value: "" },
      { key: "free_shipping_threshold", value: "0" },
    ])
    .onConflictDoNothing();

  console.log("✅ Seed complete!");
  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
