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

interface ShippingZone { id: string; governorate_ar: string; cost: number }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { data: session } = useSession()
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [governorate, setGovernorate] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{ id: string; code: string; type: string; value: number; discount: number } | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [zonesLoading, setZonesLoading] = useState(true)

  useEffect(() => {
    fetch("/api/shipping").then(r => r.json()).then(data => {
      setZones(data.map((z: ShippingZone) => ({ ...z, cost: Number(z.cost) })))
    }).catch(() => {}).finally(() => setZonesLoading(false))
  }, [])

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

  const shippingFee = zones.find(z => z.governorate_ar === governorate)?.cost ?? 0
  const discountAmount = appliedDiscount?.discount ?? 0
  const orderTotal = total + shippingFee - discountAmount

  async function applyDiscount() {
    if (!discountCode.trim()) return
    setDiscountLoading(true)
    try {
      const res = await fetch(`/api/discounts/validate?code=${encodeURIComponent(discountCode)}&total=${total}`)
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "كود غير صحيح"); return }
      setAppliedDiscount(data)
      toast.success(`تم تطبيق الخصم: ${data.discount.toLocaleString("ar-EG")} ج.م`)
    } finally {
      setDiscountLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) { toast.error("سلتك فارغة"); return }
    if (!governorate) { toast.error("اختر المحافظة"); return }

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          customer_id: customerId,
          governorate,
          address,
          notes: notes || null,
          items: items.map(i => ({
            product_id: i.id,
            product_name: i.name_ar,
            quality_tier: i.quality_tier,
            qty: i.quantity,
            unit_price: i.price,
          })),
          subtotal: total,
          shipping_cost: shippingFee,
          total: orderTotal,
          method: "cod",
          discount_code: appliedDiscount?.code ?? null,
          discount_amount: discountAmount,
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
        <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>🛒</div>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, color: "#F5EFE0", opacity: 0.45, marginBottom: 24 }}>لا يوجد منتجات لإتمام الطلب</p>
            <Link href="/#products" style={{
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
              padding: "11px 28px", borderRadius: 8, textDecoration: "none",
              background: "linear-gradient(135deg,#C9A84C,#F0D882)", color: "#0A0806",
            }}>تصفّح المنتجات</Link>
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
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Cinzel:wght@400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0A0806; }
        .co-input {
          width: 100%; background: #0E0C09; border: 1px solid rgba(201,168,76,0.2);
          border-radius: 10px; padding: 12px 16px; color: #F5EFE0;
          font-family: Tajawal,sans-serif; font-size: 14px;
          outline: none; transition: border-color 0.25s;
        }
        .co-input:focus { border-color: rgba(201,168,76,0.6); }
        .co-input::placeholder { color: rgba(245,239,224,0.2); }
        .co-submit { transition: all 0.3s ease; }
        .co-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 16px 48px rgba(201,168,76,0.4)!important; }
      `}</style>

      <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: 10, letterSpacing: "6px", color: "#C9A84C", opacity: 0.7, marginBottom: 12 }}>
              ✦ &nbsp; CHECKOUT &nbsp; ✦
            </div>
            <h1 style={{
              fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 800,
              background: "linear-gradient(135deg,#C9A84C,#F0D882)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              margin: 0,
            }}>إتمام الطلب</h1>
            <Link href="/cart" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#C9A84C", opacity: 0.6, textDecoration: "none", marginTop: 8, display: "inline-block" }}>
              ← العودة للسلة
            </Link>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>

            <form onSubmit={handleSubmit} style={{ flex: "1 1 460px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: "linear-gradient(145deg,#0E0C09,#111009)",
                border: "1px solid rgba(201,168,76,0.1)", borderRadius: 16, padding: "24px 20px",
              }}>
                <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F5EFE0", marginBottom: 20, borderBottom: "1px solid rgba(201,168,76,0.08)", paddingBottom: 14 }}>
                  بيانات التواصل والشحن
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>الاسم الكامل *</label>
                    <input className="co-input" required placeholder="مثال: سارة محمد"
                      value={name} onChange={e => setName(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>رقم الهاتف *</label>
                    <input className="co-input" required type="tel" placeholder="01XXXXXXXXX" dir="ltr"
                      value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>المحافظة *</label>
                    {zonesLoading ? (
                      <div className="co-input" style={{ opacity: 0.4, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(201,168,76,0.3)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        جاري تحميل أسعار الشحن...
                      </div>
                    ) : (
                      <select className="co-input" required value={governorate} onChange={e => setGovernorate(e.target.value)}>
                        <option value="">اختر المحافظة</option>
                        {zones.map(z => (
                          <option key={z.id} value={z.governorate_ar}>
                            {z.governorate_ar} — شحن {z.cost === 0 ? "مجاني" : `${z.cost} ج.م`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>العنوان التفصيلي *</label>
                    <textarea className="co-input" required rows={3} placeholder="الشارع، الحي، المبنى..."
                      value={address} onChange={e => setAddress(e.target.value)}
                      style={{ resize: "vertical", minHeight: 80 }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>ملاحظات إضافية (اختياري)</label>
                    <textarea className="co-input" rows={2} placeholder="أي تعليمات خاصة للتوصيل..."
                      value={notes} onChange={e => setNotes(e.target.value)}
                      style={{ resize: "vertical" }} />
                  </div>
                </div>
              </div>

              <div style={{
                background: "linear-gradient(145deg,#0E0C09,#111009)",
                border: "1px solid rgba(201,168,76,0.1)", borderRadius: 16, padding: "20px",
              }}>
                <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F5EFE0", marginBottom: 14 }}>
                  🎁 كود الخصم
                </h2>
                {appliedDiscount ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "12px 16px" }}>
                    <div>
                      <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#4ade80", letterSpacing: "1px" }}>{appliedDiscount.code}</span>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#4ade80", marginRight: 10 }}>
                        خصم {appliedDiscount.discount.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                    <button type="button" onClick={() => { setAppliedDiscount(null); setDiscountCode("") }}
                      style={{ background: "transparent", border: "none", color: "rgba(239,68,68,0.6)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="co-input" placeholder="أدخل كود الخصم" dir="ltr"
                      value={discountCode} onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), applyDiscount())}
                      style={{ flex: 1, letterSpacing: "1px" }} />
                    <button type="button" onClick={applyDiscount} disabled={discountLoading || !discountCode.trim()}
                      style={{
                        padding: "0 20px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)",
                        borderRadius: 10, color: "#C9A84C", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
                        cursor: discountLoading ? "wait" : "pointer", whiteSpace: "nowrap", opacity: !discountCode.trim() ? 0.4 : 1,
                      }}>
                      {discountLoading ? "..." : "تطبيق"}
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="co-submit"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                  color: "#0A0806", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16,
                  padding: "16px 24px", borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer",
                  boxShadow: "0 8px 32px rgba(201,168,76,0.2)",
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? (
                  <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(10,8,6,0.3)", borderTopColor: "#0A0806", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
                {loading ? "جاري تأكيد الطلب..." : "تأكيد الطلب (الدفع عند الاستلام)"}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </form>

            <div style={{ flex: "0 0 280px", minWidth: 240, position: "sticky", top: 88 }}>
              <div style={{
                background: "linear-gradient(145deg,#0E0C09,#111009)",
                border: "1px solid rgba(201,168,76,0.12)",
                borderRadius: 16, padding: "24px 20px",
              }}>
                <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F5EFE0", marginBottom: 16, borderBottom: "1px solid rgba(201,168,76,0.1)", paddingBottom: 12 }}>
                  تفاصيل طلبك
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.6, flex: 1 }}>
                        {item.name_ar} × {item.quantity}
                      </span>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: "rgba(201,168,76,0.12)", marginBottom: 12 }} />

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.5 }}>المنتجات</span>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", fontWeight: 700 }}>{total.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: appliedDiscount ? 8 : 16 }}>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.5 }}>الشحن</span>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: shippingFee > 0 ? "#C9A84C" : "#555", fontWeight: 700 }}>
                    {governorate ? (shippingFee === 0 ? "مجاني" : `${shippingFee} ج.م`) : "اختر المحافظة"}
                  </span>
                </div>
                {appliedDiscount && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#4ade80", opacity: 0.85 }}>خصم ({appliedDiscount.code})</span>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#4ade80", fontWeight: 700 }}>
                      -{discountAmount.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                )}

                <div style={{ height: 1, background: "linear-gradient(90deg,#C9A84C44,transparent)", marginBottom: 16 }} />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, fontWeight: 700, color: "#F5EFE0" }}>الإجمالي</span>
                  <span style={{
                    fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 900,
                    background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {orderTotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>

                <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 10 }}>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.45, lineHeight: 1.7 }}>
                    💵 الدفع عند الاستلام<br/>
                    🚚 توصيل لجميع محافظات مصر<br/>
                    📞 سنتواصل معك لتأكيد الطلب
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
