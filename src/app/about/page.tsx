import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

export const metadata: Metadata = {
  title: "عن معرض الفادي — قصتنا",
  description: "معرض الفادي لتجارة السيارات — المهندسين، شارع أحمد عرابي. سيارات مفحوصة، وضوح كامل في الحالة والسعر، ومعاينة حقيقية قبل أي قرار.",
}

export default function AboutPage() {
  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;700;800;900&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { from{background-position:200% center} to{background-position:-200% center} }
        .abt-fade { animation: fadeUp 0.9s cubic-bezier(0.2,0,0.2,1) both; }
        .tier-card { background:linear-gradient(145deg,#131313,#141414); border:1px solid rgba(155,163,170,0.1); border-radius:18px; padding:28px 24px; transition:all 0.35s ease; }
        .tier-card:hover { border-color:rgba(155,163,170,0.3); transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.5); }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", direction: "rtl" }}>

        {/* ── Hero ── */}
        <section style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 0%, #141414 0%, #0A0A0A 65%)",
          padding: "160px 40px 100px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }}
            viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
            <line x1="-50" y1="200" x2="900" y2="30" stroke="#A5342C" strokeWidth="0.5" opacity="0.2"/>
            <line x1="500" y1="800" x2="1500" y2="200" stroke="#A5342C" strokeWidth="0.5" opacity="0.15"/>
            <line x1="200" y1="-10" x2="1200" y2="650" stroke="#9BA3AA" strokeWidth="0.3" opacity="0.12"/>
          </svg>

          <div className="abt-fade" style={{ animationDelay: "0.1s", position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "7px", color: "#9BA3AA", opacity: 0.7, marginBottom: 28, textTransform: "uppercase" }}>
              ✦ &nbsp; our story &nbsp; ✦
            </div>
            <h1 style={{
              fontFamily: "Tajawal, sans-serif", fontStyle: "italic",
              fontSize: "clamp(38px,6vw,72px)", fontWeight: 700,
              background: "linear-gradient(135deg,#6E747A,#9BA3AA,#C9CFD4,#9BA3AA,#6E747A)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              animation: "shimmer 6s linear infinite",
              lineHeight: 1.25, margin: "0 0 28px",
            }}>
              كل سيارة عندنا،<br/>اخترناها كأنها لينا
            </h1>
            <p style={{
              fontFamily: "Tajawal, sans-serif", fontStyle: "italic",
              fontSize: "clamp(18px,2.5vw,24px)", color: "#F2F0EC", opacity: 0.55,
              lineHeight: 1.9, letterSpacing: "0.5px",
            }}>
              معرض الفادي لتجارة السيارات — المهندسين، شارع أحمد عرابي.<br/>وضوح كامل في الحالة والسعر، ومعاينة حقيقية قبل أي قرار.
            </p>
          </div>
        </section>

        {/* ── Story ── */}
        <section style={{ maxWidth: 820, margin: "0 auto", padding: "80px 40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>

            <div className="abt-fade" style={{ animationDelay: "0.2s" }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "5px", color: "#9BA3AA", opacity: 0.6, marginBottom: 20, textTransform: "uppercase" }}>
                — البداية
              </div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(17px,2.2vw,20px)", color: "#F2F0EC", opacity: 0.7, lineHeight: 2.1 }}>
                معرض الفادي بدأ من المهندسين كمحل ثقة بين الجيران قبل ما يبقى معرض. كل سيارة بتدخل المعرض بييجي صاحبها وهو عارف إنها هتتباع بسعرها الحقيقي، وكل عميل بيدخل بييجي وهو عارف إنه مش هيتفاجئ بحاجة مخفية.
              </p>
            </div>

            <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(155,163,170,0.2),transparent)" }} />

            <div className="abt-fade" style={{ animationDelay: "0.3s" }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "5px", color: "#9BA3AA", opacity: 0.6, marginBottom: 20, textTransform: "uppercase" }}>
                — المبدأ
              </div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(17px,2.2vw,20px)", color: "#F2F0EC", opacity: 0.7, lineHeight: 2.1 }}>
                شراء سيارة قرار كبير، ومش المفروض يتبني على صور مفلترة أو وصف ناقص.
                لذلك كل سيارة مستعملة عندنا بتتعرض بحالتها الحقيقية، بالكيلومترات الصحيحة، وبدرجة وضوح واحدة نلتزم بيها:
              </p>
              <blockquote style={{
                borderRight: "3px solid #9BA3AA", paddingRight: 24, marginTop: 28,
                fontFamily: "Tajawal,sans-serif", fontStyle: "italic",
                fontSize: "clamp(20px,2.5vw,26px)", color: "#9BA3AA",
                opacity: 0.85, lineHeight: 1.7,
              }}>
                "اللي هتشوفه في المعرض هو نفسه اللي هتاخده."
              </blockquote>
            </div>

            <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(155,163,170,0.2),transparent)" }} />

            <div className="abt-fade" style={{ animationDelay: "0.4s" }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "5px", color: "#9BA3AA", opacity: 0.6, marginBottom: 20, textTransform: "uppercase" }}>
                — اليوم
              </div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(17px,2.2vw,20px)", color: "#F2F0EC", opacity: 0.7, lineHeight: 2.1 }}>
                معرض الفادي اليوم بوابتين: سيارات مستعملة حقيقية موجودة في المعرض تقدر تحجز معاينتها فورًا، وتصفح للسيارات الجديدة بمواصفاتها وأسعارها للاستفسار عليها. كل ده وإحنا في نفس المكان اللي بدأنا منه — المهندسين، شارع أحمد عرابي.
              </p>
            </div>
          </div>
        </section>

        {/* ── Condition Grades ── */}
        <section style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, #121212 0%, #0A0A0A 100%)", padding: "80px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.6, marginBottom: 16, textTransform: "uppercase" }}>
                ✦ &nbsp; philosophy &nbsp; ✦
              </div>
              <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#F2F0EC", margin: 0 }}>
                درجات حالة السيارة — بوضوح، من غير مجاملة
              </h2>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                {
                  label: "جيدة", en: "GOOD", color: "#666", glow: "rgba(100,100,100,0.2)",
                  desc: "حالة جيدة ومناسبة للاستخدام اليومي، بكل تفاصيلها الحقيقية معروضة قبل ما تيجي تعاينها.",
                  icon: "🔧",
                },
                {
                  label: "جيدة جدًا", en: "VERY GOOD", color: "#A5342C", glow: "rgba(165,52,44,0.25)",
                  desc: "حالة جيدة جدًا، جاهزة للمعاينة والقيادة فورًا، صيانة دورية متابَعة.",
                  icon: "🛡️",
                },
                {
                  label: "ممتازة", en: "EXCELLENT", color: "#9BA3AA", glow: "rgba(155,163,170,0.25)",
                  desc: "حالة ممتازة، فحص شامل متاح عند الطلب. أقرب ما تكون لسيارة صفر.",
                  icon: "🏆",
                },
              ].map(t => (
                <div key={t.en} className="tier-card" style={{ flex: "1 1 280px", maxWidth: 340, boxShadow: `0 0 0 0 ${t.glow}` }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{t.icon}</div>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "4px", color: t.color, opacity: 0.8, marginBottom: 6, textTransform: "uppercase" }}>
                    {t.en}
                  </div>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 20, fontWeight: 800, color: "#F2F0EC", marginBottom: 14 }}>
                    {t.label}
                  </div>
                  <div style={{ height: 2, width: 40, background: `linear-gradient(90deg,${t.color},transparent)`, marginBottom: 16 }} />
                  <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.55, lineHeight: 1.9 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Promise ── */}
        <section style={{ padding: "100px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ fontSize: 36, marginBottom: 24 }}>🔑</div>
            <h2 style={{
              fontFamily: "Tajawal,sans-serif", fontStyle: "italic",
              fontSize: "clamp(26px,4vw,42px)", fontWeight: 700,
              color: "#F2F0EC", lineHeight: 1.5, marginBottom: 24,
            }}>
              كل سيارة عندنا، تستاهل تتشاف عن قرب.
            </h2>
            <div style={{ height: 1, width: 160, background: "linear-gradient(90deg,transparent,#9BA3AA,transparent)", margin: "0 auto 32px" }} />
            <a href="/used" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
              padding: "14px 36px", borderRadius: 8, textDecoration: "none",
              background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A",
              boxShadow: "0 8px 32px rgba(155,163,170,0.3)",
            }}>
              تصفح السيارات ✦
            </a>
          </div>
        </section>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
