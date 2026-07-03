import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { shippingZones } from "@/lib/db/drizzle/schema"
import { asc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const zones = await db.select().from(shippingZones).orderBy(asc(shippingZones.governorate_ar))
  return NextResponse.json(zones)
}
