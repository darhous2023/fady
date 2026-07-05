"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

type Brand = {
  id: string; slug: string; nameEn: string; nameAr: string | null
  logoUrl: string | null; modelCount: number; isPublic: boolean
}
type Model = {
  id: string; brandId: string; slug: string; nameEn: string
  nameAr: string | null; bodyType: string | null; adminHidden: boolean
}
type CarRow = {
  normalizedKey: string; displayName: string; brandName: string | null
  modelName: string | null; year: number | null
  publicationEligible: boolean; adminHidden: boolean; adminNotes: string | null
}

const inp = "bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-[#F2F0EC] text-sm outline-none focus:border-[#9BA3AA]/60 transition-colors font-[Tajawal,sans-serif]"
const isAdminId = (id: string) => id.startsWith("admin-")

function slugify(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
}

function Tabs({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  const tabs = [
    { id: "cars", label: "السيارات" },
    { id: "brands", label: "الماركات" },
    { id: "models", label: "الموديلات" },
  ]
  return (
    <div className="flex gap-2 border-b border-[#9BA3AA]/10 pb-3">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => setTab(t.id)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t.id ? "bg-[#9BA3AA]/15 text-[#9BA3AA] border border-[#9BA3AA]/30" : "text-[#F2F0EC]/40 border border-transparent hover:text-[#F2F0EC]/70"}`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

function BrandsTab() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ nameEn: "", nameAr: "", slug: "" })
  const [editing, setEditing] = useState<string | null>(null)
  const [editNameAr, setEditNameAr] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/cars-catalog/brands")
      if (res.ok) setBrands(await res.json())
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/cars-catalog/brands", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, slug: addForm.slug || slugify(addForm.nameEn) }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
    toast.success("تمت إضافة الماركة")
    setBrands((prev) => [data, ...prev])
    setShowAdd(false)
    setAddForm({ nameEn: "", nameAr: "", slug: "" })
  }

  async function saveNameAr(id: string) {
    const res = await fetch(`/api/admin/cars-catalog/brands/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameAr: editNameAr }),
    })
    if (!res.ok) { toast.error("حدث خطأ"); return }
    const updated = await res.json()
    setBrands((prev) => prev.map((b) => (b.id === id ? updated : b)))
    setEditing(null)
    toast.success("تم الحفظ")
  }

  async function togglePublic(b: Brand) {
    const res = await fetch(`/api/admin/cars-catalog/brands/${b.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !b.isPublic }),
    })
    if (res.ok) setBrands((prev) => prev.map((x) => (x.id === b.id ? { ...x, isPublic: !x.isPublic } : x)))
  }

  async function handleDelete(b: Brand) {
    if (!confirm(`حذف ماركة "${b.nameEn}"؟`)) return
    const res = await fetch(`/api/admin/cars-catalog/brands/${b.id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
    setBrands((prev) => prev.filter((x) => x.id !== b.id))
    toast.success("تم الحذف")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-[#F2F0EC]/40 text-sm">{brands.length} ماركة</p>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>+ ماركة جديدة</button>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="bg-[#0A0A0A] border border-[#9BA3AA]/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-[#F2F0EC] mb-5">ماركة جديدة</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required className={inp} style={{ width: "100%" }} placeholder="الاسم بالإنجليزي (مثال: Toyota)"
                value={addForm.nameEn} onChange={(e) => setAddForm((f) => ({ ...f, nameEn: e.target.value, slug: slugify(e.target.value) }))} />
              <input className={inp} style={{ width: "100%" }} placeholder="الاسم بالعربي (اختياري)"
                value={addForm.nameAr} onChange={(e) => setAddForm((f) => ({ ...f, nameAr: e.target.value }))} />
              <input className={inp} style={{ width: "100%", direction: "ltr" }} placeholder="slug"
                value={addForm.slug} onChange={(e) => setAddForm((f) => ({ ...f, slug: e.target.value }))} />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-lg font-bold text-sm" style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>إضافة</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-lg text-sm text-[#F2F0EC]/50 border border-[#9BA3AA]/10">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? <div className="p-12 text-center text-[#F2F0EC]/25 text-sm">جاري التحميل...</div> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#9BA3AA]/10">
              <th className="text-right px-6 py-3 text-[#9BA3AA]/70 font-bold text-xs">الماركة</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">الاسم بالعربي</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">عدد الموديلات</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">الحالة</th>
              <th className="px-4 py-3" />
            </tr></thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-white/3">
                  <td className="px-6 py-3 text-[#F2F0EC] font-medium">{b.nameEn}</td>
                  <td className="px-4 py-3">
                    {editing === b.id ? (
                      <div className="flex gap-2">
                        <input className={inp} value={editNameAr} onChange={(e) => setEditNameAr(e.target.value)} autoFocus />
                        <button onClick={() => saveNameAr(b.id)} className="text-xs px-2 rounded" style={{ color: "#9BA3AA" }}>حفظ</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditing(b.id); setEditNameAr(b.nameAr ?? "") }} className="text-[#F2F0EC]/60 hover:text-[#9BA3AA]">
                        {b.nameAr || <span className="text-[#F2F0EC]/25">— إضافة —</span>}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#F2F0EC]/50">{b.modelCount}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublic(b)} className={`text-xs px-3 py-1 rounded-full font-bold border ${b.isPublic ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                      {b.isPublic ? "ظاهرة" : "مخفية"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-left">
                    {isAdminId(b.id) ? (
                      <button onClick={() => handleDelete(b)} className="text-xs px-3 py-1.5 rounded-lg text-red-400/60 border border-red-400/10 hover:text-red-400">حذف</button>
                    ) : (
                      <span className="text-xs text-[#F2F0EC]/20">من قاعدة السيارات</span>
                    )}
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

function ModelsTab() {
  const [models, setModels] = useState<Model[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ brandId: "", nameEn: "", nameAr: "", slug: "", bodyType: "" })
  const [editing, setEditing] = useState<string | null>(null)
  const [editNameAr, setEditNameAr] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [mRes, bRes] = await Promise.all([
        fetch("/api/admin/cars-catalog/models"),
        fetch("/api/admin/cars-catalog/brands"),
      ])
      if (mRes.ok) setModels(await mRes.json())
      if (bRes.ok) setBrands(await bRes.json())
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const brandName = (id: string) => brands.find((b) => b.id === id)?.nameEn ?? id

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!addForm.brandId) { toast.error("اختر الماركة"); return }
    const res = await fetch("/api/admin/cars-catalog/models", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, slug: addForm.slug || slugify(addForm.nameEn) }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
    toast.success("تمت إضافة الموديل")
    setModels((prev) => [data, ...prev])
    setShowAdd(false)
    setAddForm({ brandId: "", nameEn: "", nameAr: "", slug: "", bodyType: "" })
  }

  async function saveNameAr(id: string) {
    const res = await fetch(`/api/admin/cars-catalog/models/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameAr: editNameAr }),
    })
    if (!res.ok) { toast.error("حدث خطأ"); return }
    const updated = await res.json()
    setModels((prev) => prev.map((m) => (m.id === id ? updated : m)))
    setEditing(null)
    toast.success("تم الحفظ")
  }

  async function toggleHidden(m: Model) {
    const res = await fetch(`/api/admin/cars-catalog/models/${m.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminHidden: !m.adminHidden }),
    })
    if (res.ok) setModels((prev) => prev.map((x) => (x.id === m.id ? { ...x, adminHidden: !x.adminHidden } : x)))
  }

  async function handleDelete(m: Model) {
    if (!confirm(`حذف موديل "${m.nameEn}"؟`)) return
    const res = await fetch(`/api/admin/cars-catalog/models/${m.id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
    setModels((prev) => prev.filter((x) => x.id !== m.id))
    toast.success("تم الحذف")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-[#F2F0EC]/40 text-sm">{models.length} موديل</p>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>+ موديل جديد</button>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="bg-[#0A0A0A] border border-[#9BA3AA]/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-[#F2F0EC] mb-5">موديل جديد</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <select required className={inp} style={{ width: "100%" }} value={addForm.brandId} onChange={(e) => setAddForm((f) => ({ ...f, brandId: e.target.value }))}>
                <option value="">اختر الماركة</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.nameEn}</option>)}
              </select>
              <input required className={inp} style={{ width: "100%" }} placeholder="اسم الموديل بالإنجليزي"
                value={addForm.nameEn} onChange={(e) => setAddForm((f) => ({ ...f, nameEn: e.target.value, slug: slugify(e.target.value) }))} />
              <input className={inp} style={{ width: "100%" }} placeholder="الاسم بالعربي (اختياري)"
                value={addForm.nameAr} onChange={(e) => setAddForm((f) => ({ ...f, nameAr: e.target.value }))} />
              <input className={inp} style={{ width: "100%" }} placeholder="نوع الهيكل (اختياري)"
                value={addForm.bodyType} onChange={(e) => setAddForm((f) => ({ ...f, bodyType: e.target.value }))} />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-lg font-bold text-sm" style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>إضافة</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-lg text-sm text-[#F2F0EC]/50 border border-[#9BA3AA]/10">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? <div className="p-12 text-center text-[#F2F0EC]/25 text-sm">جاري التحميل...</div> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#9BA3AA]/10">
              <th className="text-right px-6 py-3 text-[#9BA3AA]/70 font-bold text-xs">الموديل</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">الماركة</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">الاسم بالعربي</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">الحالة</th>
              <th className="px-4 py-3" />
            </tr></thead>
            <tbody>
              {models.slice(0, 200).map((m) => (
                <tr key={m.id} className="border-b border-white/3">
                  <td className="px-6 py-3 text-[#F2F0EC] font-medium">{m.nameEn}</td>
                  <td className="px-4 py-3 text-[#F2F0EC]/50">{brandName(m.brandId)}</td>
                  <td className="px-4 py-3">
                    {editing === m.id ? (
                      <div className="flex gap-2">
                        <input className={inp} value={editNameAr} onChange={(e) => setEditNameAr(e.target.value)} autoFocus />
                        <button onClick={() => saveNameAr(m.id)} className="text-xs px-2 rounded" style={{ color: "#9BA3AA" }}>حفظ</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditing(m.id); setEditNameAr(m.nameAr ?? "") }} className="text-[#F2F0EC]/60 hover:text-[#9BA3AA]">
                        {m.nameAr || <span className="text-[#F2F0EC]/25">— إضافة —</span>}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleHidden(m)} className={`text-xs px-3 py-1 rounded-full font-bold border ${!m.adminHidden ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                      {!m.adminHidden ? "ظاهر" : "مخفي"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-left">
                    {isAdminId(m.id) ? (
                      <button onClick={() => handleDelete(m)} className="text-xs px-3 py-1.5 rounded-lg text-red-400/60 border border-red-400/10 hover:text-red-400">حذف</button>
                    ) : (
                      <span className="text-xs text-[#F2F0EC]/20">من قاعدة السيارات</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {models.length > 200 && <div className="p-4 text-center text-xs text-[#F2F0EC]/30">عرض أول 200 موديل من {models.length} — استخدم فلتر الماركة قريبًا لتضييق النتائج</div>}
      </div>
    </div>
  )
}

function CarsTab() {
  const [cars, setCars] = useState<CarRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ displayName: "", year: "", bodyType: "", fuelType: "", transmission: "" })
  const [notesEditing, setNotesEditing] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "25" })
      if (q) params.set("q", q)
      const res = await fetch(`/api/admin/cars-catalog/cars?${params}`)
      if (res.ok) {
        const data = await res.json()
        setCars(data.items)
        setTotal(data.total)
      }
    } finally { setLoading(false) }
  }, [page, q])
  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/cars-catalog/cars", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, year: addForm.year ? Number(addForm.year) : null }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
    toast.success("تمت إضافة السيارة")
    setShowAdd(false)
    setAddForm({ displayName: "", year: "", bodyType: "", fuelType: "", transmission: "" })
    load()
  }

  async function toggleHidden(c: CarRow) {
    const res = await fetch(`/api/admin/cars-catalog/cars/${encodeURIComponent(c.normalizedKey)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: !c.adminHidden }),
    })
    if (res.ok) setCars((prev) => prev.map((x) => (x.normalizedKey === c.normalizedKey ? { ...x, adminHidden: !x.adminHidden } : x)))
  }

  async function saveNotes(key: string) {
    const res = await fetch(`/api/admin/cars-catalog/cars/${encodeURIComponent(key)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: notesDraft }),
    })
    if (res.ok) {
      setCars((prev) => prev.map((x) => (x.normalizedKey === key ? { ...x, adminNotes: notesDraft } : x)))
      setNotesEditing(null)
      toast.success("تم الحفظ")
    }
  }

  async function handleDelete(c: CarRow) {
    if (!confirm(`حذف "${c.displayName}"؟`)) return
    const res = await fetch(`/api/admin/cars-catalog/cars/${encodeURIComponent(c.normalizedKey)}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
    setCars((prev) => prev.filter((x) => x.normalizedKey !== c.normalizedKey))
    toast.success("تم الحذف")
  }

  const totalPages = Math.max(1, Math.ceil(total / 25))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <input className={inp} style={{ minWidth: 220 }} placeholder="بحث بالاسم..." value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        <p className="text-[#F2F0EC]/40 text-sm flex-1">{total} سيارة</p>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>+ سيارة جديدة</button>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="bg-[#0A0A0A] border border-[#9BA3AA]/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-[#F2F0EC] mb-5">سيارة جديدة (خارج المزامنة)</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required className={inp} style={{ width: "100%" }} placeholder="اسم العرض (مثال: Toyota Corolla 2024 GLi)"
                value={addForm.displayName} onChange={(e) => setAddForm((f) => ({ ...f, displayName: e.target.value }))} />
              <input type="number" className={inp} style={{ width: "100%" }} placeholder="السنة"
                value={addForm.year} onChange={(e) => setAddForm((f) => ({ ...f, year: e.target.value }))} />
              <input className={inp} style={{ width: "100%" }} placeholder="نوع الهيكل (اختياري)"
                value={addForm.bodyType} onChange={(e) => setAddForm((f) => ({ ...f, bodyType: e.target.value }))} />
              <input className={inp} style={{ width: "100%" }} placeholder="نوع الوقود (اختياري)"
                value={addForm.fuelType} onChange={(e) => setAddForm((f) => ({ ...f, fuelType: e.target.value }))} />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-lg font-bold text-sm" style={{ background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A" }}>إضافة</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-lg text-sm text-[#F2F0EC]/50 border border-[#9BA3AA]/10">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? <div className="p-12 text-center text-[#F2F0EC]/25 text-sm">جاري التحميل...</div> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#9BA3AA]/10">
              <th className="text-right px-6 py-3 text-[#9BA3AA]/70 font-bold text-xs">السيارة</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">الماركة/الموديل</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">السنة</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">ملاحظات</th>
              <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs">الحالة</th>
              <th className="px-4 py-3" />
            </tr></thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.normalizedKey} className="border-b border-white/3">
                  <td className="px-6 py-3 text-[#F2F0EC] font-medium">{c.displayName}</td>
                  <td className="px-4 py-3 text-[#F2F0EC]/50">{c.brandName} {c.modelName ? `· ${c.modelName}` : ""}</td>
                  <td className="px-4 py-3 text-[#F2F0EC]/50">{c.year ?? "—"}</td>
                  <td className="px-4 py-3">
                    {notesEditing === c.normalizedKey ? (
                      <div className="flex gap-2">
                        <input className={inp} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} autoFocus />
                        <button onClick={() => saveNotes(c.normalizedKey)} className="text-xs px-2 rounded" style={{ color: "#9BA3AA" }}>حفظ</button>
                      </div>
                    ) : (
                      <button onClick={() => { setNotesEditing(c.normalizedKey); setNotesDraft(c.adminNotes ?? "") }} className="text-[#F2F0EC]/40 hover:text-[#9BA3AA] text-xs">
                        {c.adminNotes || "— إضافة ملاحظة —"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleHidden(c)} className={`text-xs px-3 py-1 rounded-full font-bold border ${!c.adminHidden ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                      {!c.adminHidden ? "ظاهرة" : "مؤرشفة"}
                    </button>
                    {!c.publicationEligible && !c.adminHidden && (
                      <div className="text-[10px] text-yellow-500/60 mt-1">بيانات ناقصة — لن تظهر للعميل</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-left">
                    {isAdminId(c.normalizedKey) ? (
                      <button onClick={() => handleDelete(c)} className="text-xs px-3 py-1.5 rounded-lg text-red-400/60 border border-red-400/10 hover:text-red-400">حذف نهائي</button>
                    ) : (
                      <span className="text-xs text-[#F2F0EC]/20">أرشفة فقط</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs rounded-lg text-[#F2F0EC]/50 border border-white/5 disabled:opacity-30">السابق</button>
          <span className="text-xs text-[#F2F0EC]/40 px-2 py-1.5">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs rounded-lg text-[#F2F0EC]/50 border border-white/5 disabled:opacity-30">التالي</button>
        </div>
      )}
    </div>
  )
}

export default function CarsCatalogAdminPage() {
  const [tab, setTab] = useState("cars")
  return (
    <div className="space-y-6" dir="rtl" style={{ fontFamily: "Tajawal,sans-serif" }}>
      <div>
        <h1 className="text-2xl font-bold text-[#F2F0EC]">بوابة السيارات الجديدة</h1>
        <p className="text-[#F2F0EC]/40 text-sm mt-1">إدارة الماركات والموديلات والسيارات المتزامنة من قاعدة بيانات الكتالوج (Neon) — الأرشفة تُخفي السيارة عن الموقع دون حذف بيانات المصدر.</p>
      </div>
      <Tabs tab={tab} setTab={setTab} />
      {tab === "cars" && <CarsTab />}
      {tab === "brands" && <BrandsTab />}
      {tab === "models" && <ModelsTab />}
    </div>
  )
}
