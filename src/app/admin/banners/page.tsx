"use client"

import { useEffect, useRef, useState } from "react"

interface Banner { id: string; image_url: string; title_ar: string | null; link: string | null; sort_order: number; is_active: boolean }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ image_url: "", title_ar: "", link: "", sort_order: "0" })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(file: File) {
    setUploading(true)
    setError("")
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    setUploading(false)
    if (!res.ok) { setError("فشل رفع الصورة"); return }
    const { url } = await res.json()
    setForm(f => ({ ...f, image_url: url }))
  }

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/banners")
    setBanners(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError("")
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: form.image_url.trim(), title_ar: form.title_ar.trim() || null, link: form.link.trim() || null, sort_order: Number(form.sort_order) }),
    })
    if (!res.ok) { setError((await res.json()).error ?? "خطأ"); setSaving(false); return }
    setForm({ image_url: "", title_ar: "", link: "", sort_order: "0" })
    setShowForm(false)
    await load()
    setSaving(false)
  }

  async function toggle(id: string, is_active: boolean) {
    await fetch(`/api/admin/banners/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !is_active }) })
    await load()
  }

  async function deleteBanner(id: string) {
    if (!confirm("حذف البانر؟")) return
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F0EC]">إدارة البانرات</h1>
          <p className="text-[#F2F0EC]/40 text-sm mt-1">بانرات الصفحة الرئيسية</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 text-sm font-bold rounded-lg bg-gradient-to-r from-[#9BA3AA] to-[#C9CFD4] text-[#0A0A0A]">
          + بانر جديد
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={create} className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F2F0EC]/60 uppercase tracking-widest">بانر جديد</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">صورة البانر *</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full flex items-center justify-center gap-2 bg-[#9BA3AA]/10 hover:bg-[#9BA3AA]/20 border border-[#9BA3AA]/30 border-dashed rounded-lg px-3 py-3 text-sm text-[#9BA3AA] font-bold transition-colors disabled:opacity-50 mb-2">
                {uploading ? (
                  <><span className="inline-block w-4 h-4 border-2 border-[#9BA3AA]/30 border-t-[#9BA3AA] rounded-full animate-spin" /> جاري الرفع...</>
                ) : (
                  <><span className="text-lg">📁</span> ارفع صورة من جهازك</>
                )}
              </button>
              <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="أو الصق رابط الصورة هنا..." dir="ltr" required
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
            <div>
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">العنوان (اختياري)</label>
              <input value={form.title_ar} onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))}
                placeholder="عنوان البانر"
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
            <div>
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">الرابط (اختياري)</label>
              <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                placeholder="/sale أو https://..." dir="ltr"
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
            <div>
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">الترتيب</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
          </div>
          {form.image_url && (
            <div style={{ marginTop: 8 }}>
              <p className="text-xs text-[#F2F0EC]/40 mb-2">معاينة:</p>
              <img src={form.image_url} alt="preview" style={{ maxHeight: 160, borderRadius: 8, border: "1px solid rgba(201,168,76,0.15)", objectFit: "cover", maxWidth: "100%" }} onError={e => { e.currentTarget.style.display = "none" }} />
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-6 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-[#9BA3AA] to-[#C9CFD4] text-[#0A0A0A] disabled:opacity-50">
              {saving ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2 text-sm text-[#F2F0EC]/60 border border-[#9BA3AA]/10 rounded-lg">إلغاء</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#F2F0EC]/30 text-sm">جاري التحميل...</div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16 text-[#F2F0EC]/30 text-sm">لا توجد بانرات</div>
        ) : (
          <div className="divide-y divide-[#9BA3AA]/5">
            {banners.map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4">
                <img src={b.image_url} alt={b.title_ar ?? ""} style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#111", border: "1px solid rgba(201,168,76,0.1)" }} onError={e => { e.currentTarget.style.opacity = "0.2" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#F2F0EC] truncate">{b.title_ar ?? "—"}</p>
                  {b.link && <p className="text-xs text-[#F2F0EC]/40 truncate mt-0.5" dir="ltr">{b.link}</p>}
                  <p className="text-xs text-[#F2F0EC]/30 mt-0.5">ترتيب: {b.sort_order}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(b.id, b.is_active)}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${b.is_active ? "bg-green-500/15 text-green-400" : "bg-[#F2F0EC]/5 text-[#F2F0EC]/30"}`}>
                    {b.is_active ? "نشط" : "مخفي"}
                  </button>
                  <button onClick={() => deleteBanner(b.id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20">
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
