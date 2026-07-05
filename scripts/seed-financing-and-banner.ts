// Seeds demo content for Station 3: a financing/installment marquee (4 generic,
// honestly-worded financing benefits — no specific bank names are claimed since
// no real partnership has been confirmed) and one demo homepage banner.
// Both are fully admin-editable/replaceable afterwards (/admin/financing-partners, /admin/banners).
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { financingPartners } from "../src/lib/db/drizzle/schema/financingPartners";
import { banners } from "../src/lib/db/drizzle/schema/banners";
import { settings } from "../src/lib/db/drizzle/schema/settings";
import { sql } from "drizzle-orm";

const client = postgres(process.env.MIGRATION_DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const FINANCING_PARTNERS = [
  { name_ar: "تقسيط يصل حتى 60 شهر", subtitle_ar: "بالتعاون مع البنوك الشريكة", sort_order: 0 },
  { name_ar: "مقدم يبدأ من 10%", subtitle_ar: "على السيارات المؤهلة للتقسيط", sort_order: 1 },
  { name_ar: "موافقة سريعة", subtitle_ar: "إجراءات تمويل مبسطة داخل المعرض", sort_order: 2 },
  { name_ar: "استشارة تمويل مجانية", subtitle_ar: "نساعدك تختار الخطة الأنسب لك", sort_order: 3 },
];

async function main() {
  const existingPartners = await db.select({ id: financingPartners.id }).from(financingPartners);
  if (existingPartners.length === 0) {
    await db.insert(financingPartners).values(FINANCING_PARTNERS);
    console.log(`Inserted ${FINANCING_PARTNERS.length} financing marquee entries.`);
  } else {
    console.log(`Skipped financing partners — ${existingPartners.length} already exist.`);
  }

  const existingBanners = await db.select({ id: banners.id }).from(banners);
  if (existingBanners.length === 0) {
    await db.insert(banners).values({
      image_url: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=1600&q=80",
      title_ar: "تشكيلة سيارات جديدة ومستعملة — تواصل معنا الآن",
      link: "/new",
      sort_order: 0,
      is_active: true,
    });
    console.log("Inserted 1 demo homepage banner.");
  } else {
    console.log(`Skipped banner seed — ${existingBanners.length} already exist.`);
  }

  await db.insert(settings).values({ key: "financing_marquee_title_ar", value: "التمويل والتقسيط" })
    .onConflictDoUpdate({ target: settings.key, set: { value: sql`excluded.value` } });

  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
