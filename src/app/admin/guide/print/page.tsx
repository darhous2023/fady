"use client"
import { useEffect } from "react"

const SECTIONS = [
  {
    title: "الداشبورد", icon: "📊",
    items: ["نظرة عامة سريعة: إجمالي الحجوزات، الحجوزات المعلّقة، السيارات النشطة، والإيرادات.", "آخر الحجوزات تظهر مباشرة أسفل الأرقام."],
  },
  {
    title: "السيارات (المستعملة)", icon: "🚗",
    items: [
      "أضف/عدّل سيارة: الاسم، الماركة/الموديل/السنة، العداد، ناقل الحركة، نوع الوقود، درجة الحالة، والسعر.",
      "ارفع صور المعرض من قسم \"الصور\" — أول صورة هي الصورة الرئيسية.",
      "لو متاح طقم صور دوران (12-24 صورة)، ارفعه في قسم \"عارض 360°\" ليظهر تلقائيًا في صفحة السيارة.",
      "الحالة \"نشط\" فقط تظهر السيارة للعملاء على الموقع.",
    ],
  },
  {
    title: "تجهيز صور السيارات قبل الرفع", icon: "✨",
    items: [
      "حسّن كل صورة سيارة بأداة صور بالذكاء الاصطناعي قبل رفعها (البرومبت الجاهز موجود في /admin/guide، قسم \"تجهيز صور السيارات\").",
      "النتيجة: إضاءة أحسن، جودة أعلى، وخلفية استوديو موحّدة (أسود إلى فضي) بدون تغيير أي تفصيلة حقيقية في السيارة.",
    ],
  },
  {
    title: "بوابة السيارات الجديدة", icon: "🔍",
    items: ["بيانات حية من مصدر خارجي — لا تحتاج إدارة يدوية. دورك: الرد على استفسارات واتساب الواردة منها.", "من /admin/cars-catalog: تقدر تخفي/تُظهر أي ماركة أو موديل أو سيارة."],
  },
  {
    title: "حجوزات المعاينة", icon: "🧾",
    items: [
      "كل حجز يبدأ بحالة \"بانتظار التأكيد\".",
      "أكّد الميعاد مع العميل عبر واتساب وحدّث الحالة: بانتظار التأكيد → تم تأكيد الموعد → تم التواصل → تمت المعاينة.",
      "العميل يتابع حجزه من /track برقم الحجز.",
    ],
  },
  {
    title: "محتوى الصفحة الرئيسية", icon: "🏠",
    items: ["من /admin/home: فيديو الهيرو، البوابتين، شريط النص المتحرك، ركائز الثقة، خطوات العمل، وفيديو المعرض — كل حاجة قابلة للتعديل فورًا."],
  },
  {
    title: "الأقسام والبانرات والخصومات", icon: "🏷️",
    items: ["الأقسام = ماركات السيارات (للفلترة في /used).", "البانرات والخصومات وعروض الفلاش والتقييمات أقسام اختيارية إضافية."],
  },
  {
    title: "التمويل والتقسيط", icon: "💳",
    items: ["شريط متحرك بالصفحة الرئيسية لعروض التمويل — أضف/عدّل/احذف من /admin/financing-partners.", "يختفي تلقائيًا لو مفيش عروض نشطة."],
  },
  {
    title: "العملاء والصلاحيات والإعدادات", icon: "🧑‍💼",
    items: [
      "أضف حسابًا منفصلًا لكل شخص عنده صلاحية دخول — لا تشارك كلمة مرور واحدة.",
      "رقم الواتساب الرئيسي وبيانات عامة أخرى من قسم الإعدادات.",
      "قسم \"حماية الموقع\": حدود محاولات الطلبات (دخول، حجز، تتبّع، بحث...) قابلة للتعديل بالكامل من هنا.",
    ],
  },
]

export default function AdminGuidePrintPage() {
  useEffect(() => { document.title = "دليل الأدمن — ELFADY" }, [])

  return (
    <div style={{ fontFamily: "Tajawal, sans-serif", direction: "rtl", background: "#fff", color: "#111", minHeight: "100vh", padding: "40px 48px" }}>
      <style>{`
        @media print { .no-print { display: none !important; } body { background: #fff; } }
        .section { break-inside: avoid; margin-bottom: 22px; }
      `}</style>

      <button
        className="no-print"
        onClick={() => window.print()}
        style={{ position: "fixed", bottom: 28, left: 28, background: "#9BA3AA", color: "#0A0A0A", border: "none", borderRadius: 50, padding: "12px 24px", fontFamily: "Tajawal,sans-serif", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}
      >
        🖨️ طباعة / حفظ PDF
      </button>

      <div style={{ textAlign: "center", marginBottom: 36, borderBottom: "2px solid #9BA3AA", paddingBottom: 20 }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>ELFADY — دليل الأدمن</div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>معرض الفادي لتجارة السيارات — نسخة مرجعية سريعة</div>
      </div>

      {SECTIONS.map(s => (
        <div key={s.title} className="section">
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span>{s.icon}</span>{s.title}
          </div>
          <ul style={{ margin: 0, paddingRight: 22 }}>
            {s.items.map((it, i) => (
              <li key={i} style={{ fontSize: 13, lineHeight: 1.8, color: "#333", marginBottom: 4 }}>{it}</li>
            ))}
          </ul>
        </div>
      ))}

      <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #ddd", textAlign: "center", fontSize: 11, color: "#999" }}>
        elfady.vercel.app — Designed &amp; Developed by Ahmed Darhous
      </div>
    </div>
  )
}
