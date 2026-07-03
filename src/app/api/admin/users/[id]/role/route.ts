import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { admins, users } from "@/lib/db/drizzle/schema"
import { eq, or } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { action, email, name } = body

  if (!["promote", "demote"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  try {
    if (action === "promote") {
      // Don't allow duplicate admin entries
      const [existing] = await db.select({ id: admins.id })
        .from(admins)
        .where(or(eq(admins.auth_user_id, id), eq(admins.email, email)))
        .limit(1)
      if (existing) return NextResponse.json({ adminId: existing.id })

      // Insert with auth_user_id = the user's Better Auth id
      const [newAdmin] = await db.insert(admins).values({
        auth_user_id: id,
        name: name || email,
        email,
        role: "staff",
        is_active: true,
      }).returning()

      return NextResponse.json({ success: true, adminId: newAdmin.id })
    } else {
      // demote — don't allow demoting yourself
      if (session.user?.email === email) {
        return NextResponse.json({ error: "لا يمكنك إلغاء صلاحياتك بنفسك" }, { status: 400 })
      }

      await db.delete(admins).where(or(eq(admins.auth_user_id, id), eq(admins.email, email)))
      return NextResponse.json({ success: true, adminId: null })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
