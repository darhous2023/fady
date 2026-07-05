"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { CarsBrandListItem, CarsFacetCounts } from "@/lib/cars/types"

const LABELS: Record<string, string> = {
  bodyType: "نوع الهيكل", fuelType: "نوع الوقود", transmission: "ناقل الحركة", drivetrain: "نظام الدفع",
}

export default function CarFilters({ facets, brands }: { facets: CarsFacetCounts; brands?: CarsBrandListItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete("page")
    router.push(`/new/browse?${params.toString()}`)
  }

  function clearAll() {
    router.push("/new/browse")
  }

  const activeFilters = ["brand", "bodyType", "fuelType", "transmission", "drivetrain"]
    .map((k) => ({ key: k, value: searchParams.get(k) }))
    .filter((f) => f.value)

  return (
    <div style={{ direction: "rtl" }}>
      {activeFilters.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setParam(f.key, null)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
                background: "rgba(155,163,170,0.15)", border: "1px solid rgba(155,163,170,0.3)",
                color: "#F2F0EC", fontFamily: "Tajawal,sans-serif", fontSize: 12, cursor: "pointer",
              }}
            >
              {f.value} ✕
            </button>
          ))}
          <button onClick={clearAll} style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#9BA3AA", background: "none", border: "none", cursor: "pointer" }}>
            مسح الكل
          </button>
        </div>
      )}

      {brands && brands.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, color: "#F2F0EC", marginBottom: 8 }}>
            الماركة
          </div>
          <select
            value={searchParams.get("brand") ?? ""}
            onChange={(e) => setParam("brand", e.target.value || null)}
            style={{
              width: "100%", background: "#111214", color: "#F2F0EC", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "8px 10px", fontFamily: "Tajawal,sans-serif", fontSize: 13, cursor: "pointer",
            }}
          >
            <option value="">كل الماركات</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>{b.nameEn} ({b.modelCount})</option>
            ))}
          </select>
        </div>
      )}

      {(["bodyType", "fuelType", "transmission", "drivetrain"] as const).map((key) => {
        const options = facets[key]
        if (!options || options.length === 0) return null
        return (
          <div key={key} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, color: "#F2F0EC", marginBottom: 8 }}>
              {LABELS[key]}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {options.slice(0, 8).map((opt) => {
                const isActive = searchParams.get(key) === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setParam(key, isActive ? null : opt.value)}
                    style={{
                      display: "flex", justifyContent: "space-between", padding: "6px 8px", borderRadius: 6,
                      background: isActive ? "rgba(155,163,170,0.15)" : "transparent", border: "none",
                      color: isActive ? "#9BA3AA" : "rgba(242,240,236,0.75)",
                      fontFamily: "Tajawal,sans-serif", fontSize: 13, cursor: "pointer", textAlign: "right",
                    }}
                  >
                    <span>{opt.value}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, opacity: 0.6 }}>{opt.count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
