"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface Category {
  id: string
  name_ar: string
  slug: string
  sort_order: number
  is_active: boolean
}

function slugify(text: string) {
  return text.trim().toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w؀-ۿ-]/g, "")
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ name_ar: "", slug: "", sort_order: "0" })
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name_ar: "", slug: "", sort_order: "" })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) setCats(await res.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_ar: addForm.name_ar,
          slug: addForm.slug || slugify(addForm.name_ar),
          sort_order: Number(addForm.sort_order),
          is_active: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
      toast.success("تم إضافة القسم")
      setCats(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order))
      setShowAdd(false)
      setAddForm({ name_ar: "", slug: "", sort_order: "0" })
    } finally { setAdding(false) }
  }

  function startEdit(c: Category) {
    setEditing(c.id)
    setEditForm({ name_ar: c.name_ar, slug: c.slug, sort_order: String(c.sort_order) })
  }

  async function saveEdit(id: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_ar: editForm.name_ar,
          slug: editForm.slug,
          sort_order: Number(editForm.sort_order),
        }),
      })
      if (!res.ok) { toast.error("حدث خطأ"); return }
      const updated = await res.json()
      setCats(prev => prev.map(c => c.id === id ? updated : c).sort((a, b) => a.sort_order - b.sort_order))
      setEditing(null)
      toast.success("تم الحفظ")
    } finally { setSaving(false) }
  }

  async function toggleActive(c: Category) {
    const res = await fetch(`/api/admin/categories/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !c.is_active }),
    })
    if (res.ok) {
      setCats(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !x.is_active } : x))
      toast.success(!c.is_active ? "تم التفعيل" : "تم الإخفاء")
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`حذف قسم "${name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
      setCats(prev => prev.filter(c => c.id !== id))
      toast.success("تم حذف القسم")
    } finally { setDeleting(null) }
  }

  const inp = "bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-[#F2F0EC] text-sm outline-none focus:border-[#9BA3AA]/60 transition-colors font-[Tajawal,sans-serif]"

  return (
    <div className="space-y-6" dir="rtl" style={{ fontFamily: "Tajawal,sans-serif" }}>
      <style>{``}</style>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F0EC]">الأقسام</h1>
          <p className="text-[#F2F0EC]/40 text-sm mt-1">{cats.length} قسم</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>
          + قسم جديد
        </button>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="bg-[#0A0A0A] border border-[#9BA3AA]/20 rounded-2xl p-6 w-full max-w-md mx-4" dir="rtl">
            <h2 className="text-lg font-bold text-[#F2F0EC] mb-5">قسم جديد</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs text-[#F2F0EC]/50 mb-2">الاسم بالعربي *</label>
                <input required className={inp} style={{ width: "100%" }}
                  value={addForm.name_ar}
                  onChange={e => setAddForm(f => ({ ...f, name_ar: e.target.value, slug: slugify(e.target.value) }))}
                  placeholder="مثال: تويوتا"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F2F0EC]/50 mb-2">Slug (URL)</label>
                <input className={inp} style={{ width: "100%", direction: "ltr" }}
                  value={addForm.slug}
                  onChange={e => setAddForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="handbags"
                />
              </div>
              <div>
                <label className="block text-xs text-[#F2F0EC]/50 mb-2">الترتيب</label>
                <input type="number" className={inp} style={{ width: "100%" }}
                  value={addForm.sort_order}
                  onChange={e => setAddForm(f => ({ ...f, sort_order: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={adding}
                  className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-all"
                  style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A", opacity: adding ? 0.7 : 1 }}>
                  {adding ? "جاري الإضافة..." : "إضافة القسم"}
                </button>
                <button type="button" onClick={() => setShowAdd(false)}
                  className="px-5 py-2.5 rounded-lg text-sm text-[#F2F0EC]/50 border border-[#9BA3AA]/10 hover:border-[#9BA3AA]/30 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#F2F0EC]/25 text-sm">جاري التحميل...</div>
        ) : cats.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#F2F0EC]/30 text-sm mb-4">لا توجد أقسام بعد</p>
            <button onClick={() => setShowAdd(true)}
              className="text-[#9BA3AA] text-sm underline">أضف أول قسم</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#9BA3AA]/10">
                <th className="text-right px-6 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الاسم</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">Slug</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الترتيب</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الحالة</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cats.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < cats.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  {editing === c.id ? (
                    <>
                      <td className="px-6 py-3">
                        <input className={inp} value={editForm.name_ar}
                          onChange={e => setEditForm(f => ({ ...f, name_ar: e.target.value }))} autoFocus />
                      </td>
                      <td className="px-4 py-3">
                        <input className={inp} value={editForm.slug} dir="ltr"
                          onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className={inp} style={{ width: 70 }} value={editForm.sort_order}
                          onChange={e => setEditForm(f => ({ ...f, sort_order: e.target.value }))} />
                      </td>
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(c.id)} disabled={saving}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg"
                            style={{ background: "rgba(155, 163, 170,0.15)", color: "#9BA3AA", border: "1px solid rgba(155, 163, 170,0.3)" }}>
                            {saving ? "..." : "حفظ"}
                          </button>
                          <button onClick={() => setEditing(null)}
                            className="px-3 py-1.5 text-xs rounded-lg text-[#F2F0EC]/40 border border-white/5 hover:border-white/20">
                            إلغاء
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-[#F2F0EC] font-medium">{c.name_ar}</td>
                      <td className="px-4 py-4 text-[#F2F0EC]/50 font-mono text-xs">{c.slug}</td>
                      <td className="px-4 py-4 text-[#F2F0EC]/50">{c.sort_order}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => toggleActive(c)}
                          className={`text-xs px-3 py-1 rounded-full font-bold border ${c.is_active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                          {c.is_active ? "نشط" : "مخفي"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => startEdit(c)}
                            className="text-xs px-3 py-1.5 rounded-lg text-[#9BA3AA]/70 border border-[#9BA3AA]/15 hover:border-[#9BA3AA]/40 hover:text-[#9BA3AA] transition-colors">
                            تعديل
                          </button>
                          <button onClick={() => handleDelete(c.id, c.name_ar)} disabled={deleting === c.id}
                            className="text-xs px-3 py-1.5 rounded-lg text-red-400/60 border border-red-400/10 hover:border-red-400/30 hover:text-red-400 transition-colors">
                            {deleting === c.id ? "..." : "حذف"}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
