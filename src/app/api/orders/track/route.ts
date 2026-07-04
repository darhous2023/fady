import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { orders, orderItems } from "@/lib/db/drizzle/schema"
import { eq, or, desc } from "drizzle-orm"

const ORDER_COLUMNS = {
  id: orders.id,
  order_number: orders.order_number,
  customer_name: orders.customer_name,
  branch: orders.branch,
  preferred_date: orders.preferred_date,
  status: orders.status,
  total: orders.total,
  created_at: orders.created_at,
  method: orders.method,
  phone: orders.phone,
}

async function withItems<T extends { id: string }>(order: T) {
  const items = await db.select({
    product_name: orderItems.product_name,
    quality_tier: orderItems.quality_tier,
    qty: orderItems.qty,
    unit_price: orderItems.unit_price,
  }).from(orderItems).where(eq(orderItems.order_id, order.id))
  return { ...order, items }
}

export async function GET(req: NextRequest) {
  const phoneRaw = req.nextUrl.searchParams.get("phone")?.trim()
  const numberRaw = req.nextUrl.searchParams.get("number")?.trim().toUpperCase()

  if (phoneRaw) {
    const digits = phoneRaw.replace(/\D/g, "")
    if (digits.length < 8) return NextResponse.json({ error: "رقم تليفون غير صحيح" }, { status: 400 })
    // Match trailing digits so leading "0"/"+20"/"20" variants all resolve to the same bookings.
    const suffix = digits.slice(-9)

    const matches = await db.select(ORDER_COLUMNS).from(orders)
      .where(or(
        eq(orders.phone, phoneRaw),
        eq(orders.phone, digits),
      ))
      .orderBy(desc(orders.created_at))

    const filtered = matches.length > 0
      ? matches
      : (await db.select(ORDER_COLUMNS).from(orders).orderBy(desc(orders.created_at)))
          .filter(o => o.phone.replace(/\D/g, "").endsWith(suffix))

    if (filtered.length === 0) return NextResponse.json({ error: "لا توجد حجوزات بهذا الرقم" }, { status: 404 })

    const withItemsList = await Promise.all(filtered.map(withItems))
    return NextResponse.json({ orders: withItemsList })
  }

  if (numberRaw) {
    const [order] = await db.select(ORDER_COLUMNS).from(orders).where(eq(orders.order_number, numberRaw)).limit(1)
    if (!order) return NextResponse.json({ error: "رقم الطلب غير موجود" }, { status: 404 })
    return NextResponse.json({ orders: [await withItems(order)] })
  }

  return NextResponse.json({ error: "رقم التليفون أو رقم الطلب مطلوب" }, { status: 400 })
}
