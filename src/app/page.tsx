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
import CinematicHero from "@/components/store/CinematicHero"
import MarqueeTicker from "@/components/store/MarqueeTicker"
import TwoGateways from "@/components/store/TwoGateways"
import PosterStatement from "@/components/store/PosterStatement"
import TrustPillars from "@/components/store/TrustPillars"
import HowItWorks from "@/components/store/HowItWorks"
import BrandsStrip from "@/components/store/BrandsStrip"
import ShowroomVideoSection from "@/components/store/ShowroomVideoSection"
import BannersCarousel from "@/components/store/BannersCarousel"
import FlashDeals from "@/components/store/FlashDeals"
import HomeReviews from "@/components/store/HomeReviews"

export const metadata: Metadata = {
  title: "ELFADY — معرض سيارات",
  description: "معرض الفادي لتجارة السيارات — سيارات جديدة ومستعملة، بثقة وشفافية، وتواصل فوري عبر واتساب",
}

const WA = "201555557745"

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
        year: products.year,
        mileage_km: products.mileage_km,
        transmission: products.transmission,
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

async function getSettingsMap(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(settings)
    return Object.fromEntries(rows.map(r => [r.key, r.value]))
  } catch { return {} }
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
      .where(eq(categories.is_active, true))
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
  const [initialProducts, cms, activeBanners, lowStockMap, flashDeals, storeCategories] = await Promise.all([
    getProducts(), getSettingsMap(), getActiveBanners(), getLowStockMap(),
    getFlashDeals(), getCategories(),
  ])

  const productsWithStock = initialProducts.map(p => ({
    ...p,
    total_stock: lowStockMap[p.id] ?? null,
  }))

  const flashActive = cms.flash_deals_active === "true"

  return (
    <>
      <StoreHeader />
      <style>{`
                * { box-sizing: border-box; }
        body { margin: 0; background: #0A0A0A; }
        main { padding: 0 !important; min-height: unset !important; }
      `}</style>

      <LoadingIntro logoUrl={cms.logo_url || "/logo-400.png"} tagline={cms.intro_tagline_ar || "حيث تلتقي الفخامة بالثقة"} />

      <CinematicHero
        videoUrl={cms.hero_video_url}
        eyebrow={cms.hero_eyebrow_ar || "معرض سيارات موثوق"}
        headline={cms.hero_headline_ar || "الفادي"}
        subheadline={cms.hero_subheadline_ar || "سيارات جديدة ومستعملة — بثقة وشفافية"}
        whatsapp={WA}
      />

      <MarqueeTicker text={cms.marquee_text_ar} />

      <TwoGateways
        newCar={{ title: cms.gateway_new_title_ar || "سيارات جديدة", desc: cms.gateway_new_desc_ar || "", image: cms.gateway_new_image || "" }}
        usedCar={{ title: cms.gateway_used_title_ar || "سيارات مستعملة", desc: cms.gateway_used_desc_ar || "", image: cms.gateway_used_image || "" }}
      />

      {storeCategories.length > 0 && <BrandsStrip brands={storeCategories} />}

      {cms.statement_headline_ar && <PosterStatement text={cms.statement_headline_ar} />}

      <TrustPillars pillars={[
        { title: cms.trust_pillar_1_title_ar, desc: cms.trust_pillar_1_desc_ar },
        { title: cms.trust_pillar_2_title_ar, desc: cms.trust_pillar_2_desc_ar },
        { title: cms.trust_pillar_3_title_ar, desc: cms.trust_pillar_3_desc_ar },
      ]} />

      {flashActive && flashDeals.length > 0 && (
        <FlashDeals deals={flashDeals} title={cms.flash_deals_title_ar || "عروض الفلاش"} endsAt={cms.flash_deals_ends_at || null} />
      )}

      {activeBanners.length > 0 && <BannersCarousel banners={activeBanners} />}

      {/* Used cars preview */}
      <div id="products">
        <ProductGrid initialProducts={productsWithStock} />
      </div>

      <ShowroomVideoSection
        videoUrl={cms.showroom_video_url}
        headline={cms.showroom_headline_ar || "زور المعرض بنفسك"}
        desc={cms.showroom_desc_ar || ""}
        whatsapp={WA}
      />

      <HowItWorks steps={[
        { title: cms.how_it_works_1_title_ar, desc: cms.how_it_works_1_desc_ar },
        { title: cms.how_it_works_2_title_ar, desc: cms.how_it_works_2_desc_ar },
        { title: cms.how_it_works_3_title_ar, desc: cms.how_it_works_3_desc_ar },
      ]} />

      <HomeReviews />

      <StoreFooter />
      <FloatingWA />
    </>
  )
}
