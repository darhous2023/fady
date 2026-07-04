"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface Zone {
  id: string
  governorate_ar: string
  cost: number
  is_active: boolean
}

export const dynamic = "force-dynamic"

export default function ShippingPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editVal, setEditVal] = useState("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/shipping")
      if (res.ok) setZones(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function startEdit(z: Zone) {
    setEditing(z.id)
    setEditVal(String(z.cost))
  }

  async function saveEdit(id: string) {
    const cost = Number(editVal)
    if (isNaN(cost) || cost < 0) { toast.error("رقم غير صحيح"); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/shipping/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cost }),
      })
      if (!res.ok) { toast.error("حدث خطأ"); return }
      setZones(prev => prev.map(z => z.id === id ? { ...z, cost } : z))
      setEditing(null)
      toast.success("تم حفظ التكلفة")
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/shipping/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    })
    if (res.ok) {
      setZones(prev => prev.map(z => z.id === id ? { ...z, is_active: !current } : z))
      toast.success(!current ? "تم التفعيل" : "تم التعطيل")
    }
  }

  return (
    <div className="space-y-6" dir="rtl" style={{ fontFamily: "Tajawal,sans-serif" }}>
      <style>{``}</style>

      <div>
        <h1 className="text-2xl font-bold text-[#F2F0EC]">تكاليف الشحن</h1>
        <p className="text-[#F2F0EC]/40 text-sm mt-1">اضغط على السعر لتعديله — {zones.length} محافظة</p>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#F2F0EC]/25 text-sm">جاري التحميل...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#9BA3AA]/10">
                <th className="text-right px-6 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">المحافظة</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">التكلفة (ج.م)</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الحالة</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {zones.map((z, i) => (
                <tr key={z.id} style={{ borderBottom: i < zones.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <td className="px-6 py-3 text-[#F2F0EC]">{z.governorate_ar}</td>

                  <td className="px-4 py-3">
                    {editing === z.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="number" min="0" step="5"
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") saveEdit(z.id); if (e.key === "Escape") setEditing(null) }}
                          autoFocus
                          style={{
                            width: 90, background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.5)",
                            borderRadius: 6, padding: "5px 10px", color: "#F2F0EC", fontSize: 14, outline: "none",
                          }}
                        />
                        <button onClick={() => saveEdit(z.id)} disabled={saving}
                          style={{ padding: "4px 12px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6, color: "#9BA3AA", fontSize: 12, cursor: "pointer" }}>
                          حفظ
                        </button>
                        <button onClick={() => setEditing(null)}
                          style={{ background: "transparent", border: "none", color: "rgba(245,239,224,0.3)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(z)}
                        title="اضغط للتعديل"
                        style={{
                          background: "transparent", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 8, padding: "4px 0",
                        }}>
                        <span style={{ color: "#9BA3AA", fontWeight: 700, fontSize: 14 }}>
                          {Number(z.cost) === 0 ? "مجاني" : `${Number(z.cost)} ج.م`}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(z.id, z.is_active)}
                      style={{
                        padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Tajawal,sans-serif", border: "1px solid",
                        ...(z.is_active
                          ? { background: "rgba(34,197,94,0.1)", color: "#4ade80", borderColor: "rgba(34,197,94,0.2)" }
                          : { background: "rgba(239,68,68,0.1)", color: "#f87171", borderColor: "rgba(239,68,68,0.2)" })
                      }}>
                      {z.is_active ? "مفعّل" : "معطّل"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-[#F2F0EC]/25 text-xs">
                    {editing !== z.id && "✏ تعديل"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
