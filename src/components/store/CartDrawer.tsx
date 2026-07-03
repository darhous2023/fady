"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"

const QUALITY_LABELS: Record<string, string> = {
  hi_copy: "بريميوم", mirror: "ميرور كواليتي", original: "أصلي",
}

export default function CartDrawer() {
  const { items, removeItem, updateQty, count, total, isCartOpen, closeCart } = useCart()

  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [isCartOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeCart])

  if (!isCartOpen) return null

  return (
    <>
      <style>{`
        @keyframes drawerSlideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes drawerFadeIn  { from{opacity:0} to{opacity:1} }
        .cd-item { transition: background 0.2s; }
        .cd-item:hover { background: rgba(201,168,76,0.04); }
        .cd-qty-btn { background: none; border: 1px solid rgba(201,168,76,0.2); color: #C9A84C; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-family: Tajawal, sans-serif; }
        .cd-qty-btn:hover { background: rgba(201,168,76,0.12); border-color: rgba(201,168,76,0.5); }
        .cd-remove { background: none; border: none; cursor: pointer; color: rgba(245,239,224,0.25); transition: color 0.2s; padding: 4px; }
        .cd-remove:hover { color: #f87171; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          animation: "drawerFadeIn 0.25s ease both",
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 10001,
        width: "min(420px, 100vw)",
        background: "linear-gradient(180deg, #100e0a 0%, #0A0806 100%)",
        borderLeft: "1px solid rgba(201,168,76,0.15)",
        display: "flex", flexDirection: "column",
        animation: "drawerSlideIn 0.3s cubic-bezier(0.2,0,0.2,1) both",
        direction: "rtl",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid rgba(201,168,76,0.1)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 17, color: "#F5EFE0" }}>
              السلة
            </span>
            {count > 0 && (
              <span style={{
                background: "#7B1C2E", color: "#fff",
                fontFamily: "Tajawal, sans-serif", fontSize: 11, fontWeight: 700,
                padding: "2px 8px", borderRadius: 12, minWidth: 22, textAlign: "center",
              }}>{count}</span>
            )}
          </div>
          <button onClick={closeCart} style={{
            background: "none", border: "1px solid rgba(201,168,76,0.2)", cursor: "pointer",
            color: "rgba(245,239,224,0.5)", borderRadius: 8, padding: "6px 10px",
            fontFamily: "Tajawal, sans-serif", fontSize: 13, transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 4,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#F5EFE0"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)" }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(245,239,224,0.5)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            إغلاق
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontSize: 52, opacity: 0.12, marginBottom: 16 }}>🛍️</div>
              <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 15, color: "rgba(245,239,224,0.3)", margin: "0 0 24px" }}>
                سلتك فارغة
              </p>
              <button onClick={closeCart} style={{
                fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 13,
                padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #C9A84C, #F0D882)", color: "#0A0806",
              }}>
                تصفّحي المتجر
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cd-item" style={{
                display: "flex", gap: 14, padding: "14px 24px",
                borderBottom: "1px solid rgba(201,168,76,0.06)",
              }}>
                {/* Image */}
                <Link href={`/products/${item.slug}`} onClick={closeCart} style={{ flexShrink: 0 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(201,168,76,0.12)" }}>
                    {item.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={item.image} alt={item.name_ar} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", background: "#1a1510", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, opacity: 0.2 }}>👜</div>
                    }
                  </div>
                </Link>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/products/${item.slug}`} onClick={closeCart} style={{ textDecoration: "none" }}>
                    <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, fontWeight: 700, color: "#F5EFE0", margin: "0 0 3px", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name_ar}
                    </p>
                  </Link>
                  <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 11, color: "rgba(245,239,224,0.35)", margin: "0 0 8px" }}>
                    {QUALITY_LABELS[item.quality_tier] ?? item.quality_tier}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button className="cd-qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 14, fontWeight: 700, color: "#F5EFE0", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                      <button className="cd-qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 15, fontWeight: 900, color: "#C9A84C" }}>
                      {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button className="cd-remove" onClick={() => removeItem(item.id)} aria-label="حذف">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", padding: "20px 24px", flexShrink: 0 }}>
            {/* Shipping note */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "10px 14px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.08)", borderRadius: 8 }}>
              <span style={{ fontSize: 14 }}>🚚</span>
              <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, color: "rgba(245,239,224,0.45)" }}>
                شحن خلال 2-5 أيام — يُحسب بعد تأكيد العنوان
              </span>
            </div>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 14, color: "rgba(245,239,224,0.55)" }}>الإجمالي</span>
              <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900, color: "#C9A84C" }}>
                {total.toLocaleString("ar-EG")} ج.م
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/checkout" onClick={closeCart} style={{
                display: "block", textAlign: "center",
                fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 15,
                padding: "14px", borderRadius: 10, textDecoration: "none",
                background: "linear-gradient(135deg, #C9A84C, #F0D882)",
                color: "#0A0806",
                boxShadow: "0 4px 20px rgba(201,168,76,0.25)",
              }}>
                إتمام الطلب ←
              </Link>
              <Link href="/cart" onClick={closeCart} style={{
                display: "block", textAlign: "center",
                fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 13,
                padding: "11px", borderRadius: 10, textDecoration: "none",
                border: "1px solid rgba(201,168,76,0.25)",
                color: "rgba(245,239,224,0.6)",
              }}>
                عرض السلة كاملة
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
