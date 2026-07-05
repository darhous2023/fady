"use client"

import { useState } from "react"
import ImageLightbox from "@/components/store/ImageLightbox"
import { useFavorites, useCompareSelection, MAX_COMPARE } from "@/lib/cars/useCarLists"

type Img = { url: string; isMain: boolean; altText: string | null }

export default function CarDetailGallery({
  normalizedKey, displayName, images,
}: { normalizedKey: string; displayName: string; images: Img[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { has: isFavorite, toggle: toggleFavorite } = useFavorites()
  const { has: isComparing, toggle: toggleCompare } = useCompareSelection()
  const favorite = isFavorite(normalizedKey)
  const comparing = isComparing(normalizedKey)

  const mainIndex = images.findIndex((i) => i.isMain)
  const ordered = mainIndex > 0 ? [images[mainIndex], ...images.filter((_, i) => i !== mainIndex)] : images
  const main = ordered[0]

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => toggleFavorite(normalizedKey)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
            background: favorite ? "rgba(165,52,44,0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${favorite ? "rgba(165,52,44,0.4)" : "rgba(255,255,255,0.1)"}`,
            color: favorite ? "#A5342C" : "#F2F0EC", cursor: "pointer",
            fontFamily: "Tajawal,sans-serif", fontSize: 13,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          {favorite ? "في المفضلة" : "أضف للمفضلة"}
        </button>
        <button
          type="button"
          onClick={() => {
            const ok = toggleCompare(normalizedKey)
            if (!ok) alert(`يمكن مقارنة ${MAX_COMPARE} سيارات كحد أقصى في نفس الوقت`)
          }}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
            background: comparing ? "rgba(155,163,170,0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${comparing ? "rgba(155,163,170,0.5)" : "rgba(255,255,255,0.1)"}`,
            color: comparing ? "#9BA3AA" : "#F2F0EC", cursor: "pointer",
            fontFamily: "Tajawal,sans-serif", fontSize: 13,
          }}
        >
          {comparing ? "✓ في المقارنة" : "+ أضف للمقارنة"}
        </button>
      </div>

      <div
        onClick={() => main && setLightboxIndex(0)}
        style={{ aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "#111214", marginBottom: 10, cursor: main ? "zoom-in" : "default" }}
      >
        {main ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={main.url} alt={main.altText ?? displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(242,240,236,0.3)", fontFamily: "Tajawal,sans-serif" }}>
            لا توجد صورة متاحة بعد
          </div>
        )}
      </div>

      {ordered.length > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {ordered.slice(0, 8).map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img.url}
              alt=""
              onClick={() => setLightboxIndex(i)}
              style={{ width: 64, height: 64, borderRadius: 6, objectFit: "cover", flexShrink: 0, cursor: "zoom-in" }}
            />
          ))}
        </div>
      )}

      {lightboxIndex !== null && ordered.length > 0 && (
        <ImageLightbox
          images={ordered.map((i) => ({ url: i.url, alt_ar: i.altText }))}
          startIndex={lightboxIndex}
          productName={displayName}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
