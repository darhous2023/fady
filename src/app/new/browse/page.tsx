export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import CarCard from "@/components/store/cars/CarCard"
import CarFilters from "@/components/store/cars/CarFilters"
import { browseCars, getFacetCounts, getBrandBySlug } from "@/lib/cars/repository"
import { isCarsDbConfigured } from "@/lib/cars/db"
import CarsCatalogUnavailable from "@/components/store/cars/CarsCatalogUnavailable"
import type { CarsFilters } from "@/lib/cars/types"

export const metadata: Metadata = {
  title: "تصفّح كل السيارات — سيارات جديدة",
  description: "كل سيارات الكتالوج مع فلاتر متقدمة حسب الماركة ونوع الهيكل والوقود وناقل الحركة",
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>): CarsFilters {
  const get = (k: string) => (Array.isArray(searchParams[k]) ? searchParams[k]?.[0] : searchParams[k])
  return {
    bodyType: get("bodyType"),
    fuelType: get("fuelType"),
    transmission: get("transmission"),
    drivetrain: get("drivetrain"),
    page: get("page") ? Number(get("page")) : 1,
    sort: (get("sort") as CarsFilters["sort"]) ?? "newest",
  }
}

export default async function BrowseCarsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (!isCarsDbConfigured) return <CarsCatalogUnavailable />

  const sp = await searchParams
  const filters = parseFilters(sp)
  const brandSlug = Array.isArray(sp.brand) ? sp.brand[0] : sp.brand

  const brand = brandSlug ? await getBrandBySlug(brandSlug) : null

  const [result, facets] = await Promise.all([
    browseCars(filters),
    getFacetCounts(filters),
  ])

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 64px", direction: "rtl" }}>
        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", marginBottom: 8 }}>
          <Link href="/new" style={{ color: "#9BA3AA", textDecoration: "none" }}>سيارات جديدة</Link> ← تصفّح
        </div>
        <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: 26, color: "#F5F5F5", marginBottom: 24 }}>
          {brand ? brand.nameEn : "كل السيارات"} — {result.total.toLocaleString("ar-EG")} نتيجة
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, alignItems: "start" }}>
          <aside>
            <CarFilters facets={facets} />
          </aside>

          <div>
            {result.items.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(242,240,236,0.5)", fontFamily: "Tajawal,sans-serif" }}>
                لا توجد سيارات مطابقة لهذه الفلاتر. جرّب إزالة أحد الفلاتر.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {result.items.map((car) => <CarCard key={car.normalizedKey} car={car} />)}
              </div>
            )}

            {result.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
                {Array.from({ length: result.totalPages }, (_, i) => i + 1).slice(0, 10).map((p) => (
                  <Link
                    key={p}
                    href={`/new/browse?${new URLSearchParams({ ...sp as Record<string, string>, page: String(p) }).toString()}`}
                    style={{
                      width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 6, textDecoration: "none",
                      background: p === result.page ? "#9BA3AA" : "rgba(255,255,255,0.05)",
                      color: p === result.page ? "#0A0A0A" : "#F2F0EC",
                      fontFamily: "'Space Mono',monospace", fontSize: 13,
                    }}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
