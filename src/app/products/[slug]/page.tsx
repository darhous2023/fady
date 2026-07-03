import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { db } from "@/lib/db/drizzle/connection"
import { products, productImages, categories, productVariants } from "@/lib/db/drizzle/schema"
import { eq, and, asc, ne } from "drizzle-orm"
import ProductDetail from "@/components/store/ProductDetail"
import ReviewsSection from "@/components/store/ReviewsSection"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const rows = await db
    .select({ name_ar: products.name_ar, description_ar: products.description_ar, price: products.price, id: products.id })
    .from(products).where(eq(products.slug, slug)).limit(1)
  if (!rows[0]) return { title: "المنتج غير موجود" }

  const [firstImg] = await db
    .select({ url: productImages.url })
    .from(productImages)
    .where(and(eq(productImages.product_id, rows[0].id), eq(productImages.sort_order, 0)))
    .limit(1)

  const title = `${rows[0].name_ar} — ELFADY`
  const desc = rows[0].description_ar
    ? rows[0].description_ar.slice(0, 155)
    : `${rows[0].name_ar} بسعر ${Number(rows[0].price).toLocaleString("ar-EG")} ج.م — معرض الفادي لتجارة السيارات`

  return {
    title,
    description: desc,
    openGraph: {
      title, description: desc, type: "website",
      images: firstImg?.url ? [{ url: firstImg.url, width: 800, height: 800, alt: rows[0].name_ar }] : [],
    },
    twitter: {
      card: "summary_large_image", title, description: desc,
      images: firstImg?.url ? [firstImg.url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const rows = await db
    .select({
      id: products.id, slug: products.slug,
      name_ar: products.name_ar, description_ar: products.description_ar,
      price: products.price, compare_at_price: products.compare_at_price,
      quality_tier: products.quality_tier, is_featured: products.is_featured,
      status: products.status, category_name: categories.name_ar,
      category_id: products.category_id,
      year: products.year, mileage_km: products.mileage_km,
      transmission: products.transmission, fuel_type: products.fuel_type, body_type: products.body_type,
    })
    .from(products)
    .leftJoin(categories, eq(products.category_id, categories.id))
    .where(and(eq(products.slug, slug), eq(products.status, "active")))
    .limit(1)

  if (!rows[0]) notFound()

  const product = {
    ...rows[0],
    price: Number(rows[0].price),
    compare_at_price: rows[0].compare_at_price ? Number(rows[0].compare_at_price) : null,
  }

  const [imgs, relatedRows, variantRows] = await Promise.all([
    db.select({ id: productImages.id, url: productImages.url, alt_ar: productImages.alt_ar, sort_order: productImages.sort_order })
      .from(productImages)
      .where(eq(productImages.product_id, product.id))
      .orderBy(asc(productImages.sort_order)),

    product.category_id
      ? db.select({
          id: products.id, slug: products.slug, name_ar: products.name_ar,
          price: products.price, compare_at_price: products.compare_at_price,
          quality_tier: products.quality_tier,
        })
        .from(products)
        .where(and(
          eq(products.category_id, product.category_id),
          eq(products.status, "active"),
          ne(products.id, product.id),
        ))
        .limit(4)
      : Promise.resolve([]),

    db.select({
      id: productVariants.id,
      color_ar: productVariants.color_ar,
      size: productVariants.size,
      stock: productVariants.stock,
      price_override: productVariants.price_override,
    })
      .from(productVariants)
      .where(eq(productVariants.product_id, product.id))
      .orderBy(asc(productVariants.size), asc(productVariants.color_ar)),
  ])

  const related = relatedRows.map(r => ({
    ...r,
    price: Number(r.price),
    compare_at_price: r.compare_at_price ? Number(r.compare_at_price) : null,
  }))

  // Fetch first image for each related product
  const relatedWithImages = await Promise.all(
    related.map(async r => {
      const [img] = await db
        .select({ url: productImages.url, alt_ar: productImages.alt_ar })
        .from(productImages)
        .where(and(eq(productImages.product_id, r.id), eq(productImages.sort_order, 0)))
        .limit(1)
      return { ...r, image: img ?? null }
    })
  )

  return (
    <>
      <StoreHeader />
      <ProductDetail
        product={product}
        images={imgs}
        related={relatedWithImages}
        variants={variantRows.map(v => ({ ...v, price_override: v.price_override ? Number(v.price_override) : null }))}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 80px" }}>
        <ReviewsSection productId={product.id} />
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
