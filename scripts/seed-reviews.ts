// Seed: realistic Arabic product reviews
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { products } from "../src/lib/db/drizzle/schema/products"
import { reviews } from "../src/lib/db/drizzle/schema/reviews"
import { eq, and } from "drizzle-orm"

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

const REVIEW_POOL = [
  { name: "فاطمة أحمد", rating: 5, comment: "منتج رائع جداً، الجودة تتكلم عن نفسها. وصل بسرعة والتغليف أنيق جداً. راضية ١٠٠٪" },
  { name: "منى محمد", rating: 5, comment: "اشتريت الشنطة دي وانبهرت بالشغل والتفاصيل. كل الصاحبات اتسألوني عنها. هطلب تاني قريباً" },
  { name: "سارة خالد", rating: 5, comment: "أحسن موقع اتعاملت معاه. المنتج زي ما هو في الصور بالظبط أو أحسن. الشحن كان سريع جداً" },
  { name: "نورا حسام", rating: 4, comment: "منتج ممتاز والخامة عالية جداً. التوصيل استغرق يومين بس النتيجة تستاهل. هينفع هدية كمان" },
  { name: "ياسمين عمرو", rating: 5, comment: "الجودة فاقت توقعاتي! السعر مناسب جداً للشغل الممتاز ده. لازم كل بنت تجرب شاهي ستور" },
  { name: "دينا سامي", rating: 5, comment: "من أول طلب وأنا مبسوطة جداً. الموقع سهل، التوصيل سريع، والمنتج خيالي. شكراً شاهي ستور ❤️" },
  { name: "هنا طارق", rating: 4, comment: "الشنطة جميلة أوي والشغل أنيق. الحجم مناسب جداً للاستخدام اليومي. نوصي به بشدة" },
  { name: "ريم وائل", rating: 5, comment: "بصراحة منتج فاخر بسعر معقول. الخامة ممتازة ومحدش يصدق إنها اشتريتها بالسعر ده" },
  { name: "لمياء كريم", rating: 5, comment: "وصلني المنتج وأنا في نص إجازتي وأسعدني جداً. التغليف فاخر والشنطة أجمل من الصور. ١٠/١٠" },
  { name: "شيرين ماجد", rating: 4, comment: "منتج ممتاز. الخامة عالية ومريحة في الاستخدام. نوصي به لأي حد بيدور على هدية مميزة" },
  { name: "إيمان علي", rating: 5, comment: "اشتريت اتنين طلبات وكل مرة الجودة نفسها الممتازة. موقع محترم وبيحافظ على العميل" },
  { name: "سمر فؤاد", rating: 5, comment: "ماشاء الله الشغل دقيق جداً والخامة راقية. لما تمسكيها حاسة إنها غالية. تستاهل كل قرش" },
  { name: "نادية رمزي", rating: 5, comment: "أخيراً لقيت موقع بيجيب منتجات أصيلة ومش مغشوشة. شاهي ستور عنوان الجودة ❤️" },
  { name: "مروة حمدي", rating: 4, comment: "الشنطة جميلة جداً وبتتناسب مع أي إطلالة. وصلت في الوقت المتفق عليه. موصى به" },
  { name: "نيرمين سعد", rating: 5, comment: "كنت متخوفة من الشراء أونلاين بس والله المنتج جاء فوق التوقعات. هطلب مرة تانية أكيد" },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

async function seedReviews() {
  const allProducts = await db.select({ id: products.id, name: products.name_ar })
    .from(products).where(eq(products.status, "active"))

  if (!allProducts.length) {
    console.log("⚠️  No active products found. Add products first.")
    await client.end()
    return
  }

  let total = 0
  const pool = shuffle(REVIEW_POOL)

  for (const product of allProducts) {
    const existing = await db.select({ id: reviews.id }).from(reviews)
      .where(and(eq(reviews.product_id, product.id), eq(reviews.is_approved, true)))
    if (existing.length >= 2) {
      console.log(`⏭️  ${product.name} — already has reviews, skipping`)
      continue
    }

    const count = 2 + Math.floor(Math.random() * 3) // 2–4 reviews per product
    const picked = shuffle(pool).slice(0, count)

    for (const r of picked) {
      const daysAgo = Math.floor(Math.random() * 90) + 1
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      await db.insert(reviews).values({
        product_id: product.id,
        customer_name: r.name,
        rating: r.rating,
        comment_ar: r.comment,
        is_approved: true,
        created_at: date,
      })
      total++
    }
    console.log(`✅ ${product.name} — added ${count} reviews`)
  }

  console.log(`\n🎉 Done! Added ${total} reviews across ${allProducts.length} products`)
  await client.end()
}

seedReviews().catch(e => { console.error(e); process.exit(1) })
