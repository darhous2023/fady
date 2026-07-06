import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { orders, orderItems } from "@/lib/db/drizzle/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    customer_name,
    phone,
    preferred_date,
    branch,
    items,
    subtotal,
    total,
    notes,
    customer_id,
  } = body;

  if (!customer_name || !phone || !items?.length || !total) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const order_number = `FADY-${Date.now().toString(36).toUpperCase()}`;

  try {
    const [order] = await db.insert(orders).values({
      order_number,
      customer_id: customer_id || null,
      customer_name,
      phone,
      preferred_date: preferred_date || null,
      branch: branch || null,
      subtotal: String(subtotal),
      shipping_cost: "0",
      total: String(total),
      method: "whatsapp",
      status: "pending",
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

    return NextResponse.json({ order_number: order.order_number, id: order.id }, { status: 201 });
  } catch (err) {
    console.error("[api/orders POST] failed:", err);
    return NextResponse.json({ error: "تعذّر إتمام الحجز، حاول مرة أخرى" }, { status: 500 });
  }
}
