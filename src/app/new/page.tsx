export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import CarsQuickSearch from "@/components/store/cars/CarsQuickSearch"
import CarCard from "@/components/store/cars/CarCard"
import { getPublicBrands, getPortalStats, browseCars } from "@/lib/cars/repository"
import { isCarsDbConfigured } from "@/lib/cars/db"
import CarsCatalogUnavailable from "@/components/store/cars/CarsCatalogUnavailable"

export const metadata: Metadata = {
  title: "سيارات جديدة",
  description: "تصفّح كتالوج السيارات الجديدة الكامل — الماركات والموديلات والمواصفات الحقيقية، وابعتلنا استفسارك عن التوفر عبر واتساب",
}

export default async function NewCarsPage() {
  if (!isCarsDbConfigured) return <CarsCatalogUnavailable />

  const [brands, stats, featured] = await Promise.all([
    getPublicBrands(),
    getPortalStats(),
    browseCars({ page: 1, pageSize: 8, sort: "newest" }),
  ])
  const topBrands = brands.slice(0, 10)

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64 }}>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "56px 24px 40px", direction: "rtl" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "4px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 12 }}>
            كتالوج السيارات الجديدة
          </div>
          <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: "clamp(30px,5vw,52px)", color: "#F5F5F5", margin: "0 0 16px" }}>
            سيارات جديدة
          </h1>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "rgba(245,245,245,0.5)", maxWidth: 560, margin: "0 auto", lineHeight: 1.9 }}>
            تصفّح {stats.publicCarCount.toLocaleString("ar-EG")} سيارة حقيقية من {stats.publicBrandCount} ماركة، بمواصفات كاملة وصور — وابعتلنا استفسارك عن التوفر مباشرة على واتساب.
          </p>
          <CarsQuickSearch />
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
            <Link href="/new/browse" style={{ padding: "12px 24px", borderRadius: 8, background: "#9BA3AA", color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              تصفّح كل السيارات
            </Link>
            <Link href="/new/compare" style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", color: "#F2F0EC", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              قارن بين السيارات
            </Link>
            <Link href="/new/favorites" style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", color: "#F2F0EC", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              المفضلة
            </Link>
          </div>
        </div>

        {/* Top brands */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 48px", direction: "rtl" }}>
          <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 18, color: "#F2F0EC", marginBottom: 16 }}>
            أشهر الماركات
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {topBrands.map((b) => (
              <Link key={b.id} href={`/new/browse?brand=${b.slug}`} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                padding: "16px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                background: "#111214", textDecoration: "none",
              }}>
                {b.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logoUrl} alt={b.nameEn} loading="lazy" style={{ width: 32, height: 32, objectFit: "contain" }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(155,163,170,0.15)" }} />
                )}
                <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F2F0EC", textAlign: "center" }}>{b.nameEn}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "rgba(242,240,236,0.4)" }}>{b.modelCount} موديل</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured cars */}
        {featured.items.length > 0 && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 64px", direction: "rtl" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 18, color: "#F2F0EC" }}>سيارات من الكتالوج</h2>
              <Link href="/new/browse" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#9BA3AA", textDecoration: "none" }}>عرض الكل ←</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: 16, alignItems: "start" }}>
              {featured.items.map((car) => <CarCard key={car.normalizedKey} car={car} />)}
            </div>
          </div>
        )}
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
