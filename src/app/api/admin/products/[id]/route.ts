import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { products } from "@/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/auth/middleware";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const allowed = [
    "name_ar", "slug", "description_ar", "category_id",
    "quality_tier", "price", "compare_at_price", "status", "is_featured",
    "make", "model", "year", "mileage_km", "transmission", "fuel_type", "body_type",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      if (key === "price" || key === "compare_at_price") {
        updates[key] = body[key] ? String(body[key]) : null;
      } else if (key === "year" || key === "mileage_km") {
        updates[key] = body[key] ? Number(body[key]) : null;
      } else {
        updates[key] = body[key];
      }
    }
  }
  updates.updated_at = new Date();

  const [updated] = await db
    .update(products)
    .set(updates)
    .where(eq(products.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
