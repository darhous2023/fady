import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

export const metadata: Metadata = {
  title: "سياسة الخصوصية — معرض الفادي",
  description: "سياسة الخصوصية وحماية البيانات في معرض الفادي لتجارة السيارات.",
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

export default function PrivacyPage() {
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
            ✦ &nbsp; PRIVACY &nbsp; ✦
          </div>
          <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#F2F0EC", margin: "0 0 12px" }}>
            سياسة الخصوصية
          </h1>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.35, marginBottom: 48 }}>
            آخر تحديث: يوليو 2026
          </p>

          <div style={{ height: 1, background: "linear-gradient(90deg,#9BA3AA33,transparent)", marginBottom: 48 }} />

          <Section title="ما البيانات التي نجمعها؟">
            عند إرسال طلب حجز معاينة نجمع: الاسم، رقم الهاتف، والميعاد المفضل (لو حدّدته). هذه البيانات ضرورية فقط لتأكيد ميعاد المعاينة والتواصل معك.
          </Section>

          <Section title="كيف نستخدم بياناتك؟">
            <ul>
              <li>تأكيد طلب الحجز والتواصل معك لترتيب ميعاد المعاينة.</li>
              <li>تحسين خدمتنا وتجربتك في المعرض.</li>
              <li>لا نبيع ولا نشارك بياناتك مع أي طرف ثالث.</li>
            </ul>
          </Section>

          <Section title="أمان البيانات">
            جميع البيانات محفوظة على خوادم آمنة مشفرة. نستخدم بروتوكولات حماية حديثة ولا نحتفظ بأي معلومات مالية (لا أرقام بطاقات ولا حسابات).
          </Section>

          <Section title="ملفات الكوكيز">
            نستخدم ملفات كوكيز محدودة لتحسين أداء الموقع (مثل تذكر قائمة المعاينة). لا نستخدم كوكيز التتبع الإعلاني.
          </Section>

          <Section title="حقوقك">
            يمكنك في أي وقت طلب حذف بياناتك بالتواصل معنا عبر واتساب. سنستجيب خلال 48 ساعة.
          </Section>

          <Section title="التواصل">
            لأي استفسار حول خصوصيتك تواصل معنا:{" "}
            <a href="https://wa.me/201555557745" target="_blank" rel="noopener noreferrer"
              style={{ color: "#25D366", textDecoration: "none", fontWeight: 700 }}>
              واتساب معرض الفادي
            </a>
          </Section>
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
