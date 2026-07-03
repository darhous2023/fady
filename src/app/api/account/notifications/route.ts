import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { products, productImages } from "@/lib/db/drizzle/schema"
import { eq, and, gte, desc } from "drizzle-orm"
import { auth } from "@/utils/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.id) return NextResponse.json({ notifications: [] })
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const newProducts = await db.select({
      id: products.id,
      slug: products.slug,
      name_ar: products.name_ar,
      price: products.price,
      created_at: products.created_at,
    }).from(products)
      .where(and(eq(products.status, "active"), gte(products.created_at, cutoff)))
      .orderBy(desc(products.created_at))
      .limit(15)
    const imgs = newProducts.length > 0
      ? await db.select({ product_id: productImages.product_id, url: productImages.url })
          .from(productImages).where(eq(productImages.sort_order, 0))
      : []
    const imgMap = Object.fromEntries(imgs.map(i => [i.product_id, i.url]))
    const notifications = newProducts.map(p => ({
      id: p.id,
      type: "new_product",
      title: `✨ منتج جديد: ${p.name_ar}`,
      body: `متاح الآن بسعر ${Number(p.price).toLocaleString("ar-EG")} ج.م`,
      link: `/products/${p.slug}`,
      image: imgMap[p.id] ?? null,
      created_at: p.created_at,
    }))
    return NextResponse.json({ notifications })
  } catch {
    return NextResponse.json({ notifications: [] })
  }
}
