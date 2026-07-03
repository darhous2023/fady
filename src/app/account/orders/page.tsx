"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth/client"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

interface Order {
  order_number: string
  status: string
  total: number
  subtotal: number
  shipping_cost: number
  governorate: string
  created_at: string
}

const STATUS: Record<string, string> = { pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن", delivered: "تم التسليم", cancelled: "ملغي" }
const STATUS_C: Record<string, string> = { pending: "#eab308", confirmed: "#3b82f6", shipped: "#a855f7", delivered: "#22c55e", cancelled: "#ef4444" }

export default function OrdersPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending && !session) router.push("/signin")
  }, [session, isPending, router])

  useEffect(() => {
    if (!session) return
    fetch("/api/account/orders").then(r => r.json()).then(d => setOrders(d.orders || [])).catch(() => {}).finally(() => setLoading(false))
  }, [session])

  if (isPending) return null

  return (
    <>
      <StoreHeader />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Cinzel&display=swap'); * { box-sizing: border-box; } body { margin: 0; background: #0A0806; }`}</style>
      <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ marginBottom: 32 }}>
            <Link href="/account/profile" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#C9A84C", opacity: 0.6, textDecoration: "none" }}>← رجوع للحساب</Link>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg,#C9A84C,#F0D882)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: "12px 0 0" }}>
              طلباتي
            </h1>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#F5EFE0", opacity: 0.3, fontFamily: "Tajawal,sans-serif" }}>جاري التحميل...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>📦</div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 16, color: "#F5EFE0", opacity: 0.35, marginBottom: 20 }}>لا توجد طلبات بعد</p>
              <Link href="/#products" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#C9A84C", textDecoration: "none", padding: "10px 24px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8 }}>
                تصفّح المنتجات
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {orders.map(o => (
                <div key={o.order_number} style={{ background: "linear-gradient(145deg,#0E0C09,#111009)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 13, color: "#F5EFE0", opacity: 0.5, marginBottom: 4 }}>{o.order_number}</div>
                      <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.35 }}>
                        {new Date(o.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })} — {o.governorate}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: `${STATUS_C[o.status]}20`, color: STATUS_C[o.status] }}>
                        {STATUS[o.status]}
                      </span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 900, background: "linear-gradient(135deg,#C9A84C,#F0D882)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                          {Number(o.total).toLocaleString("ar-EG")} ج.م
                        </div>
                        {Number(o.shipping_cost) > 0 && (
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.3 }}>
                            شحن {Number(o.shipping_cost).toLocaleString("ar-EG")} ج.م
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {o.status === "shipped" && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(201,168,76,0.07)" }}>
                      <Link href="/track" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#C9A84C", textDecoration: "none", opacity: 0.8 }}>
                        تتبّع الشحنة →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
