import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات على أكثر الأسئلة شيوعاً حول ShahY Store — الشحن، الدفع، الجودة، والاسترجاع",
}

const FAQS = [
  {
    q: "ما هي مناطق الشحن المتاحة؟",
    a: "نشحن لكل محافظات مصر — القاهرة، الجيزة، الإسكندرية، والمحافظات الأخرى. مدة التوصيل من 2 إلى 5 أيام عمل.",
  },
  {
    q: "كيف يتم الدفع؟",
    a: "الدفع عند الاستلام (كاش) — تدفعي لما الشحنة توصلك. لا نأخذ أي دفع مقدم.",
  },
  {
    q: "ما الفرق بين الجودة بريميوم وميرور كواليتي وأصلي؟",
    a: "بريميوم: مواد عالية الجودة بتشطيب ممتاز مطابق للأصل تقريباً. ميرور كواليتي: نسخة طبق الأصل يصعب التفريق بينها وبين الأصلي. أصلي: منتج أصلي 100% بضمان كامل.",
  },
  {
    q: "هل يمكنني الاسترجاع أو الاستبدال؟",
    a: "نعم، خلال 7 أيام من تاريخ الاستلام في حالة وجود عيب مصنعي أو خطأ في الطلب. للتفاصيل الكاملة راجعي صفحة الاسترجاع والاستبدال.",
  },
  {
    q: "كيف أتتبع طلبي؟",
    a: "بعد تأكيد الطلب ستحصلين على رقم تتبع. يمكنك استخدامه في صفحة تتبع الطلبات أو التواصل معنا مباشرة على واتساب.",
  },
  {
    q: "هل المنتجات المعروضة متوفرة في المخزن؟",
    a: "نعم، كل المنتجات المعروضة متوفرة. في حالة نفاد أي منتج يُحذف تلقائياً من الموقع أو يُوضح عليه 'نفدت الكمية'.",
  },
  {
    q: "كيف يمكنني التواصل معكم؟",
    a: "عبر واتساب على الرقم 01015835455 — نرد في أسرع وقت ممكن من الساعة 10 صباحاً حتى 10 مساءً.",
  },
  {
    q: "هل يمكنني طلب منتج غير موجود في الموقع؟",
    a: "بالتأكيد — تواصلي معنا على واتساب وسنحاول توفير ما تحتاجينه أو نُرشدك لأقرب بديل متاح.",
  },
]

export default function FaqPage() {
  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Cinzel:wght@400&family=Playfair+Display:ital,wght@1,400&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: #0A0806; }
        .faq-item { border: 1px solid rgba(201,168,76,0.08); border-radius: 14px; padding: 22px 24px; background: linear-gradient(145deg,#0E0C09,#111009); transition: all 0.3s ease; }
        .faq-item:hover { border-color: rgba(201,168,76,0.2); }
      `}</style>

      <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 100px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "6px", color: "#C9A84C", opacity: 0.7, marginBottom: 16 }}>✦ &nbsp; FAQ &nbsp; ✦</div>
            <h1 style={{
              fontFamily: "Tajawal,sans-serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: 900,
              color: "#F5EFE0", margin: "0 0 12px",
            }}>
              الأسئلة الشائعة
            </h1>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(245,239,224,0.35)", margin: 0 }}>
              إجابات سريعة على أكثر الأسئلة شيوعاً
            </p>
            <div style={{ height: 1.5, width: 100, margin: "24px auto 0", background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />
          </div>

          {/* FAQs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Cinzel,serif", fontSize: 11, color: "#C9A84C", fontWeight: 700,
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
                      color: "#F5EFE0", margin: "0 0 10px", lineHeight: 1.5,
                    }}>
                      {faq.q}
                    </h3>
                    <p style={{
                      fontFamily: "Tajawal,sans-serif", fontSize: 13, lineHeight: 1.8,
                      color: "rgba(245,239,224,0.5)", margin: 0,
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            textAlign: "center", marginTop: 56,
            background: "linear-gradient(145deg,#0E0C09,#111009)",
            border: "1px solid rgba(201,168,76,0.12)", borderRadius: 16, padding: "32px 24px",
          }}>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "rgba(245,239,224,0.6)", margin: "0 0 20px" }}>
              لم تجدي إجابة لسؤالك؟
            </p>
            <a
              href={`https://wa.me/201015835455?text=${encodeURIComponent("السلام عليكم، عندي سؤال بخصوص...")}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
                padding: "12px 28px", borderRadius: 10, textDecoration: "none",
                background: "rgba(37,160,85,0.12)", color: "#25D366",
                border: "1px solid rgba(37,160,85,0.3)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
              </svg>
              تواصلي معنا على واتساب
            </a>
          </div>
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
