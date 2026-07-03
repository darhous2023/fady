import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { admins } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updates: Record<string, unknown> = { updated_at: new Date() }
  if ("role" in body && ["owner", "manager", "staff"].includes(body.role)) updates.role = body.role
  if ("is_active" in body) updates.is_active = body.is_active

  const [updated] = await db.update(admins).set(updates).where(eq(admins.id, id)).returning()
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.delete(admins).where(eq(admins.id, id))
  return NextResponse.json({ ok: true })
}
