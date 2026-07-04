export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { db } from "@/lib/db/drizzle/connection"
import { products, productImages, categories, productVariants, product360Frames } from "@/lib/db/drizzle/schema"
import { eq, and, gt, asc, inArray } from "drizzle-orm"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import ProductGrid, { type StoreProduct } from "@/components/store/ProductGrid"

export const metadata: Metadata = {
  title: "سيارات مستعملة",
  description: "تصفّح السيارات المستعملة المتاحة فعليًا في معرض الفادي — صور حقيقية، حالة مفحوصة، وتواصل فوري",
}

async function getUsedCars(): Promise<StoreProduct[]> {
  const rows = await db
    .select({
      id: products.id, slug: products.slug, name_ar: products.name_ar,
      description_ar: products.description_ar, price: products.price,
      compare_at_price: products.compare_at_price, quality_tier: products.quality_tier,
      is_featured: products.is_featured, category_name: categories.name_ar,
      year: products.year, mileage_km: products.mileage_km, transmission: products.transmission,
    })
    .from(products)
    .leftJoin(categories, eq(products.category_id, categories.id))
    .where(eq(products.status, "active"))

  const ids = rows.map(r => r.id)
  const [allImages, frameCounts] = await Promise.all([
    ids.length
      ? db.select({ product_id: productImages.product_id, url: productImages.url, alt_ar: productImages.alt_ar })
          .from(productImages).where(inArray(productImages.product_id, ids)).orderBy(asc(productImages.sort_order))
      : Promise.resolve([]),
    ids.length
      ? db.select({ product_id: product360Frames.product_id })
          .from(product360Frames).where(inArray(product360Frames.product_id, ids))
      : Promise.resolve([]),
  ])

  const imagesByProduct = new Map<string, { url: string; alt_ar: string | null }[]>()
  for (const img of allImages) {
    const list = imagesByProduct.get(img.product_id) ?? []
    list.push({ url: img.url, alt_ar: img.alt_ar })
    imagesByProduct.set(img.product_id, list)
  }
  const frameCountByProduct = new Map<string, number>()
  for (const f of frameCounts) frameCountByProduct.set(f.product_id, (frameCountByProduct.get(f.product_id) ?? 0) + 1)

  return rows.map(r => {
    const images = imagesByProduct.get(r.id) ?? []
    return {
      ...r,
      price: Number(r.price),
      compare_at_price: r.compare_at_price ? Number(r.compare_at_price) : null,
      image: images[0] ?? null,
      images,
      has360: (frameCountByProduct.get(r.id) ?? 0) >= 2,
    }
  })
}

async function getLowStockMap(): Promise<Record<string, number>> {
  const rows = await db.select({ product_id: productVariants.product_id, stock: productVariants.stock })
    .from(productVariants).where(gt(productVariants.stock, 0))
  const map: Record<string, number> = {}
  for (const r of rows) map[r.product_id] = (map[r.product_id] ?? 0) + r.stock
  return map
}

async function getBrandNameBySlug(slug?: string): Promise<string | undefined> {
  if (!slug) return undefined
  const [row] = await db.select({ name_ar: categories.name_ar }).from(categories).where(eq(categories.slug, slug)).limit(1)
  return row?.name_ar
}

export default async function UsedCarsPage({ searchParams }: { searchParams: Promise<{ brand?: string }> }) {
  const { brand } = await searchParams
  const [cars, lowStock, initialCategory] = await Promise.all([getUsedCars(), getLowStockMap(), getBrandNameBySlug(brand)])
  const carsWithStock = cars.map(c => ({ ...c, total_stock: lowStock[c.id] ?? null }))

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64 }}>
        <div style={{ textAlign: "center", padding: "56px 24px 0", direction: "rtl" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "4px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 12 }}>
            متاحة الآن في المعرض
          </div>
          <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: "clamp(30px,5vw,52px)", color: "#F5F5F5", margin: 0 }}>
            سيارات مستعملة
          </h1>
        </div>
        <ProductGrid initialProducts={carsWithStock} initialCategory={initialCategory} showHeader={false} />
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
