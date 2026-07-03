"use client"

import { useEffect, useState } from "react"

interface Review {
  id: string
  customer_name: string
  rating: number
  comment_ar: string | null
  created_at: string
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= rating ? "#9BA3AA" : "none"}
          stroke={i <= rating ? "#9BA3AA" : "rgba(155,163,170,0.25)"}
          strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  )
}

export default function HomeReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reviews?featured=true")
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading || reviews.length === 0) return null

  return (
    <section style={{
      background: "#0A0A0A",
      padding: "64px 40px",
      direction: "rtl",
    }}>
      <style>{`
        @keyframes revFade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hr-card { transition: all 0.3s ease; }
        .hr-card:hover { transform: translateY(-3px); border-color: rgba(155,163,170,0.2) !important; }
        @media (max-width: 600px) {
          .hr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.65, marginBottom: 14 }}>
            ✦ &nbsp; CUSTOMER REVIEWS &nbsp; ✦
          </div>
          <h2 style={{
            fontFamily: "Tajawal, sans-serif", fontSize: "clamp(22px,4vw,32px)", fontWeight: 800,
            color: "#F2F0EC", margin: "0 0 8px",
          }}>
            ماذا تقول عميلاتنا؟
          </h2>
          <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "rgba(242,240,236,0.35)", margin: 0 }}>
            آراء حقيقية من عميلات ShahY
          </p>
        </div>

        {/* Grid */}
        <div className="hr-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {reviews.map((rev, i) => (
            <div key={rev.id} className="hr-card" style={{
              background: "linear-gradient(145deg, #131313, #141414)",
              border: "1px solid rgba(155,163,170,0.08)",
              borderRadius: 14, padding: "20px 20px 18px",
              animation: `revFade 0.5s ease ${i * 0.07}s both`,
            }}>
              {/* Stars + name */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <Stars rating={rev.rating} />
                  <div style={{
                    fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 13,
                    color: "#F2F0EC", marginTop: 8,
                  }}>
                    {rev.customer_name}
                  </div>
                </div>
                <div style={{
                  fontFamily: "Tajawal, sans-serif", fontSize: 28, color: "rgba(155,163,170,0.07)",
                  lineHeight: 1, marginTop: -4,
                }}>"</div>
              </div>

              {/* Comment */}
              {rev.comment_ar && (
                <p style={{
                  fontFamily: "Tajawal, sans-serif", fontSize: 13, lineHeight: 1.7,
                  color: "rgba(242,240,236,0.55)", margin: 0,
                  display: "-webkit-box", WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {rev.comment_ar}
                </p>
              )}

              {/* Gold accent bar */}
              <div style={{
                height: 2, width: 32, marginTop: 14,
                background: "linear-gradient(90deg, #9BA3AA, transparent)",
                borderRadius: 2,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
