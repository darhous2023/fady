import type { Metadata } from "next"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

export const metadata: Metadata = {
  title: "دليل المعرض",
  description: "دليل شامل لكل ما يقدمه معرض الفادي لتجارة السيارات — السيارات الجديدة والمستعملة، درجات الحالة، الحجز، عارض 360°، والتواصل",
}

const CONDITION_GRADES = [
  { icon: "🔧", label: "جيدة", desc: "حالة جيدة ومناسبة للاستخدام اليومي، بسعر تنافسي." },
  { icon: "🛡️", label: "جيدة جدًا", desc: "حالة جيدة جدًا، جاهزة للمعاينة والقيادة فورًا." },
  { icon: "🏆", label: "ممتازة", desc: "حالة ممتازة، مع فحص شامل متاح عند الطلب." },
]

const BOOKING_STEPS = [
  { n: "01", title: "تصفّح", desc: "تصفّح السيارات المستعملة المتاحة فعليًا في المعرض، أو استكشف موديلات السيارات الجديدة عبر بوابة الاستعلام." },
  { n: "02", title: "احجز معاينة", desc: "اضغط \"احجز معاينة\" على السيارة التي تهمك — تُضاف لقائمة المعاينة الخاصة بك." },
  { n: "03", title: "أكّد بياناتك", desc: "من صفحة الحجز، أدخل اسمك ورقم موبايلك وميعادًا مفضلًا (اختياري) — فرع المعرض ثابت ومعروض مسبقًا." },
  { n: "04", title: "تواصل مباشر", desc: "سنتواصل معك عبر واتساب لتأكيد الموعد، أو راسلنا مباشرة في أي وقت." },
  { n: "05", title: "عاين واقرر", desc: "عاين السيارة شخصيًا في المعرض، جرّبها، واتخذ قرارك دون أي التزام مسبق." },
]

export default function GuidePage() {
  return (
    <>
      <StoreHeader />
      <style>{`
        * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        .g-card { border: 1px solid rgba(155,163,170,0.08); border-radius: 14px; background: linear-gradient(145deg,#131313,#141414); transition: border-color 0.3s ease; }
        .g-card:hover { border-color: rgba(155,163,170,0.2); }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 100px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 16 }}>✦ &nbsp; دليلك الشامل &nbsp; ✦</div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, color: "#F2F0EC", margin: "0 0 12px" }}>
              دليل معرض الفادي
            </h1>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(242,240,236,0.35)", margin: 0, maxWidth: 520, marginRight: "auto", marginLeft: "auto" }}>
              كل ما تحتاج معرفته قبل أول زيارة — من التصفح إلى المعاينة
            </p>
            <div style={{ height: 1.5, width: 100, margin: "24px auto 0", background: "linear-gradient(90deg,transparent,#9BA3AA,transparent)" }} />
          </div>

          {/* What we offer */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 700, color: "#9BA3AA", marginBottom: 20 }}>ماذا نقدّم</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
              <div className="g-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🚗</div>
                <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F2F0EC", margin: "0 0 8px" }}>سيارات مستعملة</h3>
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", lineHeight: 1.8, margin: "0 0 12px" }}>
                  كل سيارة معروضة على <Link href="/used" style={{ color: "#9BA3AA" }}>صفحة السيارات المستعملة</Link> موجودة فعليًا في المعرض — صور حقيقية، وحالة موثّقة.
                </p>
              </div>
              <div className="g-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F2F0EC", margin: "0 0 8px" }}>سيارات جديدة</h3>
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", lineHeight: 1.8, margin: "0 0 12px" }}>
                  بوابة <Link href="/new" style={{ color: "#9BA3AA" }}>الاستعلام عن الجديد</Link> تتيح تصفّح كل الماركات والموديلات والمواصفات، وطلب التوفر مباشرة على واتساب.
                </p>
              </div>
              <div className="g-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🔄</div>
                <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F2F0EC", margin: "0 0 8px" }}>مقايضة</h3>
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", lineHeight: 1.8, margin: 0 }}>
                  عندك سيارة قديمة؟ راسلنا ببياناتها على واتساب وسنقيّمها ونناقش إمكانية المقايضة أو الشراء.
                </p>
              </div>
            </div>
          </section>

          {/* Condition grades */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 700, color: "#9BA3AA", marginBottom: 20 }}>درجات حالة السيارة</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
              {CONDITION_GRADES.map(g => (
                <div key={g.label} className="g-card" style={{ padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{g.icon}</div>
                  <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F2F0EC", margin: "0 0 8px" }}>{g.label}</h3>
                  <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", lineHeight: 1.8, margin: 0 }}>{g.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Booking process */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 700, color: "#9BA3AA", marginBottom: 20 }}>كيف يتم الحجز؟</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {BOOKING_STEPS.map((s, i) => (
                <div key={s.n} style={{ display: "flex", gap: 20, padding: "18px 4px", borderBottom: i < BOOKING_STEPS.length - 1 ? "1px solid rgba(155,163,170,0.08)" : "none" }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color: "#9BA3AA", opacity: 0.5, flexShrink: 0, minWidth: 42 }}>{s.n}</div>
                  <div>
                    <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15, color: "#F2F0EC", margin: "0 0 6px" }}>{s.title}</h3>
                    <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 360 viewer */}
          <section style={{ marginBottom: 64 }}>
            <div className="g-card" style={{ padding: 28, display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ fontSize: 32 }}>🔄</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 700, color: "#F2F0EC", margin: "0 0 8px" }}>عارض 360°</h2>
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", lineHeight: 1.8, margin: 0 }}>
                  بعض السيارات متاح لها عارض دوران كامل 360° — اسحب بإصبعك أو بالماوس على صورة السيارة في صفحتها لتدويرها ومعاينتها من كل الزوايا قبل زيارة المعرض.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div style={{ textAlign: "center", background: "linear-gradient(145deg,#131313,#141414)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 16, padding: "32px 24px" }}>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "rgba(242,240,236,0.6)", margin: "0 0 20px" }}>
              جاهز تبدأ؟
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/used" style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 10, textDecoration: "none", background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>
                تصفّح السيارات
              </Link>
              <a
                href={`https://wa.me/201555557745?text=${encodeURIComponent("السلام عليكم، عندي سؤال بخصوص المعرض")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 10, textDecoration: "none", background: "rgba(37,160,85,0.12)", color: "#25D366", border: "1px solid rgba(37,160,85,0.3)" }}
              >
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
