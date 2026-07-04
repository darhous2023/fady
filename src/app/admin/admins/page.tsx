"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface Admin {
  id: string
  name: string
  email: string
  role: "owner" | "manager" | "staff"
  is_active: boolean
  created_at: string
}

const ROLES = [
  { value: "owner", label: "مالك", desc: "كل الصلاحيات", color: "#9BA3AA" },
  { value: "manager", label: "مدير", desc: "منتجات + طلبات + خصومات", color: "#7B6FCC" },
  { value: "staff", label: "موظف", desc: "الطلبات فقط", color: "#5B9BD5" },
]

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: 8, padding: "10px 14px", color: "#F2F0EC",
  fontFamily: "Tajawal,sans-serif", fontSize: 14, outline: "none",
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/admins")
      if (res.ok) setAdmins(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error("كل الحقول مطلوبة"); return }
    if (form.password.length < 8) { toast.error("كلمة السر 8 أحرف على الأقل"); return }
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
      toast.success(`تم إضافة ${form.name} كـ ${ROLES.find(r => r.value === form.role)?.label}`)
      setForm({ name: "", email: "", password: "", role: "staff" })
      setShowForm(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  async function changeRole(id: string, role: string) {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
    if (res.ok) {
      setAdmins(prev => prev.map(a => a.id === id ? { ...a, role: role as Admin["role"] } : a))
      toast.success("تم تغيير الصلاحية")
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    })
    if (res.ok) {
      setAdmins(prev => prev.map(a => a.id === id ? { ...a, is_active: !current } : a))
      toast.success(!current ? "تم التفعيل" : "تم الإيقاف")
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`حذف ${name}؟ مش هيقدر يدخل الأدمن بعد كده.`)) return
    const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" })
    if (res.ok) {
      setAdmins(prev => prev.filter(a => a.id !== id))
      toast.success("تم الحذف")
    }
  }

  return (
    <div className="space-y-6" dir="rtl" style={{ fontFamily: "Tajawal,sans-serif" }}>
      <style>{`
                input,select { background: #0A0A0A !important; color: #F2F0EC !important; }
        input::placeholder { color: rgba(245,239,224,0.25) !important; }
        input:focus,select:focus { border-color: rgba(201,168,76,0.5) !important; outline: none; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F2F0EC", margin: 0 }}>إدارة الصلاحيات</h1>
          <p style={{ fontSize: 13, color: "rgba(245,239,224,0.35)", margin: "4px 0 0" }}>
            {admins.length} مستخدم — {admins.filter(a => a.is_active).length} نشط
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          style={{
            background: showForm ? "rgba(201,168,76,0.08)" : "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
            color: showForm ? "#9BA3AA" : "#0A0A0A", fontFamily: "Tajawal,sans-serif",
            fontWeight: 700, fontSize: 14, padding: "10px 20px", borderRadius: 8,
            border: showForm ? "1px solid rgba(201,168,76,0.3)" : "none", cursor: "pointer",
          }}>
          {showForm ? "إلغاء" : "+ مستخدم جديد"}
        </button>
      </div>

      {/* Role Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {ROLES.map(r => (
          <div key={r.value} style={{
            background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
            padding: "12px 16px", flex: "1 1 160px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: r.color }}>{r.label}</span>
            </div>
            <span style={{ fontSize: 12, color: "rgba(245,239,224,0.4)" }}>{r.desc}</span>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: "linear-gradient(145deg,#0A0A0A,#111111)",
          border: "1px solid rgba(201,168,76,0.15)", borderRadius: 14, padding: "24px 20px",
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#9BA3AA", margin: "0 0 20px" }}>إضافة مستخدم جديد</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>الاسم *</label>
              <input style={inputStyle} placeholder="مثال: محمد أحمد"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>الإيميل *</label>
              <input style={inputStyle} type="email" placeholder="admin@example.com" dir="ltr"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>كلمة السر * (8+ أحرف)</label>
              <input style={inputStyle} type="password" placeholder="••••••••" dir="ltr"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(245,239,224,0.45)", marginBottom: 6 }}>الصلاحية *</label>
              <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={submitting}
            style={{
              background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A",
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
              padding: "11px 28px", borderRadius: 8, border: "none", cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}>
            {submitting ? "جاري الإنشاء..." : "إنشاء المستخدم"}
          </button>
        </form>
      )}

      {/* Admins Table */}
      <div style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 14, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "rgba(245,239,224,0.25)", fontSize: 14 }}>جاري التحميل...</div>
        ) : admins.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>👤</div>
            <p style={{ color: "rgba(245,239,224,0.3)", fontSize: 14 }}>لا يوجد مستخدمين بعد</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                {["المستخدم", "الصلاحية", "الحالة", "تاريخ الإضافة", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 11, color: "rgba(201,168,76,0.7)", fontWeight: 700, letterSpacing: "1.5px", textAlign: "right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((a, i) => {
                const roleInfo = ROLES.find(r => r.value === a.role)
                return (
                  <tr key={a.id} style={{ borderBottom: i < admins.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#F2F0EC" }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(245,239,224,0.4)", marginTop: 2 }}>{a.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <select value={a.role} onChange={e => changeRole(a.id, e.target.value)}
                        style={{
                          background: "transparent", border: `1px solid ${roleInfo?.color}44`,
                          borderRadius: 8, padding: "5px 10px", color: roleInfo?.color,
                          fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        }}>
                        {ROLES.map(r => <option key={r.value} value={r.value} style={{ background: "#0A0A0A", color: "#F2F0EC" }}>{r.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => toggleActive(a.id, a.is_active)}
                        style={{
                          padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
                          fontFamily: "Tajawal,sans-serif", border: "1px solid",
                          ...(a.is_active
                            ? { background: "rgba(34,197,94,0.1)", color: "#4ade80", borderColor: "rgba(34,197,94,0.2)" }
                            : { background: "rgba(239,68,68,0.1)", color: "#f87171", borderColor: "rgba(239,68,68,0.2)" })
                        }}>
                        {a.is_active ? "نشط" : "موقوف"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "rgba(245,239,224,0.4)" }}>
                      {new Date(a.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => handleDelete(a.id, a.name)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.4)", fontSize: 18, padding: 4 }}>×</button>
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
