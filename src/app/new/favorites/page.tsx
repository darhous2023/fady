"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import CarCard from "@/components/store/cars/CarCard"
import { useFavorites } from "@/lib/cars/useCarLists"
import type { CarsCanonicalDetail } from "@/lib/cars/types"

export default function FavoritesPage() {
  const { keys } = useFavorites()
  const [cars, setCars] = useState<CarsCanonicalDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (keys.length === 0) { setCars([]); setLoading(false); setError(false); return }
    setLoading(true)
    setError(false)
    // A hard client-side timeout so a stalled fetch (dropped connection,
    // server hiccup) shows a real error state instead of leaving the
    // customer on "جاري التحميل..." forever -- Station 6 finding.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)
    // Reuses the compare endpoint's batched lookup — same full-detail shape works fine for cards too.
    fetch(`/api/new-cars/compare?keys=${keys.map(encodeURIComponent).join(",")}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("failed")
        return r.json()
      })
      .then((data) => setCars(data.cars ?? []))
      .catch(() => setError(true))
      .finally(() => { clearTimeout(timeoutId); setLoading(false) })
  }, [keys])

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 64px", direction: "rtl" }}>
        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", marginBottom: 8 }}>
          <Link href="/new" style={{ color: "#9BA3AA", textDecoration: "none" }}>سيارات جديدة</Link> ← المفضلة
        </div>
        <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: 26, color: "#F5F5F5", marginBottom: 20 }}>
          سياراتي المفضلة
        </h1>

        {loading ? (
          <p style={{ color: "rgba(242,240,236,0.4)", fontFamily: "Tajawal,sans-serif" }}>جاري التحميل...</p>
        ) : error ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#D9776A", fontFamily: "Tajawal,sans-serif" }}>
            تعذر تحميل السيارات المفضلة حاليًا. يرجى المحاولة مرة أخرى بعد قليل.
          </div>
        ) : cars.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(242,240,236,0.4)", fontFamily: "Tajawal,sans-serif" }}>
            لا توجد سيارات في المفضلة بعد. اضغط أيقونة القلب على أي سيارة لإضافتها.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: 16, alignItems: "start" }}>
            {cars.map((c) => (
              <CarCard
                key={c.normalizedKey}
                car={{
                  normalizedKey: c.normalizedKey,
                  displayName: c.displayName,
                  brandName: c.brand?.nameEn ?? "",
                  modelName: c.model?.nameEn ?? null,
                  year: c.year,
                  bodyType: c.bodyType,
                  fuelType: c.fuelType,
                  powerHp: c.powerHp,
                  mainImageUrl: c.images.find((i) => i.isMain)?.url ?? c.images[0]?.url ?? null,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
