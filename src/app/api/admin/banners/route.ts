import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { banners } from "@/lib/db/drizzle/schema"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { asc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const all = await db.select().from(banners).orderBy(asc(banners.sort_order))
  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { image_url, title_ar, link, sort_order } = body
  if (!image_url) return NextResponse.json({ error: "image_url مطلوب" }, { status: 400 })

  const [row] = await db.insert(banners).values({
    image_url, title_ar: title_ar || null, link: link || null,
    sort_order: sort_order ?? 0, is_active: true,
  }).returning()

  return NextResponse.json(row, { status: 201 })
}
