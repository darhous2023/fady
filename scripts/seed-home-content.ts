// Seeds sensible default copy for the home page into `settings` so the site
// looks complete on first load. Every value here is immediately editable
// from /admin/home — nothing here is hardcoded into the frontend.
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { settings } from "../src/lib/db/drizzle/schema/settings";

const client = postgres(process.env.MIGRATION_DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const DEFAULTS: Record<string, string> = {
  hero_video_url: "https://videos.pexels.com/video-files/14052063/14052063-hd_1920_1080_25fps.mp4",
  hero_eyebrow_ar: "معرض سيارات موثوق منذ سنوات",
  hero_headline_ar: "الفادي",
  hero_subheadline_ar: "سيارات جديدة ومستعملة — بثقة وشفافية، وتواصل فوري عبر واتساب",

  gateway_new_title_ar: "سيارات جديدة",
  gateway_new_desc_ar: "تصفّح كل الماركات والموديلات، شوف المواصفات كاملة، واسأل عن التوفر فورًا",
  gateway_new_image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",

  gateway_used_title_ar: "سيارات مستعملة",
  gateway_used_desc_ar: "سيارات متاحة فعليًا في المعرض، بحالة مفحوصة وصور حقيقية",
  gateway_used_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",

  marquee_text_ar: "سيارات جديدة  ·  سيارات مستعملة  ·  فحص شامل  ·  تواصل فوري عبر واتساب  ·  ",
  statement_headline_ar: "ثقة تُبنى بالتفاصيل",

  trust_pillar_1_title_ar: "شفافية كاملة",
  trust_pillar_1_desc_ar: "كل بيانات السيارة (الحالة، العداد، الفحص) معروضة بوضوح قبل أي قرار — بدون مفاجآت.",
  trust_pillar_2_title_ar: "معاينة حقيقية",
  trust_pillar_2_desc_ar: "زور المعرض وعاين السيارة بنفسك، أو اطلب تفاصيل إضافية على واتساب في أي وقت.",
  trust_pillar_3_title_ar: "خبرة في السوق",
  trust_pillar_3_desc_ar: "سنوات من التعامل المباشر في تجارة السيارات الجديدة والمستعملة في مصر.",

  how_it_works_1_title_ar: "اختر السيارة",
  how_it_works_1_desc_ar: "تصفّح السيارات الجديدة عبر الكتالوج أو السيارات المستعملة المتاحة فعليًا.",
  how_it_works_2_title_ar: "استفسر أو احجز معاينة",
  how_it_works_2_desc_ar: "تواصل معنا مباشرة على واتساب لمعرفة التوفر أو لتحديد موعد معاينة.",
  how_it_works_3_title_ar: "قرارك بثقة",
  how_it_works_3_desc_ar: "بعد المعاينة والاطمئنان لكل التفاصيل، تقدر تاخد قرارك وانت مطمئن.",

  showroom_video_url: "https://videos.pexels.com/video-files/7154208/7154208-hd_1920_1080_25fps.mp4",
  showroom_headline_ar: "زور المعرض بنفسك",
  showroom_desc_ar: "تجربة معاينة حقيقية لكل سيارة قبل القرار — في المهندسين، شارع أحمد عرابي",
};

async function main() {
  console.log("Seeding home content defaults...");
  for (const [key, value] of Object.entries(DEFAULTS)) {
    await db.insert(settings).values({ key, value }).onConflictDoNothing();
  }
  console.log("Done.");
  await client.end();
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
