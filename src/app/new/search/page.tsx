export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import CarCard from "@/components/store/cars/CarCard"
import SearchBox from "@/components/store/cars/SearchBox"
import { searchCars } from "@/lib/cars/repository"
import { isCarsDbConfigured } from "@/lib/cars/db"
import CarsCatalogUnavailable from "@/components/store/cars/CarsCatalogUnavailable"

export const metadata: Metadata = {
  title: "بحث في السيارات الجديدة",
  description: "بحث فوري في كل كتالوج السيارات الجديدة بالعربي أو الإنجليزي",
}

export default async function SearchCarsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (!isCarsDbConfigured) return <CarsCatalogUnavailable />

  const sp = await searchParams
  const qRaw = Array.isArray(sp.q) ? sp.q[0] : sp.q
  const q = (qRaw ?? "").trim()
  const results = q ? await searchCars(q) : []

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 64px", direction: "rtl" }}>
        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", marginBottom: 8 }}>
          <Link href="/new" style={{ color: "#9BA3AA", textDecoration: "none" }}>سيارات جديدة</Link> ← البحث
        </div>
        <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: 26, color: "#F5F5F5", marginBottom: 20 }}>
          بحث في كل السيارات
        </h1>

        <SearchBox initialQuery={q} />

        <div style={{ marginTop: 28 }}>
          {!q ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(242,240,236,0.4)", fontFamily: "Tajawal,sans-serif" }}>
              اكتب اسم ماركة أو موديل (عربي أو إنجليزي) — مثال: BMW أو بي ام دبليو
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(242,240,236,0.5)", fontFamily: "Tajawal,sans-serif" }}>
              لا توجد نتائج لـ &quot;{q}&quot;
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.4)", marginBottom: 16 }}>
                {results.length.toLocaleString("ar-EG")} نتيجة
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {results.map((car) => <CarCard key={car.normalizedKey} car={car} />)}
              </div>
            </>
          )}
        </div>
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
