import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { discountCodes, orders, customers } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/utils/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.id) return NextResponse.json({ coupons: [] })
    const [customer] = await db.select({ phone: customers.phone })
      .from(customers).where(eq(customers.auth_user_id, session.user.id)).limit(1)
    const allCodes = await db.select().from(discountCodes).where(eq(discountCodes.is_active, true))
    const usedCodes = new Set<string>()
    if (customer) {
      const myOrders = await db.select({ discount_code: orders.discount_code })
        .from(orders).where(eq(orders.phone, customer.phone))
      myOrders.forEach(o => { if (o.discount_code) usedCodes.add(o.discount_code) })
    }
    const now = new Date()
    const coupons = allCodes.map(c => {
      const expired = c.expires_at ? new Date(c.expires_at) < now : false
      const exhausted = c.max_uses != null ? c.used_count >= c.max_uses : false
      return {
        id: c.id,
        code: c.code,
        type: c.type,
        value: Number(c.value),
        min_order: Number(c.min_order),
        max_uses: c.max_uses,
        used_count: c.used_count,
        expires_at: c.expires_at,
        status: usedCodes.has(c.code) ? "used" : (expired || exhausted) ? "expired" : "valid",
      }
    })
    return NextResponse.json({ coupons })
  } catch {
    return NextResponse.json({ coupons: [] })
  }
}
