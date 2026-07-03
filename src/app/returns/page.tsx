import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

export const metadata: Metadata = {
  title: "سياسة الاسترجاع والاستبدال — ShahY Store",
  description: "تعرف على سياسة الاسترجاع والاستبدال في ShahY Store وشروطها.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 700, color: "#9BA3AA", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ display: "inline-block", width: 3, height: 18, background: "#9BA3AA", borderRadius: 2, flexShrink: 0 }} />
        {title}
      </h2>
      <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F2F0EC", opacity: 0.62, lineHeight: 2.1 }}>
        {children}
      </div>
    </div>
  )
}

export default function ReturnsPage() {
  return (
    <>
      <StoreHeader />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        ul { padding-right: 20px; margin: 0; } li { margin-bottom: 8px; }
      `}</style>
      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 32px 100px" }}>
          <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.6, marginBottom: 16, textTransform: "uppercase" }}>
            ✦ &nbsp; RETURNS &nbsp; ✦
          </div>
          <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#F2F0EC", margin: "0 0 12px" }}>
            سياسة الاسترجاع والاستبدال
          </h1>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.35, marginBottom: 48 }}>
            آخر تحديث: يونيو 2025
          </p>

          <div style={{ height: 1, background: "linear-gradient(90deg,#9BA3AA33,transparent)", marginBottom: 48 }} />

          <Section title="حقك في الاسترجاع">
            نحن في ShahY Store نؤمن بحق العميل في الحصول على ما دفع ثمنه بالضبط.
            إذا وصل المنتج تالفاً أو مختلفاً عما طلبته، نضمن لك الاسترجاع الكامل أو الاستبدال الفوري دون أي تعقيد.
          </Section>

          <Section title="شروط القبول">
            <ul>
              <li>المنتج لم يُستخدم ولم تُفك عبوته الأصلية (لو كانت مغلفة).</li>
              <li>الإبلاغ عن المشكلة خلال <strong style={{ color: "#F2F0EC", opacity: 1 }}>48 ساعة</strong> من الاستلام.</li>
              <li>إرسال صور واضحة للمنتج والمشكلة عبر واتساب.</li>
              <li>الاحتفاظ بالفاتورة أو رقم الطلب.</li>
            </ul>
          </Section>

          <Section title="حالات الاسترجاع المقبولة">
            <ul>
              <li>وصول المنتج مكسوراً أو تالفاً أثناء الشحن.</li>
              <li>المنتج مختلف عن الصورة المعروضة (لون أو موديل آخر).</li>
              <li>خلل واضح في الصناعة أو التشطيب.</li>
            </ul>
          </Section>

          <Section title="حالات الاسترجاع غير المقبولة">
            <ul>
              <li>تغيير الرأي بعد الاستلام (ما عجبكيش).</li>
              <li>المنتجات التي وضحنا درجة جودتها بشكل كامل ووافقتِ عليها.</li>
              <li>أضرار ناتجة عن سوء الاستخدام.</li>
            </ul>
          </Section>

          <Section title="كيف تطلبي الاسترجاع؟">
            <ol style={{ paddingRight: 20, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>تواصلي معنا على واتساب: <strong style={{ color: "#9BA3AA", opacity: 1 }}>+20 101 583 5455</strong></li>
              <li style={{ marginBottom: 8 }}>أرسلي رقم طلبك + صور للمشكلة.</li>
              <li style={{ marginBottom: 8 }}>سنرد عليكِ خلال 4 ساعات عمل.</li>
              <li>نتفق على إعادة الشحن أو استرداد القيمة.</li>
            </ol>
          </Section>

          <Section title="مدة الاسترداد">
            بعد وصول المنتج إلينا وتأكيد المشكلة، يتم إرسال المنتج البديل خلال <strong style={{ color: "#F2F0EC", opacity: 1 }}>3-5 أيام عمل</strong>،
            أو استرداد القيمة عن طريق الطريقة المتفق عليها.
          </Section>

          <div style={{ marginTop: 48, padding: "24px", background: "rgba(155,163,170,0.05)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 14 }}>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.55, margin: 0, lineHeight: 1.9 }}>
              📱 للتواصل الفوري:{" "}
              <a href="https://wa.me/201555557745" target="_blank" rel="noopener noreferrer"
                style={{ color: "#25D366", textDecoration: "none", fontWeight: 700 }}>
                واتساب ShahY Store
              </a>
            </p>
          </div>
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
