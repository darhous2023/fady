import { NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { settings } from "@/lib/db/drizzle/schema"
import { inArray } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, ["announcement_text", "announcement_active"]))

    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return NextResponse.json({
      text: map.announcement_text ?? "",
      active: map.announcement_active === "true",
    })
  } catch {
    return NextResponse.json({ text: "", active: false })
  }
}
