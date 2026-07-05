"use client"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { downloadAdminGuidePdf } from "@/lib/guidePdf"

const IMAGE_ENHANCE_PROMPT = `Enhance this car photo for a premium car dealership website called ELFADY.

Do NOT change the car itself in any way: keep its exact make, model, shape, proportions, color, badges, plate, and every real detail 100% unchanged. This must stay a truthful photo of the real car — no redesigning, no adding/removing parts, no changing the body color.

Apply these enhancements only:
1. Lighting: correct exposure so the car is evenly and naturally lit, remove harsh shadows, blown highlights, or dull flatness — make it look like a professional studio shoot.
2. Quality: increase sharpness, clarity, and resolution. Remove noise, blur, and compression artifacts. Photorealistic result, not artificial or painterly.
3. Background: completely and cleanly remove the original background (street, garage, wall, people, clutter — everything behind and around the car).
4. New backdrop: replace it with a seamless studio gradient background that fades from deep black (#0A0A0A) at the outer edges into a soft metallic silver-gray glow (#9BA3AA) directly behind the car, with a subtle, softly reflective dark floor beneath the wheels (like a high-end showroom floor, not a mirror).
5. Color grading: keep colors natural and true-to-life — no oversaturation, no unnatural filters.
6. Framing: keep the car centered and fully visible, same angle as the original photo, with clean edges suitable for a product gallery (square or landscape).

Output: one high-resolution, photorealistic image ready for an e-commerce car listing — consistent with a premium, minimalist, black-and-silver brand identity.`

// ── Shared mockup shell (illustrative fake UI, not a real screenshot) ───────
function MockShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div style={{ background: "#0A0A0A", border: "1px solid rgba(155,163,170,0.15)", borderRadius: 10, overflow: "hidden", fontSize: 11, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
      <div style={{ background: "#111111", borderBottom: "1px solid rgba(155,163,170,0.1)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#A5342C" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7d858c" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ae60" }} />
        <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.3)", marginRight: 8 }}>{title}</span>
      </div>
      {children}
    </div>
  )
}
function Badge({ color, text }: { color: string; text: string }) {
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontFamily: "Tajawal,sans-serif", background: `${color}22`, color, border: `1px solid ${color}44` }}>{text}</span>
}

function DashboardMockup() {
  return (
    <MockShell title="الداشبورد — ELFADY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[
            { label: "إجمالي الحجوزات", val: "47", icon: "🧾" },
            { label: "بانتظار التأكيد", val: "3", icon: "⏳", hl: true },
            { label: "سيارات نشطة", val: "18", icon: "🚗" },
            { label: "الإيرادات", val: "620,000 ج", icon: "💰" },
          ].map(s => (
            <div key={s.label} style={{ background: s.hl ? "rgba(155,163,170,0.1)" : "#111111", border: `1px solid ${s.hl ? "rgba(155,163,170,0.3)" : "rgba(155,163,170,0.08)"}`, borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(242,240,236,0.4)", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F2F0EC" }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111111", border: "1px solid rgba(155,163,170,0.08)", borderRadius: 8, padding: 10 }}>
          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(242,240,236,0.4)", marginBottom: 8 }}>آخر الحجوزات</div>
          {["أحمد محمد — تويوتا كورولا 2021", "سارة علي — هيونداي إلنترا 2020"].map(r => (
            <div key={r} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid rgba(155,163,170,0.06)", fontFamily: "Tajawal,sans-serif", color: "rgba(242,240,236,0.6)" }}>
              <span>{r}</span><Badge color="#9BA3AA" text="بانتظار التأكيد" />
            </div>
          ))}
        </div>
      </div>
    </MockShell>
  )
}

function ProductFormMockup() {
  return (
    <MockShell title="السيارات — تعديل">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          ["اسم السيارة", "تويوتا كورولا 2021"],
          ["الماركة / الموديل / السنة", "تويوتا / كورولا / 2021"],
          ["العداد (كم) / ناقل الحركة", "42,000 / أوتوماتيك"],
          ["درجة الحالة", "ممتازة"],
          ["السعر", "620,000 ج.م"],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", background: "#111111", border: "1px solid rgba(155,163,170,0.08)", borderRadius: 6, padding: "6px 10px" }}>
            <span style={{ fontFamily: "Tajawal,sans-serif", color: "rgba(242,240,236,0.4)" }}>{label}</span>
            <span style={{ fontFamily: "Tajawal,sans-serif", color: "#F2F0EC", fontWeight: 700 }}>{val}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <Badge color="#9BA3AA" text="📷 صور المعرض" />
          <Badge color="#C9CFD4" text="🔄 عارض 360°" />
        </div>
      </div>
    </MockShell>
  )
}

function FinancingMockup() {
  return (
    <MockShell title="التمويل والتقسيط — ELFADY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { icon: "💳", title: "تقسيط يصل حتى 60 شهر", sub: "بالتعاون مع البنوك الشريكة" },
          { icon: "💳", title: "مقدم يبدأ من 10%", sub: "على السيارات المؤهلة للتقسيط" },
          { icon: "💳", title: "موافقة سريعة", sub: "إجراءات تمويل مبسطة داخل المعرض" },
        ].map(p => (
          <div key={p.title} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111111", border: "1px solid rgba(155,163,170,0.08)", borderRadius: 8, padding: "8px 10px" }}>
            <span style={{ fontSize: 16 }}>{p.icon}</span>
            <div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, fontWeight: 700, color: "#F2F0EC" }}>{p.title}</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.4)" }}>{p.sub}</div>
            </div>
            <Badge color="#27ae60" text="نشط" />
          </div>
        ))}
      </div>
    </MockShell>
  )
}

interface Section { id: string; icon: string; title: string; steps: string[]; tips?: string[]; mockup?: React.ReactNode }

function ImageEnhancePromptCard() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(IMAGE_ENHANCE_PROMPT)
      setCopied(true)
      toast.success("تم نسخ البرومبت")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("تعذّر النسخ — انسخه يدويًا من الصندوق")
    }
  }

  return (
    <div style={{ background: "#0A0A0A", border: "1px solid rgba(155,163,170,0.15)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid rgba(155,163,170,0.1)" }}>
        <span style={{ fontSize: 12, color: "rgba(242,240,236,0.4)" }}>برومبت تحسين الصور — للنسخ في أي أداة صور بالذكاء الاصطناعي</span>
        <button onClick={copy} style={{
          fontSize: 12, fontWeight: 700, color: copied ? "#27ae60" : "#9BA3AA",
          background: "rgba(155,163,170,0.1)", border: "1px solid rgba(155,163,170,0.25)",
          padding: "5px 14px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
        }}>
          {copied ? "✓ تم النسخ" : "📋 نسخ"}
        </button>
      </div>
      <pre style={{
        margin: 0, padding: 16, fontSize: 12, lineHeight: 1.7, color: "rgba(242,240,236,0.7)",
        whiteSpace: "pre-wrap", direction: "ltr", textAlign: "left", fontFamily: "'Space Mono', monospace",
        maxHeight: 320, overflowY: "auto",
      }}>{IMAGE_ENHANCE_PROMPT}</pre>
    </div>
  )
}

const SECTIONS: Section[] = [
  {
    id: "dashboard", icon: "📊", title: "الداشبورد",
    steps: [
      "أول صفحة تفتح بعد تسجيل الدخول — نظرة سريعة على إجمالي الحجوزات، الحجوزات المعلّقة، السيارات النشطة، والإيرادات.",
      "قائمة \"آخر الحجوزات\" تاخدك مباشرة لتفاصيل أي حجز جديد.",
    ],
    mockup: <DashboardMockup />,
  },
  {
    id: "products", icon: "🚗", title: "السيارات (المستعملة)",
    steps: [
      "من /admin/products اضغط \"+ سيارة جديدة\" أو افتح سيارة موجودة للتعديل.",
      "املأ بيانات السيارة: الاسم، الماركة/الموديل/السنة، العداد، ناقل الحركة، نوع الوقود، درجة الحالة (جيدة / جيدة جدًا / ممتازة)، والسعر (مع سعر مقارنة اختياري لعرض الخصم).",
      "ارفع صور المعرض العادية من قسم \"الصور\" — الصورة الأولى هي الصورة الرئيسية في كل مكان بالموقع.",
      "لو متاح طقم صور دوران كامل للسيارة (12-24 صورة حوالين العربية، كل صورة بزاوية مختلفة)، ارفعها في قسم \"عارض 360°\" بنفس الترتيب — العارض هيظهر تلقائيًا في صفحة السيارة بدل المعرض العادي.",
      "الحالة (نشط / مسودة / مؤرشف) تتحكم في ظهور السيارة على الموقع — \"نشط\" فقط يظهر للعملاء.",
    ],
    tips: ["فعّل \"مميّز\" على السيارات اللي عايز تبرزها في الصفحة الرئيسية.", "سعر المقارنة (أعلى من السعر الحالي) بيظهر شرطة خصم تلقائيًا على كارت السيارة."],
    mockup: <ProductFormMockup />,
  },
  {
    id: "image-prep", icon: "✨", title: "تجهيز صور السيارات قبل الرفع (لهوية بصرية موحّدة)",
    steps: [
      "قبل ما ترفع أي صورة سيارة على الموقع، حسّنها الأول بأي أداة توليد/تحسين صور بالذكاء الاصطناعي (ChatGPT بالصور، Gemini، Photoroom، أو أي أداة مشابهة).",
      "الصق البرومبت الجاهز اللي تحت مع الصورة الأصلية للسيارة في الأداة.",
      "البرومبت بيخلّي كل الصور: إضاءة أحسن، جودة ووضوح أعلى، وخلفية استوديو متدرّجة من الأسود للفضي (نفس هوية الموقع) بدل الخلفية الأصلية — من غير ما يغيّر أي تفصيلة حقيقية في شكل العربية.",
      "بعد التحسين، ارفع الصورة الناتجة زي أي صورة عادية من قسم \"الصور\" أو \"عارض 360°\" في صفحة السيارة.",
      "النتيجة: كل صور المعرض تبقى متسقة بصريًا وبمظهر بريميوم موحّد، حتى لو الصور الأصلية اتصورت في أماكن وإضاءات مختلفة.",
    ],
    tips: ["كرّر نفس البرومبت مع كل صورة عشان الهوية البصرية تفضل موحّدة.", "احتفظ بالصورة الأصلية دايمًا قبل التحسين — ارفع النسخة المحسّنة فقط."],
    mockup: <ImageEnhancePromptCard />,
  },
  {
    id: "new-cars", icon: "🔍", title: "بوابة السيارات الجديدة",
    steps: [
      "هذه البوابة (/new) تعرض كتالوج سيارات جديدة حقيقي (ماركات وموديلات ومواصفات كاملة)، متزامن من قاعدة بيانات مخصصة، مع بحث ومقارنة ومفضلة للعميل.",
      "من /admin/cars-catalog: تقدر تخفي/تُظهر أي ماركة أو موديل أو سيارة، تضيف اسم عربي، تكتب ملاحظة داخلية، أو تضيف سيارة جديدة يدويًا.",
      "دور المعرض هنا هو الرد على استفسارات التوفر اللي بتوصل عبر واتساب من هذه البوابة.",
    ],
  },
  {
    id: "orders", icon: "🧾", title: "حجوزات المعاينة",
    steps: [
      "كل حجز معاينة بيوصل من الموقع يظهر في /admin/orders بحالة \"بانتظار التأكيد\".",
      "افتح الحجز، أكّد الميعاد مع العميل عبر واتساب، ثم حدّث الحالة: بانتظار التأكيد → تم تأكيد الموعد → تم التواصل → تمت المعاينة.",
      "العميل يقدر يتابع حالة حجزه بنفسه من صفحة /track برقم الحجز.",
    ],
  },
  {
    id: "home", icon: "🏠", title: "محتوى الصفحة الرئيسية",
    steps: [
      "من /admin/home تتحكم في كل محتوى الصفحة الرئيسية بدون لمس الكود: فيديو الهيرو ونصوصه، بطاقتَي البوابتين (جديدة/مستعملة)، شريط النص المتحرك، العنوان الفاصل، ركائز الثقة الثلاث، خطوات \"كيف نعمل\"، وفيديو قسم المعرض.",
      "أي تغيير هنا يظهر مباشرة على الموقع اللايف بعد الحفظ.",
    ],
  },
  {
    id: "categories", icon: "🏷️", title: "الأقسام (الماركات)",
    steps: [
      "كل \"قسم\" هنا يمثّل ماركة سيارة (تويوتا، هيونداي، كيا...) — تُستخدم لفلترة السيارات المستعملة بالماركة في /used.",
      "أضف قسمًا جديدًا بالاسم بالعربي، والـ slug يتولّد تلقائيًا.",
    ],
  },
  {
    id: "banners", icon: "🖼️", title: "البانرات والخصومات وعروض الفلاش والتقييمات",
    steps: [
      "البانرات: صور ترويجية تظهر في أماكن مخصصة بالموقع (سلايدر في الصفحة الرئيسية).",
      "الخصومات: أكواد خصم (نسبة أو مبلغ ثابت) يقدر العميل يستخدمها.",
      "التقييمات: مراجعات العملاء المعروضة في قسم الآراء بالصفحة الرئيسية — تقدر تضيف تقييمًا بنفسك (معتمد فورًا) أو توافق/تحذف تقييمات العملاء.",
      "هذه الأقسام اختيارية ولا تؤثر على عمل الموقع الأساسي إذا تُركت فارغة.",
    ],
  },
  {
    id: "financing", icon: "💳", title: "التمويل والتقسيط",
    steps: [
      "شريط متحرك في الصفحة الرئيسية يعرض عروض التمويل والتقسيط المتاحة — كل بطاقة لها عنوان، وصف اختياري، وشعار اختياري (شعار بنك/شركة تمويل لو حابب تحدد شريك بعينه).",
      "من /admin/financing-partners: أضف/عدّل/أخفِ/احذف أي عرض في أي وقت — الشريط بيختفي تلقائيًا لو مفيش عروض نشطة.",
      "عنوان الشريط نفسه (\"التمويل والتقسيط\") قابل للتعديل من /admin/home.",
    ],
    tips: ["البيانات المبدئية عبارة عن عروض عامة صادقة (تقسيط/مقدم/موافقة سريعة) وليست شراكات بنكية محددة — لو عندك اتفاق حقيقي مع بنك أو شركة تمويل، عدّل النص والشعار ليعكس الشريك الفعلي."],
    mockup: <FinancingMockup />,
  },
  {
    id: "people", icon: "🧑‍💼", title: "العملاء والصلاحيات والإعدادات",
    steps: [
      "العملاء: قائمة بكل من أنشأ حسابًا على الموقع.",
      "الصلاحيات: أضف حسابًا منفصلًا لكل شخص عنده صلاحية دخول اللوحة — لا تشارك كلمة مرور واحدة بين أكثر من شخص.",
      "الإعدادات: رقم الواتساب الرئيسي، اسم المتجر، العنوان، رابط خرائط جوجل، وروابط السوشيال (فيسبوك، إنستجرام المعرض، إنستجرام المدير) — كل دول بيظهروا في فوتر الموقع تلقائيًا فور الحفظ.",
    ],
  },
]

export default function AdminGuidePage() {
  const [open, setOpen] = useState<string>("dashboard")
  const [downloading, setDownloading] = useState(false)

  async function handleDownloadPdf() {
    if (downloading) return
    setDownloading(true)
    try {
      await downloadAdminGuidePdf()
    } catch (err) {
      console.error(err)
      toast.error("تعذر إنشاء ملف PDF. حاول مرة أخرى.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ direction: "rtl", fontFamily: "Tajawal, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#F2F0EC", margin: "0 0 8px" }}>دليل الأدمن</h1>
        <p style={{ fontSize: 14, color: "rgba(242,240,236,0.4)", margin: 0 }}>
          دليل شامل لإدارة معرض الفادي من لوحة التحكم — اضغط على أي قسم لعرض التفاصيل.
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin/guide/print" style={{ fontSize: 12, color: "#9BA3AA", textDecoration: "none", border: "1px solid rgba(155,163,170,0.3)", padding: "6px 14px", borderRadius: 8 }}>
            🖨️ نسخة للطباعة
          </Link>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            style={{ fontSize: 12, color: "#0A0A0A", background: "#9BA3AA", border: "none", cursor: downloading ? "default" : "pointer", opacity: downloading ? 0.7 : 1, padding: "6px 14px", borderRadius: 8, fontFamily: "Tajawal, sans-serif", fontWeight: 700 }}
          >
            {downloading ? "⏳ جارِ التحضير..." : "⬇️ تحميل PDF"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SECTIONS.map(s => {
          const isOpen = open === s.id
          return (
            <div key={s.id} style={{ background: "#111111", border: "1px solid rgba(155,163,170,0.1)", borderRadius: 12, overflow: "hidden" }}>
              <button
                onClick={() => setOpen(isOpen ? "" : s.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "right" }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#F2F0EC" }}>{s.title}</span>
                <span style={{ color: "#9BA3AA", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>‹</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 20px 20px", display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 320px" }}>
                    <ol style={{ margin: 0, paddingRight: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                      {s.steps.map((step, i) => (
                        <li key={i} style={{ fontSize: 13, color: "rgba(242,240,236,0.65)", lineHeight: 1.8 }}>{step}</li>
                      ))}
                    </ol>
                    {s.tips && (
                      <div style={{ marginTop: 14, background: "rgba(155,163,170,0.06)", border: "1px solid rgba(155,163,170,0.15)", borderRadius: 8, padding: 12 }}>
                        {s.tips.map((t, i) => (
                          <div key={i} style={{ fontSize: 12, color: "#9BA3AA", marginBottom: i < s.tips!.length - 1 ? 6 : 0 }}>💡 {t}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  {s.mockup && <div style={{ flex: "1 1 280px", maxWidth: 340 }}>{s.mockup}</div>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
