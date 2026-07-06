"use client"

import { useEffect, useRef, useState } from "react"

interface Logo { id: string; name: string; logo_url: string; link: string | null; sort_order: number; is_active: boolean }

export default function AdminPartnerLogosPage() {
  const [logos, setLogos] = useState<Logo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", logo_url: "", link: "", sort_order: "0" })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleLogoUpload(file: File) {
    setUploading(true)
    setError("")
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    setUploading(false)
    if (!res.ok) { setError("فشل رفع الشعار"); return }
    const { url } = await res.json()
    setForm(f => ({ ...f, logo_url: url }))
  }

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/partner-logos")
    setLogos(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError("")
    const res = await fetch("/api/admin/partner-logos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        logo_url: form.logo_url.trim(),
        link: form.link.trim() || null,
        sort_order: Number(form.sort_order),
      }),
    })
    if (!res.ok) { setError((await res.json()).error ?? "خطأ"); setSaving(false); return }
    setForm({ name: "", logo_url: "", link: "", sort_order: "0" })
    setShowForm(false)
    await load()
    setSaving(false)
  }

  async function toggle(id: string, is_active: boolean) {
    await fetch(`/api/admin/partner-logos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !is_active }) })
    await load()
  }

  async function deleteLogo(id: string) {
    if (!confirm("حذف الشعار؟")) return
    await fetch(`/api/admin/partner-logos/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F0EC]">شعارات الشركاء</h1>
          <p className="text-[#F2F0EC]/40 text-sm mt-1">شريط شعارات مستقل يظهر أسفل الهيرو مباشرة في الصفحة الرئيسية (فيزا/ماستركارد وشركات التمويل)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 text-sm font-bold rounded-lg bg-gradient-to-r from-[#9BA3AA] to-[#C9CFD4] text-[#0A0A0A]">
          + إضافة شعار
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F2F0EC]/60 uppercase tracking-widest">شعار شريك جديد</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">الاسم *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="مثال: Visa" required
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
            <div>
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">رابط (اختياري)</label>
              <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                placeholder="https://..." dir="ltr"
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">الشعار *</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full flex items-center justify-center gap-2 bg-[#9BA3AA]/10 hover:bg-[#9BA3AA]/20 border border-[#9BA3AA]/30 border-dashed rounded-lg px-3 py-3 text-sm text-[#9BA3AA] font-bold transition-colors disabled:opacity-50 mb-2">
                {uploading ? (
                  <><span className="inline-block w-4 h-4 border-2 border-[#9BA3AA]/30 border-t-[#9BA3AA] rounded-full animate-spin" /> جاري الرفع...</>
                ) : (
                  <><span className="text-lg">📁</span> ارفع شعار</>
                )}
              </button>
              <input value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))}
                placeholder="أو الصق رابط الشعار هنا..." dir="ltr" required
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
            <div>
              <label className="block text-xs text-[#F2F0EC]/50 mb-1">الترتيب</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                className="w-full bg-[#111] border border-[#9BA3AA]/15 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] outline-none focus:border-[#9BA3AA]/40" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving || !form.logo_url}
              className="px-6 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-[#9BA3AA] to-[#C9CFD4] text-[#0A0A0A] disabled:opacity-50">
              {saving ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2 text-sm text-[#F2F0EC]/60 border border-[#9BA3AA]/10 rounded-lg">إلغاء</button>
          </div>
        </form>
      )}

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#F2F0EC]/30 text-sm">جاري التحميل...</div>
        ) : logos.length === 0 ? (
          <div className="text-center py-16 text-[#F2F0EC]/30 text-sm">لا توجد شعارات بعد</div>
        ) : (
          <div className="divide-y divide-[#9BA3AA]/5">
            {logos.map(l => (
              <div key={l.id} className="flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.logo_url} alt={l.name} style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 8, flexShrink: 0, background: "#111", border: "1px solid rgba(155, 163, 170,0.1)" }} onError={e => { e.currentTarget.style.opacity = "0.2" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#F2F0EC] truncate">{l.name}</p>
                  <p className="text-xs text-[#F2F0EC]/30 mt-0.5">ترتيب: {l.sort_order}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(l.id, l.is_active)}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${l.is_active ? "bg-green-500/15 text-green-400" : "bg-[#F2F0EC]/5 text-[#F2F0EC]/30"}`}>
                    {l.is_active ? "نشط" : "مخفي"}
                  </button>
                  <button onClick={() => deleteLogo(l.id)}
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
