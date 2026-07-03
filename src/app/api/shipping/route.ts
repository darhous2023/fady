import { NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { shippingZones } from "@/lib/db/drizzle/schema"
import { eq, asc } from "drizzle-orm"

export async function GET() {
  try {
    const zones = await db.select({
      id: shippingZones.id,
      governorate_ar: shippingZones.governorate_ar,
      cost: shippingZones.cost,
    }).from(shippingZones)
      .where(eq(shippingZones.is_active, true))
      .orderBy(asc(shippingZones.governorate_ar))
    return NextResponse.json(zones)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
