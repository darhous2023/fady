"use client"

import { useState } from "react"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

const STATUS_STEPS = [
  { key: "pending",   label: "تم استلام الطلب",   icon: "📋" },
  { key: "confirmed", label: "تم تأكيد الطلب",    icon: "✅" },
  { key: "shipped",   label: "في الطريق إليكِ",   icon: "🚚" },
  { key: "delivered", label: "تم التسليم",          icon: "🎉" },
]

const QUALITY: Record<string, string> = { hi_copy: "بريميوم", mirror: "ميرور كواليتي", original: "أصلي" }

interface TrackResult {
  order_number: string
  customer_name: string
  governorate: string
  status: string
  total: string
  shipping_cost: string
  created_at: string
  items: { product_name: string; quality_tier: string; qty: number; unit_price: string }[]
}

export default function TrackPage() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState("")

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true); setError(""); setResult(null)
    try {
      const res = await fetch(`/api/orders/track?number=${encodeURIComponent(input.trim())}`)
      const data = await res.json()
      if (!res.ok) { setError(data.error || "حدث خطأ"); return }
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  const stepIdx = result ? STATUS_STEPS.findIndex(s => s.key === result.status) : -1
  const isCancelled = result?.status === "cancelled"

  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800&family=Cinzel:wght@400&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: #0A0806; }
        .tr-input { width: 100%; background: #0E0C09; border: 1px solid rgba(201,168,76,0.25); border-radius: 10px; padding: 14px 18px; color: #F5EFE0; font-family: Tajawal,sans-serif; font-size: 16px; outline: none; letter-spacing: 1.5px; transition: border-color 0.25s; }
        .tr-input:focus { border-color: rgba(201,168,76,0.6); }
        .tr-input::placeholder { color: rgba(245,239,224,0.2); letter-spacing: 1px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fadeUp { animation: fadeUp 0.5s ease both; }
      `}</style>

      <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px 100px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "6px", color: "#C9A84C", opacity: 0.7, marginBottom: 16, textTransform: "uppercase" }}>
              ✦ &nbsp; ORDER TRACKING &nbsp; ✦
            </div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 800, color: "#F5EFE0", margin: "0 0 10px" }}>
              تتبّع طلبكِ
            </h1>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.35 }}>
              أدخلي رقم الطلب لمعرفة حالته الحالية
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleTrack} style={{ display: "flex", gap: 10, marginBottom: 40 }}>
            <input className="tr-input" dir="ltr" placeholder="SHY-XXXXXXXX"
              value={input} onChange={e => setInput(e.target.value.toUpperCase())} />
            <button type="submit" disabled={loading}
              style={{
                padding: "0 28px", background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                color: "#0A0806", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
                borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer",
                flexShrink: 0, opacity: loading ? 0.7 : 1, whiteSpace: "nowrap",
              }}>
              {loading ? "..." : "تتبّع"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="fadeUp">
              {/* Order header */}
              <div style={{ background: "linear-gradient(145deg,#0E0C09,#111009)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 16, padding: "24px 20px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#C9A84C", letterSpacing: "1px" }}>{result.order_number}</div>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(245,239,224,0.45)", marginTop: 4 }}>
                      {new Date(result.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(245,239,224,0.4)", marginBottom: 2 }}>الإجمالي</div>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 800, color: "#C9A84C" }}>
                      {Number(result.total).toLocaleString("ar-EG")} ج.م
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(245,239,224,0.5)" }}>👤 {result.customer_name}</span>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(245,239,224,0.5)" }}>📍 {result.governorate}</span>
                </div>
              </div>

              {/* Status stepper */}
              {!isCancelled ? (
                <div style={{ background: "linear-gradient(145deg,#0E0C09,#111009)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 16, padding: "28px 20px", marginBottom: 20 }}>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(201,168,76,0.6)", letterSpacing: "2px", marginBottom: 24, fontWeight: 700 }}>حالة الطلب</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= stepIdx
                      const active = i === stepIdx
                      return (
                        <div key={step.key} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: i < STATUS_STEPS.length - 1 ? 24 : 0, position: "relative" }}>
                          {/* Line */}
                          {i < STATUS_STEPS.length - 1 && (
                            <div style={{
                              position: "absolute", right: 19, top: 40, width: 2, height: "calc(100% - 16px)",
                              background: done ? "linear-gradient(to bottom,#C9A84C,rgba(201,168,76,0.3))" : "rgba(255,255,255,0.06)",
                              borderRadius: 2,
                            }} />
                          )}
                          {/* Circle */}
                          <div style={{
                            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                            background: done ? (active ? "linear-gradient(135deg,#C9A84C,#F0D882)" : "rgba(201,168,76,0.15)") : "rgba(255,255,255,0.04)",
                            border: done ? (active ? "2px solid #C9A84C" : "1px solid rgba(201,168,76,0.3)") : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: active ? "0 0 20px rgba(201,168,76,0.3)" : "none",
                            zIndex: 1,
                          }}>
                            {done ? step.icon : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />}
                          </div>
                          {/* Text */}
                          <div style={{ paddingTop: 8 }}>
                            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: active ? 700 : 400, color: done ? (active ? "#C9A84C" : "#F5EFE0") : "rgba(245,239,224,0.3)" }}>
                              {step.label}
                            </div>
                            {active && (
                              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(201,168,76,0.6)", marginTop: 3 }}>
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
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#f87171", fontWeight: 700 }}>
                  ❌ تم إلغاء الطلب
                </div>
              )}

              {/* Items */}
              {result.items.length > 0 && (
                <div style={{ background: "linear-gradient(145deg,#0E0C09,#111009)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 16, padding: "20px", marginBottom: 20 }}>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(201,168,76,0.6)", letterSpacing: "2px", marginBottom: 16, fontWeight: 700 }}>المنتجات ({result.items.length})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {result.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0" }}>{item.product_name}</div>
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(245,239,224,0.35)", marginTop: 2 }}>
                            {QUALITY[item.quality_tier] ?? item.quality_tier} · {item.qty} قطعة
                          </div>
                        </div>
                        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#C9A84C", fontWeight: 700 }}>
                          {(item.qty * Number(item.unit_price)).toLocaleString("ar-EG")} ج.م
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WA help */}
              <div style={{ textAlign: "center" }}>
                <a href={`https://wa.me/201015835455?text=${encodeURIComponent(`السلام عليكم، أريد الاستفسار عن طلبي رقم ${result.order_number}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 8, textDecoration: "none", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366" }}>
                  📱 تواصلي مع خدمة العملاء
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
