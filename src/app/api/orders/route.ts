import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { orders, orderItems } from "@/lib/db/drizzle/schema";
import { checkRateLimit, getClientIp, hashIdentifier } from "@/lib/rateLimit";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  // Never use the raw phone digits as a rate-limit/Redis key -- hash first.
  const rateKey = `${getClientIp(request)}:${hashIdentifier(String(phone))}`;
  const { limited, retryAfterSeconds } = await checkRateLimit("booking", rateKey);
  if (limited) {
    return NextResponse.json(
      { error: "عدد كبير من طلبات الحجز، حاول مرة أخرى بعد قليل" },
      { status: 429, headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined },
    );
  }
  if (customer_id && !UUID_RE.test(customer_id)) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }
  if (!items.every((item: { product_id?: string }) => item.product_id && UUID_RE.test(item.product_id))) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const order_number = `FADY-${Date.now().toString(36).toUpperCase()}`;

  try {
    // Both inserts must succeed together -- an order row with no items (or
    // vice versa) is a real, confirmed bug found this station: a malformed
    // item left an orphaned order row in production even though the
    // customer was told the booking failed.
    const order = await db.transaction(async (tx) => {
      const [created] = await tx.insert(orders).values({
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

      await tx.insert(orderItems).values(
        items.map((item: {
          product_id: string;
          variant_id?: string;
          product_name: string;
          quality_tier: string;
          qty: number;
          unit_price: number;
        }) => ({
          order_id: created.id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          product_name: item.product_name,
          quality_tier: item.quality_tier,
          qty: item.qty,
          unit_price: String(item.unit_price),
        }))
      );

      return created;
    });

    return NextResponse.json({ order_number: order.order_number, id: order.id }, { status: 201 });
  } catch (err) {
    console.error("[api/orders POST] failed:", err);
    return NextResponse.json({ error: "تعذّر إتمام الحجز، حاول مرة أخرى" }, { status: 500 });
  }
}
