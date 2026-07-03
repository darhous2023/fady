"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "@/lib/auth/client"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

interface Order {
  order_number: string; status: string; total: number; subtotal: number;
  shipping_cost: number; governorate: string; created_at: string;
}

interface Notification {
  id: string; type: string; title: string; body: string;
  link: string; image: string | null; created_at: string | null;
}

interface Coupon {
  id: string; code: string; type: "percent" | "fixed"; value: number;
  min_order: number; expires_at: string | null; status: "valid" | "used" | "expired";
}

interface CustomerProfile {
  id: string; name: string; phone: string; email: string | null;
  avatar_url: string | null; instagram_url: string | null;
  facebook_url: string | null; tiktok_url: string | null;
  created_at: string;
}

const STATUS_AR: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", shipped: "تم الشحن",
  delivered: "تم التسليم", cancelled: "ملغي",
}
const STATUS_COLOR: Record<string, string> = {
  pending: "#eab308", confirmed: "#3b82f6", shipped: "#a855f7",
  delivered: "#22c55e", cancelled: "#ef4444",
}
const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"]

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "الآن"
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `منذ ${hrs} ساعة`
  const days = Math.floor(hrs / 24)
  return `منذ ${days} يوم`
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [tab, setTab] = useState<"overview" | "orders" | "coupons" | "notifications" | "profile">("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  // Profile edit state
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editInstagram, setEditInstagram] = useState("")
  const [editFacebook, setEditFacebook] = useState("")
  const [editTiktok, setEditTiktok] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isPending && !session) router.push("/signin")
  }, [session, isPending, router])

  useEffect(() => {
    if (!session) return
    Promise.all([
      fetch("/api/account/orders").then(r => r.json()),
      fetch("/api/account/notifications").then(r => r.json()),
      fetch("/api/account/coupons").then(r => r.json()),
      fetch("/api/account/me").then(r => r.json()),
    ]).then(([o, n, c, m]) => {
      setOrders(o.orders || [])
      setNotifications(n.notifications || [])
      setCoupons(c.coupons || [])
      if (m.customer) {
        setCustomer(m.customer)
        setEditName(m.customer.name || "")
        setEditPhone(m.customer.phone || "")
        setEditInstagram(m.customer.instagram_url || "")
        setEditFacebook(m.customer.facebook_url || "")
        setEditTiktok(m.customer.tiktok_url || "")
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [session])

  async function handleSignOut() {
    await signOut()
    router.push("/")
  }

  function copyCoupon(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  async function handleSaveProfile() {
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch("/api/account/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          instagram_url: editInstagram,
          facebook_url: editFacebook,
          tiktok_url: editTiktok,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setCustomer(data.customer)
        setSaveMsg({ ok: true, text: "تم الحفظ بنجاح ✓" })
      } else {
        setSaveMsg({ ok: false, text: data.error || "حدث خطأ" })
      }
    } catch {
      setSaveMsg({ ok: false, text: "تعذّر الاتصال" })
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(null), 3000)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/account/avatar", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok && data.url) {
        setCustomer(prev => prev ? { ...prev, avatar_url: data.url } : prev)
        setSaveMsg({ ok: true, text: "تم رفع الصورة ✓" })
      } else {
        setSaveMsg({ ok: false, text: data.error || "فشل رفع الصورة" })
      }
    } catch {
      setSaveMsg({ ok: false, text: "تعذّر الاتصال" })
    } finally {
      setAvatarUploading(false)
      setTimeout(() => setSaveMsg(null), 3000)
    }
  }

  if (isPending) return null

  const avatarSrc = customer?.avatar_url || null
  const initials = (session?.user?.name || "U").charAt(0).toUpperCase()
  const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0)

  const validCoupons = coupons.filter(c => c.status === "valid")
  const usedCoupons = coupons.filter(c => c.status === "used")
  const expiredCoupons = coupons.filter(c => c.status === "expired")

  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Cinzel:wght@400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0A0806; }
        .acc-tab { background: none; border: none; cursor: pointer; padding: 10px 20px; border-radius: 10px; font-family: Tajawal,sans-serif; font-size: 14px; font-weight: 700; transition: all 0.2s; white-space: nowrap; }
        .acc-tab.active { background: rgba(201,168,76,0.12); color: #C9A84C; }
        .acc-tab:not(.active) { color: rgba(245,239,224,0.5); }
        .acc-tab:not(.active):hover { color: #F5EFE0; background: rgba(255,255,255,0.04); }
        .card { background: linear-gradient(145deg,#0E0C09,#111009); border: 1px solid rgba(201,168,76,0.12); border-radius: 16px; padding: 24px; }
        .coupon-card { border-radius: 14px; padding: 18px 20px; position: relative; }
        .step-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .signout-btn:hover { opacity: 0.8 !important; }
        .browse-btn:hover { background: rgba(201,168,76,0.15) !important; }
      `}</style>
      <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>

          {/* Hero Card */}
          <div className="card" style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{ position: "relative", flexShrink: 0, cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
                title="اضغط لتغيير الصورة"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="صورتك" style={{
                    width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                    boxShadow: "0 0 0 3px rgba(201,168,76,0.3)",
                    border: "2px solid #C9A84C",
                  }} />
                ) : (
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, fontWeight: 900, color: "#0A0806",
                    fontFamily: "Tajawal,sans-serif",
                    boxShadow: "0 0 0 3px rgba(201,168,76,0.2)",
                  }}>{initials}</div>
                )}
                <div style={{
                  position: "absolute", bottom: 0, left: 0,
                  width: 20, height: 20, borderRadius: "50%",
                  background: avatarUploading ? "#eab308" : "#C9A84C",
                  border: "2px solid #0A0806",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10,
                }}>
                  {avatarUploading ? "⏳" : "📷"}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "4px", color: "#C9A84C", opacity: 0.6, marginBottom: 4 }}>✦ ACCOUNT ✦</div>
                <div style={{
                  fontFamily: "Tajawal,sans-serif", fontSize: 22, fontWeight: 900,
                  background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  lineHeight: 1.2,
                }}>
                  {session?.user?.name || "مرحباً"}
                </div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.35, marginTop: 2, direction: "ltr", textAlign: "right" }}>
                  {session?.user?.email}
                </div>
              </div>
            </div>
            <button
              className="signout-btn"
              onClick={handleSignOut}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(201,168,76,0.15)",
                background: "rgba(201,168,76,0.06)", color: "#F5EFE0", opacity: 0.6,
                fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              تسجيل الخروج
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
            {[
              { label: "طلب", value: orders.length.toString(), icon: "📦" },
              { label: "ج.م إجمالي", value: totalSpent.toLocaleString("ar-EG"), icon: "💰" },
              { label: "عضو ShahY", value: "", icon: "👑" },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, minWidth: 130,
                background: "linear-gradient(145deg,#0E0C09,#111009)",
                border: "1px solid rgba(201,168,76,0.12)", borderRadius: 12,
                padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <div>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 900, color: "#C9A84C", lineHeight: 1.1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.4, marginTop: 2 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4, marginBottom: 24,
            background: "linear-gradient(145deg,#0E0C09,#111009)",
            border: "1px solid rgba(201,168,76,0.1)", borderRadius: 14,
            padding: "6px", overflowX: "auto",
          }}>
            {([
              { key: "overview", label: "نظرة عامة", emoji: "🏠" },
              { key: "orders", label: `طلباتي (${orders.length})`, emoji: "📦" },
              { key: "coupons", label: "الكوبونات", emoji: "🎟️" },
              { key: "notifications", label: `الإشعارات (${notifications.length})`, emoji: "🔔" },
              { key: "profile", label: "بياناتي", emoji: "👤" },
            ] as const).map(t => (
              <button
                key={t.key}
                className={`acc-tab${tab === t.key ? " active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{
                width: 36, height: 36, border: "3px solid rgba(201,168,76,0.15)",
                borderTopColor: "#C9A84C", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
            </div>
          )}

          {/* Tab Content */}
          {!loading && (
            <>
              {/* OVERVIEW */}
              {tab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                      <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 16, fontWeight: 700, color: "#F5EFE0", margin: 0 }}>آخر 3 طلبات</h2>
                      <button onClick={() => setTab("orders")} style={{ background: "none", border: "none", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#C9A84C", cursor: "pointer", opacity: 0.8 }}>عرض الكل ←</button>
                    </div>
                    {orders.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
                        <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.3, margin: "0 0 14px" }}>لا توجد طلبات بعد</p>
                        <Link href="/#products" className="browse-btn" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#C9A84C", textDecoration: "none", fontWeight: 700, padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.07)", transition: "background 0.2s" }}>
                          تصفّح المنتجات
                        </Link>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {orders.slice(0, 3).map((o, i) => (
                          <div key={o.order_number} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < Math.min(orders.length, 3) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                            <div>
                              <div style={{ fontFamily: "monospace", fontSize: 12, color: "#C9A84C", letterSpacing: "0.5px" }}>{o.order_number}</div>
                              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.35, marginTop: 3 }}>{new Date(o.created_at).toLocaleDateString("ar-EG")}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${STATUS_COLOR[o.status]}22`, color: STATUS_COLOR[o.status] }}>
                                {STATUS_AR[o.status]}
                              </span>
                              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#C9A84C" }}>{Number(o.total).toLocaleString("ar-EG")} ج</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                      <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 16, fontWeight: 700, color: "#F5EFE0", margin: 0 }}>الإشعارات الأخيرة</h2>
                      <button onClick={() => setTab("notifications")} style={{ background: "none", border: "none", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#C9A84C", cursor: "pointer", opacity: 0.8 }}>عرض الكل ←</button>
                    </div>
                    {notifications.length === 0 ? (
                      <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.3, margin: 0, textAlign: "center", padding: "16px 0" }}>لا توجد إشعارات</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {notifications.slice(0, 3).map(n => (
                          <div key={n.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A84C", marginTop: 5, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, color: "#F5EFE0", marginBottom: 2 }}>{n.title}</div>
                              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.45 }}>{n.body}</div>
                            </div>
                            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.25, whiteSpace: "nowrap" }}>{timeAgo(n.created_at)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <Link href="/#products" className="browse-btn" style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700,
                      color: "#C9A84C", textDecoration: "none",
                      padding: "12px 28px", borderRadius: 12,
                      border: "1px solid rgba(201,168,76,0.25)",
                      background: "rgba(201,168,76,0.07)",
                      transition: "background 0.2s",
                    }}>
                      <span>🛍️</span> تصفّح المنتجات
                    </Link>
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {tab === "orders" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {orders.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                      <div style={{ fontSize: 48, marginBottom: 14 }}>📦</div>
                      <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 16, color: "#F5EFE0", opacity: 0.35, margin: "0 0 20px" }}>لا توجد طلبات بعد</p>
                      <Link href="/#products" className="browse-btn" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#C9A84C", textDecoration: "none", fontWeight: 700, padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.07)", transition: "background 0.2s" }}>
                        تصفّح المنتجات
                      </Link>
                    </div>
                  ) : (
                    orders.map(order => {
                      const currentIdx = STATUS_STEPS.indexOf(order.status)
                      const isCancelled = order.status === "cancelled"
                      return (
                        <div key={order.order_number} className="card">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(201,168,76,0.08)", flexWrap: "wrap", gap: 10 }}>
                            <div>
                              <div style={{ fontFamily: "monospace", fontSize: 13, color: "#C9A84C", letterSpacing: "0.5px", fontWeight: 700 }}>{order.order_number}</div>
                              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.35, marginTop: 4 }}>
                                {new Date(order.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                                {order.governorate && ` · ${order.governorate}`}
                              </div>
                            </div>
                            <div style={{ textAlign: "left" }}>
                              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 900, color: "#C9A84C" }}>
                                {Number(order.total).toLocaleString("ar-EG")} <span style={{ fontSize: 12, opacity: 0.7 }}>ج.م</span>
                              </div>
                              {order.shipping_cost > 0 && (
                                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.35, marginTop: 2 }}>شحن {Number(order.shipping_cost).toLocaleString("ar-EG")} ج.م</div>
                              )}
                            </div>
                          </div>

                          {isCancelled ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                              <span style={{ fontSize: 14 }}>❌</span>
                              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, color: "#ef4444" }}>تم إلغاء الطلب</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                              {STATUS_STEPS.map((step, idx) => {
                                const isDone = currentIdx >= idx
                                const isCurrent = currentIdx === idx
                                const isLast = idx === STATUS_STEPS.length - 1
                                return (
                                  <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: isLast ? 0 : 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                      <div className="step-dot" style={{
                                        background: isDone ? "#C9A84C" : "rgba(245,239,224,0.1)",
                                        boxShadow: isCurrent ? "0 0 0 3px rgba(201,168,76,0.25)" : "none",
                                        border: isDone ? "none" : "1px solid rgba(245,239,224,0.15)",
                                        transition: "all 0.3s",
                                      }} />
                                      {!isLast && (
                                        <div style={{
                                          flex: 1, height: 2,
                                          background: currentIdx > idx ? "#C9A84C" : "rgba(245,239,224,0.08)",
                                          transition: "background 0.3s",
                                        }} />
                                      )}
                                    </div>
                                    <div style={{
                                      fontFamily: "Tajawal,sans-serif", fontSize: 10, marginTop: 6,
                                      color: isDone ? "#C9A84C" : "#F5EFE0",
                                      opacity: isDone ? 1 : 0.3,
                                      fontWeight: isCurrent ? 700 : 400,
                                      textAlign: "center", whiteSpace: "nowrap",
                                    }}>
                                      {STATUS_AR[step]}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {order.status === "shipped" && (
                            <div style={{ marginTop: 14 }}>
                              <a href="#" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#a855f7", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                                <span>📍</span> تتبّع الشحنة
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {/* COUPONS */}
              {tab === "coupons" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {coupons.length === 0 && (
                    <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🎟️</div>
                      <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F5EFE0", opacity: 0.3, margin: 0 }}>لا توجد كوبونات بعد</p>
                    </div>
                  )}
                  {[
                    { label: "الكوبونات الصالحة", list: validCoupons, accent: "#22c55e", icon: "✅" },
                    { label: "الكوبونات المستخدمة", list: usedCoupons, accent: "#6b7280", icon: "✔️" },
                    { label: "الكوبونات المنتهية", list: expiredCoupons, accent: "#ef4444", icon: "⛔" },
                  ].map(section => (
                    <div key={section.label}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 14 }}>{section.icon}</span>
                        <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F5EFE0", opacity: 0.6 }}>{section.label}</span>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)", marginRight: 8 }} />
                      </div>
                      {section.list.length === 0 ? (
                        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.25, paddingRight: 22 }}>لا يوجد</div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {section.list.map(coupon => (
                            <div key={coupon.id} className="coupon-card" style={{
                              background: "linear-gradient(145deg,#0E0C09,#111009)",
                              border: `1px solid ${section.accent}30`,
                              boxShadow: `inset 0 0 30px ${section.accent}06`,
                            }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: section.accent, letterSpacing: "2px" }}>{coupon.code}</span>
                                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${section.accent}18`, color: section.accent, fontWeight: 700 }}>
                                    {coupon.status === "valid" ? "صالح" : coupon.status === "used" ? "مستخدم" : "منتهي"}
                                  </span>
                                </div>
                                {coupon.status === "valid" && (
                                  <button
                                    onClick={() => copyCoupon(coupon.code)}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 5,
                                      padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(201,168,76,0.2)",
                                      background: copied === coupon.code ? "rgba(34,197,94,0.1)" : "rgba(201,168,76,0.08)",
                                      color: copied === coupon.code ? "#22c55e" : "#C9A84C",
                                      fontFamily: "Tajawal,sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer",
                                      transition: "all 0.2s",
                                    }}
                                  >
                                    {copied === coupon.code ? "✓ تم النسخ" : "📋 نسخ"}
                                  </button>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F5EFE0" }}>
                                  {coupon.type === "percent" ? `${coupon.value}% خصم` : `${coupon.value} ج.م خصم`}
                                </div>
                                {coupon.min_order > 0 && (
                                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.4 }}>
                                    حد أدنى {coupon.min_order.toLocaleString("ar-EG")} ج.م
                                  </div>
                                )}
                                {coupon.expires_at && (
                                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.4 }}>
                                    ينتهي {new Date(coupon.expires_at).toLocaleDateString("ar-EG")}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* NOTIFICATIONS */}
              {tab === "notifications" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {notifications.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                      <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F5EFE0", opacity: 0.3, margin: 0 }}>لا توجد إشعارات جديدة</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        {n.image ? (
                          <img src={n.image} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(201,168,76,0.12)" }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🔔</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F5EFE0" }}>{n.title}</div>
                            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.25, whiteSpace: "nowrap", marginRight: 12 }}>{timeAgo(n.created_at)}</span>
                          </div>
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.5, marginBottom: n.link ? 10 : 0, lineHeight: 1.5 }}>{n.body}</div>
                          {n.link && (
                            <Link href={n.link} style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#C9A84C",
                              textDecoration: "none", fontWeight: 700,
                              padding: "5px 12px", borderRadius: 7,
                              border: "1px solid rgba(201,168,76,0.18)",
                              background: "rgba(201,168,76,0.07)",
                            }}>
                              عرض المنتج ←
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PROFILE */}
              {tab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Info row */}
                  <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                      <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 17, fontWeight: 700, color: "#F5EFE0", margin: 0 }}>معلومات الحساب</h2>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(201,168,76,0.1)", color: "#C9A84C", fontWeight: 700 }}>👑 عضو ShahY</span>
                    </div>
                    {([
                      { label: "البريد الإلكتروني", value: session?.user?.email || "—", ltr: true },
                      {
                        label: "تاريخ التسجيل",
                        value: customer?.created_at
                          ? new Date(customer.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })
                          : "—",
                      },
                    ] as { label: string; value: string; ltr?: boolean }[]).map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.45 }}>{row.label}</span>
                        <span style={{ fontFamily: row.ltr ? "monospace" : "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F5EFE0", direction: row.ltr ? "ltr" : "rtl" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Edit form */}
                  <div className="card">
                    <h3 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, fontWeight: 700, color: "#F5EFE0", margin: "0 0 18px", paddingBottom: 14, borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                      تعديل البيانات الشخصية
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        { label: "الاسم الكامل", value: editName, setter: setEditName, placeholder: "اسمك الكامل", icon: "👤" },
                        { label: "رقم الهاتف", value: editPhone, setter: setEditPhone, placeholder: "01xxxxxxxxx", icon: "📱", ltr: true },
                      ].map(field => (
                        <div key={field.label}>
                          <label style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.5, marginBottom: 6, display: "block" }}>
                            {field.icon} {field.label}
                          </label>
                          <input
                            value={field.value}
                            onChange={e => field.setter(e.target.value)}
                            placeholder={field.placeholder}
                            dir={field.ltr ? "ltr" : "rtl"}
                            style={{
                              width: "100%", padding: "11px 14px", borderRadius: 10,
                              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.15)",
                              color: "#F5EFE0", fontFamily: "Tajawal,sans-serif", fontSize: 14,
                              outline: "none", boxSizing: "border-box",
                            }}
                          />
                        </div>
                      ))}

                      <div style={{ height: 1, background: "rgba(201,168,76,0.08)", margin: "4px 0" }} />
                      <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#C9A84C", margin: 0, opacity: 0.7 }}>
                        🔗 روابط السوشيال ميديا (اختياري)
                      </p>

                      {[
                        { label: "Instagram", value: editInstagram, setter: setEditInstagram, placeholder: "https://instagram.com/username", icon: "📸" },
                        { label: "Facebook", value: editFacebook, setter: setEditFacebook, placeholder: "https://facebook.com/username", icon: "👤" },
                        { label: "TikTok", value: editTiktok, setter: setEditTiktok, placeholder: "https://tiktok.com/@username", icon: "🎵" },
                      ].map(field => (
                        <div key={field.label}>
                          <label style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.45, marginBottom: 6, display: "block" }}>
                            {field.icon} {field.label}
                          </label>
                          <input
                            value={field.value}
                            onChange={e => field.setter(e.target.value)}
                            placeholder={field.placeholder}
                            dir="ltr"
                            style={{
                              width: "100%", padding: "10px 14px", borderRadius: 10,
                              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.1)",
                              color: "#F5EFE0", fontFamily: "monospace", fontSize: 13,
                              outline: "none", boxSizing: "border-box",
                            }}
                          />
                        </div>
                      ))}

                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          style={{
                            flex: 1, padding: "12px 0", borderRadius: 10,
                            background: saving ? "rgba(201,168,76,0.3)" : "linear-gradient(135deg,#C9A84C,#F0D882)",
                            border: "none", color: "#0A0806",
                            fontFamily: "Tajawal,sans-serif", fontSize: 15, fontWeight: 900,
                            cursor: saving ? "not-allowed" : "pointer",
                            transition: "opacity 0.2s",
                          }}
                        >
                          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                        </button>
                        {saveMsg && (
                          <span style={{
                            fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700,
                            color: saveMsg.ok ? "#22c55e" : "#ef4444",
                          }}>
                            {saveMsg.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Avatar upload hint */}
                  <div style={{ padding: "13px 18px", borderRadius: 10, background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)", textAlign: "center" }}>
                    <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.4, margin: 0, lineHeight: 1.7 }}>
                      📷 لتغيير صورة الحساب — اضغط على الصورة في أعلى الصفحة
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
