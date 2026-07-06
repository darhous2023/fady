import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { products, productImages, categories } from "@/lib/db/drizzle/schema"
import { eq, and, ilike } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  try {
    const rows = await db
      .select({ id: products.id, slug: products.slug, name_ar: products.name_ar, price: products.price, category_name: categories.name_ar })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .where(and(eq(products.status, "active"), ilike(products.name_ar, `%${q}%`)))
      .limit(8)

    const ids = rows.map(r => r.id)
    const imgs = ids.length > 0
      ? await db.select({ product_id: productImages.product_id, url: productImages.url })
          .from(productImages).where(eq(productImages.sort_order, 0))
      : []
    const imgMap = Object.fromEntries(imgs.map(i => [i.product_id, i.url]))

    return NextResponse.json(rows.map(r => ({ ...r, price: Number(r.price), image: imgMap[r.id] ?? null })))
  } catch (err) {
    console.error("[api/search] failed:", err)
    return NextResponse.json({ error: "تعذر البحث حاليًا" }, { status: 500 })
  }
}
