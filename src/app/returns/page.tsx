import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

export const metadata: Metadata = {
  title: "سياسة الحجز والإلغاء — معرض الفادي",
  description: "تعرف على سياسة حجز معاينة السيارات وإلغائها في معرض الفادي لتجارة السيارات.",
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

export default function BookingPolicyPage() {
  return (
    <>
      <StoreHeader />
      <style>{`
                * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        ul, ol { padding-right: 20px; margin: 0; } li { margin-bottom: 8px; }
      `}</style>
      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 32px 100px" }}>
          <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 9, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.6, marginBottom: 16, textTransform: "uppercase" }}>
            ✦ &nbsp; BOOKING POLICY &nbsp; ✦
          </div>
          <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#F2F0EC", margin: "0 0 12px" }}>
            سياسة الحجز والإلغاء
          </h1>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.35, marginBottom: 48 }}>
            آخر تحديث: يوليو 2026
          </p>

          <div style={{ height: 1, background: "linear-gradient(90deg,#9BA3AA33,transparent)", marginBottom: 48 }} />

          <Section title="حجز المعاينة — بدون أي التزام">
            طلب حجز معاينة سيارة عبر الموقع مجاني تمامًا ولا يُلزمك بأي شراء.
            الهدف منه إننا نأكد ميعادك ونجهّز السيارة عشان تشوفها وتجربها بدون أي انتظار.
          </Section>

          <Section title="تأجيل أو إلغاء الحجز">
            <ul>
              <li>تقدر تلغي أو تأجّل ميعاد المعاينة في أي وقت من غير أي رسوم.</li>
              <li>كل اللي يلزم إنك تبعتلنا رسالة على واتساب برقم الطلب أو اسمك ورقم موبايلك.</li>
              <li>لو محتاج ميعاد تاني، هنرتّبه معاك على طول.</li>
            </ul>
          </Section>

          <Section title="بعد المعاينة">
            الموقع بيسهّل عليك حجز ميعاد المعاينة بس — أي اتفاق على الشراء أو التفاوض على السعر بيتم شخصيًا في المعرض بعد ما تشوف السيارة وتتأكد إنها مناسبة ليك.
          </Section>

          <Section title="لو غيّرت رأيك">
            عادي تمامًا. سواء قبل الميعاد أو بعد ما تعاين السيارة وتقرر إنها مش مناسبة، مفيش أي التزام أو تكلفة عليك.
          </Section>

          <div style={{ marginTop: 48, padding: "24px", background: "rgba(155,163,170,0.05)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 14 }}>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.55, margin: 0, lineHeight: 1.9 }}>
              📱 لتعديل أو إلغاء ميعاد المعاينة:{" "}
              <a href="https://wa.me/201555557745" target="_blank" rel="noopener noreferrer"
                style={{ color: "#25D366", textDecoration: "none", fontWeight: 700 }}>
                واتساب معرض الفادي
              </a>
            </p>
          </div>
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
