import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { discountCodes } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const allowed = ["is_active", "max_uses", "expires_at"]
  const updates: Record<string, unknown> = { updated_at: new Date() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const [updated] = await db.update(discountCodes).set(updates).where(eq(discountCodes.id, id)).returning()
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.delete(discountCodes).where(eq(discountCodes.id, id))
  return NextResponse.json({ ok: true })
}
