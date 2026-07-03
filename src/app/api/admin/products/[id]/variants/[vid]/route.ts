export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { productVariants } from "@/lib/db/drizzle/schema"
import { eq, and } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; vid: string }> },
) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, vid } = await params
  const body = await req.json()
  const updates: Record<string, unknown> = {}
  if (body.color_ar !== undefined) updates.color_ar = body.color_ar?.trim() || null
  if (body.size !== undefined) updates.size = body.size?.trim() || null
  if (body.sku !== undefined) updates.sku = body.sku?.trim() || null
  if (body.stock !== undefined) updates.stock = Number(body.stock) || 0
  if (body.price_override !== undefined)
    updates.price_override = body.price_override ? String(Number(body.price_override)) : null
  const [updated] = await db
    .update(productVariants)
    .set(updates)
    .where(and(eq(productVariants.id, vid), eq(productVariants.product_id, id)))
    .returning()
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; vid: string }> },
) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, vid } = await params
  await db
    .delete(productVariants)
    .where(and(eq(productVariants.id, vid), eq(productVariants.product_id, id)))
  return NextResponse.json({ ok: true })
}
