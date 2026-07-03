"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"

const WL_KEY = "elfady-wishlist"

export interface WishlistItem {
  id: string; slug: string; name_ar: string; price: number
  quality_tier: string; image: string | null
}

const QUALITY: Record<string, string> = { hi_copy: "بريميوم", mirror: "ميرور كواليتي", original: "أصلي" }
const QC: Record<string, string> = { hi_copy: "#888", mirror: "#A5342C", original: "#9BA3AA" }

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(WL_KEY) ?? "[]")) } catch {}
  }, [])

  function remove(id: string) {
    const next = items.filter(i => i.id !== id)
    setItems(next)
    localStorage.setItem(WL_KEY, JSON.stringify(next))
  }

  function addToCart(item: WishlistItem) {
    addItem({ id: item.id, slug: item.slug, name_ar: item.name_ar, price: item.price, image: item.image, quality_tier: item.quality_tier })
    toast.success(`تمت الإضافة: ${item.name_ar}`)
  }

  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        .wl-card { background: linear-gradient(145deg,#131313,#141414); border: 1px solid rgba(155,163,170,0.1); border-radius: 16px; overflow: hidden; transition: all 0.3s ease; }
        .wl-card:hover { border-color: rgba(155,163,170,0.25); transform: translateY(-2px); }
        .wl-img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .wl-card:hover .wl-img { transform: scale(1.04); }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 100px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 16 }}>✦ &nbsp; WISHLIST &nbsp; ✦</div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#F2F0EC", margin: "0 0 10px" }}>
              قائمة أمنياتك
            </h1>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(242,240,236,0.35)" }}>
              {items.length > 0 ? `${items.length} منتج محفوظ` : "لا توجد منتجات محفوظة"}
            </p>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.15 }}>🤍</div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 16, color: "rgba(242,240,236,0.3)" }}>
                لم تحفظي أي منتج حتى الآن
              </p>
              <Link href="/" style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 8, textDecoration: "none", background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A", display: "inline-block", marginTop: 24 }}>
                تصفّحي المتجر
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
              {items.map(item => (
                <div key={item.id} className="wl-card">
                  <Link href={`/products/${item.slug}`} style={{ textDecoration: "none", display: "block", position: "relative" }}>
                    <div style={{ overflow: "hidden" }}>
                      {item.image
                        ? <img src={item.image} alt={item.name_ar} className="wl-img" loading="lazy" />
                        : <div style={{ width: "100%", aspectRatio: "1", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, opacity: 0.15 }}>👜</div>
                      }
                    </div>
                    <div style={{ position: "absolute", top: 10, left: 10, background: `${QC[item.quality_tier]}22`, border: `1px solid ${QC[item.quality_tier]}44`, color: QC[item.quality_tier], fontFamily: "Tajawal,sans-serif", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>
                      {QUALITY[item.quality_tier]}
                    </div>
                  </Link>

                  <div style={{ padding: "14px" }}>
                    <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F2F0EC", margin: "0 0 4px", lineHeight: 1.4 }}>{item.name_ar}</p>
                    <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 16, fontWeight: 900, color: "#9BA3AA", margin: "0 0 14px" }}>{item.price.toLocaleString("ar-EG")} ج.م</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => addToCart(item)} style={{ flex: 1, background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 12, padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                        أضف للسلة
                      </button>
                      <button onClick={() => remove(item.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#D9776A", fontFamily: "Tajawal,sans-serif", fontSize: 12, padding: "9px 12px", borderRadius: 8, cursor: "pointer" }}>
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
