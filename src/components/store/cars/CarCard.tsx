"use client"

import Link from "next/link"
import type { CarsBrowseItem, CarsSearchResultItem } from "@/lib/cars/types"
import { useFavorites, useCompareSelection, MAX_COMPARE } from "@/lib/cars/useCarLists"

const FALLBACK_IMAGE = "/logo-400.png"

export default function CarCard({ car }: { car: CarsBrowseItem | CarsSearchResultItem }) {
  const { has: isFavorite, toggle: toggleFavorite } = useFavorites()
  const { has: isComparing, toggle: toggleCompare } = useCompareSelection()
  const favorite = isFavorite(car.normalizedKey)
  const comparing = isComparing(car.normalizedKey)

  return (
    <div
      style={{
        display: "block", borderRadius: 10, overflow: "hidden", position: "relative",
        background: "#111214", border: comparing ? "1px solid #9BA3AA" : "1px solid rgba(255,255,255,0.08)",
        transition: "border-color 0.2s ease",
      }}
    >
      <div style={{ position: "absolute", top: 8, insetInlineEnd: 8, zIndex: 2, display: "flex", gap: 6 }}>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleFavorite(car.normalizedKey) }}
          aria-label={favorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          style={{
            width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(10,10,10,0.7)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
            color: favorite ? "#A5342C" : "#F2F0EC",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </div>

      <Link href={`/new/car/${encodeURIComponent(car.normalizedKey)}`} style={{ display: "block", textDecoration: "none" }}>
        <div style={{ position: "relative", aspectRatio: "4/3", background: "#0A0A0A" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={car.mainImageUrl ?? FALLBACK_IMAGE}
            alt={car.displayName}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: car.mainImageUrl ? "cover" : "contain", opacity: car.mainImageUrl ? 1 : 0.35, padding: car.mainImageUrl ? 0 : 24 }}
          />
        </div>
        <div style={{ padding: "14px 16px 16px", direction: "rtl" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#9BA3AA", marginBottom: 4 }}>
            {car.brandName}{car.modelName ? ` · ${car.modelName}` : ""}
          </div>
          <div
            style={{
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F2F0EC", lineHeight: 1.4,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              minHeight: "calc(1.4em * 2)",
            }}
            title={car.displayName}
          >
            {car.displayName}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(242,240,236,0.55)" }}>
            {car.year && <span>{car.year}</span>}
            {"bodyType" in car && car.bodyType && <span>{car.bodyType}</span>}
            {"powerHp" in car && car.powerHp && <span>{Math.round(car.powerHp)} hp</span>}
          </div>
        </div>
      </Link>

      <div style={{ padding: "0 16px 14px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Tajawal,sans-serif", fontSize: 11, color: comparing ? "#9BA3AA" : "rgba(242,240,236,0.4)", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={comparing}
            onChange={() => {
              const ok = toggleCompare(car.normalizedKey)
              if (!ok) alert(`يمكن مقارنة ${MAX_COMPARE} سيارات كحد أقصى في نفس الوقت`)
            }}
          />
          إضافة للمقارنة
        </label>
      </div>
    </div>
  )
}
