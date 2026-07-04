export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { settings } from "@/lib/db/drizzle/schema"
import { inArray } from "drizzle-orm"
import { ORDER_STATUS_KEYS, ORDER_STATUS_SETTING_KEY, getOrderStatusLabels } from "@/lib/orderStatusLabels"

export async function GET() {
  try {
    const rows = await db.select().from(settings).where(
      inArray(settings.key, ORDER_STATUS_KEYS.map(ORDER_STATUS_SETTING_KEY))
    )
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return NextResponse.json(getOrderStatusLabels(map), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    })
  } catch {
    return NextResponse.json(getOrderStatusLabels({}))
  }
}
