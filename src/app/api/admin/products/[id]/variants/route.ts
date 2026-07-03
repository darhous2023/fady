export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { productVariants } from "@/lib/db/drizzle/schema"
import { eq, asc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const rows = await db.select().from(productVariants)
    .where(eq(productVariants.product_id, id))
    .orderBy(asc(productVariants.size), asc(productVariants.color_ar))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const [created] = await db.insert(productVariants).values({
    product_id: id,
    color_ar: body.color_ar?.trim() || null,
    size: body.size?.trim() || null,
    sku: body.sku?.trim() || null,
    stock: Number(body.stock) || 0,
    price_override: body.price_override ? String(Number(body.price_override)) : null,
  }).returning()
  return NextResponse.json(created, { status: 201 })
}
