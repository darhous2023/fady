import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { orders, orderItems } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const number = req.nextUrl.searchParams.get("number")?.trim().toUpperCase()
  if (!number) return NextResponse.json({ error: "رقم الطلب مطلوب" }, { status: 400 })

  const [order] = await db.select({
    id: orders.id,
    order_number: orders.order_number,
    customer_name: orders.customer_name,
    branch: orders.branch,
    preferred_date: orders.preferred_date,
    status: orders.status,
    total: orders.total,
    created_at: orders.created_at,
    method: orders.method,
  }).from(orders).where(eq(orders.order_number, number)).limit(1)

  if (!order) return NextResponse.json({ error: "رقم الطلب غير موجود" }, { status: 404 })

  const items = await db.select({
    product_name: orderItems.product_name,
    quality_tier: orderItems.quality_tier,
    qty: orderItems.qty,
    unit_price: orderItems.unit_price,
  }).from(orderItems).where(eq(orderItems.order_id, order.id))

  return NextResponse.json({ ...order, items })
}
