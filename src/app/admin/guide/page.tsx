"use client"
import { useState } from "react"

// ── Types ──────────────────────────────────────────────────────────────────
interface Section {
  id: string
  icon: string
  title: string
  subtitle: string
  steps: string[]
  tips?: string[]
  mockup: React.ReactNode
}

// ── Mockup helpers ─────────────────────────────────────────────────────────
function AdminMockupShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div style={{
      background: "#0A0806", border: "1px solid rgba(201,168,76,0.15)",
      borderRadius: 10, overflow: "hidden", fontSize: 11,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    }}>
      <div style={{ background: "#111009", borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c0392b" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f39c12" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ae60" }} />
        <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(245,239,224,0.3)", marginRight: 8 }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function MockBadge({ color, text }: { color: string; text: string }) {
  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontFamily: "Tajawal,sans-serif", background: `${color}22`, color, border: `1px solid ${color}44` }}>
      {text}
    </span>
  )
}

// ── Individual mockups ─────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <AdminMockupShell title="الداشبورد — ShahY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[
            { label: "إجمالي الطلبات", val: "47", icon: "🧾" },
            { label: "طلبات معلّقة", val: "3", icon: "⏳", hl: true },
            { label: "منتجات نشطة", val: "28", icon: "📦" },
            { label: "المبيعات", val: "12,400 ج", icon: "💰" },
          ].map(s => (
            <div key={s.label} style={{
              background: s.hl ? "rgba(201,168,76,0.1)" : "#111009",
              border: `1px solid ${s.hl ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.08)"}`,
              borderRadius: 8, padding: "8px 10px",
            }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.4)", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F5EFE0" }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#111009", border: "1px solid rgba(201,168,76,0.08)", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(245,239,224,0.5)", marginBottom: 8 }}>الإيرادات — آخر 30 يوم</div>
          <div style={{ height: 40, display: "flex", alignItems: "flex-end", gap: 2 }}>
            {[3,6,2,8,5,9,4,7,3,6,8,5,7,9,4,6,3,8,5,7,4,9,6,3,8,5,7,4,6,9].map((h, i) => (
              <div key={i} style={{ flex: 1, background: `rgba(201,168,76,${0.2 + h * 0.08})`, borderRadius: "2px 2px 0 0", height: `${h * 11}%` }} />
            ))}
          </div>
        </div>
        {[
          { name: "فاطمة أحمد", num: "SHY-0047", status: "pending", total: "1,200" },
          { name: "منى محمد", num: "SHY-0046", status: "shipped", total: "890" },
          { name: "سارة علي", num: "SHY-0045", status: "delivered", total: "2,100" },
        ].map(o => (
          <div key={o.num} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(201,168,76,0.05)" }}>
            <div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0" }}>{o.name}</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.3)" }}>{o.num}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MockBadge color={o.status === "pending" ? "#f39c12" : o.status === "shipped" ? "#9b59b6" : "#27ae60"} text={o.status === "pending" ? "معلّق" : o.status === "shipped" ? "شُحن" : "سُلّم"} />
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#C9A84C" }}>{o.total} ج</span>
            </div>
          </div>
        ))}
      </div>
    </AdminMockupShell>
  )
}

function ProductsMockup() {
  return (
    <AdminMockupShell title="المنتجات — ShahY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", fontWeight: 700 }}>المنتجات (28)</span>
          <div style={{ background: "linear-gradient(135deg,#C9A84C,#F0D882)", color: "#0A0806", borderRadius: 6, padding: "5px 12px", fontFamily: "Tajawal,sans-serif", fontSize: 10, fontWeight: 700 }}>+ منتج جديد</div>
        </div>
        {[
          { name: "شنطة جوتشي ميني", cat: "شنط", price: "1,200", tier: "بريميوم", status: "active" },
          { name: "محفظة شانيل كاميليا", cat: "محافظ", price: "950", tier: "ميرور", status: "active" },
          { name: "كلتش لويس فيتون", cat: "كلتشات", price: "5,500", tier: "أصلي", status: "draft" },
        ].map(p => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#111009", borderRadius: 8, border: "1px solid rgba(201,168,76,0.06)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(201,168,76,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👜</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.35)" }}>{p.cat} · {p.price} ج</div>
            </div>
            <MockBadge color={p.tier === "أصلي" ? "#3498db" : p.tier === "ميرور" ? "#9b59b6" : "#C9A84C"} text={p.tier} />
            <MockBadge color={p.status === "active" ? "#27ae60" : "#e67e22"} text={p.status === "active" ? "نشط" : "مسودة"} />
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 22, height: 22, background: "rgba(201,168,76,0.1)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✏️</div>
              <div style={{ width: 22, height: 22, background: "rgba(192,57,43,0.1)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🗑</div>
            </div>
          </div>
        ))}
      </div>
    </AdminMockupShell>
  )
}

function OrdersMockup() {
  return (
    <AdminMockupShell title="الطلبات — ShahY Admin">
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {["الكل", "معلّقة", "مؤكدة", "شُحنت", "سُلّمت", "ملغاة"].map((s, i) => (
            <div key={s} style={{ padding: "3px 10px", borderRadius: 20, fontFamily: "Tajawal,sans-serif", fontSize: 10, background: i === 0 ? "rgba(201,168,76,0.15)" : "transparent", border: `1px solid ${i === 0 ? "rgba(201,168,76,0.3)" : "rgba(245,239,224,0.08)"}`, color: i === 0 ? "#C9A84C" : "rgba(245,239,224,0.4)" }}>{s}</div>
          ))}
        </div>
        {[
          { num: "SHY-0047", name: "فاطمة أحمد", phone: "01001234567", items: 2, total: "1,200", status: "pending", date: "اليوم 14:30" },
          { num: "SHY-0046", name: "منى محمد", phone: "01112345678", items: 1, total: "890", status: "confirmed", date: "أمس 09:15" },
          { num: "SHY-0045", name: "سارة علي", phone: "01223456789", items: 3, total: "2,100", status: "shipped", date: "24/06" },
        ].map(o => (
          <div key={o.num} style={{ padding: "8px 0", borderBottom: "1px solid rgba(201,168,76,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#C9A84C", fontWeight: 700 }}>{o.num}</span>
                <MockBadge color={o.status === "pending" ? "#f39c12" : o.status === "confirmed" ? "#3498db" : "#9b59b6"} text={o.status === "pending" ? "معلّق" : o.status === "confirmed" ? "مؤكد" : "شُحن"} />
              </div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.5)", marginTop: 2 }}>{o.name} · {o.phone} · {o.items} منتجات</div>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#F5EFE0", fontWeight: 700 }}>{o.total} ج</div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.3)" }}>{o.date}</div>
            </div>
          </div>
        ))}
      </div>
    </AdminMockupShell>
  )
}

function SettingsMockup() {
  return (
    <AdminMockupShell title="الإعدادات — ShahY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "اسم المتجر", val: "ShahY Store", type: "text" },
          { label: "رقم واتساب الطلبات", val: "201015835455", type: "text" },
          { label: "كلمات الهيرو", val: "شعوراً، هويتك، أناقة، ...", type: "text" },
          { label: "عروض الفلاش", val: "مفعّلة", type: "toggle", on: true },
          { label: "تاريخ انتهاء الفلاش", val: "2026-07-05 23:59", type: "text" },
          { label: "الإعلان العلوي", val: "شحن مجاني على الطلبات فوق 500 ج", type: "text" },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.5)", flex: "0 0 120px", textAlign: "right" }}>{f.label}</label>
            {f.type === "toggle" ? (
              <div style={{ width: 36, height: 18, background: f.on ? "rgba(39,174,96,0.3)" : "rgba(255,255,255,0.1)", border: `1px solid ${f.on ? "#27ae60" : "rgba(255,255,255,0.1)"}`, borderRadius: 20, display: "flex", alignItems: "center", padding: "0 2px", justifyContent: f.on ? "flex-end" : "flex-start" }}>
                <div style={{ width: 13, height: 13, borderRadius: "50%", background: f.on ? "#27ae60" : "#555" }} />
              </div>
            ) : (
              <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 6, padding: "4px 8px", fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.6)" }}>{f.val}</div>
            )}
          </div>
        ))}
        <div style={{ marginTop: 4 }}>
          <div style={{ background: "linear-gradient(135deg,#C9A84C,#F0D882)", color: "#0A0806", borderRadius: 6, padding: "6px 16px", fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, display: "inline-block" }}>حفظ الإعدادات</div>
        </div>
      </div>
    </AdminMockupShell>
  )
}

function FlashMockup() {
  return (
    <AdminMockupShell title="عروض الفلاش — ShahY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "10px 12px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 8 }}>
          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#C9A84C", fontWeight: 700, marginBottom: 6 }}>⚡ إعداد عروض الفلاش</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.5)" }}>تفعيل العروض</span>
              <div style={{ width: 36, height: 18, background: "rgba(39,174,96,0.3)", border: "1px solid #27ae60", borderRadius: 20, display: "flex", alignItems: "center", padding: "0 2px", justifyContent: "flex-end" }}>
                <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#27ae60" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.5)" }}>عنوان القسم</span>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#F5EFE0" }}>عروض الفلاش 🔥</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.5)" }}>تنتهي في</span>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#C9A84C" }}>2026-07-05 23:59</span>
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.4)" }}>المنتجات في الفلاش = منتجات marked كـ "مميّز" مع سعر مقارنة أعلى من السعر الحالي</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["شنطة جوتشي (20%)", "محفظة شانيل (15%)", "كلتش LV (25%)"].map(p => (
            <div key={p} style={{ flex: 1, background: "#111009", border: "1px solid rgba(240,100,80,0.2)", borderRadius: 6, padding: "5px 7px", fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(240,100,80,0.8)", textAlign: "center" }}>⚡ {p}</div>
          ))}
        </div>
      </div>
    </AdminMockupShell>
  )
}

function BannersMockup() {
  return (
    <AdminMockupShell title="البانرات — ShahY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", fontWeight: 700 }}>البانرات الإعلانية</span>
          <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontFamily: "Tajawal,sans-serif" }}>+ رفع بانر</div>
        </div>
        {[
          { title: "تشكيلة الصيف", status: true, order: 1 },
          { title: "خصم 30% عروض رمضان", status: true, order: 2 },
          { title: "وصل حديثاً — بانر تجريبي", status: false, order: 3 },
        ].map(b => (
          <div key={b.title} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#111009", borderRadius: 8, border: "1px solid rgba(201,168,76,0.06)" }}>
            <div style={{ width: 48, height: 28, background: "rgba(201,168,76,0.06)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🖼️</div>
            <span style={{ flex: 1, fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(245,239,224,0.7)" }}>{b.title}</span>
            <MockBadge color={b.status ? "#27ae60" : "#555"} text={b.status ? "نشط" : "معطّل"} />
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.25)" }}>#{b.order}</span>
          </div>
        ))}
      </div>
    </AdminMockupShell>
  )
}

function ReviewsMockup() {
  return (
    <AdminMockupShell title="التقييمات — ShahY Admin">
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { name: "منى م.", rating: 5, text: "منتج رائع جداً، الجودة ممتازة", approved: false },
          { name: "سارة أ.", rating: 4, text: "شنطة جميلة وشحن سريع، شكراً", approved: true },
          { name: "هدى ع.", rating: 5, text: "تجربة تسوق ممتازة سأكرر الشراء", approved: true },
        ].map(r => (
          <div key={r.name} style={{ padding: "8px 10px", background: "#111009", borderRadius: 8, border: `1px solid ${r.approved ? "rgba(201,168,76,0.08)" : "rgba(201,168,76,0.2)"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0" }}>{r.name}</span>
                <span style={{ color: "#C9A84C", fontSize: 10 }}>{"★".repeat(r.rating)}</span>
              </div>
              <MockBadge color={r.approved ? "#27ae60" : "#f39c12"} text={r.approved ? "معتمد" : "بانتظار الموافقة"} />
            </div>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.5)", margin: 0 }}>{r.text}</p>
            {!r.approved && (
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <div style={{ padding: "3px 10px", background: "rgba(39,174,96,0.15)", border: "1px solid rgba(39,174,96,0.3)", borderRadius: 5, fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "#27ae60" }}>✓ موافقة</div>
                <div style={{ padding: "3px 10px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 5, fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "#c0392b" }}>✕ رفض</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminMockupShell>
  )
}

// ── Main sections data ─────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: "dashboard",
    icon: "📊",
    title: "الداشبورد",
    subtitle: "نظرة شاملة على أداء المتجر",
    steps: [
      "بمجرد الدخول ستجد 4 كاردات إحصائية: إجمالي الطلبات، الطلبات المعلّقة، عدد المنتجات النشطة، وإجمالي المبيعات",
      "الرسم البياني يعرض إيرادات آخر 30 يوم — الأعمدة الذهبية تمثل حجم المبيعات اليومي",
      "جدول «آخر الطلبات» يعرض أحدث 5 طلبات مع اسم العميل، رقم الطلب، الحالة، والمبلغ",
      "اضغط على أي طلب للانتقال مباشرة إلى تفاصيله",
    ],
    tips: [
      "الكارد البرتقالي «طلبات معلّقة» هو الأهم — تابعه يومياً",
      "الرسم البياني لا يحسب الطلبات الملغاة",
    ],
    mockup: <DashboardMockup />,
  },
  {
    id: "products",
    icon: "📦",
    title: "المنتجات",
    subtitle: "إضافة وتعديل وإدارة كتالوج المتجر",
    steps: [
      "اضغط «+ منتج جديد» لفتح نموذج الإضافة",
      "أدخل: الاسم بالعربي، التصنيف، السعر الأساسي، سعر المقارنة (للخصومات)، الجودة (بريميوم / ميرور / أصلي)، الوصف",
      "في قسم «الصور»: ارفع صورة أو أكثر — أول صورة ترفعها ستكون الرئيسية التي تظهر في الكارت",
      "في قسم «المتغيّرات»: أضف مقاسات أو ألوان مع ستوك وسعر مستقل لكل متغيّر",
      "حدّد «مميّز» إذا أردت ظهور المنتج في عروض الفلاش (مع سعر مقارنة أعلى من السعر الحالي)",
      "اختر الحالة: «نشط» = يظهر في المتجر، «مسودة» = مخفي، «نفذ» = يظهر كـ Out of Stock",
      "اضغط «حفظ» — المنتج يظهر فوراً في المتجر",
    ],
    tips: [
      "السعر الأساسي هو سعر البيع الفعلي — سعر المقارنة هو السعر القديم المشطوب",
      "الصورة المثالية: 800×800 بكسل، خلفية بيضاء أو نظيفة",
      "المنتجات مرتّبة في المتجر من الأحدث للأقدم تلقائياً",
    ],
    mockup: <ProductsMockup />,
  },
  {
    id: "orders",
    icon: "🧾",
    title: "الطلبات",
    subtitle: "استقبال ومتابعة وتحديث حالات الطلبات",
    steps: [
      "تُرسَل الطلبات من زر «إتمام الطلب» في المتجر — تظهر هنا فوراً بحالة «معلّق»",
      "اضغط على أي طلب لفتح صفحة التفاصيل الكاملة (المنتجات، العنوان، رقم الهاتف)",
      "غيّر الحالة من القائمة المنسدلة: معلّق ← مؤكد ← شُحن ← سُلّم",
      "يمكن استخدام الفلاتر العلوية للتصفية حسب الحالة",
      "لإلغاء طلب: غيّر حالته إلى «ملغي» — لا يمكن حذف الطلبات حمايةً للسجل",
    ],
    tips: [
      "«مؤكد» يعني: اتصلتِ بالعميلة وأكدتِ الطلب",
      "«شُحن» يعني: سلّمتِ الطلب للشركة",
      "«سُلّم» يعني: وصل للعميلة — الإيرادات تُحسب فقط من الطلبات المسلّمة",
    ],
    mockup: <OrdersMockup />,
  },
  {
    id: "categories",
    icon: "🏷️",
    title: "الأقسام",
    subtitle: "إدارة تصنيفات المتجر",
    steps: [
      "اضغط «+ قسم جديد» وأدخل الاسم بالعربي والـ Slug (بالإنجليزي بدون مسافات مثل: handbags)",
      "رقم الترتيب يحدد موضع القسم في شريط التصنيفات على الصفحة الرئيسية",
      "لتعديل اسم قسم: اضغط أيقونة القلم بجانبه",
      "لا تحذف قسماً فيه منتجات — انقل المنتجات أولاً لقسم آخر",
    ],
    tips: [
      "الأقسام تظهر في: شريط الفلترة أعلى المنتجات، وشريط pills الصفحة الرئيسية",
      "اجعل أسماء الأقسام قصيرة ومعبّرة (شنط، محافظ، أحذية)",
    ],
    mockup: (
      <AdminMockupShell title="الأقسام — ShahY Admin">
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", fontWeight: 700 }}>الأقسام (7)</span>
            <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontFamily: "Tajawal,sans-serif" }}>+ قسم جديد</div>
          </div>
          {["شنط", "محافظ", "كلتشات", "أحذية", "إكسسوارات", "ساعات", "نظارات"].map((cat, i) => (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#111009", borderRadius: 7, border: "1px solid rgba(201,168,76,0.06)" }}>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.2)", width: 14 }}>#{i + 1}</span>
              <span style={{ flex: 1, fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0" }}>{cat}</span>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.3)" }}>{cat.toLowerCase().replace("ي", "")}</span>
              <div style={{ fontSize: 10 }}>✏️</div>
            </div>
          ))}
        </div>
      </AdminMockupShell>
    ),
  },
  {
    id: "flash",
    icon: "⚡",
    title: "عروض الفلاش",
    subtitle: "إدارة العروض المحدودة بعداد تنازلي",
    steps: [
      "اذهب إلى «الإعدادات» → فعّل «عروض الفلاش» وأدخل تاريخ الانتهاء",
      "الانتقال إلى «المنتجات» → عدّل المنتجات التي تريد تضمينها في الفلاش",
      "لكل منتج: فعّل «مميّز» ✓ وأضف «سعر المقارنة» أعلى من السعر الحالي",
      "المنتجات ستظهر تلقائياً في قسم الفلاش مع نسبة الخصم والعداد التنازلي",
      "عند انتهاء الوقت: يختفي قسم الفلاش من المتجر تلقائياً",
    ],
    tips: [
      "الحد الأقصى 8 منتجات في الفلاش",
      "يمكن تغيير وقت الانتهاء في أي وقت لتمديد العرض",
    ],
    mockup: <FlashMockup />,
  },
  {
    id: "banners",
    icon: "🖼️",
    title: "البانرات الإعلانية",
    subtitle: "إدارة البانرات الدوّارة في الصفحة الرئيسية",
    steps: [
      "اضغط «+ رفع بانر» واختر الصورة (يُفضّل 1200×400 بكسل)",
      "أضف عنواناً ورابطاً اختيارياً (مثل: /sale أو /products)",
      "رقم الترتيب يحدد ترتيب ظهور البانرات",
      "اضغط على زر التبديل لتفعيل أو إيقاف أي بانر بدون حذفه",
    ],
    tips: [
      "البانرات تظهر كـ carousel دوّار في الصفحة الرئيسية",
      "لا تضع أكثر من 4-5 بانرات للأداء الأمثل",
    ],
    mockup: <BannersMockup />,
  },
  {
    id: "reviews",
    icon: "⭐",
    title: "التقييمات",
    subtitle: "إدارة ومراجعة تقييمات العملاء",
    steps: [
      "التقييمات الجديدة تظهر بحالة «بانتظار الموافقة» — لا تظهر في المتجر حتى تعتمدها",
      "اضغط «✓ موافقة» لنشر التقييم في المتجر",
      "اضغط «✕ رفض» لحذف أي تقييم غير لائق أو كاذب",
      "التقييمات المعتمدة تظهر في قسم «آراء العملاء» بالصفحة الرئيسية",
    ],
    tips: [
      "التقييمات الأعلى نجوماً تظهر أولاً في الصفحة الرئيسية",
      "راجع التقييمات يومياً — العميلة تنتظر ردك",
    ],
    mockup: <ReviewsMockup />,
  },
  {
    id: "discounts",
    icon: "🎁",
    title: "أكواد الخصم",
    subtitle: "إنشاء وإدارة أكواد الحسم",
    steps: [
      "اضغط «+ كود جديد» وأدخل اسم الكود (مثل: SHAHY10)",
      "اختر نوع الخصم: نسبة مئوية % أو مبلغ ثابت بالجنيه",
      "أدخل الحد الأدنى للطلب (اختياري) — مثل: لا يُطبَّق إلا على طلبات فوق 500 ج",
      "حدّد تاريخ الانتهاء واضغط «حفظ»",
      "شاركي الكود مع العملاء عبر واتساب أو انستاجرام",
    ],
    tips: [
      "الكود يُستخدم في صفحة Checkout قبل إتمام الطلب",
      "يمكنك إيقاف أي كود مؤقتاً بدون حذفه",
    ],
    mockup: (
      <AdminMockupShell title="الخصومات — ShahY Admin">
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", fontWeight: 700 }}>أكواد الخصم</span>
            <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontFamily: "Tajawal,sans-serif" }}>+ كود جديد</div>
          </div>
          {[
            { code: "SHAHY10", type: "10%", min: "200 ج", expires: "2026-07-31", active: true },
            { code: "WELCOME50", type: "50 ج ثابت", min: "500 ج", expires: "2026-12-31", active: true },
            { code: "SUMMER20", type: "20%", min: "—", expires: "2026-06-30", active: false },
          ].map(d => (
            <div key={d.code} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#111009", borderRadius: 8, border: "1px solid rgba(201,168,76,0.06)" }}>
              <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 5, padding: "3px 8px", fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: 1 }}>{d.code}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#F5EFE0" }}>{d.type} · حد أدنى {d.min}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.3)" }}>ينتهي {d.expires}</div>
              </div>
              <MockBadge color={d.active ? "#27ae60" : "#555"} text={d.active ? "نشط" : "موقف"} />
            </div>
          ))}
        </div>
      </AdminMockupShell>
    ),
  },
  {
    id: "shipping",
    icon: "🚚",
    title: "مناطق الشحن",
    subtitle: "إعداد أسعار الشحن لكل محافظة",
    steps: [
      "اضغط «+ منطقة شحن» وأدخل اسم المنطقة (مثل: القاهرة الكبرى)",
      "أدخل سعر الشحن بالجنيه وعدد أيام التوصيل المتوقع",
      "يمكن إضافة عدة مناطق بأسعار مختلفة (الصعيد، الإسكندرية، الدلتا...)",
      "العميلة تختار المنطقة عند إتمام الطلب — يُضاف سعر الشحن تلقائياً",
    ],
    tips: [
      "ابدأ بمنطقتين: القاهرة الكبرى + باقي الجمهورية",
      "يمكن وضع سعر 0 لتقديم شحن مجاني على بعض المناطق",
    ],
    mockup: (
      <AdminMockupShell title="الشحن — ShahY Admin">
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { zone: "القاهرة الكبرى والجيزة", price: "35 ج", days: "2-3 أيام" },
            { zone: "الإسكندرية والمحافظات الكبرى", price: "45 ج", days: "3-4 أيام" },
            { zone: "باقي المحافظات والصعيد", price: "55 ج", days: "4-6 أيام" },
          ].map(z => (
            <div key={z.zone} style={{ padding: "8px 12px", background: "#111009", borderRadius: 8, border: "1px solid rgba(201,168,76,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0" }}>{z.zone}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.35)", marginTop: 2 }}>{z.days}</div>
              </div>
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#C9A84C" }}>{z.price}</span>
            </div>
          ))}
        </div>
      </AdminMockupShell>
    ),
  },
  {
    id: "settings",
    icon: "⚙️",
    title: "الإعدادات",
    subtitle: "إعدادات المتجر العامة — هنا تتحكمين في كل شيء",
    steps: [
      "اسم المتجر: يظهر في تاب المتصفح وبعض الصفحات",
      "رقم واتساب الطلبات: يُستخدم في أزرار واتساب في المتجر كله — غيّريه إذا تغيّر رقمك",
      "كلمات الهيرو: الكلمات الدوارة في الصفحة الرئيسية، افصليها بفاصلة (,)",
      "الإعلان العلوي: نص يظهر أعلى الموقع — اتركيه فارغاً لإخفائه",
      "عروض الفلاش: فعّلي الزر واضبطي وقت الانتهاء",
      "بعد تعديل أي إعداد اضغطي «حفظ» — التغييرات تظهر فوراً",
    ],
    tips: [
      "غيّري كلمات الهيرو كل فترة لإبقاء الموقع حيّاً",
      "الإعلان العلوي مثالي لإعلانات الشحن المجاني أو العروض",
    ],
    mockup: <SettingsMockup />,
  },
  {
    id: "admins",
    icon: "👥",
    title: "الصلاحيات",
    subtitle: "إضافة وإدارة حسابات الأدمن",
    steps: [
      "اضغط «+ أدمن جديد» وأدخل الاسم والبريد الإلكتروني وكلمة المرور",
      "الأدمن الجديد يستطيع الدخول فوراً بالبيانات التي أدخلتِها",
      "يمكن حذف أي حساب أدمن — لكن لا تحذفي حسابك الأساسي!",
    ],
    tips: [
      "لا تشاركي كلمة المرور — أضفي حساباً منفصلاً لكل شخص",
      "استخدمي كلمة مرور قوية (8+ حروف، أرقام، رموز)",
    ],
    mockup: (
      <AdminMockupShell title="الصلاحيات — ShahY Admin">
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0", fontWeight: 700 }}>المشرفون</span>
            <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontFamily: "Tajawal,sans-serif" }}>+ أدمن جديد</div>
          </div>
          {[
            { name: "شاهندة سليمان", email: "shahy@store.com", role: "مالك" },
            { name: "مساعدة المتجر", email: "helper@store.com", role: "أدمن" },
          ].map(a => (
            <div key={a.email} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#111009", borderRadius: 8, border: "1px solid rgba(201,168,76,0.06)" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F5EFE0" }}>{a.name}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.35)" }}>{a.email}</div>
              </div>
              <MockBadge color={a.role === "مالك" ? "#C9A84C" : "#3498db"} text={a.role} />
            </div>
          ))}
        </div>
      </AdminMockupShell>
    ),
  },
  {
    id: "ads",
    icon: "📣",
    title: "دليل الإعلانات المدفوعة",
    subtitle: "Google Ads · Meta Ads · TikTok Ads — دليل مبتدئ متكامل",
    steps: [
      "ابدأ بـ Meta Ads (فيسبوك/انستاجرام) — الأسهل والأكثر فاعلية للبنات في مصر",
      "حدّدي الجمهور: نساء 18-45 سنة، مصر كلها أو محافظات محددة، اهتمامات: موضة، شنط، إكسسوارات",
      "ابدأي بميزانية صغيرة: 50-100 ج/يوم وراقبي النتائج أسبوع قبل ما تزوّدي",
      "لـ Google Ads: اختاري نوع «شبكة البحث» وكلمات مفتاحية زي: شنط شانيل مصر، شنط فاخرة، إكسسوارات نسائية",
      "لـ TikTok Ads: الفيديو هو الملك — سجّلي فيديو Unboxing أو عرض المنتج وارفعيه كإعلان",
      "استخدمي الـ Pixel دايماً — هو اللي بيساعدك تعرفي مين اشترى وتستهدفيه تاني",
    ],
    tips: [
      "افتحي حساب Business على Meta قبل الإعلانات: business.facebook.com",
      "أهم رقم: CPP (تكلفة الشراء) مش CPM أو CPC",
      "أعلاني عن المنتجات الأكثر مبيعاً مش كل المنتجات",
      "Retargeting: استهدفي الناس اللي زاروا موقعك بعروض خاصة",
      "A/B Testing: جرّبي 2-3 إعلانات بنفس الوقت وشوفي أيهم أحسن",
      "أوقات الإعلانات الأحسن: 8-11 مساءً وأيام الخميس والجمعة",
    ],
    mockup: (
      <AdminMockupShell title="خطة الإعلانات — شاهي ستور">
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { platform: "Meta Ads", color: "#1877F2", budget: "100-200 ج/يوم", icon: "📘" },
              { platform: "TikTok Ads", color: "#FF0050", budget: "50-150 ج/يوم", icon: "🎵" },
              { platform: "Google Ads", color: "#34A853", budget: "100-200 ج/يوم", icon: "🔍" },
            ].map(p => (
              <div key={p.platform} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${p.color}33`, background: `${p.color}11`, textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{p.icon}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#F5EFE0", fontWeight: 700, marginBottom: 2 }}>{p.platform}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: `${p.color}`, fontWeight: 700 }}>{p.budget}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 12px", background: "#111009", borderRadius: 8, border: "1px solid rgba(201,168,76,0.1)" }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#C9A84C", fontWeight: 700, marginBottom: 4 }}>✦ مثال إعلان انستاجرام</div>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "rgba(245,239,224,0.7)", lineHeight: 1.7 }}>
              «شنطة شانيل أوريجنال 🖤 بأسعار لا تصدقيها — اطلبي دلوقتي وهيوصلك خلال يومين 🚀 كود خصم: SHAHY10»
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { label: "الجمهور المستهدف", val: "نساء 18-45، مصر" },
              { label: "أفضل وقت للنشر", val: "8-11 مساءً" },
              { label: "أهم مقياس", val: "CPP (تكلفة الشراء)" },
              { label: "ابدأي بـ", val: "50-100 ج/يوم" },
            ].map(i => (
              <div key={i.label} style={{ padding: "6px 8px", background: "rgba(201,168,76,0.05)", borderRadius: 6, border: "1px solid rgba(201,168,76,0.08)" }}>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.4)", marginBottom: 2 }}>{i.label}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#F5EFE0", fontWeight: 700 }}>{i.val}</div>
              </div>
            ))}
          </div>
        </div>
      </AdminMockupShell>
    ),
  },
  {
    id: "ai-image",
    icon: "🤖",
    title: "برومبت الصور بالذكاء الاصطناعي",
    subtitle: "حوّلي أي صورة لإعلان عالمي في ثوانٍ",
    steps: [
      "افتحي أي نموذج AI للصور: ChatGPT-4o أو Gemini أو Claude أو Midjourney",
      "ارفعي صورة المنتج (الخلفية البيضاء أو صورة طبيعية)",
      "انسخي البرومبت الجاهز من زرار التحميل أدناه وأضيفي عليه اسم المنتج",
      "النموذج هيعدّل الإضاءة والخلفية ويحوّلها لصورة إعلانية احترافية",
      "استخدمي الصورة مباشرة في إعلانات Meta أو TikTok أو Stories",
    ],
    tips: [
      "أوضح الصور: خلفية بيضاء أو رمادية فاتحة بدون فوضى",
      "جرّبي أكثر من صورة وخذي أحسن نتيجة",
      "ChatGPT-4o مجاني للمشتركين ويدي نتائج ممتازة",
      "احفظي الصور بجودة عالية (PNG أو JPG 1080×1080 على الأقل)",
    ],
    mockup: (
      <AdminMockupShell title="AI Image Prompt — شاهي ستور">
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "10px 12px", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 8 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#a855f7", fontWeight: 700, marginBottom: 6 }}>🤖 البرومبت الجاهز (مثال مختصر)</div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(245,239,224,0.6)", lineHeight: 1.7 }}>
              "Transform this product photo into a world-class luxury fashion ad. Dark golden background, dramatic lighting, Arabic text «شاهي ستور» elegant serif font..."
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { tool: "ChatGPT-4o", color: "#10b981", note: "مجاني ✓" },
              { tool: "Gemini", color: "#3b82f6", note: "مجاني ✓" },
              { tool: "Claude", color: "#C9A84C", note: "مجاني ✓" },
            ].map(t => (
              <div key={t.tool} style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: `1px solid ${t.color}33`, background: `${t.color}11`, textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: t.color, fontWeight: 700 }}>{t.tool}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 8, color: "rgba(245,239,224,0.4)", marginTop: 2 }}>{t.note}</div>
              </div>
            ))}
          </div>
          <a
            href="/ai-image-prompt.md"
            download="shahy-ai-prompt.md"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px 0", borderRadius: 8,
              background: "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(168,85,247,0.05))",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#a855f7", textDecoration: "none",
              fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700,
            }}
          >
            ⬇️ تحميل البرومبت الكامل
          </a>
        </div>
      </AdminMockupShell>
    ),
  },
]

// ── Main Component ─────────────────────────────────────────────────────────
export default function AdminGuidePage() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div style={{ direction: "rtl", fontFamily: "Tajawal, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800;900&family=Cinzel:wght@400&display=swap');
        .guide-toc-item { transition: all 0.2s; cursor: pointer; }
        .guide-toc-item:hover { background: rgba(201,168,76,0.08) !important; }
        .guide-section-card { transition: all 0.25s; }
        .guide-section-card:hover .guide-expand-btn { opacity: 1 !important; }
        .guide-step-item { transition: background 0.2s; }
        .guide-step-item:hover { background: rgba(201,168,76,0.04); border-radius: 6px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .guide-detail { animation: fadeIn 0.3s ease; }
        .guide-dl-btn { transition: all 0.2s; }
        .guide-dl-btn:hover { opacity: 0.85; transform: translateY(-1px); }
      `}</style>

      {/* ── Download bar ────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
        padding: "14px 18px", marginBottom: 28,
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12,
      }}>
        <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(245,239,224,0.4)", marginLeft: "auto" }}>
          📥 تحميل الدليل
        </span>
        <a
          href="/admin/guide/print"
          target="_blank"
          rel="noopener noreferrer"
          className="guide-dl-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "8px 18px", borderRadius: 8, textDecoration: "none",
            background: "linear-gradient(135deg,#C9A84C,#F0D882)",
            color: "#0A0806", fontFamily: "Tajawal,sans-serif",
            fontSize: 13, fontWeight: 700,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          طباعة الدليل / PDF
        </a>
        <a
          href="/shahy-store-context.md"
          download="shahy-store-context.md"
          className="guide-dl-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "8px 18px", borderRadius: 8, textDecoration: "none",
            background: "rgba(245,239,224,0.06)",
            border: "1px solid rgba(245,239,224,0.15)",
            color: "rgba(245,239,224,0.7)", fontFamily: "Tajawal,sans-serif",
            fontSize: 13, fontWeight: 600,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          ملف السياق للـ AI
        </a>
        <a
          href="/admin/guide/handover"
          target="_blank"
          rel="noopener noreferrer"
          className="guide-dl-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "8px 18px", borderRadius: 8, textDecoration: "none",
            background: "rgba(123,28,46,0.15)",
            border: "1px solid rgba(123,28,46,0.4)",
            color: "#E8756A", fontFamily: "Tajawal,sans-serif",
            fontSize: 13, fontWeight: 600,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          وثيقة نقل الملكية
        </a>
        <a
          href="/ai-image-prompt.md"
          download="shahy-ai-prompt.md"
          className="guide-dl-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "8px 18px", borderRadius: 8, textDecoration: "none",
            background: "rgba(168,85,247,0.1)",
            border: "1px solid rgba(168,85,247,0.3)",
            color: "#a855f7", fontFamily: "Tajawal,sans-serif",
            fontSize: 13, fontWeight: 600,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"/>
          </svg>
          برومبت AI للصور
        </a>
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 10, letterSpacing: "6px", color: "rgba(201,168,76,0.6)", marginBottom: 10 }}>
          ✦ &nbsp; SHAHY STORE ADMIN &nbsp; ✦
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#F5EFE0", margin: "0 0 8px", lineHeight: 1.2 }}>
          دليل الأدمن الشامل
        </h1>
        <p style={{ color: "rgba(245,239,224,0.45)", fontSize: 14, margin: 0 }}>
          كل ما تحتاج معرفته لإدارة المتجر من الصفر — خطوة بخطوة
        </p>
      </div>

      {/* ── Quick Start Banner ──────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(123,28,46,0.08) 100%)",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 36,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🚀</span>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#C9A84C", margin: 0 }}>البداية السريعة</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12 }}>
          {[
            { step: "1", text: "ادخل الأدمن من", link: "/admin/login", linkText: "/admin/login" },
            { step: "2", text: "أضف منتجاتك من صفحة «المنتجات»" },
            { step: "3", text: "جهّز الأقسام والشحن والإعدادات" },
            { step: "4", text: "تابع الطلبات يومياً وحدّث حالاتها" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                color: "#0A0806", fontSize: 12, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s.step}</div>
              <p style={{ color: "rgba(245,239,224,0.7)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                {s.text}{" "}
                {s.link && <a href={s.link} style={{ color: "#C9A84C", textDecoration: "underline" }}>{s.linkText}</a>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOC ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: "2px", color: "rgba(245,239,224,0.3)", marginBottom: 12, textTransform: "uppercase" }}>محتويات الدليل</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={e => { e.preventDefault(); setActive(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
              className="guide-toc-item"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 20,
                background: active === s.id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active === s.id ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: active === s.id ? "#C9A84C" : "rgba(245,239,224,0.5)",
                textDecoration: "none", fontSize: 13,
                transition: "all 0.2s",
              }}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Sections ────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {SECTIONS.map((section, idx) => {
          const isOpen = active === section.id
          return (
            <div
              key={section.id}
              id={section.id}
              className="guide-section-card"
              style={{
                background: isOpen ? "rgba(201,168,76,0.03)" : "rgba(255,255,255,0.01)",
                border: `1px solid ${isOpen ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 0.25s, background 0.25s",
              }}
            >
              {/* Section header */}
              <button
                onClick={() => setActive(isOpen ? null : section.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 14,
                  padding: "18px 24px", background: "none", border: "none",
                  cursor: "pointer", textAlign: "right",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: isOpen ? "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isOpen ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{section.icon}</div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, color: "rgba(245,239,224,0.2)", letterSpacing: "1px" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 16, fontWeight: 800, color: "#F5EFE0", margin: 0 }}>
                      {section.title}
                    </h3>
                  </div>
                  <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(245,239,224,0.4)", margin: "2px 0 0" }}>
                    {section.subtitle}
                  </p>
                </div>
                <div
                  className="guide-expand-btn"
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#C9A84C", fontSize: 14, flexShrink: 0,
                    opacity: isOpen ? 1 : 0.4,
                    transition: "transform 0.25s, opacity 0.25s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </div>
              </button>

              {/* Expandable detail */}
              {isOpen && (
                <div className="guide-detail" style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ height: 1, background: "rgba(201,168,76,0.1)" }} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    {/* Steps */}
                    <div>
                      <h4 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>
                        الخطوات
                      </h4>
                      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {section.steps.map((step, i) => (
                          <li key={i} className="guide-step-item" style={{ display: "flex", gap: 12, padding: "6px 8px" }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                              border: "1px solid rgba(201,168,76,0.3)",
                              color: "#C9A84C", fontSize: 11, fontWeight: 700,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              marginTop: 1,
                            }}>{i + 1}</div>
                            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(245,239,224,0.75)", margin: 0, lineHeight: 1.6 }}>{step}</p>
                          </li>
                        ))}
                      </ol>

                      {section.tips && (
                        <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 10 }}>
                          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, color: "#C9A84C", marginBottom: 8 }}>💡 نصائح</div>
                          {section.tips.map((tip, i) => (
                            <p key={i} style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(245,239,224,0.5)", margin: "0 0 4px", display: "flex", gap: 6 }}>
                              <span style={{ color: "rgba(201,168,76,0.5)" }}>•</span> {tip}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Mockup */}
                    <div>
                      <h4 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>
                        معاينة الشاشة
                      </h4>
                      {section.mockup}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <div style={{
        marginTop: 48, padding: "28px 32px",
        background: "linear-gradient(135deg,rgba(123,28,46,0.15),rgba(201,168,76,0.08))",
        border: "1px solid rgba(201,168,76,0.15)", borderRadius: 16,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>📞</div>
        <h3 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 800, color: "#F5EFE0", margin: "0 0 8px" }}>
          محتاج مساعدة؟
        </h3>
        <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(245,239,224,0.45)", margin: "0 0 16px" }}>
          تواصل مع المطوّر مباشرة لأي استفسار تقني
        </p>
        <a
          href="https://wa.me/201030002331"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
            color: "#25D366", borderRadius: 10, padding: "10px 22px",
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
          </svg>
          واتساب المطوّر
        </a>
      </div>
    </div>
  )
}
