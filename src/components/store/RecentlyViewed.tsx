"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export interface RecentItem { id: string; slug: string; name_ar: string; price: number; image: string | null }

const KEY = "shahy-recent"
const MAX = 8

export function saveRecentlyViewed(item: RecentItem) {
  if (typeof window === "undefined") return
  try {
    const prev: RecentItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    const filtered = prev.filter(p => p.id !== item.id)
    localStorage.setItem(KEY, JSON.stringify([item, ...filtered].slice(0, MAX)))
  } catch {}
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [items, setItems] = useState<RecentItem[]>([])

  useEffect(() => {
    try {
      const stored: RecentItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]")
      setItems(excludeId ? stored.filter(i => i.id !== excludeId) : stored)
    } catch {}
  }, [excludeId])

  if (items.length === 0) return null

  return (
    <div style={{ marginTop: 60, direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,transparent,rgba(155,163,170,0.15))" }} />
        <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "5px", color: "#9BA3AA", opacity: 0.6, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          شاهدتِ مؤخراً
        </span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(155,163,170,0.15),transparent)" }} />
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
        {items.map(item => (
          <Link key={item.id} href={`/products/${item.slug}`} style={{ textDecoration: "none", flexShrink: 0, width: 130 }}>
            <div style={{
              background: "linear-gradient(145deg,#131313,#141414)",
              border: "1px solid rgba(155,163,170,0.1)", borderRadius: 12, overflow: "hidden",
              transition: "all 0.25s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(155,163,170,0.3)"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(155,163,170,0.1)"; e.currentTarget.style.transform = "" }}>
              <div style={{ aspectRatio: "1", background: "#111", overflow: "hidden" }}>
                {item.image
                  ? <img src={item.image} alt={item.name_ar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, opacity: 0.15 }}>👜</div>
                }
              </div>
              <div style={{ padding: "10px 10px 12px" }}>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, fontWeight: 700, color: "#F2F0EC", lineHeight: 1.4, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.name_ar}
                </div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 900, color: "#9BA3AA" }}>
                  {item.price.toLocaleString("ar-EG")} ج.م
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
