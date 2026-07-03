import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات على أكثر الأسئلة شيوعاً حول معرض الفادي لتجارة السيارات — الحجز، المعاينة، درجات الحالة، والتواصل",
}

const FAQS = [
  {
    q: "إزاي أحجز معاينة لسيارة؟",
    a: "من صفحة السيارة اضغط \"احجز معاينة\"، هتتضاف لقائمة المعاينة، وبعدها تأكّد بياناتك في صفحة الحجز — هنتواصل معاك لتحديد الميعاد. أو ابعتلنا على واتساب مباشرة.",
  },
  {
    q: "هل السيارات المعروضة على الموقع موجودة فعليًا في المعرض؟",
    a: "نعم، كل سيارة مستعملة معروضة على الموقع موجودة فعليًا في معرض الفادي — المهندسين، شارع أحمد عرابي. تقدر تعاينها وتجربها بنفسك قبل أي قرار.",
  },
  {
    q: "إيه الفرق بين درجات الحالة (جيدة / جيدة جدًا / ممتازة)؟",
    a: "جيدة: حالة جيدة ومناسبة للاستخدام اليومي. جيدة جدًا: حالة جيدة جدًا وجاهزة للمعاينة والقيادة فورًا. ممتازة: حالة ممتازة مع فحص شامل متاح عند الطلب.",
  },
  {
    q: "هل السيارة بتتفحص قبل ما تتعرض؟",
    a: "نعم، وحالة كل سيارة موضّحة بوضوح في صفحتها — كيلومترات حقيقية، ناقل الحركة، نوع الوقود، ودرجة الحالة. الفحص الشامل متاح عند الطلب.",
  },
  {
    q: "إزاي أشوف السيارات الجديدة (0 كم)؟",
    a: "من بوابة \"سيارات جديدة\" تقدر تتصفح الماركات والموديلات والمواصفات، وتتواصل معنا مباشرة على واتساب للاستفسار عن السعر والتوفر.",
  },
  {
    q: "إزاي أتابع حالة طلب الحجز بتاعي؟",
    a: "من صفحة \"تتبع الحجز\" برقم الطلب اللي وصلك بعد إرسال الطلب، أو تواصل معنا مباشرة على واتساب في أي وقت.",
  },
  {
    q: "هل ينفع أقايض عربيتي القديمة؟",
    a: "تواصل معنا على واتساب ببيانات عربيتك، وهنقيّمها ونناقش إمكانية المقايضة أو الشراء.",
  },
  {
    q: "إزاي أتواصل معاكم؟",
    a: "عبر واتساب على الرقم 201555557745 — هنرد في أقرب وقت ممكن.",
  },
]

export default function FaqPage() {
  return (
    <>
      <StoreHeader />
      <style>{`
                * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        .faq-item { border: 1px solid rgba(155,163,170,0.08); border-radius: 14px; padding: 22px 24px; background: linear-gradient(145deg,#131313,#141414); transition: all 0.3s ease; }
        .faq-item:hover { border-color: rgba(155,163,170,0.2); }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 100px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 16 }}>✦ &nbsp; FAQ &nbsp; ✦</div>
            <h1 style={{
              fontFamily: "Tajawal,sans-serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: 900,
              color: "#F2F0EC", margin: "0 0 12px",
            }}>
              الأسئلة الشائعة
            </h1>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(242,240,236,0.35)", margin: 0 }}>
              إجابات سريعة على أكثر الأسئلة شيوعاً
            </p>
            <div style={{ height: 1.5, width: 100, margin: "24px auto 0", background: "linear-gradient(90deg,transparent,#9BA3AA,transparent)" }} />
          </div>

          {/* FAQs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    background: "rgba(155,163,170,0.1)", border: "1px solid rgba(155,163,170,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#9BA3AA", fontWeight: 700,
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
                      color: "#F2F0EC", margin: "0 0 10px", lineHeight: 1.5,
                    }}>
                      {faq.q}
                    </h3>
                    <p style={{
                      fontFamily: "Tajawal,sans-serif", fontSize: 13, lineHeight: 1.8,
                      color: "rgba(242,240,236,0.5)", margin: 0,
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
            background: "linear-gradient(145deg,#131313,#141414)",
            border: "1px solid rgba(155,163,170,0.12)", borderRadius: 16, padding: "32px 24px",
          }}>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "rgba(242,240,236,0.6)", margin: "0 0 20px" }}>
              لم تجد إجابة لسؤالك؟
            </p>
            <a
              href={`https://wa.me/201555557745?text=${encodeURIComponent("السلام عليكم، عندي سؤال بخصوص...")}`}
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
              تواصل معنا على واتساب
            </a>
          </div>
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
