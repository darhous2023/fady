// One-off script: seeds a starter set of reviews — some showroom-wide (product_id
// null), some tied to specific demo cars by name — so the reviews UI isn't empty
// on first launch. All rows are fully admin-editable/deletable from /admin/reviews.
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { reviews } from "../src/lib/db/drizzle/schema/reviews";
import { products } from "../src/lib/db/drizzle/schema/products";

const client = postgres(process.env.MIGRATION_DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const SHOWROOM_REVIEWS = [
  { customer_name: "أحمد سامي", rating: 5, comment_ar: "تعامل محترم جدًا من أول لحظة، ومفيش أي مبالغة في وصف حالة السيارات — اللي شفته هو اللي اخدته." },
  { customer_name: "مروة حسن", rating: 5, comment_ar: "المعرض منظم والسيارات نضيفة، وأهم حاجة إنهم صريحين في كل التفاصيل من غير ما تسأل." },
  { customer_name: "كريم عادل", rating: 4, comment_ar: "خدمة كويسة والمتابعة بعد الحجز سريعة، بس كنت عايز خيارات تمويل أكتر." },
];

const CAR_REVIEWS: { carName: string; customer_name: string; rating: number; comment_ar: string }[] = [
  { carName: "تويوتا كورولا 2021", customer_name: "محمد إبراهيم", rating: 5, comment_ar: "العربية فبريكة فعلاً زي ما اتقال، والعداد الحقيقي اتأكد منه في الفحص. مبسوط جدًا بالشراء." },
  { carName: "هيونداي النترا 2020", customer_name: "ياسمين طارق", rating: 5, comment_ar: "حالة ممتازة والسعر مناسب مقارنة بالسوق، والمعاينة كانت بدون أي ضغط." },
  { carName: "كيا سيراتو 2019", customer_name: "عمرو فتحي", rating: 4, comment_ar: "عربية جيدة جدًا واقتصادية في البنزين، حبذت لو كانت الألوان المتاحة أكتر." },
];

async function main() {
  console.log("Seeding reviews...");

  for (const r of SHOWROOM_REVIEWS) {
    await db.insert(reviews).values({
      product_id: null,
      customer_name: r.customer_name,
      rating: r.rating,
      comment_ar: r.comment_ar,
      is_approved: true,
    });
  }

  for (const r of CAR_REVIEWS) {
    const [product] = await db.select({ id: products.id }).from(products).where(eq(products.name_ar, r.carName)).limit(1);
    if (!product) {
      console.warn(`Skipped — product not found: ${r.carName}`);
      continue;
    }
    await db.insert(reviews).values({
      product_id: product.id,
      customer_name: r.customer_name,
      rating: r.rating,
      comment_ar: r.comment_ar,
      is_approved: true,
    });
  }

  console.log("Done.");
  await client.end();
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
