"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface FlashDeal {
  id: string
  slug: string
  name_ar: string
  price: number
  compare_at_price: number
  discount: number
  image: string | null
  quality_tier: string
}

interface FlashDealsProps {
  deals: FlashDeal[]
  title: string
  endsAt: string | null
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s, expired: false }
}

function pad(n: number) { return String(n).padStart(2, "0") }

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        background: "rgba(10,8,6,0.8)", border: "1px solid rgba(240,100,80,0.35)",
        borderRadius: 10, padding: "10px 14px", minWidth: 52, textAlign: "center",
        fontFamily: "Tajawal, sans-serif", fontSize: 28, fontWeight: 900, color: "#F5EFE0",
        lineHeight: 1, fontVariantNumeric: "tabular-nums",
      }}>
        {pad(value)}
      </div>
      <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 10, color: "rgba(245,239,224,0.45)", letterSpacing: "1px" }}>
        {label}
      </span>
    </div>
  )
}

export default function FlashDeals({ deals, title, endsAt }: FlashDealsProps) {
  const target = endsAt ? new Date(endsAt) : null
  const [time, setTime] = useState(target ? calcTimeLeft(target) : null)

  useEffect(() => {
    if (!target) return
    setTime(calcTimeLeft(target))
    const id = setInterval(() => setTime(calcTimeLeft(target)), 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt])

  if (!deals.length) return null
  if (time?.expired) return null

  return (
    <section style={{
      background: "linear-gradient(135deg, #1a0505 0%, #0f0202 40%, #0A0806 100%)",
      borderTop: "1px solid rgba(240,100,80,0.15)",
      borderBottom: "1px solid rgba(240,100,80,0.1)",
      padding: "56px 40px 64px",
      direction: "rtl",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Cinzel:wght@400&display=swap');
        @keyframes flashPulse {
          0%,100% { opacity:1; text-shadow: 0 0 20px rgba(240,100,80,0.6); }
          50%      { opacity:0.75; text-shadow: 0 0 40px rgba(240,100,80,0.9); }
        }
        @keyframes flashBgMove {
          0%   { transform: translate(-10%, -10%) rotate(0deg); }
          100% { transform: translate(10%, 10%) rotate(360deg); }
        }
        @keyframes flashSlide { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fd-card { transition: all 0.3s ease; text-decoration: none; display: block; }
        .fd-card:hover { transform: translateY(-6px); }
        .fd-card:hover .fd-img { transform: scale(1.07); }
        .fd-img { transition: transform 0.45s ease; width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
      `}</style>

      {/* Background glow orbs */}
      <div style={{
        position: "absolute", top: "-40%", right: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,40,40,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
        animation: "flashBgMove 20s linear infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-30%", left: "5%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,60,30,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, animation: "flashSlide 0.6s ease both" }}>
          <div style={{
            fontFamily: "Cinzel, serif", fontSize: 10, letterSpacing: "6px",
            color: "rgba(240,100,80,0.8)", textTransform: "uppercase", marginBottom: 12,
          }}>
            ✦ &nbsp; LIMITED TIME &nbsp; ✦
          </div>
          <h2 style={{
            fontFamily: "Tajawal, sans-serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 900,
            color: "#F5EFE0", margin: "0 0 8px",
            animation: "flashPulse 2.5s ease-in-out infinite",
          }}>
            ⚡ {title} ⚡
          </h2>

          {/* Countdown */}
          {time && !time.expired && (
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "Tajawal, sans-serif", fontSize: 12, color: "rgba(240,100,80,0.7)",
                letterSpacing: "2px", textTransform: "uppercase",
              }}>
                تنتهي خلال
              </span>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                {time.d > 0 && <CountdownBox value={time.d} label="يوم" />}
                {(time.d > 0 || time.h > 0) && (
                  <>
                    <CountdownBox value={time.h} label="ساعة" />
                    {time.d > 0 && (
                      <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900, color: "rgba(240,100,80,0.5)", paddingTop: 10 }}>:</div>
                    )}
                  </>
                )}
                <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900, color: "rgba(240,100,80,0.5)", paddingTop: 10 }}>:</div>
                <CountdownBox value={time.m} label="دقيقة" />
                <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900, color: "rgba(240,100,80,0.5)", paddingTop: 10 }}>:</div>
                <CountdownBox value={time.s} label="ثانية" />
              </div>
            </div>
          )}

          {/* Gold divider */}
          <div style={{
            height: 1.5, width: 160, margin: "24px auto 0",
            background: "linear-gradient(90deg, transparent, rgba(240,100,80,0.5), rgba(201,168,76,0.6), rgba(240,100,80,0.5), transparent)",
          }} />
        </div>

        {/* Product cards */}
        <div style={{
          display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center",
          animation: "flashSlide 0.7s ease 0.15s both",
        }}>
          {deals.map((deal, i) => (
            <Link key={deal.id} href={`/products/${deal.slug}`} className="fd-card"
              style={{ flex: "1 1 220px", maxWidth: 260 }}>
              <div style={{
                background: "linear-gradient(145deg, #120808, #0f0606)",
                border: "1px solid rgba(240,100,80,0.15)",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                animationDelay: `${i * 0.07}s`,
              }}>
                {/* Image */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  {deal.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={deal.image} alt={deal.name_ar} className="fd-img" loading="lazy" />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "1", background: "#1a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, opacity: 0.2 }}>🛍️</div>
                  )}
                  {/* Discount badge */}
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "linear-gradient(135deg, #C0392B, #E74C3C)",
                    color: "#fff", fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: 15,
                    padding: "4px 12px", borderRadius: 20,
                    boxShadow: "0 4px 16px rgba(192,57,43,0.5)",
                  }}>
                    خصم {deal.discount}٪
                  </div>
                  {/* ⚡ Flash badge */}
                  <div style={{
                    position: "absolute", top: 12, left: 12,
                    background: "rgba(10,8,6,0.85)", backdropFilter: "blur(4px)",
                    border: "1px solid rgba(240,100,80,0.3)",
                    fontFamily: "Tajawal, sans-serif", fontSize: 12,
                    padding: "3px 8px", borderRadius: 8, color: "rgba(240,100,80,0.9)",
                  }}>⚡ فلاش</div>
                  {/* Dark overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 60%, rgba(18,8,8,0.6) 100%)",
                  }} />
                </div>

                {/* Info */}
                <div style={{ padding: "14px 14px 16px" }}>
                  <p style={{
                    fontFamily: "Tajawal, sans-serif", fontSize: 14, fontWeight: 700,
                    color: "#F5EFE0", margin: "0 0 10px", lineHeight: 1.4,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {deal.name_ar}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{
                      fontFamily: "Tajawal, sans-serif", fontSize: 20, fontWeight: 900,
                      background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {deal.price.toLocaleString("ar-EG")} ج.م
                    </span>
                    <span style={{
                      fontFamily: "Tajawal, sans-serif", fontSize: 13,
                      color: "rgba(245,239,224,0.3)", textDecoration: "line-through",
                    }}>
                      {deal.compare_at_price.toLocaleString("ar-EG")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Link href="/sale" style={{
            fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 14,
            color: "rgba(240,100,80,0.8)", textDecoration: "none",
            border: "1px solid rgba(240,100,80,0.25)", padding: "10px 28px",
            borderRadius: 8, display: "inline-block", transition: "all 0.25s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "rgba(240,100,80,1)"
            e.currentTarget.style.borderColor = "rgba(240,100,80,0.5)"
            e.currentTarget.style.background = "rgba(240,100,80,0.08)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(240,100,80,0.8)"
            e.currentTarget.style.borderColor = "rgba(240,100,80,0.25)"
            e.currentTarget.style.background = "transparent"
          }}>
            عرض كل التخفيضات ←
          </Link>
        </div>
      </div>
    </section>
  )
}
