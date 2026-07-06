import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { partnerLogos } from "@/lib/db/drizzle/schema"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { asc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const all = await db.select().from(partnerLogos).orderBy(asc(partnerLogos.sort_order))
  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, logo_url, link, sort_order } = body
  if (!name) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 })
  if (!logo_url) return NextResponse.json({ error: "الشعار مطلوب" }, { status: 400 })

  const [row] = await db.insert(partnerLogos).values({
    name, logo_url, link: link || null,
    sort_order: sort_order ?? 0, is_active: true,
  }).returning()

  return NextResponse.json(row, { status: 201 })
}
