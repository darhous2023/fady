"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

function ConfirmContent() {
  const params = useSearchParams()
  const orderNumber = params.get("order") ?? ""

  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
      <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 16 }}>
        ✦ &nbsp; BOOKING CONFIRMED &nbsp; ✦
      </div>
      <h1 style={{
        fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 800,
        background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        margin: "0 0 16px",
      }}>
        تم استلام طلب الحجز!
      </h1>
      {orderNumber && (
        <div style={{
          fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F2F0EC", opacity: 0.5, marginBottom: 32,
        }}>
          رقم الطلب: <span style={{ color: "#9BA3AA", fontWeight: 700, opacity: 1 }}>{orderNumber}</span>
        </div>
      )}
      <div style={{
        background: "rgba(155,163,170,0.06)", border: "1px solid rgba(155,163,170,0.12)",
        borderRadius: 14, padding: "24px 28px", maxWidth: 420, margin: "0 auto 32px",
      }}>
        <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F2F0EC", opacity: 0.6, lineHeight: 1.9, margin: 0 }}>
          سنتواصل معك قريباً على رقمك لتأكيد ميعاد المعاينة.
          يمكنك أيضاً إخطارنا بطلبك مباشرةً عبر واتساب لأسرع استجابة.
        </p>
      </div>

      {/* Primary CTA: notify admin via WA */}
      {orderNumber && (
        <div style={{ maxWidth: 380, margin: "0 auto 16px" }}>
          <a href={`https://wa.me/201555557745?text=${encodeURIComponent(`🚗 طلب حجز معاينة جديد — معرض الفادي\n\nرقم الطلب: ${orderNumber}\n\nأرجو تأكيد استلام الطلب. شكراً`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%",
              fontFamily: "Tajawal,sans-serif", fontWeight: 800, fontSize: 15,
              padding: "14px 28px", borderRadius: 10, textDecoration: "none",
              background: "linear-gradient(135deg,rgba(37,211,102,0.15),rgba(37,211,102,0.08))",
              border: "1px solid rgba(37,211,102,0.4)", color: "#25D366",
              boxShadow: "0 4px 20px rgba(37,211,102,0.1)",
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
            </svg>
            أبلغ الأدمن بطلبك
          </a>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href={`/track${orderNumber ? `?n=${encodeURIComponent(orderNumber)}` : ""}`} style={{
          fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
          padding: "11px 24px", borderRadius: 8, textDecoration: "none",
          background: "transparent", color: "#9BA3AA",
          border: "1px solid rgba(155,163,170,0.3)",
        }}>
          🔍 تتبّع حالة الحجز
        </Link>
        <Link href="/" style={{
          fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
          padding: "11px 24px", borderRadius: 8, textDecoration: "none",
          background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A",
        }}>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
      `}</style>
      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Suspense fallback={<div style={{ fontFamily: "Tajawal,sans-serif", color: "#9BA3AA", textAlign: "center", padding: 60 }}>...</div>}>
          <ConfirmContent />
        </Suspense>
      </main>
      <StoreFooter />
    </>
  )
}
