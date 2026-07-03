export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { db } from "@/lib/db/drizzle/connection"
import { products, productImages, categories, settings, productVariants, banners } from "@/lib/db/drizzle/schema"
import { eq, and, gt, isNotNull } from "drizzle-orm"
import LoadingIntro from "@/components/store/LoadingIntro"
import ProductGrid, { type StoreProduct } from "@/components/store/ProductGrid"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import HeroSection from "@/components/store/HeroSection"
import BannersCarousel from "@/components/store/BannersCarousel"
import FlashDeals from "@/components/store/FlashDeals"
import TrustSection from "@/components/store/TrustSection"
import CategoriesStrip from "@/components/store/CategoriesStrip"
import HomeReviews from "@/components/store/HomeReviews"

export const metadata: Metadata = {
  title: "ShahY Store — إكسسوارات فاخرة مستوردة",
  description: "أرقى الشنط والمحافظ والشوزات النسائية المستوردة — تشكيلات حصرية بأفضل الأسعار",
}

async function getProducts(): Promise<StoreProduct[]> {
  try {
    const rows = await db
      .select({
        id: products.id,
        slug: products.slug,
        name_ar: products.name_ar,
        description_ar: products.description_ar,
        price: products.price,
        compare_at_price: products.compare_at_price,
        quality_tier: products.quality_tier,
        is_featured: products.is_featured,
        category_name: categories.name_ar,
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .where(and(eq(products.status, "active")))
      .limit(50)

    const ids = rows.map(r => r.id)
    const images = ids.length > 0
      ? await db
          .select({ product_id: productImages.product_id, url: productImages.url, alt_ar: productImages.alt_ar })
          .from(productImages)
          .where(eq(productImages.sort_order, 0))
      : []

    const imageMap = Object.fromEntries(images.map(i => [i.product_id, i]))

    return rows.map(r => ({
      ...r,
      price: Number(r.price),
      compare_at_price: r.compare_at_price ? Number(r.compare_at_price) : null,
      image: imageMap[r.id] ?? null,
    }))
  } catch {
    return []
  }
}

async function getHeroWords(): Promise<string[]> {
  try {
    const row = await db.select().from(settings).where(eq(settings.key, "hero_words")).limit(1)
    if (row[0]?.value) {
      const words = row[0].value.split(",").map(w => w.trim()).filter(Boolean)
      if (words.length) return words
    }
  } catch { /* fall through */ }
  return []
}

async function getActiveBanners() {
  try {
    return await db
      .select({ id: banners.id, image_url: banners.image_url, title_ar: banners.title_ar, link: banners.link })
      .from(banners)
      .where(eq(banners.is_active, true))
      .orderBy(banners.sort_order)
  } catch { return [] }
}

async function getFlashDealsSettings() {
  try {
    const rows = await db.select().from(settings)
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return {
      active: map.flash_deals_active === "true",
      title: map.flash_deals_title_ar || "عروض الفلاش",
      endsAt: map.flash_deals_ends_at || null,
    }
  } catch { return { active: false, title: "عروض الفلاش", endsAt: null } }
}

interface FlashDeal { id: string; slug: string; name_ar: string; price: number; compare_at_price: number; discount: number; image: string | null; quality_tier: string }

async function getFlashDeals(): Promise<FlashDeal[]> {
  try {
    const rows = await db
      .select({
        id: products.id, slug: products.slug, name_ar: products.name_ar,
        price: products.price, compare_at_price: products.compare_at_price,
        quality_tier: products.quality_tier,
      })
      .from(products)
      .where(and(
        eq(products.status, "active"),
        eq(products.is_featured, true),
        isNotNull(products.compare_at_price),
      ))
      .limit(20)
    // filter JS-side: compare_at_price > price
    const qualified = rows.filter(r => r.compare_at_price && Number(r.compare_at_price) > Number(r.price)).slice(0, 8)
    const images = qualified.length > 0
      ? await db.select({ product_id: productImages.product_id, url: productImages.url })
          .from(productImages).where(eq(productImages.sort_order, 0))
      : []
    const imgMap = Object.fromEntries(images.map(i => [i.product_id, i.url]))
    return qualified.map(r => ({
      id: r.id, slug: r.slug, name_ar: r.name_ar,
      price: Number(r.price),
      compare_at_price: Number(r.compare_at_price!),
      discount: Math.round((1 - Number(r.price) / Number(r.compare_at_price)) * 100),
      image: imgMap[r.id] ?? null,
      quality_tier: r.quality_tier,
    }))
  } catch { return [] }
}

async function getCategories() {
  try {
    return await db
      .select({ id: categories.id, name_ar: categories.name_ar, slug: categories.slug })
      .from(categories)
      .orderBy(categories.sort_order)
  } catch { return [] }
}

async function getLowStockMap(): Promise<Record<string, number>> {
  try {
    const rows = await db
      .select({ product_id: productVariants.product_id, stock: productVariants.stock })
      .from(productVariants)
      .where(gt(productVariants.stock, 0))
    const map: Record<string, number> = {}
    for (const r of rows) {
      map[r.product_id] = (map[r.product_id] ?? 0) + r.stock
    }
    return map
  } catch { return {} }
}

export default async function StorePage() {
  const [initialProducts, heroWords, activeBanners, lowStockMap, flashSettings, flashDeals, storeCategories] = await Promise.all([
    getProducts(), getHeroWords(), getActiveBanners(), getLowStockMap(),
    getFlashDealsSettings(), getFlashDeals(), getCategories(),
  ])

  const productsWithStock = initialProducts.map(p => ({
    ...p,
    total_stock: lowStockMap[p.id] ?? null,
  }))

  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;700;800;900&family=Playfair+Display:ital,wght@1,400&family=Cormorant+Garamond:ital,wght@1,300&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0A0806; }
        main { padding: 0 !important; min-height: unset !important; }
      `}</style>

      <LoadingIntro />
      <HeroSection words={heroWords} />

      <TrustSection />

      {storeCategories.length > 0 && <CategoriesStrip categories={storeCategories} />}

      {flashSettings.active && flashDeals.length > 0 && (
        <FlashDeals deals={flashDeals} title={flashSettings.title} endsAt={flashSettings.endsAt} />
      )}

      {activeBanners.length > 0 && <BannersCarousel banners={activeBanners} />}

      {/* Products */}
      <div id="products">
        <ProductGrid initialProducts={productsWithStock} />
      </div>

      <HomeReviews />

      <StoreFooter />
      <FloatingWA />
    </>
  )
}
