import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { products } from "@/lib/db/drizzle/schema";
import { desc } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.select().from(products).orderBy(desc(products.created_at));
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    name_ar, slug, description_ar, category_id, quality_tier, price, compare_at_price, status, is_featured,
    make, model, year, mileage_km, transmission, fuel_type, body_type,
    exterior_color, interior_color, engine_cc, cylinders, horsepower,
    drivetrain, doors, seats, previous_owners, plate_type,
    inspection_status, warranty, features_ar,
  } = body;

  if (!name_ar || !slug || !category_id || !quality_tier || !price) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const [product] = await db.insert(products).values({
    name_ar,
    slug,
    description_ar: description_ar || null,
    category_id,
    quality_tier,
    price: String(price),
    compare_at_price: compare_at_price ? String(compare_at_price) : null,
    status: status || "draft",
    is_featured: Boolean(is_featured),
    make: make || null,
    model: model || null,
    year: year ? Number(year) : null,
    mileage_km: mileage_km ? Number(mileage_km) : null,
    transmission: transmission || null,
    fuel_type: fuel_type || null,
    body_type: body_type || null,
    exterior_color: exterior_color || null,
    interior_color: interior_color || null,
    engine_cc: engine_cc ? Number(engine_cc) : null,
    cylinders: cylinders ? Number(cylinders) : null,
    horsepower: horsepower ? Number(horsepower) : null,
    drivetrain: drivetrain || null,
    doors: doors ? Number(doors) : null,
    seats: seats ? Number(seats) : null,
    previous_owners: previous_owners ? Number(previous_owners) : null,
    plate_type: plate_type || null,
    inspection_status: inspection_status || null,
    warranty: warranty || null,
    features_ar: features_ar || null,
  }).returning();

  return NextResponse.json(product, { status: 201 });
}
