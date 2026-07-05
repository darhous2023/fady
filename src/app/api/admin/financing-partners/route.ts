import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { financingPartners } from "@/lib/db/drizzle/schema"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { asc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const all = await db.select().from(financingPartners).orderBy(asc(financingPartners.sort_order))
  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name_ar, subtitle_ar, logo_url, link, sort_order } = body
  if (!name_ar) return NextResponse.json({ error: "name_ar مطلوب" }, { status: 400 })

  const [row] = await db.insert(financingPartners).values({
    name_ar, subtitle_ar: subtitle_ar || null, logo_url: logo_url || null, link: link || null,
    sort_order: sort_order ?? 0, is_active: true,
  }).returning()

  return NextResponse.json(row, { status: 201 })
}
