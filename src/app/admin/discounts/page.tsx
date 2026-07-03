"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface DiscountCode {
  id: string
  code: string
  type: "percent" | "fixed"
  value: number
  min_order: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0A0806", border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: 8, padding: "10px 14px", color: "#F5EFE0",
  fontFamily: "Tajawal,sans-serif", fontSize: 14, outline: "none",
}

export default function DiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    code: "", type: "percent", value: "", min_order: "", max_uses: "", expires_at: "",
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/discounts")
      if (res.ok) setCodes(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code || !form.value) { toast.error("الكود والقيمة مطلوبة"); return }
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value),
          min_order: form.min_order ? Number(form.min_order) : 0,
          max_uses: form.max_uses ? Number(form.max_uses) : null,
          expires_at: form.expires_at || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
      toast.success("تم إنشاء الكود")
      setForm({ code: "", type: "percent", value: "", min_order: "", max_uses: "", expires_at: "" })
      setShowForm(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/discounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    })
    if (res.ok) {
      setCodes(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c))
      toast.success(!current ? "تم تفعيل الكود" : "تم تعطيل الكود")
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`حذف الكود "${code}"؟`)) return
    const res = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" })
    if (res.ok) {
      setCodes(prev => prev.filter(c => c.id !== id))
      toast.success("تم حذف الكود")
    }
  }

  function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    setForm(f => ({ ...f, code: `SHAHY${rand}` }))
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "Tajawal,sans-serif", direction: "rtl" }}>
      <style>{`
                input,select { background: #0A0806 !important; color: #F5EFE0 !important; }
        input::placeholder { color: rgba(245,239,224,0.25) !important; }
        input:focus, select:focus { border-color: rgba(201,168,76,0.5) !important; outline: none; }
        .badge-active { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
        .badge-inactive { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F5EFE0", margin: 0 }}>أكواد الخصم</h1>
          <p style={{ fontSize: 13, color: "rgba(245,239,224,0.35)", margin: "4px 0 0" }}>
            {codes.length} كود — {codes.filter(c => c.is_active).length} مفعّل
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            background: showForm ? "rgba(201,168,76,0.08)" : "linear-gradient(135deg,#C9A84C,#F0D882)",
            color: showForm ? "#C9A84C" : "#0A0806", fontFamily: "Tajawal,sans-serif",
            fontWeight: 700, fontSize: 14, padding: "10px 20px", borderRadius: 8,
            border: showForm ? "1px solid rgba(201,168,76,0.3)" : "none", cursor: "pointer",
          }}
        >
          {showForm ? "إلغاء" : "+ كود جديد"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: "linear-gradient(145deg,#0E0C09,#111009)",
          border: "1px solid rgba(201,168,76,0.15)", borderRadius: 14, padding: "24px 20px",
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#C9A84C", margin: "0 0 20px" }}>إنشاء كود خصم جديد</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>الكود *</label>
              <div style={{ display: "flex", gap: 6 }}>
                <input style={inputStyle} placeholder="SHAHY2025" value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                <button type="button" onClick={generateCode}
                  style={{ padding: "0 12px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "#C9A84C", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>
                  عشوائي
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>نوع الخصم *</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="percent">نسبة مئوية (%)</option>
                <option value="fixed">مبلغ ثابت (ج.م)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>
                القيمة * {form.type === "percent" ? "(1–100)" : "(ج.م)"}
              </label>
              <input style={inputStyle} type="number" min="1" max={form.type === "percent" ? 100 : undefined}
                placeholder={form.type === "percent" ? "15" : "50"} value={form.value}
                onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>الحد الأدنى للطلب (ج.م)</label>
              <input style={inputStyle} type="number" min="0" placeholder="0" value={form.min_order}
                onChange={e => setForm(f => ({ ...f, min_order: e.target.value }))} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>أقصى عدد استخدامات</label>
              <input style={inputStyle} type="number" min="1" placeholder="غير محدود" value={form.max_uses}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>تاريخ الانتهاء</label>
              <input style={inputStyle} type="datetime-local" value={form.expires_at}
                onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} />
            </div>
          </div>

          <button type="submit" disabled={submitting}
            style={{
              background: "linear-gradient(135deg,#C9A84C,#F0D882)", color: "#0A0806",
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
              padding: "11px 28px", borderRadius: 8, border: "none", cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}>
            {submitting ? "جاري الحفظ..." : "حفظ الكود"}
          </button>
        </form>
      )}

      {/* Table */}
      <div style={{ background: "#0A0806", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 14, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "rgba(245,239,224,0.25)", fontSize: 14 }}>جاري التحميل...</div>
        ) : codes.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>🎁</div>
            <p style={{ color: "rgba(245,239,224,0.3)", fontSize: 14 }}>لا يوجد أكواد خصم بعد</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                {["الكود", "النوع", "القيمة", "الاستخدام", "الحد الأدنى", "الانتهاء", "الحالة", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 11, color: "rgba(201,168,76,0.7)", fontWeight: 700, letterSpacing: "1.5px", textAlign: "right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {codes.map((c, i) => {
                const expired = c.expires_at && new Date(c.expires_at) < new Date()
                const exhausted = c.max_uses !== null && c.used_count >= c.max_uses
                return (
                  <tr key={c.id} style={{ borderBottom: i < codes.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontFamily: "monospace", fontSize: 13, fontWeight: 700, letterSpacing: "1px",
                        background: "rgba(201,168,76,0.08)", color: "#C9A84C",
                        padding: "3px 10px", borderRadius: 6,
                      }}>{c.code}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(245,239,224,0.6)" }}>
                      {c.type === "percent" ? "نسبة %" : "مبلغ ثابت"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#F5EFE0" }}>
                      {c.type === "percent" ? `${c.value}%` : `${c.value} ج.م`}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(245,239,224,0.6)" }}>
                      {c.used_count}{c.max_uses !== null ? ` / ${c.max_uses}` : ""}
                      {exhausted && <span style={{ marginRight: 6, fontSize: 11, color: "#f87171" }}>منتهي</span>}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(245,239,224,0.6)" }}>
                      {Number(c.min_order) > 0 ? `${Number(c.min_order).toLocaleString("ar-EG")} ج.م` : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: expired ? "#f87171" : "rgba(245,239,224,0.45)" }}>
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString("ar-EG") : "—"}
                      {expired && " ⚠"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => toggleActive(c.id, c.is_active)}
                        className={c.is_active ? "badge-active" : "badge-inactive"}
                        style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>
                        {c.is_active ? "مفعّل" : "معطّل"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => handleDelete(c.id, c.code)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.5)", fontSize: 18, lineHeight: 1, padding: 4 }}
                        title="حذف">×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
