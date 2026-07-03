import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

export const metadata: Metadata = {
  title: "سياسة الخصوصية — ShahY Store",
  description: "سياسة الخصوصية وحماية البيانات في ShahY Store.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 700, color: "#C9A84C", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ display: "inline-block", width: 3, height: 18, background: "#C9A84C", borderRadius: 2, flexShrink: 0 }} />
        {title}
      </h2>
      <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F5EFE0", opacity: 0.62, lineHeight: 2.1 }}>
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
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800&family=Cinzel:wght@400&display=swap');
        * { box-sizing: border-box; } body { margin: 0; background: #0A0806; }
        ul { padding-right: 20px; margin: 0; } li { margin-bottom: 8px; }
      `}</style>
      <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 32px 100px" }}>
          <div style={{ fontFamily: "Cinzel,sans-serif", fontSize: 9, letterSpacing: "6px", color: "#C9A84C", opacity: 0.6, marginBottom: 16, textTransform: "uppercase" }}>
            ✦ &nbsp; PRIVACY &nbsp; ✦
          </div>
          <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#F5EFE0", margin: "0 0 12px" }}>
            سياسة الخصوصية
          </h1>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.35, marginBottom: 48 }}>
            آخر تحديث: يونيو 2025
          </p>

          <div style={{ height: 1, background: "linear-gradient(90deg,#C9A84C33,transparent)", marginBottom: 48 }} />

          <Section title="ما البيانات التي نجمعها؟">
            عند تقديم طلب نجمع: الاسم، رقم الهاتف، المحافظة، والعنوان. هذه البيانات ضرورية فقط لإتمام عملية الشحن والتواصل معك.
          </Section>

          <Section title="كيف نستخدم بياناتك؟">
            <ul>
              <li>تأكيد الطلب والتواصل معك لترتيب التوصيل.</li>
              <li>تحسين خدمتنا وتجربتك في المتجر.</li>
              <li>لا نبيع ولا نشارك بياناتك مع أي طرف ثالث.</li>
            </ul>
          </Section>

          <Section title="أمان البيانات">
            جميع البيانات محفوظة على خوادم آمنة مشفرة. نستخدم بروتوكولات حماية حديثة ولا نحتفظ بأي معلومات مالية (لا أرقام بطاقات ولا حسابات).
          </Section>

          <Section title="ملفات الكوكيز">
            نستخدم ملفات كوكيز محدودة لتحسين أداء الموقع (مثل تذكر سلة التسوق). لا نستخدم كوكيز التتبع الإعلاني.
          </Section>

          <Section title="حقوقك">
            يمكنك في أي وقت طلب حذف بياناتك بالتواصل معنا عبر واتساب. سنستجيب خلال 48 ساعة.
          </Section>

          <Section title="التواصل">
            لأي استفسار حول خصوصيتك تواصل معنا:{" "}
            <a href="https://wa.me/201015835455" target="_blank" rel="noopener noreferrer"
              style={{ color: "#25D366", textDecoration: "none", fontWeight: 700 }}>
              واتساب ShahY Store
            </a>
          </Section>
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
