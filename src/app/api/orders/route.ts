import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { orders, orderItems, discountCodes } from "@/lib/db/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    customer_name,
    phone,
    governorate,
    address,
    items,
    subtotal,
    shipping_cost,
    total,
    method,
    discount_code,
    notes,
    customer_id,
  } = body;

  if (!customer_name || !phone || !governorate || !address || !items?.length || !total) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const order_number = `SHY-${Date.now().toString(36).toUpperCase()}`;

  const [order] = await db.insert(orders).values({
    order_number,
    customer_id: customer_id || null,
    customer_name,
    phone,
    governorate,
    address,
    subtotal: String(subtotal),
    shipping_cost: String(shipping_cost || 0),
    total: String(total),
    method: method || "cod",
    status: "pending",
    discount_code: discount_code || null,
    notes: notes || null,
  }).returning();

  if (items?.length > 0) {
    await db.insert(orderItems).values(
      items.map((item: {
        product_id: string;
        variant_id?: string;
        product_name: string;
        quality_tier: string;
        qty: number;
        unit_price: number;
      }) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.product_name,
        quality_tier: item.quality_tier,
        qty: item.qty,
        unit_price: String(item.unit_price),
      }))
    );
  }

  if (discount_code) {
    await db.update(discountCodes)
      .set({ used_count: sql`used_count + 1` })
      .where(eq(discountCodes.code, discount_code.toUpperCase().trim()))
  }

  return NextResponse.json({ order_number: order.order_number, id: order.id }, { status: 201 });
}
