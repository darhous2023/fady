"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import { useCompareSelection } from "@/lib/cars/useCarLists"
import type { CarsCanonicalDetail } from "@/lib/cars/types"
import { touchTarget } from "@/lib/designTokens"

const ROWS: { label: string; get: (c: CarsCanonicalDetail) => string | number | null }[] = [
  { label: "السنة", get: (c) => c.year },
  { label: "نوع الهيكل", get: (c) => c.bodyType },
  { label: "عدد الأبواب", get: (c) => c.doors },
  { label: "عدد المقاعد", get: (c) => c.seatingCapacity },
  { label: "المحرك", get: (c) => c.engine },
  { label: "ناقل الحركة", get: (c) => c.transmission },
  { label: "نظام الدفع", get: (c) => c.drivetrain },
  { label: "نوع الوقود", get: (c) => c.fuelType },
  { label: "القوة الحصانية", get: (c) => (c.powerHp ? `${Math.round(c.powerHp)} hp` : null) },
  { label: "العزم", get: (c) => (c.torqueNm ? `${Math.round(c.torqueNm)} Nm` : null) },
]

export default function ComparePage() {
  const { keys, toggle } = useCompareSelection()
  const [cars, setCars] = useState<CarsCanonicalDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (keys.length === 0) { setCars([]); setLoading(false); return }
    setLoading(true)
    fetch(`/api/new-cars/compare?keys=${keys.map(encodeURIComponent).join(",")}`)
      .then((r) => r.json())
      .then((data) => setCars(data.cars ?? []))
      .finally(() => setLoading(false))
  }, [keys])

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 64px", direction: "rtl" }}>
        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", marginBottom: 8 }}>
          <Link href="/new" style={{ color: "#9BA3AA", textDecoration: "none" }}>سيارات جديدة</Link> ← المقارنة
        </div>
        <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: 26, color: "#F5F5F5", marginBottom: 20 }}>
          مقارنة السيارات
        </h1>

        {loading ? (
          <p style={{ color: "rgba(242,240,236,0.4)", fontFamily: "Tajawal,sans-serif" }}>جاري التحميل...</p>
        ) : cars.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(242,240,236,0.4)", fontFamily: "Tajawal,sans-serif" }}>
            لم تُضف أي سيارة للمقارنة بعد. اذهب إلى{" "}
            <Link href="/new/browse" style={{ color: "#9BA3AA" }}>تصفّح السيارات</Link> وفعّل &quot;إضافة للمقارنة&quot; على أي سيارة.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "right", padding: "10px 12px", fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#9BA3AA" }} />
                  {cars.map((c) => (
                    <th key={c.normalizedKey} style={{ padding: "10px 12px", minWidth: 200 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                        <button
                          onClick={() => toggle(c.normalizedKey)}
                          style={{ background: "rgba(165,52,44,0.2)", color: "#A5342C", border: "none", borderRadius: 8, width: touchTarget.comfortable, height: touchTarget.comfortable, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                          aria-label="إزالة من المقارنة"
                        >×</button>
                        <Link href={`/new/car/${encodeURIComponent(c.normalizedKey)}`} style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, color: "#F2F0EC", textDecoration: "none", textAlign: "center" }}>
                          {c.displayName}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "10px 12px", fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(242,240,236,0.5)" }}>{row.label}</td>
                    {cars.map((c) => (
                      <td key={c.normalizedKey} style={{ padding: "10px 12px", textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC" }}>
                        {row.get(c) ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
