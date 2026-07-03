"use client"

// ─── Shared primitive helpers ────────────────────────────────────────────────
const G = "#C9A84C"

function Frame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", marginTop: 4 }}>
      <div style={{ background: "#f0f0f0", padding: "6px 12px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", gap: 6 }}>
        {["#ff5f57", "#ffbd2e", "#28ca41"].map(c => (
          <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />
        ))}
        <span style={{ fontSize: 9, color: "#999", marginRight: 8, fontFamily: "monospace" }}>
          your-store.vercel.app{url}
        </span>
      </div>
      <div style={{ padding: "12px 14px", background: "#fafafa", fontFamily: "Tajawal, sans-serif", fontSize: 11 }}>
        {children}
      </div>
    </div>
  )
}

function Badge({ color, text }: { color: string; text: string }) {
  return (
    <span style={{ padding: "1px 8px", borderRadius: 12, fontSize: 9, fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}44`, whiteSpace: "nowrap" }}>
      {text}
    </span>
  )
}

function Btn({ text, primary }: { text: string; primary?: boolean }) {
  return (
    <span style={{ padding: "4px 12px", borderRadius: 5, fontSize: 10, background: primary ? G : "transparent", color: primary ? "#0A0806" : G, border: `1px solid ${G}${primary ? "" : "60"}`, fontWeight: 700, display: "inline-block", cursor: "pointer" }}>
      {text}
    </span>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", width: 32, height: 16, borderRadius: 8, background: on ? "#27ae60" : "#ccc", padding: 1, justifyContent: on ? "flex-end" : "flex-start", flexShrink: 0 }}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: "white" }} />
    </span>
  )
}

function TRow({ cells, head }: { cells: React.ReactNode[]; head?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #eee", background: head ? "#f5f5f5" : "white" }}>
      {cells.map((c, i) => (
        <div key={i} style={{ flex: i === 0 ? 2 : 1, padding: "5px 8px", fontSize: head ? 9 : 10, fontWeight: head ? 700 : 400, color: head ? "#666" : "#333", borderLeft: i > 0 ? "1px solid #eee" : "none", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {c}
        </div>
      ))}
    </div>
  )
}

function FRow({ label, value, toggle }: { label: string; value?: string; toggle?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: "1px solid #f0f0f0" }}>
      <span style={{ flex: "0 0 130px", fontSize: 10, color: "#666", textAlign: "right" }}>{label}</span>
      {toggle !== undefined ? (
        <Toggle on={toggle} />
      ) : (
        <div style={{ flex: 1, background: "white", border: "1px solid #d8d8d8", borderRadius: 5, padding: "3px 8px", fontSize: 10, color: "#444" }}>{value}</div>
      )}
    </div>
  )
}

// ─── Section mockups ─────────────────────────────────────────────────────────

function DashMockup() {
  return (
    <Frame url="/admin/dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
        {[
          { icon: "🧾", label: "إجمالي الطلبات", val: "47" },
          { icon: "⏳", label: "معلّقة", val: "3", hl: true },
          { icon: "📦", label: "منتجات نشطة", val: "28" },
          { icon: "💰", label: "المبيعات", val: "12,400 ج" },
        ].map(c => (
          <div key={c.label} style={{ border: `1px solid ${c.hl ? G + "70" : "#e0e0e0"}`, background: c.hl ? "#fffbf0" : "white", borderRadius: 6, padding: 8, textAlign: "center" }}>
            <div style={{ fontSize: 14 }}>{c.icon}</div>
            <div style={{ fontSize: 8, color: "#888", marginTop: 2 }}>{c.label}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: c.hl ? "#b8860b" : "#222", marginTop: 1 }}>{c.val}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#555", marginBottom: 4 }}>آخر الطلبات</div>
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
        <TRow cells={["رقم الطلب", "اسم العميلة", "الحالة", "المبلغ"]} head />
        <TRow cells={["SHY-0047", "فاطمة أحمد", <Badge key="1" color="#e65100" text="معلّق" />, "1,200 ج"]} />
        <TRow cells={["SHY-0046", "منى محمد", <Badge key="2" color="#1565c0" text="مؤكد" />, "890 ج"]} />
        <TRow cells={["SHY-0045", "سارة علي", <Badge key="3" color="#27ae60" text="سُلّم" />, "2,100 ج"]} />
      </div>
    </Frame>
  )
}

function ProdsMockup() {
  return (
    <Frame url="/admin/products">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>المنتجات (28)</span>
        <Btn text="+ منتج جديد" primary />
      </div>
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
        <TRow cells={["اسم المنتج", "التصنيف", "السعر", "الجودة", "الحالة", "إجراء"]} head />
        {[
          ["شنطة جوتشي ميني", "شنط", "1,200 ج", <Badge key="a" color={G} text="بريميوم" />, <Badge key="b" color="#27ae60" text="نشط" />, "✏️ 🗑"],
          ["محفظة شانيل كاميليا", "محافظ", "950 ج", <Badge key="c" color="#7b1fa2" text="ميرور" />, <Badge key="d" color="#27ae60" text="نشط" />, "✏️ 🗑"],
          ["كلتش لويس فيتون", "كلتشات", "5,500 ج", <Badge key="e" color="#1565c0" text="أصلي" />, <Badge key="f" color="#e65100" text="مسودة" />, "✏️ 🗑"],
        ].map((r, i) => <TRow key={i} cells={r} />)}
      </div>
    </Frame>
  )
}

function OrdsMockup() {
  return (
    <Frame url="/admin/orders">
      <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
        {[["الكل", true], ["معلّقة", false], ["مؤكدة", false], ["شُحنت", false], ["سُلّمت", false], ["ملغاة", false]].map(([lbl, act]) => (
          <span key={String(lbl)} style={{ padding: "2px 10px", borderRadius: 20, fontSize: 9, border: `1px solid ${act ? G : "#ccc"}`, background: act ? "#fffbf0" : "transparent", color: act ? "#b8860b" : "#777", fontWeight: act ? 700 : 400 }}>{String(lbl)}</span>
        ))}
      </div>
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
        <TRow cells={["رقم الطلب", "العميلة", "الهاتف", "عناصر", "المبلغ", "الحالة"]} head />
        {[
          ["SHY-0047", "فاطمة أحمد", "01001234567", "2 منتجات", "1,200 ج", <Badge key="1" color="#e65100" text="معلّق" />],
          ["SHY-0046", "منى محمد", "01112345678", "1 منتج", "890 ج", <Badge key="2" color="#1565c0" text="مؤكد" />],
          ["SHY-0045", "سارة علي", "01223456789", "3 منتجات", "2,100 ج", <Badge key="3" color="#6a1b9a" text="شُحن" />],
        ].map((r, i) => <TRow key={i} cells={r} />)}
      </div>
    </Frame>
  )
}

function CatsMockup() {
  return (
    <Frame url="/admin/categories">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>الأقسام</span>
        <Btn text="+ قسم جديد" primary />
      </div>
      {["شنط (handbags)", "محافظ (wallets)", "كلتشات (clutches)", "أحذية (shoes)", "إكسسوارات (accessories)"].map((c, i) => (
        <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "white", border: "1px solid #eee", borderRadius: 5, marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: "#bbb", width: 16, textAlign: "center" }}>#{i + 1}</span>
          <span style={{ flex: 1, fontSize: 10, color: "#333" }}>{c}</span>
          <span style={{ fontSize: 11 }}>✏️</span>
        </div>
      ))}
    </Frame>
  )
}

function FlashMockup() {
  return (
    <Frame url="/admin/settings">
      <div style={{ background: "#fffbf0", border: `1px solid ${G}40`, borderRadius: 6, padding: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#b8860b", marginBottom: 6 }}>⚡ إعدادات عروض الفلاش</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#555" }}>تفعيل عروض الفلاش</span>
            <Toggle on={true} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#555" }}>تاريخ الانتهاء</span>
            <span style={{ fontSize: 10, color: "#b8860b", fontWeight: 700 }}>2026-07-28 20:01</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#555" }}>عنوان القسم</span>
            <span style={{ fontSize: 10, color: "#333" }}>عروض الفلاش 🔥</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 9, color: "#888", padding: "6px 8px", background: "#f5f5f5", borderRadius: 5 }}>
        💡 المنتجات في الفلاش = منتجات مميّزة ✓ مع سعر مقارنة أعلى من سعر البيع
      </div>
    </Frame>
  )
}

function BanMockup() {
  return (
    <Frame url="/admin/banners">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>البانرات الإعلانية</span>
        <Btn text="+ رفع بانر" primary />
      </div>
      {[
        { title: "تشكيلة الصيف الجديدة", link: "/sale", active: true },
        { title: "خصم 30% على المحافظ", link: "/products", active: true },
        { title: "وصل حديثاً — بانر تجريبي", link: "/", active: false },
      ].map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", background: "white", border: "1px solid #eee", borderRadius: 5, marginBottom: 4 }}>
          <div style={{ width: 44, height: 26, background: "#e8e8e8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🖼️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "#333", fontWeight: 600 }}>{b.title}</div>
            <div style={{ fontSize: 9, color: "#999" }}>رابط: {b.link}</div>
          </div>
          <Toggle on={b.active} />
          <span style={{ fontSize: 9, color: "#bbb" }}>#{i + 1}</span>
        </div>
      ))}
    </Frame>
  )
}

function RevMockup() {
  return (
    <Frame url="/admin/reviews">
      {[
        { name: "منى م.", stars: 5, text: "منتج رائع جداً، الجودة ممتازة", approved: false },
        { name: "سارة أ.", stars: 4, text: "شنطة جميلة وشحن سريع، شكراً", approved: true },
        { name: "هدى ع.", stars: 5, text: "تجربة تسوق ممتازة سأكرر الشراء", approved: true },
      ].map((r, i) => (
        <div key={i} style={{ padding: "8px 10px", background: "white", border: `1px solid ${r.approved ? "#e0e0e0" : G + "50"}`, borderRadius: 6, marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#333" }}>{r.name}</span>
              <span style={{ color: G, fontSize: 10 }}>{"★".repeat(r.stars)}</span>
            </div>
            <Badge color={r.approved ? "#27ae60" : "#e65100"} text={r.approved ? "معتمد" : "بانتظار الموافقة"} />
          </div>
          <p style={{ fontSize: 10, color: "#666", margin: 0 }}>{r.text}</p>
          {!r.approved && (
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <span style={{ padding: "2px 10px", background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 4, fontSize: 9, color: "#2e7d32", fontWeight: 700 }}>✓ موافقة</span>
              <span style={{ padding: "2px 10px", background: "#ffebee", border: "1px solid #ef9a9a", borderRadius: 4, fontSize: 9, color: "#c62828", fontWeight: 700 }}>✕ رفض</span>
            </div>
          )}
        </div>
      ))}
    </Frame>
  )
}

function DiscMockup() {
  return (
    <Frame url="/admin/discounts">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>أكواد الخصم</span>
        <Btn text="+ كود جديد" primary />
      </div>
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
        <TRow cells={["الكود", "النوع", "القيمة", "الحد الأدنى", "الانتهاء", "الحالة"]} head />
        {[
          [<span key="1" style={{ fontFamily: "monospace", fontSize: 10, color: "#b8860b", fontWeight: 700 }}>SHAHY10</span>, "نسبة %", "10%", "200 ج", "2026-07-31", <Badge key="a" color="#27ae60" text="نشط" />],
          [<span key="2" style={{ fontFamily: "monospace", fontSize: 10, color: "#b8860b", fontWeight: 700 }}>WELCOME50</span>, "مبلغ ثابت", "50 ج", "500 ج", "2026-12-31", <Badge key="b" color="#27ae60" text="نشط" />],
          [<span key="3" style={{ fontFamily: "monospace", fontSize: 10, color: "#999" }}>SUMMER20</span>, "نسبة %", "20%", "—", "2026-06-30", <Badge key="c" color="#999" text="موقف" />],
        ].map((r, i) => <TRow key={i} cells={r} />)}
      </div>
    </Frame>
  )
}

function ShipMockup() {
  return (
    <Frame url="/admin/shipping">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>مناطق الشحن</span>
        <Btn text="+ منطقة" primary />
      </div>
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
        <TRow cells={["المنطقة", "سعر الشحن", "مدة التوصيل", "إجراء"]} head />
        {[
          ["القاهرة الكبرى والجيزة", "35 ج", "2–3 أيام", "✏️"],
          ["الإسكندرية والمحافظات الكبرى", "45 ج", "3–4 أيام", "✏️"],
          ["باقي المحافظات والصعيد", "55 ج", "4–6 أيام", "✏️"],
        ].map((r, i) => <TRow key={i} cells={r} />)}
      </div>
    </Frame>
  )
}

function SetMockup() {
  return (
    <Frame url="/admin/settings">
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <FRow label="اسم المتجر" value="شاهي ستور" />
        <FRow label="رقم واتساب الطلبات" value="+201015835455" />
        <FRow label="كلمات الهيرو (مفصولة بفاصلة)" value="شعوراً، هويتك، أناقة..." />
        <FRow label="نص الإعلان العلوي" value="🚚 شحن مجاني على الطلبات فوق 500 ج" />
        <FRow label="تفعيل الإعلان العلوي" toggle={true} />
        <FRow label="تفعيل عروض الفلاش" toggle={true} />
        <FRow label="تاريخ انتهاء الفلاش" value="2026-07-28T20:01" />
      </div>
      <div style={{ marginTop: 10 }}>
        <Btn text="حفظ الإعدادات" primary />
      </div>
    </Frame>
  )
}

function AdmMockup() {
  return (
    <Frame url="/admin/admins">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>المشرفون</span>
        <Btn text="+ أدمن جديد" primary />
      </div>
      {[
        { name: "صاحبة المتجر", email: "owner@shahy.store", role: "مالك", roleColor: G },
        { name: "مساعدة المتجر", email: "helper@shahy.store", role: "أدمن", roleColor: "#1565c0" },
      ].map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "white", border: "1px solid #eee", borderRadius: 6, marginBottom: 5 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#333" }}>{a.name}</div>
            <div style={{ fontSize: 9, color: "#999" }}>{a.email}</div>
          </div>
          <Badge color={a.roleColor} text={a.role} />
          <span style={{ fontSize: 11, cursor: "pointer" }}>🗑</span>
        </div>
      ))}
    </Frame>
  )
}

// ─── Sections data ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    num: "01", icon: "📊", title: "الداشبورد", url: "/admin/dashboard",
    subtitle: "نظرة شاملة على أداء المتجر اليومي",
    steps: [
      "بعد تسجيل الدخول يفتح الداشبورد مباشرة — هو الشاشة الرئيسية",
      "4 كاردات إحصائية: إجمالي الطلبات، الطلبات المعلّقة، المنتجات النشطة، إجمالي المبيعات",
      "الكارد البرتقالي «طلبات معلّقة» هو الأهم — تابعيه أول شيء كل يوم",
      "الرسم البياني يعرض إيرادات آخر 30 يوم بشكل مرئي",
      "جدول «آخر الطلبات» يعرض أحدث 5 طلبات مع حالة كل منها",
      "اضغطي على أي طلب في الجدول للانتقال لتفاصيله مباشرة",
    ],
    tips: [
      "المبيعات تُحسب فقط من الطلبات المسلّمة (حالة «سُلّم»)",
      "الرسم البياني لا يشمل الطلبات الملغاة أو المعلّقة",
      "راجعي الداشبورد صباحاً لمتابعة الطلبات الجديدة",
    ],
    mockup: <DashMockup />,
  },
  {
    num: "02", icon: "📦", title: "المنتجات", url: "/admin/products",
    subtitle: "إضافة وتعديل وإدارة كتالوج المتجر بالكامل",
    steps: [
      "اضغطي «+ منتج جديد» لفتح نموذج الإضافة",
      "أدخلي: الاسم بالعربي، التصنيف، السعر الأساسي (سعر البيع الفعلي)",
      "سعر المقارنة = السعر القديم المشطوب — يظهر للعميل كسعر أصلي",
      "اختاري الجودة: بريميوم (hi_copy) أو ميرور (mirror) أو أصلي (original)",
      "في قسم «الصور»: ارفعي صورة أو أكثر — أول صورة ترفعيها تظهر في الكارت",
      "في قسم «المتغيّرات»: أضيفي ألوان أو مقاسات مع ستوك مستقل لكل متغيّر",
      "فعّلي «مميّز» إذا أردتِ ظهور المنتج في قسم عروض الفلاش",
      "اختاري الحالة: نشط = يظهر، مسودة = مخفي، نفذ = out of stock",
      "اضغطي «حفظ» — المنتج يظهر في المتجر فوراً",
    ],
    tips: [
      "الصورة المثالية: مربعة 800×800 بكسل، خلفية بيضاء أو نظيفة",
      "المنتجات مرتّبة من الأحدث للأقدم تلقائياً",
      "لا تحذفي منتجاً عليه طلبات سابقة — غيّري حالته لـ «نفذ» بدلاً من الحذف",
    ],
    mockup: <ProdsMockup />,
  },
  {
    num: "03", icon: "🧾", title: "الطلبات", url: "/admin/orders",
    subtitle: "استقبال ومتابعة وتحديث حالات الطلبات",
    steps: [
      "الطلبات تصل عبر واتساب وتُسجَّل في النظام تلقائياً بحالة «معلّق»",
      "اضغطي على أي طلب لفتح صفحة التفاصيل الكاملة",
      "في صفحة التفاصيل: ستجدين اسم العميلة، رقم الهاتف، العنوان، المنتجات المطلوبة",
      "غيّري الحالة من القائمة: معلّق ← مؤكد ← شُحن ← سُلّم",
      "مؤكد: تواصلتِ مع العميلة وأكدتِ الطلب",
      "شُحن: سلّمتِ الطلب لشركة الشحن",
      "سُلّم: وصل للعميلة وأنهيتِ الطلب — يُحتسب في المبيعات",
      "فلّتري الطلبات بالتبويبات العلوية (معلّقة / مؤكدة / ...)",
      "لإلغاء طلب: غيّري حالته لـ «ملغي» — لا يمكن حذف الطلبات لحماية السجل",
    ],
    tips: [
      "ابدأي بالطلبات المعلّقة — العميلة تنتظر",
      "سجّلي ملاحظة في حقل «notes» لو في أي تفاصيل خاصة",
    ],
    mockup: <OrdsMockup />,
  },
  {
    num: "04", icon: "🏷️", title: "الأقسام", url: "/admin/categories",
    subtitle: "إدارة تصنيفات المتجر التي تظهر في الفلترة والتنقل",
    steps: [
      "اضغطي «+ قسم جديد» وأدخلي الاسم بالعربي والـ Slug بالإنجليزي (مثل: handbags)",
      "رقم الترتيب يحدد موضع القسم في شريط التصنيفات",
      "لتعديل اسم قسم: اضغطي أيقونة القلم ✏️ بجانبه",
      "الأقسام تظهر في: شريط الفلتر في المنتجات، وقائمة pills بالصفحة الرئيسية",
      "لا تحذفي قسماً فيه منتجات — انقلي المنتجات أولاً",
    ],
    tips: [
      "اجعلي أسماء الأقسام قصيرة (شنط، محافظ، أحذية)",
      "الـ Slug بالإنجليزي وبدون مسافات: handbags, wallets, shoes",
    ],
    mockup: <CatsMockup />,
  },
  {
    num: "05", icon: "⚡", title: "عروض الفلاش", url: "/admin/settings",
    subtitle: "عروض محدودة بعداد تنازلي تظهر تلقائياً في الصفحة الرئيسية",
    steps: [
      "الخطوة 1: اذهبي للإعدادات → فعّلي «عروض الفلاش» واضبطي تاريخ الانتهاء",
      "الخطوة 2: اذهبي للمنتجات → عدّلي المنتجات المراد تضمينها",
      "لكل منتج: فعّلي ✓ «مميّز» وأضيفي «سعر المقارنة» أعلى من السعر الحالي",
      "مثال: سعر البيع 800 ج، سعر المقارنة 1000 ج → خصم 20%",
      "تظهر المنتجات تلقائياً في قسم الفلاش مع نسبة الخصم والعداد التنازلي",
      "عند انتهاء الوقت: قسم الفلاش يختفي تلقائياً من الصفحة الرئيسية",
    ],
    tips: [
      "الحد الأقصى 8 منتجات في الفلاش",
      "يمكن تمديد العرض بتغيير تاريخ الانتهاء في الإعدادات",
      "لا حاجة لإيقاف الفلاش يدوياً — يختفي تلقائياً",
    ],
    mockup: <FlashMockup />,
  },
  {
    num: "06", icon: "🖼️", title: "البانرات الإعلانية", url: "/admin/banners",
    subtitle: "بانرات دوّارة تظهر في أعلى الصفحة الرئيسية",
    steps: [
      "اضغطي «+ رفع بانر» واختاري الصورة (يُفضّل 1200×400 بكسل)",
      "أضيفي عنواناً ورابطاً اختيارياً (مثل: /sale أو /products)",
      "رقم الترتيب يحدد ترتيب ظهور البانرات في الكاروسيل",
      "اضغطي على زر التبديل 🔘 لتفعيل أو إيقاف بانر بدون حذفه",
      "البانرات تظهر كـ carousel دوّار في أعلى الصفحة الرئيسية",
    ],
    tips: [
      "لا تضعي أكثر من 4-5 بانرات للأداء الأمثل",
      "البانر المُعطَّل محفوظ ويمكن إعادة تفعيله في أي وقت",
    ],
    mockup: <BanMockup />,
  },
  {
    num: "07", icon: "⭐", title: "التقييمات", url: "/admin/reviews",
    subtitle: "مراجعة والموافقة على تقييمات العملاء قبل نشرها",
    steps: [
      "التقييمات الجديدة تظهر بحالة «بانتظار الموافقة» — لا تظهر في المتجر حتى تعتمديها",
      "اضغطي «✓ موافقة» لنشر التقييم في قسم آراء العملاء بالصفحة الرئيسية",
      "اضغطي «✕ رفض» لحذف تقييم غير لائق أو كاذب",
      "التقييمات المعتمدة تُرتَّب من الأعلى نجوماً تلقائياً",
      "العميلات يكتبن التقييمات من صفحة المنتج مباشرة",
    ],
    tips: [
      "راجعي التقييمات أسبوعياً على الأقل",
      "لا تعتمدي تقييمات تحتوي معلومات شخصية أو محتوى مسيء",
      "التقييمات الإيجابية تزيد ثقة العملاء الجدد",
    ],
    mockup: <RevMockup />,
  },
  {
    num: "08", icon: "🎁", title: "أكواد الخصم", url: "/admin/discounts",
    subtitle: "إنشاء وإدارة أكواد الحسم للعملاء",
    steps: [
      "اضغطي «+ كود جديد» وأدخلي اسم الكود بالأحرف الكبيرة (مثل: SHAHY10)",
      "اختاري النوع: نسبة مئوية % أو مبلغ ثابت بالجنيه",
      "أدخلي الحد الأدنى للطلب (اختياري) — مثل: 200 ج",
      "حدّدي تاريخ الانتهاء أو اتركيه فارغاً لخصم دائم",
      "شاركي الكود مع العملاء عبر واتساب أو انستاجرام",
      "العميلة تُدخل الكود في سلة الشراء قبل إتمام الطلب",
    ],
    tips: [
      "الأكواد المفعّلة حالياً: SHAHY10 (10% على طلبات +200ج)، WELCOME50 (50ج على طلبات +500ج)",
      "يمكن إيقاف أي كود مؤقتاً بدون حذفه",
      "استخدمي أكواد مختلفة لمناسبات مختلفة (عيد، رمضان، صيف)",
    ],
    mockup: <DiscMockup />,
  },
  {
    num: "09", icon: "🚚", title: "مناطق الشحن", url: "/admin/shipping",
    subtitle: "إعداد أسعار الشحن لكل منطقة جغرافية",
    steps: [
      "اضغطي «+ منطقة» وأدخلي اسم المنطقة بالعربي",
      "أدخلي سعر الشحن بالجنيه وعدد أيام التوصيل المتوقع",
      "العميلة تختار المنطقة عند إتمام الطلب — يُضاف سعر الشحن تلقائياً",
      "يمكن وضع سعر 0 لتقديم شحن مجاني على منطقة معينة",
    ],
    tips: [
      "ابدأي بمنطقتين: القاهرة الكبرى + باقي الجمهورية",
      "القاهرة: 35 ج / 2-3 أيام — المحافظات: 45-55 ج / 3-6 أيام",
    ],
    mockup: <ShipMockup />,
  },
  {
    num: "10", icon: "⚙️", title: "الإعدادات", url: "/admin/settings",
    subtitle: "إعدادات المتجر العامة — تحكّمي في كل شيء من هنا",
    steps: [
      "اسم المتجر: يظهر في تاب المتصفح وبعض الصفحات",
      "رقم واتساب الطلبات: يُستخدم في جميع أزرار واتساب في المتجر — حدّثيه لو تغيّر رقمك",
      "كلمات الهيرو: الكلمات الدوارة في الصفحة الرئيسية، افصليها بفاصلة (,)",
      "الإعلان العلوي: نص يظهر أعلى الموقع في شريط ملوّن — اتركيه فارغاً لإخفائه",
      "عروض الفلاش: فعّلي الزر واضبطي وقت الانتهاء",
      "بعد تعديل أي إعداد اضغطي «حفظ» — التغييرات تظهر فوراً",
    ],
    tips: [
      "غيّري كلمات الهيرو كل فترة لإبقاء الموقع حيّاً",
      "الإعلان العلوي مثالي لـ: شحن مجاني، عروض محدودة، مواسم",
      "تأكدي من رقم الواتساب قبل أي تغيير — إذا تغيّر: غيّريه هنا + أخبري المطوّر",
    ],
    mockup: <SetMockup />,
  },
  {
    num: "11", icon: "👥", title: "الصلاحيات", url: "/admin/admins",
    subtitle: "إضافة وإدارة حسابات المشرفين على المتجر",
    steps: [
      "اضغطي «+ أدمن جديد» وأدخلي الاسم والبريد الإلكتروني وكلمة المرور",
      "الأدمن الجديد يستطيع الدخول فوراً بالبيانات المُدخَلة",
      "يمكن حذف أي حساب بالضغط على أيقونة 🗑 — لكن لا تحذفي حسابك الأساسي!",
    ],
    tips: [
      "أضيفي حساباً منفصلاً لكل شخص — لا تشاركي كلمة المرور",
      "كلمة مرور قوية: 8+ حروف، أرقام، رموز",
    ],
    mockup: <AdmMockup />,
  },
]

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Cinzel:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { background: #e5e5e5; direction: rtl; font-family: Tajawal, sans-serif; }

.print-wrap { max-width: 860px; margin: 0 auto; padding: 24px; }

.paper {
  background: white;
  padding: 56px 64px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  page-break-after: always;
}

.cover-logo {
  font-family: 'Cinzel', serif;
  font-size: 42px;
  font-weight: 700;
  color: #C9A84C;
  letter-spacing: 8px;
  margin-bottom: 4px;
}

.cover-subtitle {
  font-size: 11px;
  letter-spacing: 6px;
  color: #999;
  font-family: Cinzel, serif;
  text-transform: uppercase;
  margin-bottom: 48px;
}

.cover-title {
  font-size: 36px;
  font-weight: 900;
  color: #111;
  line-height: 1.3;
  margin-bottom: 10px;
}

.cover-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 60px;
  line-height: 1.8;
}

.divider { height: 2px; background: linear-gradient(to left, #C9A84C, #F0D882, #C9A84C); margin: 32px 0; }
.divider-sm { height: 1px; background: #e8e8e8; margin: 16px 0; }

.toc-title { font-size: 11px; letter-spacing: 4px; color: #999; text-transform: uppercase; font-family: Cinzel, serif; margin-bottom: 20px; }
.toc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.toc-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.toc-num { font-family: Cinzel, serif; font-size: 10px; color: #C9A84C; font-weight: 700; width: 20px; }
.toc-icon { font-size: 16px; }
.toc-text { font-size: 13px; color: #333; }

.section-paper {
  background: white;
  padding: 48px 64px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 24px;
}

.section-num {
  font-family: Cinzel, serif;
  font-size: 32px;
  font-weight: 700;
  color: #e8e8e8;
  line-height: 1;
}

.section-icon-wrap {
  width: 52px; height: 52px; border-radius: 14px;
  background: #fffbf0; border: 1px solid #C9A84C40;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; flex-shrink: 0;
}

.section-heading { font-size: 22px; font-weight: 900; color: #111; }
.section-subheading { font-size: 13px; color: #888; margin-top: 3px; }

.section-url {
  margin-right: auto;
  font-family: monospace; font-size: 10px; color: #bbb;
  background: #f8f8f8; padding: 4px 10px; border-radius: 4px; border: 1px solid #e8e8e8;
}

.section-body { display: grid; grid-template-columns: 1.1fr 1fr; gap: 32px; }

.col-label {
  font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
  font-family: Cinzel, serif; color: #C9A84C; font-weight: 700;
  margin-bottom: 14px;
}

.steps-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.step-item { display: flex; gap: 12px; align-items: flex-start; }
.step-num {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  border: 1.5px solid #C9A84C; color: #C9A84C; font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; margin-top: 1px;
}
.step-text { font-size: 12.5px; color: #444; line-height: 1.65; }

.tips-box {
  margin-top: 16px;
  background: #fffbf0;
  border: 1px solid #C9A84C30;
  border-right: 3px solid #C9A84C;
  border-radius: 6px;
  padding: 12px 14px;
}
.tips-label { font-size: 10px; font-weight: 700; color: #C9A84C; margin-bottom: 8px; }
.tips-item { font-size: 11px; color: #666; display: flex; gap: 6px; margin-bottom: 4px; line-height: 1.5; }

.no-print-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  background: #0A0806; border-bottom: 1px solid #C9A84C40;
  padding: 10px 24px;
  display: flex; align-items: center; gap: 16px;
}

.print-btn {
  padding: 8px 20px; border-radius: 8px;
  background: linear-gradient(135deg,#C9A84C,#F0D882);
  color: #0A0806; font-family: Tajawal, sans-serif; font-size: 13px; font-weight: 700;
  border: none; cursor: pointer;
}

.print-btn:hover { opacity: 0.9; }

@media print {
  .no-print-bar { display: none !important; }
  body { background: white; }
  .paper, .section-paper {
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    page-break-after: always;
  }
  @page { margin: 14mm 16mm; size: A4; }
  .print-wrap { padding: 0; max-width: 100%; }
}
`

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminGuidePrintPage() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Floating print bar ─────────────────────────────────────── */}
      <div className="no-print-bar">
        <span style={{ fontFamily: "Cinzel, serif", fontSize: 12, color: "#C9A84C", letterSpacing: 3 }}>ShahY Admin Guide</span>
        <button className="print-btn" onClick={() => window.print()}>
          🖨️ &nbsp; طباعة / حفظ كـ PDF
        </button>
        <a href="/admin/guide" style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, color: "rgba(245,239,224,0.4)", textDecoration: "none", marginRight: "auto" }}>
          ← العودة للدليل
        </a>
      </div>

      <div className="print-wrap" style={{ paddingTop: 64 }}>

        {/* ── Cover page ─────────────────────────────────────────────── */}
        <div className="paper" style={{ minHeight: 700, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div className="cover-logo">ShahY</div>
            <div className="cover-subtitle">Store</div>

            <div style={{ width: 60, height: 2, background: "linear-gradient(to left,#C9A84C,#F0D882,#C9A84C)", marginBottom: 32 }} />

            <h1 className="cover-title">دليل إدارة المتجر الشامل</h1>
            <p className="cover-desc">
              كل ما تحتاجين معرفته لإدارة متجر شاهي من الصفر<br />
              خطوة بخطوة — مع معاينة كل شاشة
            </p>

            <div style={{ display: "flex", gap: 24, fontSize: 12, color: "#999" }}>
              <span>📅 يونيو 2026</span>
              <span>·</span>
              <span>13 قسم</span>
              <span>·</span>
              <span>الإصدار 1.0</span>
            </div>
          </div>

          <div className="divider" />

          {/* Quick start */}
          <div style={{ background: "#fffbf0", border: "1px solid #C9A84C30", borderRadius: 10, padding: "20px 24px", marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#C9A84C", marginBottom: 12 }}>🚀 البداية السريعة</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["1", "ادخلي الأدمن من /admin/login"],
                ["2", "أضيفي منتجاتك من صفحة «المنتجات»"],
                ["3", "جهّزي الأقسام والشحن والإعدادات"],
                ["4", "تابعي الطلبات يومياً وحدّثي حالاتها"],
              ].map(([n, t]) => (
                <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#C9A84C", color: "#0A0806", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
                  <span style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOC */}
          <div>
            <div className="toc-title">محتويات الدليل</div>
            <div className="toc-grid">
              {SECTIONS.map(s => (
                <div key={s.num} className="toc-item">
                  <span className="toc-num">{s.num}</span>
                  <span className="toc-icon">{s.icon}</span>
                  <div>
                    <div className="toc-text">{s.title}</div>
                    <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>{s.subtitle.split(" — ")[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider-sm" style={{ marginTop: 32 }} />
          <div style={{ textAlign: "center", fontSize: 10, color: "#ccc", fontFamily: "Cinzel, serif", letterSpacing: 2 }}>
            DESIGNED &amp; DEVELOPED BY AHMED DARHOUS · +201030002331
          </div>
        </div>

        {/* ── Sections ─────────────────────────────────────────────────── */}
        {SECTIONS.map(section => (
          <div key={section.num} className="section-paper">
            <div className="section-header">
              <span className="section-num">{section.num}</span>
              <div className="section-icon-wrap">{section.icon}</div>
              <div>
                <div className="section-heading">{section.title}</div>
                <div className="section-subheading">{section.subtitle}</div>
              </div>
              <span className="section-url">{section.url}</span>
            </div>

            <div className="section-body">
              {/* Steps */}
              <div>
                <div className="col-label">الخطوات</div>
                <ol className="steps-list">
                  {section.steps.map((step, i) => (
                    <li key={i} className="step-item">
                      <div className="step-num">{i + 1}</div>
                      <p className="step-text">{step}</p>
                    </li>
                  ))}
                </ol>

                {section.tips && (
                  <div className="tips-box">
                    <div className="tips-label">💡 نصائح مهمة</div>
                    {section.tips.map((tip, i) => (
                      <div key={i} className="tips-item">
                        <span style={{ color: "#C9A84C", flexShrink: 0 }}>•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mockup */}
              <div>
                <div className="col-label">معاينة الشاشة</div>
                {section.mockup}
              </div>
            </div>
          </div>
        ))}

        {/* ── Ads Guide ────────────────────────────────────────────────── */}
        <div className="section-paper">
          <div className="section-header">
            <span className="section-num">12</span>
            <div className="section-icon-wrap">📣</div>
            <div>
              <div className="section-heading">دليل الإعلانات المدفوعة</div>
              <div className="section-subheading">Google Ads · Meta Ads · TikTok Ads — مخصص لشاهي ستور</div>
            </div>
            <span className="section-url">دليل مرجعي</span>
          </div>

          <div className="section-body">
            <div>
              <div className="col-label">المنصات الثلاث</div>

              {/* Google Ads */}
              <div style={{ marginBottom: 16, border: "1px solid #e8f0fe", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ background: "#e8f0fe", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #d2e3fc" }}>
                  <span style={{ fontSize: 14 }}>🔍</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1a73e8" }}>Google Ads</span>
                  <span style={{ fontSize: 10, color: "#5f6368", marginRight: "auto" }}>ميزانية مقترحة: 100–200 ج.م / يوم</span>
                </div>
                <div style={{ padding: "12px 14px", background: "white", fontSize: 11, lineHeight: 1.9, color: "#333" }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: "#1a73e8" }}>الكلمات المفتاحية الموصى بها:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                    {["شنط مستوردة", "شنط فاخرة", "شنط هاي كوبي", "شنط ميرور", "محافظ نسائية فاخرة", "شنط شانيل مصر", "شوزات فاخرة", "إكسسوارات فاخرة"].map(k => (
                      <span key={k} style={{ background: "#e8f0fe", color: "#1a73e8", padding: "2px 8px", borderRadius: 4, fontSize: 10, border: "1px solid #d2e3fc" }}>{k}</span>
                    ))}
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: "#555" }}>خطوات الإعداد:</div>
                  <ol style={{ margin: 0, paddingRight: 16, color: "#555" }}>
                    <li>افتحي حساب Google Ads على ads.google.com</li>
                    <li>اختاري «حملة بحث» — الهدف: المبيعات أو الزيارات</li>
                    <li>الاستهداف: مصر · نساء · 20–45 سنة</li>
                    <li>اكتبي إعلاناتك بالعربي مع ذكر «شاهي ستور» والسعر</li>
                    <li>حوّلي الرابط لصفحة المنتج المستهدف مباشرةً لا الهوم</li>
                    <li>راقبي معدل النقر CTR وكلفة التحويل يومياً</li>
                  </ol>
                </div>
              </div>

              {/* Meta Ads */}
              <div style={{ marginBottom: 16, border: "1px solid #e7d7f5", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ background: "#e7d7f5", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #d5b8f0" }}>
                  <span style={{ fontSize: 14 }}>📘</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6E3FC1" }}>Meta Ads — Facebook &amp; Instagram</span>
                  <span style={{ fontSize: 10, color: "#5f6368", marginRight: "auto" }}>ميزانية مقترحة: 150–300 ج.م / يوم</span>
                </div>
                <div style={{ padding: "12px 14px", background: "white", fontSize: 11, lineHeight: 1.9, color: "#333" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 6, color: "#6E3FC1" }}>الجمهور المستهدف:</div>
                      <ul style={{ margin: 0, paddingRight: 14, color: "#555" }}>
                        <li>نساء · 18–40 سنة · مصر</li>
                        <li>اهتمامات: موضة، فاشون، تسوق، ماركات</li>
                        <li>سلوك: مشترو المنتجات الفاخرة عبر الإنترنت</li>
                        <li>Lookalike من زوار موقعك (بعد 1000 زيارة)</li>
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 6, color: "#6E3FC1" }}>أفضل فورمات الإعلانات:</div>
                      <ul style={{ margin: 0, paddingRight: 14, color: "#555" }}>
                        <li>Carousel — 3–5 منتجات في إعلان واحد</li>
                        <li>Reels — فيديو 15 ثانية للمنتج</li>
                        <li>Story — صورة بسيطة + سعر + CTA</li>
                        <li>Catalog — ربط مباشر بالمنتجات</li>
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, background: "#f8f4ff", borderRadius: 6, padding: "8px 12px", fontSize: 10, color: "#555", border: "1px solid #d5b8f0" }}>
                    ⚠️ مهم: أضيفي Meta Pixel على الموقع (من Events Manager) لتتبع الطلبات وقياس التحويلات بدقة.
                  </div>
                </div>
              </div>

              {/* TikTok Ads */}
              <div style={{ border: "1px solid #ffe0e8", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ background: "#ffe0e8", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #ffc2d1" }}>
                  <span style={{ fontSize: 14 }}>🎵</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#ff0050" }}>TikTok Ads</span>
                  <span style={{ fontSize: 10, color: "#5f6368", marginRight: "auto" }}>ميزانية مقترحة: 50–150 ج.م / يوم</span>
                </div>
                <div style={{ padding: "12px 14px", background: "white", fontSize: 11, lineHeight: 1.9, color: "#333" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 6, color: "#ff0050" }}>نوع المحتوى الأفضل:</div>
                      <ul style={{ margin: 0, paddingRight: 14, color: "#555" }}>
                        <li>فيديو Unboxing 15–30 ثانية</li>
                        <li>عرض المنتج من زوايا متعددة</li>
                        <li>«كنت بدور على شنطة فاخرة وأسعار معقولة...»</li>
                        <li>ريف للإعلان من مؤثرات موضة مصريات</li>
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 6, color: "#ff0050" }}>إعداد الحملة:</div>
                      <ul style={{ margin: 0, paddingRight: 14, color: "#555" }}>
                        <li>ads.tiktok.com ← حساب Business</li>
                        <li>In-Feed Ads: تظهر في الفيد الطبيعي</li>
                        <li>الاستهداف: مصر · إناث · 18–38</li>
                        <li>الهدف: حركة مرور للموقع أو تحويلات</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="col-label">نصائح وأمثلة</div>

              {/* Ad copy examples */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 8 }}>نماذج نصوص إعلانية جاهزة:</div>
                {[
                  { platform: "Google", text: "شنط فاخرة مستوردة | أسعار لا تصدق | توصيل لكل مصر | شاهي ستور", note: "عنوان الإعلان" },
                  { platform: "Meta", text: "✨ تشكيلة شانيل ولويس فيتون الجديدة وصلت!\nجودة ميرور بأسعار معقولة\nاطلبي الآن وادفعي عند الاستلام 📦", note: "نص البوست" },
                  { platform: "TikTok", text: "فاجئتكم بأحسن شنطة في القاهرة🤫 #شاهي_ستور #شنط_فاخرة #هاي_كوبي", note: "وصف الفيديو + هاشتاقات" },
                ].map(({ platform, text, note }) => (
                  <div key={platform} style={{ marginBottom: 8, border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ background: "#f5f5f5", padding: "4px 10px", fontSize: 9, color: "#888", fontWeight: 700 }}>{platform} · {note}</div>
                    <div style={{ padding: "8px 10px", fontSize: 10, color: "#333", lineHeight: 1.7, direction: "rtl", whiteSpace: "pre-wrap" }}>{text}</div>
                  </div>
                ))}
              </div>

              {/* Budget plan */}
              <div style={{ background: "#fffbf0", border: "1px solid #C9A84C30", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", marginBottom: 8 }}>💰 خطة ميزانية مقترحة (شهرياً)</div>
                {[
                  ["Google Ads (Search)", "3,000 – 6,000 ج.م"],
                  ["Meta Ads (Facebook + Instagram)", "4,500 – 9,000 ج.م"],
                  ["TikTok Ads", "1,500 – 4,500 ج.م"],
                  ["إجمالي التسويق المدفوع", "9,000 – 19,500 ج.م"],
                ].map(([label, val], i) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < 3 ? "1px solid #f0e8d0" : "none", fontSize: 10 }}>
                    <span style={{ color: "#555" }}>{label}</span>
                    <span style={{ fontWeight: 700, color: i === 3 ? "#C9A84C" : "#333" }}>{val}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: 9, color: "#999", lineHeight: 1.6 }}>
                  * ابدأي بالحد الأدنى أسبوعين لاختبار ما يشتغل، ثم زيدي الميزانية على الإعلانات الفائزة.
                </div>
              </div>

              {/* Tips */}
              <div className="tips-box" style={{ marginTop: 12 }}>
                <div className="tips-label">💡 نصائح مهمة</div>
                {[
                  "دايماً روّحي لصفحة المنتج مباشرةً، مش الهوم بيج — هيزيد معدل التحويل",
                  "صوّري المنتجات على خلفية بيضاء نظيفة لإعلانات Google Shopping",
                  "استخدمي وجه حقيقي في TikTok — المنتج بدون وجه بيأدى أضعف",
                  "اعملي A/B testing على نصين مختلفين واحتفظي بالأفضل",
                  "تابعي Cost Per Purchase (CPP) لا Cost Per Click فقط",
                  "أوقات الذروة: 8م – 12م مصر — ارفعي الميزانية في هذا الوقت",
                  "أضيفي Retargeting لمن زاروا الموقع ولم يشتروا: ذكّريهم بالمنتج",
                ].map((tip, i) => (
                  <div key={i} className="tips-item">
                    <span style={{ color: "#C9A84C", flexShrink: 0 }}>•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Image Prompt ─────────────────────────────────────────── */}
        <div className="section-paper">
          <div className="section-header">
            <span className="section-num">13</span>
            <div className="section-icon-wrap">🤖</div>
            <div>
              <div className="section-heading">برومبت الذكاء الاصطناعي للصور</div>
              <div className="section-subheading">حوّلي أي صورة منتج إلى إعلان عالمي في ثوانٍ — مجاناً</div>
            </div>
            <span className="section-url">تحميل: /ai-image-prompt.md</span>
          </div>

          <div className="section-body">
            <div>
              <div className="col-label">كيفية الاستخدام</div>
              <ol style={{ margin: 0, paddingRight: 16, fontSize: 11, lineHeight: 2, color: "#555" }}>
                <li>افتحي أي نموذج AI: ChatGPT-4o أو Gemini أو Claude</li>
                <li>ارفعي صورة المنتج (خلفية بيضاء أفضل)</li>
                <li>انسخي البرومبت من ملف <strong>ai-image-prompt.md</strong> الموجود في المتجر</li>
                <li>أضيفي اسم المنتج في آخر البرومبت وأرسليه</li>
                <li>احفظي الصورة الناتجة واستخدميها في الإعلانات</li>
              </ol>

              <div style={{ marginTop: 14, background: "#f8f4ff", border: "1px solid #d5b8f0", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6E3FC1", marginBottom: 8 }}>📋 البرومبت المختصر (للنماذج المحدودة)</div>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#333", lineHeight: 1.8, direction: "ltr", background: "white", padding: "8px 10px", borderRadius: 6, border: "1px solid #e0d5f5" }}>
                  {`Transform this product photo into a luxury fashion ad.
Brand: ShahY Store (شاهي ستور) — Egyptian luxury accessories.
Style: Chanel/Dior editorial. Dark dramatic background,
warm golden rim lighting, professional studio quality.
Add small Arabic text "شاهي ستور" in gold at top.
Output: 1:1 square, highest resolution, PNG.
Make it look like a €300 European luxury brand campaign.`}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 8 }}>النماذج المجانية الموصى بها:</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { name: "ChatGPT-4o", url: "chat.openai.com", color: "#10b981" },
                    { name: "Google Gemini", url: "gemini.google.com", color: "#3b82f6" },
                    { name: "Claude", url: "claude.ai", color: "#C9A84C" },
                  ].map(t => (
                    <div key={t.name} style={{ padding: "8px 10px", borderRadius: 8, border: `1px solid ${t.color}44`, background: `${t.color}11`, textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: t.color }}>{t.name}</div>
                      <div style={{ fontSize: 9, color: "#888", marginTop: 2 }}>{t.url}</div>
                      <div style={{ fontSize: 9, color: "#27ae60", marginTop: 2, fontWeight: 700 }}>✓ مجاني</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="col-label">نصائح التصوير</div>
              <div className="tips-box">
                <div className="tips-label">📸 قبل استخدام الـ AI</div>
                {[
                  "صوّري المنتج على خلفية بيضاء نظيفة — النتائج أوضح بكثير",
                  "الإضاءة الطبيعية كافية — لا تحتاجي استوديو",
                  "التصوير من الأمام أو بزاوية 45 درجة يعطي أفضل النتائج",
                  "احتفظي بالصورة الأصلية دايماً — تحتاجيها لتعديلات مستقبلية",
                ].map((tip, i) => (
                  <div key={i} className="tips-item">
                    <span style={{ color: "#6E3FC1", flexShrink: 0 }}>•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>

              <div className="tips-box" style={{ marginTop: 12 }}>
                <div className="tips-label">🎨 بعد الحصول على الصورة</div>
                {[
                  "جرّبي 3-4 مرات وخذي أجمل نتيجة",
                  "الحجم المطلوب للإعلانات: 1080×1080 (مربع) أو 1080×1920 (ستوري)",
                  "احفظيها PNG للجودة العالية أو JPEG لحجم أصغر",
                  "أضيفي الصورة مباشرة في إعلانات Meta أو TikTok كـ Creative",
                  "يمكن استخدام نفس الصورة للموقع والسوشيال ميديا",
                ].map((tip, i) => (
                  <div key={i} className="tips-item">
                    <span style={{ color: "#C9A84C", flexShrink: 0 }}>•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, padding: "12px 14px", background: "#fffbf0", border: "1px solid #C9A84C44", borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", marginBottom: 6 }}>✦ الملف الكامل</div>
                <div style={{ fontSize: 10, color: "#555", lineHeight: 1.7 }}>
                  البرومبت الكامل مع كل التفاصيل موجود في:<br />
                  <span style={{ fontFamily: "monospace", color: "#333" }}>your-store.vercel.app/ai-image-prompt.md</span><br />
                  يمكن تحميله من صفحة الدليل التفاعلي في لوحة الأدمن.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Back cover ───────────────────────────────────────────────── */}
        <div className="paper" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>📞</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 8 }}>محتاجة مساعدة؟</h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 24, lineHeight: 1.8 }}>
            لأي استفسار تقني أو تعديل في الموقع<br />تواصلي مع المطوّر مباشرة
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4, fontFamily: "Cinzel, serif", letterSpacing: 2 }}>WHATSAPP</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#25D366" }}>+201030002331</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4, fontFamily: "Cinzel, serif", letterSpacing: 2 }}>INSTAGRAM</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#C9A84C" }}>@darhous</div>
            </div>
          </div>
          <div className="divider" style={{ width: "100%", marginTop: 40 }} />
          <div style={{ fontSize: 10, color: "#ccc", fontFamily: "Cinzel, serif", letterSpacing: 2, marginTop: 16 }}>
            © 2026 SHAHY STORE — ALL RIGHTS RESERVED
          </div>
        </div>

      </div>
    </div>
  )
}
