"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Review {
  id: string
  customer_name: string
  rating: number
  comment_ar: string | null
  created_at: string
}

function StarRating({ rating, interactive = false, onRate }: {
  rating: number
  interactive?: boolean
  onRate?: (r: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(s)}
          style={{
            fontSize: interactive ? 26 : 14,
            color: s <= (hover || rating) ? "#F0D882" : "#2a2520",
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.15s ease",
            lineHeight: 1,
          }}>★</span>
      ))}
    </div>
  )
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const [reviewsList, setReviewsList] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(r => r.json())
      .then(data => { setReviewsList(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [productId])

  const avg = reviewsList.length
    ? reviewsList.reduce((s, r) => s + r.rating, 0) / reviewsList.length
    : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { toast.error("اختر عدد النجوم"); return }
    if (!name.trim()) { toast.error("اكتب اسمك"); return }

    setSubmitting(true)
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, customer_name: name, rating, comment_ar: comment }),
    })
    setSubmitting(false)
    if (res.ok) {
      setSubmitted(true)
      setName(""); setRating(0); setComment("")
    } else {
      toast.error("حدث خطأ، حاول مرة أخرى")
    }
  }

  return (
    <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: 64, marginTop: 64, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700&family=Cinzel:wght@400&display=swap');
        .rev-input { width:100%; background:#0E0C09; border:1px solid rgba(201,168,76,0.18); border-radius:10px; padding:12px 16px; color:#F5EFE0; font-family:Tajawal,sans-serif; font-size:14px; outline:none; transition:border-color 0.2s; }
        .rev-input:focus { border-color:rgba(201,168,76,0.5); }
        .rev-input::placeholder { color:rgba(245,239,224,0.2); }
        .rev-card { background:linear-gradient(145deg,#0E0C09,#111009); border:1px solid rgba(201,168,76,0.08); border-radius:14px; padding:20px; transition:border-color 0.3s; }
        .rev-card:hover { border-color:rgba(201,168,76,0.18); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.2))" }} />
        <span style={{ fontFamily: "Cinzel,serif", fontSize: 10, letterSpacing: "5px", color: "#C9A84C", opacity: 0.7, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          ✦ آراء العملاء ✦
        </span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(201,168,76,0.2),transparent)" }} />
      </div>

      {/* Stats row */}
      {reviewsList.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 48, fontWeight: 900, color: "#C9A84C", lineHeight: 1 }}>
              {avg.toFixed(1)}
            </div>
            <StarRating rating={Math.round(avg)} />
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.35, marginTop: 4 }}>
              {reviewsList.length} تقييم
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {[5,4,3,2,1].map(s => {
              const count = reviewsList.filter(r => r.rating === s).length
              const pct = reviewsList.length ? (count / reviewsList.length) * 100 : 0
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.4, minWidth: 8 }}>{s}</span>
                  <span style={{ color: "#F0D882", fontSize: 10 }}>★</span>
                  <div style={{ flex: 1, height: 5, background: "#1a1610", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#C9A84C,#F0D882)", borderRadius: 3, transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#F5EFE0", opacity: 0.3, minWidth: 16 }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Reviews list */}
        <div style={{ flex: "1 1 400px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#C9A84C", opacity: 0.4 }}>
              <div style={{ display: "inline-block", width: 20, height: 20, border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            </div>
          ) : reviewsList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>💬</div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.3 }}>
                لم يترك أحد تقييماً بعد — كن الأول!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {reviewsList.map(r => (
                <div key={r.id} className="rev-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, color: "#F5EFE0" }}>{r.customer_name}</span>
                      <div style={{ marginTop: 3 }}>
                        <StarRating rating={r.rating} />
                      </div>
                    </div>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", opacity: 0.25 }}>
                      {new Date(r.created_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  {r.comment_ar && (
                    <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.6, lineHeight: 1.8, margin: 0 }}>
                      {r.comment_ar}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>

        {/* Submit form */}
        <div style={{ flex: "0 0 320px", minWidth: 260 }}>
          <div style={{ background: "linear-gradient(145deg,#0E0C09,#111009)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 16, padding: "24px 20px" }}>
            <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F5EFE0", marginBottom: 20, borderBottom: "1px solid rgba(201,168,76,0.08)", paddingBottom: 12 }}>
              {submitted ? "شكراً لك! 🌟" : "اترك تقييمك"}
            </h3>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.55, lineHeight: 1.8 }}>
                  تم إرسال تقييمك بنجاح وسيظهر بعد المراجعة.
                </p>
                <button onClick={() => setSubmitted(false)}
                  style={{ marginTop: 16, background: "none", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C", fontFamily: "Tajawal,sans-serif", fontSize: 12, padding: "7px 16px", borderRadius: 8, cursor: "pointer" }}>
                  إضافة تقييم آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Stars */}
                <div>
                  <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.5, marginBottom: 8 }}>تقييمك *</label>
                  <StarRating rating={rating} interactive onRate={setRating} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.5, marginBottom: 6 }}>اسمك *</label>
                  <input className="rev-input" required placeholder="مثال: سارة م." value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", opacity: 0.5, marginBottom: 6 }}>تعليقك (اختياري)</label>
                  <textarea className="rev-input" rows={3} placeholder="رأيك في المنتج..." value={comment} onChange={e => setComment(e.target.value)}
                    style={{ resize: "vertical", minHeight: 72 }} />
                </div>
                <button type="submit" disabled={submitting}
                  style={{
                    background: "linear-gradient(135deg,#C9A84C,#F0D882)", color: "#0A0806",
                    fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
                    padding: "12px", borderRadius: 10, border: "none", cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1, transition: "opacity 0.2s",
                  }}>
                  {submitting ? "جاري الإرسال..." : "إرسال التقييم ✦"}
                </button>
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#F5EFE0", opacity: 0.2, textAlign: "center" }}>
                  يظهر تقييمك بعد المراجعة خلال 24 ساعة
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
