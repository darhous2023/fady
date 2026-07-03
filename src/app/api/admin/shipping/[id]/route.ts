import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { shippingZones } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const updates: Record<string, unknown> = { updated_at: new Date() }
  if ("cost" in body) updates.cost = String(body.cost)
  if ("is_active" in body) updates.is_active = body.is_active

  const [updated] = await db.update(shippingZones).set(updates).where(eq(shippingZones.id, id)).returning()
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}
