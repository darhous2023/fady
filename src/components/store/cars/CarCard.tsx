import Link from "next/link"
import type { CarsBrowseItem } from "@/lib/cars/types"

const FALLBACK_IMAGE = "/logo-400.png"

export default function CarCard({ car }: { car: CarsBrowseItem }) {
  return (
    <Link
      href={`/new/car/${encodeURIComponent(car.normalizedKey)}`}
      style={{
        display: "block", borderRadius: 10, overflow: "hidden",
        background: "#111214", border: "1px solid rgba(255,255,255,0.08)",
        textDecoration: "none", transition: "border-color 0.2s ease",
      }}
    >
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
        <div style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F2F0EC", lineHeight: 1.4 }}>
          {car.displayName}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8, fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(242,240,236,0.55)" }}>
          {car.year && <span>{car.year}</span>}
          {car.bodyType && <span>{car.bodyType}</span>}
          {car.powerHp && <span>{Math.round(car.powerHp)} hp</span>}
        </div>
      </div>
    </Link>
  )
}
