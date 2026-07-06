import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { reviews } from "@/lib/db/drizzle/schema"
import { eq, and, isNull, desc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product_id")
  const featured  = req.nextUrl.searchParams.get("featured")
  const showroom  = req.nextUrl.searchParams.get("showroom")

  try {
    if (showroom === "true") {
      const rows = await db
        .select()
        .from(reviews)
        .where(and(isNull(reviews.product_id), eq(reviews.is_approved, true)))
        .orderBy(desc(reviews.created_at))
        .limit(12)
      return NextResponse.json(rows)
    }

    if (featured === "true") {
      const rows = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.is_approved, true)))
        .orderBy(desc(reviews.rating), desc(reviews.created_at))
        .limit(8)
      return NextResponse.json(rows)
    }

    if (!productId) return NextResponse.json([], { status: 200 })

    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.product_id, productId), eq(reviews.is_approved, true)))
      .orderBy(desc(reviews.created_at))
      .limit(20)

    return NextResponse.json(rows)
  } catch (err) {
    console.error("[api/reviews GET] failed:", err)
    return NextResponse.json({ error: "تعذر تحميل التقييمات" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { product_id, customer_name, rating, comment_ar } = body

  if (!customer_name?.trim() || !rating) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 })
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "التقييم يجب أن يكون بين 1 و 5" }, { status: 400 })
  }

  try {
    const [review] = await db.insert(reviews).values({
      product_id: product_id || null,
      customer_name: customer_name.trim(),
      rating: Number(rating),
      comment_ar: comment_ar?.trim() || null,
      is_approved: false,
    }).returning()

    return NextResponse.json({ ok: true, id: review.id }, { status: 201 })
  } catch (err) {
    console.error("[api/reviews POST] failed:", err)
    return NextResponse.json({ error: "تعذّر إرسال التقييم، حاول مرة أخرى" }, { status: 500 })
  }
}
