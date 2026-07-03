// Seeds car-brand categories + a handful of demo used cars with placeholder photos.
// Everything here is DB-driven and fully editable/replaceable from /admin (edit fields,
// upload real photos, archive). Run once: npx tsx scripts/seed-demo-cars.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categories } from "../src/lib/db/drizzle/schema/categories";
import { products, productImages } from "../src/lib/db/drizzle/schema/products";

const client = postgres(process.env.MIGRATION_DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const BRANDS = [
  { name_ar: "تويوتا", slug: "toyota", sort_order: 1 },
  { name_ar: "هيونداي", slug: "hyundai", sort_order: 2 },
  { name_ar: "كيا", slug: "kia", sort_order: 3 },
  { name_ar: "شيفروليه", slug: "chevrolet", sort_order: 4 },
  { name_ar: "نيسان", slug: "nissan", sort_order: 5 },
  { name_ar: "أم جي", slug: "mg", sort_order: 6 },
];

type DemoCar = {
  brandSlug: string;
  name_ar: string;
  model: string;
  year: number;
  mileage_km: number;
  transmission: "automatic" | "manual";
  fuel_type: string;
  body_type: string;
  condition: "original" | "mirror" | "hi_copy"; // excellent / very good / good
  price: number;
  compare_at_price?: number;
  is_featured?: boolean;
  description_ar: string;
  images: string[];
};

const DEMO_CARS: DemoCar[] = [
  {
    brandSlug: "toyota", name_ar: "تويوتا كورولا 2021", model: "كورولا", year: 2021,
    mileage_km: 42000, transmission: "automatic", fuel_type: "بنزين", body_type: "سيدان",
    condition: "original", price: 620000, compare_at_price: 660000, is_featured: true,
    description_ar: "حالة السيارة: ممتازة، فبريكة بالكامل\nعدد الملاك: مالك واحد\nصيانة دورية بالوكيل\nتم الفحص الشامل",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1400&q=80",
    ],
  },
  {
    brandSlug: "hyundai", name_ar: "هيونداي النترا 2020", model: "إلنترا", year: 2020,
    mileage_km: 58000, transmission: "automatic", fuel_type: "بنزين", body_type: "سيدان",
    condition: "original", price: 520000, is_featured: true,
    description_ar: "حالة ممتازة، فحص كامل\nمالك واحد من الوكيل\nكاملة المعدات",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=80"],
  },
  {
    brandSlug: "kia", name_ar: "كيا سيراتو 2019", model: "سيراتو", year: 2019,
    mileage_km: 71000, transmission: "automatic", fuel_type: "بنزين", body_type: "سيدان",
    condition: "mirror", price: 430000,
    description_ar: "حالة جيدة جدًا، جاهزة للمعاينة\nصيانة دورية موثقة",
    images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80"],
  },
  {
    brandSlug: "chevrolet", name_ar: "شيفروليه أفيو 2018", model: "أفيو", year: 2018,
    mileage_km: 85000, transmission: "manual", fuel_type: "بنزين", body_type: "هاتشباك",
    condition: "mirror", price: 320000,
    description_ar: "اقتصادية في الاستهلاك\nحالة جيدة جدًا ومناسبة للاستخدام اليومي",
    images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80"],
  },
  {
    brandSlug: "nissan", name_ar: "نيسان صني 2022", model: "صني", year: 2022,
    mileage_km: 21000, transmission: "automatic", fuel_type: "بنزين", body_type: "سيدان",
    condition: "original", price: 480000, is_featured: true,
    description_ar: "شبه جديدة، عداد قليل جدًا\nضمان الوكيل ساري",
    images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1400&q=80"],
  },
  {
    brandSlug: "mg", name_ar: "أم جي 5 2021", model: "MG5", year: 2021,
    mileage_km: 39000, transmission: "automatic", fuel_type: "بنزين", body_type: "سيدان",
    condition: "original", price: 495000,
    description_ar: "حالة ممتازة، فحص شامل متاح\nكاملة المعدات مع شاشة لمس",
    images: ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1400&q=80"],
  },
];

function slugify(text: string, suffix: string) {
  return `car-${suffix}-${Math.random().toString(36).slice(2, 8)}`;
}

async function main() {
  console.log("Seeding car brand categories...");
  const insertedCats = await db.insert(categories).values(BRANDS).onConflictDoNothing().returning();
  const catRows = insertedCats.length ? insertedCats : await db.select().from(categories);
  const bySlug = Object.fromEntries(catRows.map((c) => [c.slug, c.id]));

  console.log("Seeding demo used cars...");
  for (const car of DEMO_CARS) {
    const category_id = bySlug[car.brandSlug];
    if (!category_id) { console.warn("skip (no category):", car.name_ar); continue; }

    const [row] = await db.insert(products).values({
      name_ar: car.name_ar,
      slug: slugify(car.name_ar, car.brandSlug),
      description_ar: car.description_ar,
      category_id,
      quality_tier: car.condition,
      price: String(car.price),
      compare_at_price: car.compare_at_price ? String(car.compare_at_price) : null,
      is_featured: !!car.is_featured,
      status: "active",
      make: car.brandSlug,
      model: car.model,
      year: car.year,
      mileage_km: car.mileage_km,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      body_type: car.body_type,
    }).returning();

    for (let i = 0; i < car.images.length; i++) {
      await db.insert(productImages).values({
        product_id: row.id,
        url: car.images[i],
        alt_ar: car.name_ar,
        sort_order: i,
      });
    }
    console.log("  +", car.name_ar);
  }

  console.log("Done.");
  await client.end();
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
