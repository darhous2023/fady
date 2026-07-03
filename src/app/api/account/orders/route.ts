import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { orders, customers } from "@/lib/db/drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { auth } from "@/utils/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.id) return NextResponse.json({ orders: [] })

    const limit = Number(new URL(req.url).searchParams.get("limit") || "50")

    // Find customer record linked to this auth user
    const [customer] = await db.select().from(customers).where(eq(customers.auth_user_id, session.user.id)).limit(1)

    if (!customer) return NextResponse.json({ orders: [] })

    // Get orders by customer phone
    const userOrders = await db
      .select({
        order_number: orders.order_number,
        status: orders.status,
        total: orders.total,
        subtotal: orders.subtotal,
        shipping_cost: orders.shipping_cost,
        governorate: orders.governorate,
        created_at: orders.created_at,
      })
      .from(orders)
      .where(eq(orders.phone, customer.phone))
      .orderBy(desc(orders.created_at))
      .limit(limit)

    return NextResponse.json({ orders: userOrders })
  } catch {
    return NextResponse.json({ orders: [] })
  }
}
