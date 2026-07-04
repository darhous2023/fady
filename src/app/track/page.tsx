"use client"

import { useEffect, useState } from "react"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import { DEFAULT_ORDER_STATUS_LABELS, type OrderStatusKey } from "@/lib/orderStatusLabels"

const STEP_KEYS: OrderStatusKey[] = ["pending", "confirmed", "shipped", "delivered"]
const STEP_ICONS: Record<OrderStatusKey, string> = { pending: "📋", confirmed: "✅", shipped: "📞", delivered: "🎉", cancelled: "❌" }

const QUALITY: Record<string, string> = { original: "ممتازة", mirror: "جيدة جدًا", hi_copy: "جيدة" }

interface TrackedOrder {
  order_number: string
  customer_name: string
  branch: string | null
  preferred_date: string | null
  status: string
  total: string
  created_at: string
  items: { product_name: string; quality_tier: string; qty: number; unit_price: string }[]
}

export default function TrackPage() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TrackedOrder[] | null>(null)
  const [error, setError] = useState("")
  const [labels, setLabels] = useState<Record<OrderStatusKey, string>>(DEFAULT_ORDER_STATUS_LABELS)

  useEffect(() => {
    fetch("/api/order-status-labels").then(r => r.json()).then(setLabels).catch(() => {})
  }, [])

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true); setError(""); setResults(null)
    try {
      const digits = input.replace(/\D/g, "")
      const isPhone = digits.length >= 8
      const param = isPhone ? `phone=${encodeURIComponent(input.trim())}` : `number=${encodeURIComponent(input.trim())}`
      const res = await fetch(`/api/orders/track?${param}`)
      const data = await res.json()
      if (!res.ok) { setError(data.error || "حدث خطأ"); return }
      setResults(data.orders)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <StoreHeader />
      <style>{`
                * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        .tr-input { width: 100%; background: #131313; border: 1px solid rgba(155,163,170,0.25); border-radius: 10px; padding: 14px 18px; color: #F2F0EC; font-family: Tajawal,sans-serif; font-size: 16px; outline: none; letter-spacing: 1.5px; transition: border-color 0.25s; }
        .tr-input:focus { border-color: rgba(155,163,170,0.6); }
        .tr-input::placeholder { color: rgba(242,240,236,0.2); letter-spacing: 1px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fadeUp { animation: fadeUp 0.5s ease both; }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px 100px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 16, textTransform: "uppercase" }}>
              ✦ &nbsp; BOOKING TRACKING &nbsp; ✦
            </div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 800, color: "#F2F0EC", margin: "0 0 10px" }}>
              تتبّع حالة الحجز
            </h1>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.35 }}>
              أدخل رقم تليفونك لعرض كل حجوزاتك، أو رقم الطلب مباشرة
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleTrack} style={{ display: "flex", gap: 10, marginBottom: 40 }}>
            <input className="tr-input" dir="ltr" placeholder="01xxxxxxxxx أو FADY-XXXXXXXX"
              value={input} onChange={e => setInput(e.target.value)} />
            <button type="submit" disabled={loading}
              style={{
                padding: "0 28px", background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
                borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer",
                flexShrink: 0, opacity: loading ? 0.7 : 1, whiteSpace: "nowrap",
              }}>
              {loading ? "..." : "تتبّع"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#D9776A" }}>
              {error}
            </div>
          )}

          {/* Results */}
          {results && results.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {results.length > 1 && (
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.4)", textAlign: "center" }}>
                  تم العثور على {results.length} حجوزات بهذا الرقم
                </p>
              )}
              {results.map(result => {
                const stepIdx = STEP_KEYS.findIndex(s => s === result.status)
                const isCancelled = result.status === "cancelled"

                return (
                  <div key={result.order_number} className="fadeUp">
                    {/* Order header */}
                    <div style={{ background: "linear-gradient(145deg,#131313,#141414)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 16, padding: "24px 20px", marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                        <div>
                          <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#9BA3AA", letterSpacing: "1px" }}>{result.order_number}</div>
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.45)", marginTop: 4 }}>
                            {new Date(result.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                          </div>
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(242,240,236,0.4)", marginBottom: 2 }}>الإجمالي</div>
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 800, color: "#9BA3AA" }}>
                            {Number(result.total).toLocaleString("ar-EG")} ج.م
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)" }}>👤 {result.customer_name}</span>
                        {result.branch && <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)" }}>📍 {result.branch}</span>}
                        {result.preferred_date && <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)" }}>📅 {result.preferred_date}</span>}
                      </div>
                    </div>

                    {/* Status stepper */}
                    {!isCancelled ? (
                      <div style={{ background: "linear-gradient(145deg,#131313,#141414)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 16, padding: "28px 20px", marginBottom: 20 }}>
                        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(155,163,170,0.6)", letterSpacing: "2px", marginBottom: 24, fontWeight: 700 }}>حالة الطلب</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                          {STEP_KEYS.map((step, i) => {
                            const done = i <= stepIdx
                            const active = i === stepIdx
                            return (
                              <div key={step} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: i < STEP_KEYS.length - 1 ? 24 : 0, position: "relative" }}>
                                {i < STEP_KEYS.length - 1 && (
                                  <div style={{
                                    position: "absolute", right: 19, top: 40, width: 2, height: "calc(100% - 16px)",
                                    background: done ? "linear-gradient(to bottom,#9BA3AA,rgba(155,163,170,0.3))" : "rgba(255,255,255,0.06)",
                                    borderRadius: 2,
                                  }} />
                                )}
                                <div style={{
                                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                                  background: done ? (active ? "linear-gradient(135deg,#9BA3AA,#C9CFD4)" : "rgba(155,163,170,0.15)") : "rgba(255,255,255,0.04)",
                                  border: done ? (active ? "2px solid #9BA3AA" : "1px solid rgba(155,163,170,0.3)") : "1px solid rgba(255,255,255,0.08)",
                                  boxShadow: active ? "0 0 20px rgba(155,163,170,0.3)" : "none",
                                  zIndex: 1,
                                }}>
                                  {done ? STEP_ICONS[step] : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />}
                                </div>
                                <div style={{ paddingTop: 8 }}>
                                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: active ? 700 : 400, color: done ? (active ? "#9BA3AA" : "#F2F0EC") : "rgba(242,240,236,0.3)" }}>
                                    {labels[step]}
                                  </div>
                                  {active && (
                                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(155,163,170,0.6)", marginTop: 3 }}>
                                      الحالة الحالية
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#D9776A", fontWeight: 700 }}>
                        ❌ {labels.cancelled}
                      </div>
                    )}

                    {/* Items */}
                    {result.items.length > 0 && (
                      <div style={{ background: "linear-gradient(145deg,#131313,#141414)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 16, padding: "20px" }}>
                        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(155,163,170,0.6)", letterSpacing: "2px", marginBottom: 16, fontWeight: 700 }}>السيارات ({result.items.length})</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {result.items.map((item, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC" }}>{item.product_name}</div>
                                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.35)", marginTop: 2 }}>
                                  {QUALITY[item.quality_tier] ?? item.quality_tier}
                                </div>
                              </div>
                              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#9BA3AA", fontWeight: 700 }}>
                                {(item.qty * Number(item.unit_price)).toLocaleString("ar-EG")} ج.م
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* WA help */}
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <a href={`https://wa.me/201555557745?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن حجوزاتي")}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 8, textDecoration: "none", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366" }}>
                  📱 تواصل مع خدمة العملاء
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
