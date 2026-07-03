import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { customers, orders } from "@/lib/db/drizzle/schema"
import { count, desc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const rows = await db
      .select({
        id: customers.id,
        name: customers.name,
        phone: customers.phone,
        email: customers.email,
        created_at: customers.created_at,
      })
      .from(customers)
      .orderBy(desc(customers.created_at))
      .limit(100)

    // Get order counts per customer phone
    const orderCounts = await db
      .select({ phone: orders.phone, count: count() })
      .from(orders)
      .groupBy(orders.phone)

    const countMap = Object.fromEntries(orderCounts.map(r => [r.phone, r.count]))

    return NextResponse.json(rows.map(c => ({ ...c, order_count: countMap[c.phone] || 0 })))
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
