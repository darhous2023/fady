import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { categories } from "@/lib/db/drizzle/schema"
import { asc, eq } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cats = await db.select().from(categories).orderBy(asc(categories.sort_order))
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name_ar, slug, sort_order, is_active } = body

  if (!name_ar?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: "الاسم والـ slug مطلوبان" }, { status: 400 })
  }

  try {
    const [cat] = await db.insert(categories).values({
      name_ar: name_ar.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      sort_order: Number(sort_order) || 0,
      is_active: is_active !== false,
    }).returning()
    return NextResponse.json(cat, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("unique")) return NextResponse.json({ error: "الـ slug موجود بالفعل" }, { status: 409 })
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
