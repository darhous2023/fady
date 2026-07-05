"use client"

import { useState } from "react"

interface DayData {
  day: string
  revenue: number
  orders: number
}

export default function RevenueChart({ data }: { data: DayData[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (data.length === 0) {
    return (
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(245,239,224,0.2)" }}>لا توجد بيانات بعد</p>
      </div>
    )
  }

  const maxRev = Math.max(...data.map(d => d.revenue), 1)
  const chartH = 180
  const barW = Math.max(Math.floor(660 / data.length) - 4, 6)

  return (
    <div style={{ position: "relative", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: chartH + 32, padding: "0 8px", minWidth: data.length * (barW + 4) }}>
        {data.map((d, i) => {
          const h = Math.max(Math.round((d.revenue / maxRev) * chartH), d.revenue > 0 ? 4 : 2)
          const isHovered = hovered === i
          const dateLabel = new Date(d.day).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })

          return (
            <div key={d.day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: `0 0 ${barW}px` }}>
              {/* Tooltip */}
              {isHovered && (
                <div style={{
                  position: "absolute", bottom: chartH + 48,
                  background: "#111111", border: "1px solid rgba(155, 163, 170,0.3)",
                  borderRadius: 8, padding: "8px 12px", zIndex: 10,
                  fontFamily: "Tajawal,sans-serif", textAlign: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)", whiteSpace: "nowrap",
                  transform: `translateX(${i > data.length - 6 ? "-80%" : "0"})`,
                }}>
                  <div style={{ fontSize: 11, color: "rgba(245,239,224,0.5)", marginBottom: 2 }}>{dateLabel}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#9BA3AA" }}>{d.revenue.toLocaleString("ar-EG")} ج</div>
                  <div style={{ fontSize: 11, color: "rgba(245,239,224,0.4)" }}>{d.orders} طلب</div>
                </div>
              )}

              {/* Bar */}
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: barW, height: h,
                  background: isHovered
                    ? "linear-gradient(180deg,#C9CFD4,#9BA3AA)"
                    : d.revenue > 0
                    ? "linear-gradient(180deg,#9BA3AA88,#9BA3AA44)"
                    : "rgba(255,255,255,0.04)",
                  borderRadius: "4px 4px 2px 2px",
                  transition: "all 0.15s ease",
                  cursor: "default",
                  boxShadow: isHovered ? "0 0 12px rgba(155, 163, 170,0.4)" : "none",
                  alignSelf: "flex-end",
                }}
              />

              {/* X label — show every N days */}
              <div style={{
                fontSize: 9, color: "rgba(245,239,224,0.25)", textAlign: "center",
                fontFamily: "Tajawal,sans-serif", lineHeight: 1.2, width: barW,
                visibility: i % Math.ceil(data.length / 10) === 0 ? "visible" : "hidden",
              }}>
                {new Date(d.day).getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Y axis hint */}
      <div style={{
        position: "absolute", top: 4, right: 8,
        fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.2)",
      }}>
        {maxRev.toLocaleString("ar-EG")} ج
      </div>
    </div>
  )
}
