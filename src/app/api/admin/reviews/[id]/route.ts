import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { reviews } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const updates: Record<string, unknown> = {}

  if ("is_approved" in body) updates.is_approved = Boolean(body.is_approved)
  if ("customer_name" in body && body.customer_name?.trim()) updates.customer_name = body.customer_name.trim()
  if ("rating" in body) {
    const r = Number(body.rating)
    if (r < 1 || r > 5) return NextResponse.json({ error: "التقييم يجب أن يكون بين 1 و 5" }, { status: 400 })
    updates.rating = r
  }
  if ("comment_ar" in body) updates.comment_ar = body.comment_ar?.trim() || null
  if ("product_id" in body) updates.product_id = body.product_id || null

  const [updated] = await db
    .update(reviews)
    .set(updates)
    .where(eq(reviews.id, id))
    .returning()

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.delete(reviews).where(eq(reviews.id, id))
  return NextResponse.json({ ok: true })
}
