"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { CarsFilters } from "@/lib/cars/types"

const SORT_LABELS: Record<NonNullable<CarsFilters["sort"]>, string> = {
  newest: "الأحدث إضافة",
  year_desc: "سنة الصنع: الأحدث أولًا",
  year_asc: "سنة الصنع: الأقدم أولًا",
  power_desc: "قوة المحرك: الأعلى أولًا",
  power_asc: "قوة المحرك: الأقل أولًا",
  name_asc: "الاسم: أ-ي",
}

export default function SortSelect({ currentSort }: { currentSort: NonNullable<CarsFilters["sort"]> }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "newest") params.delete("sort")
    else params.set("sort", value)
    params.delete("page")
    router.push(`/new/browse?${params.toString()}`)
  }

  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.6)" }}>
      ترتيب حسب
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          background: "#111214", color: "#F2F0EC", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8, padding: "8px 12px", fontFamily: "Tajawal,sans-serif", fontSize: 13, cursor: "pointer",
        }}
      >
        {(Object.keys(SORT_LABELS) as Array<keyof typeof SORT_LABELS>).map((key) => (
          <option key={key} value={key}>{SORT_LABELS[key]}</option>
        ))}
      </select>
    </label>
  )
}
