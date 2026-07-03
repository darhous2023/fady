import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { categories, products } from "@/lib/db/drizzle/schema"
import { eq, count } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updates: Record<string, unknown> = { updated_at: new Date() }
  if ("name_ar" in body) updates.name_ar = body.name_ar
  if ("slug" in body) updates.slug = body.slug
  if ("sort_order" in body) updates.sort_order = Number(body.sort_order)
  if ("is_active" in body) updates.is_active = body.is_active

  try {
    const [updated] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning()
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  // Check for linked products
  const [{ count: productCount }] = await db.select({ count: count() }).from(products).where(eq(products.category_id, id))
  if (Number(productCount) > 0) {
    return NextResponse.json({ error: `لا يمكن الحذف — يوجد ${productCount} منتج في هذا القسم` }, { status: 409 })
  }

  await db.delete(categories).where(eq(categories.id, id))
  return NextResponse.json({ success: true })
}
