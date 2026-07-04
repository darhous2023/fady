import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { pageViews } from "@/lib/db/drizzle/schema"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : null
    const visitor_id = typeof body.visitor_id === "string" ? body.visitor_id.slice(0, 100) : null

    if (!path || !visitor_id) return NextResponse.json({ ok: false }, { status: 400 })
    if (path.startsWith("/admin")) return NextResponse.json({ ok: true })

    await db.insert(pageViews).values({ path, visitor_id })
    return NextResponse.json({ ok: true })
  } catch {
    // Analytics must never break the page — swallow any failure silently.
    return NextResponse.json({ ok: false })
  }
}
