import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { products, productImages, categories } from "@/lib/db/drizzle/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

  const rows = await db
    .select({
      id: products.id,
      name_ar: products.name_ar,
      slug: products.slug,
      description_ar: products.description_ar,
      price: products.price,
      compare_at_price: products.compare_at_price,
      quality_tier: products.quality_tier,
      is_featured: products.is_featured,
      category_id: products.category_id,
      category_name: categories.name_ar,
      category_slug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.category_id, categories.id))
    .where(
      and(
        eq(products.status, "active"),
        categorySlug ? eq(categories.slug, categorySlug) : undefined,
        featured === "true" ? eq(products.is_featured, true) : undefined
      )
    )
    .limit(limit);

  // Attach first image for each product
  const ids = rows.map((r) => r.id);
  const images =
    ids.length > 0
      ? await db
          .select({ product_id: productImages.product_id, url: productImages.url, alt_ar: productImages.alt_ar })
          .from(productImages)
          .where(eq(productImages.sort_order, 0))
      : [];

  const imageMap = Object.fromEntries(images.map((i) => [i.product_id, i]));

  const result = rows.map((r) => ({
    ...r,
    price: Number(r.price),
    compare_at_price: r.compare_at_price ? Number(r.compare_at_price) : null,
    image: imageMap[r.id] ?? null,
  }));

  return NextResponse.json(result, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
