"use client"

import Link from "next/link"
import { useCart } from "@/contexts/CartContext"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

const WA = "201555557745"

function buildWaMessage(items: ReturnType<typeof useCart>["items"]): string {
  const lines = items.map(
    item => `• ${item.name_ar} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString("ar-EG")} ج.م`
  )
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  return [
    "السلام عليكم 👋",
    "أريد حجز معاينة السيارات التالية:",
    "",
    ...lines,
    "",
    `الإجمالي: ${total.toLocaleString("ar-EG")} ج.م`,
    "",
    "أرجو التواصل لتحديد ميعاد المعاينة.",
  ].join("\n")
}

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, count, total } = useCart()

  const waHref = `https://wa.me/${WA}?text=${encodeURIComponent(buildWaMessage(items))}`

  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0A0A0A; }
        .cart-item { transition: all 0.3s ease; }
        .cart-item:hover { border-color: rgba(155,163,170,0.25)!important; }
        .cart-qty-btn { background: rgba(155,163,170,0.08); border: 1px solid rgba(155,163,170,0.2); color: #9BA3AA; border-radius: 6px; width: 32px; height: 32px; cursor: pointer; font-size: 16px; font-weight: 700; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .cart-qty-btn:hover { background: rgba(155,163,170,0.18); border-color: rgba(155,163,170,0.5); }
        .cart-remove-btn { background: none; border: none; cursor: pointer; color: #555; font-size: 18px; padding: 4px 8px; transition: color 0.2s; border-radius: 6px; }
        .cart-remove-btn:hover { color: #c0392b; background: rgba(165,52,44,0.1); }
        .cart-checkout-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 16px 48px rgba(155,163,170,0.4)!important; }
        .cart-wa-btn:hover { background: rgba(37,211,102,0.2)!important; border-color: rgba(37,211,102,0.5)!important; transform: translateY(-1px); }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 12 }}>
              ✦ &nbsp; VIEWING LIST &nbsp; ✦
            </div>
            <h1 style={{
              fontFamily: "Tajawal,sans-serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: 800,
              background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              margin: 0,
            }}>
              قائمة المعاينة {count > 0 && <span style={{ fontSize: "0.55em", opacity: 0.6 }}>({count} سيارة)</span>}
            </h1>
          </div>

          {items.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ fontSize: 64, marginBottom: 24, opacity: 0.3 }}>🚗</div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, color: "#F2F0EC", opacity: 0.4, marginBottom: 32 }}>
                لسه مفيش سيارات في قائمة المعاينة
              </p>
              <Link href="/used" style={{
                fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
                padding: "12px 32px", borderRadius: 8, textDecoration: "none",
                background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A",
              }}>
                تصفّح السيارات
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>

              {/* Items list */}
              <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: 14 }}>
                {items.map(item => (
                  <div key={item.id} className="cart-item" style={{
                    background: "linear-gradient(145deg,#131313,#141414)",
                    border: "1px solid rgba(155,163,170,0.1)",
                    borderRadius: 14, padding: "16px 18px",
                    display: "flex", alignItems: "center", gap: 16,
                  }}>
                    {/* Image */}
                    <div style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#1A1A1A" }}>
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name_ar}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, opacity: 0.3 }}>🚗</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/products/${item.slug}`} style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F2F0EC", textDecoration: "none", display: "block", marginBottom: 4 }}>
                        {item.name_ar}
                      </Link>
                      <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#9BA3AA", fontWeight: 700 }}>
                        {item.price.toLocaleString("ar-EG")} ج.م
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F2F0EC", minWidth: 24, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>

                    {/* Subtotal */}
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: 15, color: "#9BA3AA", minWidth: 90, textAlign: "center" }}>
                      {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                    </div>

                    {/* Remove */}
                    <button className="cart-remove-btn" onClick={() => removeItem(item.id)} title="حذف">✕</button>
                  </div>
                ))}

                {/* Clear list */}
                <button onClick={() => { if (confirm("إفراغ قائمة المعاينة؟")) clearCart() }}
                  style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#555", textDecoration: "underline", padding: "4px 0" }}>
                  إفراغ القائمة
                </button>
              </div>

              {/* Order summary */}
              <div style={{ flex: "0 0 280px", minWidth: 240, position: "sticky", top: 88 }}>
                <div style={{
                  background: "linear-gradient(145deg,#131313,#141414)",
                  border: "1px solid rgba(155,163,170,0.12)",
                  borderRadius: 16, padding: "24px 20px",
                }}>
                  <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F2F0EC", marginBottom: 20, borderBottom: "1px solid rgba(155,163,170,0.1)", paddingBottom: 14 }}>
                    ملخص الحجز
                  </h3>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.5 }}>عدد السيارات</span>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.5 }}>الميعاد</span>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#9BA3AA", opacity: 0.8 }}>يُحدَّد في الخطوة التالية</span>
                  </div>

                  <div style={{ height: 1, background: "linear-gradient(90deg,#9BA3AA44,transparent)", marginBottom: 20 }} />

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, fontWeight: 700, color: "#F2F0EC" }}>إجمالي أسعار السيارات</span>
                    <span style={{
                      fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 900,
                      background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {total.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>

                  {/* Checkout button */}
                  <Link href="/checkout" className="cart-checkout-btn" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                    color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
                    padding: "14px 20px", borderRadius: 10, textDecoration: "none", marginBottom: 12,
                    boxShadow: "0 8px 32px rgba(155,163,170,0.2)",
                    transition: "all 0.3s ease",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    متابعة لتأكيد الحجز
                  </Link>

                  {/* WhatsApp booking */}
                  <a href={waHref} target="_blank" rel="noopener noreferrer"
                    className="cart-wa-btn"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
                      color: "#25D366", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
                      padding: "12px 20px", borderRadius: 10, textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                    </svg>
                    حجز عبر واتساب
                  </a>

                  <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F2F0EC", opacity: 0.25, textAlign: "center", marginTop: 16 }}>
                    🔒 بدون التزام بالشراء — المعاينة مجانية
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />

      {/* Mobile sticky checkout bar */}
      {items.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
          background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(155,163,170,0.15)",
          padding: "12px 20px 16px",
          display: "none",
        }} className="cart-mobile-bar">
          <style>{`
            @media (max-width: 768px) { .cart-mobile-bar { display: block !important; } }
          `}</style>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)" }}>
              إجمالي {count} سيارة
            </span>
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 17, fontWeight: 900, color: "#9BA3AA" }}>
              {total.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
          <Link href="/checkout" style={{
            display: "block", textAlign: "center",
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "14px", borderRadius: 10, textDecoration: "none",
            background: "linear-gradient(135deg, #9BA3AA, #C9CFD4)", color: "#0A0A0A",
            boxShadow: "0 4px 20px rgba(155,163,170,0.25)",
          }}>
            تأكيد الحجز ←
          </Link>
        </div>
      )}
    </>
  )
}
