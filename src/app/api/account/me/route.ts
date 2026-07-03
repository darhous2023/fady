import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { customers } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/utils/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.id) return NextResponse.json({ customer: null })
    const [customer] = await db.select().from(customers)
      .where(eq(customers.auth_user_id, session.user.id)).limit(1)
    return NextResponse.json({ customer: customer ?? null })
  } catch {
    return NextResponse.json({ customer: null })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const allowed = ["name", "phone", "avatar_url", "instagram_url", "facebook_url", "tiktok_url"] as const
    type AllowedField = typeof allowed[number]
    const updates: Partial<Record<AllowedField, string>> = {}
    for (const key of allowed) {
      if (key in body && typeof body[key] === "string") {
        updates[key] = body[key].trim()
      }
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 })
    }

    const [existing] = await db.select({ id: customers.id })
      .from(customers).where(eq(customers.auth_user_id, session.user.id)).limit(1)

    if (!existing) return NextResponse.json({ error: "Customer not found" }, { status: 404 })

    const [updated] = await db.update(customers)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(customers.auth_user_id, session.user.id))
      .returning()

    return NextResponse.json({ customer: updated })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
