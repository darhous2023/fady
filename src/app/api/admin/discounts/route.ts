import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { discountCodes } from "@/lib/db/drizzle/schema"
import { desc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await db.select().from(discountCodes).orderBy(desc(discountCodes.created_at))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { code, type, value, min_order, max_uses, expires_at } = body

  if (!code || !type || !value) {
    return NextResponse.json({ error: "الكود والنوع والقيمة مطلوبة" }, { status: 400 })
  }
  if (!["percent", "fixed"].includes(type)) {
    return NextResponse.json({ error: "نوع غير صحيح" }, { status: 400 })
  }
  if (type === "percent" && (Number(value) < 1 || Number(value) > 100)) {
    return NextResponse.json({ error: "نسبة الخصم يجب أن تكون بين 1 و 100" }, { status: 400 })
  }

  try {
    const [created] = await db.insert(discountCodes).values({
      code: String(code).toUpperCase().trim(),
      type,
      value: String(value),
      min_order: String(min_order || 0),
      max_uses: max_uses ? Number(max_uses) : null,
      expires_at: expires_at ? new Date(expires_at) : null,
      is_active: true,
    }).returning()

    return NextResponse.json(created, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("unique")) return NextResponse.json({ error: "الكود موجود بالفعل" }, { status: 409 })
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
