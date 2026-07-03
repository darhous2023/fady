"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCart } from "@/contexts/CartContext"
import { useSession } from "@/lib/auth/client"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

const BRANCH = "معرض الفادي لتجارة السيارات — المهندسين، شارع أحمد عرابي"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { data: session } = useSession()
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user) return
    fetch("/api/account/me").then(r => r.json()).then(d => {
      if (d.customer) {
        setCustomerId(d.customer.id)
        if (!phone) setPhone(d.customer.phone)
      }
      if (!name && session.user.name) setName(session.user.name)
    }).catch(() => {})
  }, [session])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) { toast.error("قائمة المعاينة فارغة"); return }

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          customer_id: customerId,
          preferred_date: preferredDate || null,
          branch: BRANCH,
          notes: notes || null,
          items: items.map(i => ({
            product_id: i.id,
            product_name: i.name_ar,
            quality_tier: i.quality_tier,
            qty: i.quantity,
            unit_price: i.price,
          })),
          subtotal: total,
          total,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "حدث خطأ، حاول مرة أخرى")
        setLoading(false)
        return
      }

      const data = await res.json()
      clearCart()
      router.push(`/order-confirmed?order=${data.order_number}`)
    } catch {
      toast.error("فشل الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <StoreHeader />
        <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>🚗</div>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, color: "#F2F0EC", opacity: 0.45, marginBottom: 24 }}>لا توجد سيارات لإتمام طلب الحجز</p>
            <Link href="/used" style={{
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
              padding: "11px 28px", borderRadius: 8, textDecoration: "none",
              background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A",
            }}>تصفّح السيارات</Link>
          </div>
        </main>
        <StoreFooter />
      </>
    )
  }

  return (
    <>
      <StoreHeader />
      <style>{`
                * { box-sizing: border-box; }
        body { margin: 0; background: #0A0A0A; }
        .co-input {
          width: 100%; background: #131313; border: 1px solid rgba(155,163,170,0.2);
          border-radius: 10px; padding: 12px 16px; color: #F2F0EC;
          font-family: Tajawal,sans-serif; font-size: 14px;
          outline: none; transition: border-color 0.25s;
        }
        .co-input:focus { border-color: rgba(155,163,170,0.6); }
        .co-input::placeholder { color: rgba(242,240,236,0.2); }
        .co-submit { transition: all 0.3s ease; }
        .co-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 16px 48px rgba(155,163,170,0.4)!important; }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 12 }}>
              ✦ &nbsp; BOOK A VIEWING &nbsp; ✦
            </div>
            <h1 style={{
              fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 800,
              background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              margin: 0,
            }}>تأكيد طلب المعاينة</h1>
            <Link href="/cart" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#9BA3AA", opacity: 0.6, textDecoration: "none", marginTop: 8, display: "inline-block" }}>
              ← العودة لقائمة المعاينة
            </Link>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>

            <form onSubmit={handleSubmit} style={{ flex: "1 1 460px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: "linear-gradient(145deg,#131313,#141414)",
                border: "1px solid rgba(155,163,170,0.1)", borderRadius: 16, padding: "24px 20px",
              }}>
                <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F2F0EC", marginBottom: 20, borderBottom: "1px solid rgba(155,163,170,0.08)", paddingBottom: 14 }}>
                  بيانات التواصل
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.55, marginBottom: 8 }}>الاسم الكامل *</label>
                    <input className="co-input" required placeholder="مثال: أحمد محمد"
                      value={name} onChange={e => setName(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.55, marginBottom: 8 }}>رقم الهاتف *</label>
                    <input className="co-input" required type="tel" placeholder="01XXXXXXXXX" dir="ltr"
                      value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.55, marginBottom: 8 }}>الميعاد المفضل للمعاينة (اختياري)</label>
                    <input className="co-input" type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.55, marginBottom: 8 }}>مكان المعاينة</label>
                    <div className="co-input" style={{ opacity: 0.75, cursor: "default" }}>📍 {BRANCH}</div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.55, marginBottom: 8 }}>ملاحظات إضافية (اختياري)</label>
                    <textarea className="co-input" rows={2} placeholder="أي استفسار عن السيارة أو الميعاد..."
                      value={notes} onChange={e => setNotes(e.target.value)}
                      style={{ resize: "vertical" }} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="co-submit"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                  color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16,
                  padding: "16px 24px", borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer",
                  boxShadow: "0 8px 32px rgba(155,163,170,0.2)",
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? (
                  <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(10,10,10,0.3)", borderTopColor: "#0A0A0A", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
                {loading ? "جاري إرسال الطلب..." : "إرسال طلب الحجز"}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </form>

            <div style={{ flex: "0 0 280px", minWidth: 240, position: "sticky", top: 88 }}>
              <div style={{
                background: "linear-gradient(145deg,#131313,#141414)",
                border: "1px solid rgba(155,163,170,0.12)",
                borderRadius: 16, padding: "24px 20px",
              }}>
                <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F2F0EC", marginBottom: 16, borderBottom: "1px solid rgba(155,163,170,0.1)", paddingBottom: 12 }}>
                  تفاصيل الحجز
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.6, flex: 1 }}>
                        {item.name_ar}
                      </span>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {item.price.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: "linear-gradient(90deg,#9BA3AA44,transparent)", marginBottom: 16 }} />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, fontWeight: 700, color: "#F2F0EC" }}>الإجمالي</span>
                  <span style={{
                    fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 900,
                    background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {total.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>

                <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(155,163,170,0.04)", border: "1px solid rgba(155,163,170,0.1)", borderRadius: 10 }}>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F2F0EC", opacity: 0.45, lineHeight: 1.7 }}>
                    📞 سيتواصل معك فريق المعرض لتأكيد الموعد<br/>
                    📍 المعاينة في معرض الفادي — المهندسين<br/>
                    🚗 بدون التزام بالشراء
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
