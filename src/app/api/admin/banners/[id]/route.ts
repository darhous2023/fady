import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { banners } from "@/lib/db/drizzle/schema"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

interface Props { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { title_ar, link, sort_order, is_active } = body

  const updates: Record<string, unknown> = { updated_at: sql`now()` }
  if (title_ar !== undefined) updates.title_ar = title_ar
  if (link !== undefined) updates.link = link
  if (sort_order !== undefined) updates.sort_order = sort_order
  if (is_active !== undefined) updates.is_active = is_active

  const [row] = await db.update(banners).set(updates).where(eq(banners.id, id)).returning()
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.delete(banners).where(eq(banners.id, id))
  return NextResponse.json({ ok: true })
}
