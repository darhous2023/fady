import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { admins } from "@/lib/db/drizzle/schema"
import { desc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { auth } from "@/utils/auth"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await db.select().from(admins).orderBy(desc(admins.created_at))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, email, password, role } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "الاسم والإيميل وكلمة السر مطلوبة" }, { status: 400 })
  }
  if (!["owner", "manager", "staff"].includes(role)) {
    return NextResponse.json({ error: "صلاحية غير صحيحة" }, { status: 400 })
  }

  try {
    const created = await auth.api.signUpEmail({
      body: { name, email, password },
    })

    if (!created?.user?.id) {
      return NextResponse.json({ error: "فشل إنشاء المستخدم" }, { status: 500 })
    }

    const [admin] = await db.insert(admins).values({
      auth_user_id: created.user.id,
      name,
      email,
      role: role as "owner" | "manager" | "staff",
      is_active: true,
    }).returning()

    return NextResponse.json(admin, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: "الإيميل ده موجود بالفعل" }, { status: 409 })
    }
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
