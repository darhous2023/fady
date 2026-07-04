import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { reviews } from "@/lib/db/drizzle/schema"
import { desc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await db.select().from(reviews).orderBy(desc(reviews.created_at)).limit(100)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { product_id, customer_name, rating, comment_ar } = body

  if (!customer_name?.trim() || !rating) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 })
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "التقييم يجب أن يكون بين 1 و 5" }, { status: 400 })
  }

  const [review] = await db.insert(reviews).values({
    product_id: product_id || null,
    customer_name: customer_name.trim(),
    rating: Number(rating),
    comment_ar: comment_ar?.trim() || null,
    is_approved: true,
  }).returning()

  return NextResponse.json(review, { status: 201 })
}
