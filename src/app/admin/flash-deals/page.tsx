"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface Product {
  id: string
  name_ar: string
  slug: string
  price: number
  compare_at_price: number | null
  is_featured: boolean
  status: string
  image: string | null
}

interface FlashSettings {
  flash_deals_active: string
  flash_deals_title_ar: string
  flash_deals_ends_at: string
}

export default function FlashDealsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<FlashSettings>({ flash_deals_active: "false", flash_deals_title_ar: "عروض الفلاش", flash_deals_ends_at: "" })
  const [savingSettings, setSavingSettings] = useState(false)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [priceVal, setPriceVal] = useState("")
  const [savingPrice, setSavingPrice] = useState(false)
  const [filter, setFilter] = useState<"all" | "active">("active")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [prodRes, settRes] = await Promise.all([
        fetch("/api/admin/products?limit=100"),
        fetch("/api/admin/settings"),
      ])
      if (prodRes.ok) {
        const data = await prodRes.json()
        setProducts((data.products || data).map((p: Product) => ({
          ...p,
          price: Number(p.price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
        })))
      }
      if (settRes.ok) {
        const d = await settRes.json()
        const m: Record<string, string> = {}
        ;(d as { key: string; value: string }[]).forEach((r: { key: string; value: string }) => { m[r.key] = r.value })
        setSettings({
          flash_deals_active: m.flash_deals_active || "false",
          flash_deals_title_ar: m.flash_deals_title_ar || "عروض الفلاش",
          flash_deals_ends_at: m.flash_deals_ends_at || "",
        })
      }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    setSavingSettings(true)
    try {
      const form = e.target as HTMLFormElement
      const data = new FormData(form)
      const body = {
        flash_deals_active: (form.elements.namedItem("flash_deals_active") as HTMLInputElement)?.checked ? "true" : "false",
        flash_deals_title_ar: data.get("flash_deals_title_ar") as string,
        flash_deals_ends_at: data.get("flash_deals_ends_at") as string,
      }
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            { key: "flash_deals_active", value: body.flash_deals_active },
            { key: "flash_deals_title_ar", value: body.flash_deals_title_ar },
            { key: "flash_deals_ends_at", value: body.flash_deals_ends_at },
          ],
        }),
      })
      if (res.ok) { toast.success("تم حفظ إعدادات الفلاش"); setSettings({ ...settings, ...body }) }
      else toast.error("حدث خطأ")
    } finally { setSavingSettings(false) }
  }

  async function toggleFeatured(p: Product) {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !p.is_featured }),
    })
    if (res.ok) {
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_featured: !x.is_featured } : x))
      toast.success(!p.is_featured ? "✅ أضيف لعروض الفلاش" : "❌ أُزيل من عروض الفلاش")
    }
  }

  async function saveComparePrice(id: string) {
    const val = Number(priceVal)
    if (isNaN(val) || val < 0) { toast.error("سعر غير صحيح"); return }
    setSavingPrice(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compare_at_price: val > 0 ? val : null }),
      })
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, compare_at_price: val > 0 ? val : null } : p))
        setEditingPrice(null)
        toast.success("تم حفظ السعر الأصلي")
      }
    } finally { setSavingPrice(false) }
  }

  const flashActive = products.filter(p => p.is_featured && p.compare_at_price && p.compare_at_price > p.price && p.status === "active")
  const displayed = filter === "active" ? flashActive : products.filter(p => p.status === "active")

  const inp = "bg-[#111009] border border-[#C9A84C]/20 rounded-lg px-3 py-2 text-[#F5EFE0] text-sm outline-none focus:border-[#C9A84C]/60 w-full font-[Tajawal,sans-serif]"

  return (
    <div className="space-y-6" dir="rtl" style={{ fontFamily: "Tajawal,sans-serif" }}>
      <style>{``}</style>

      <div>
        <h1 className="text-2xl font-bold text-[#F5EFE0]">⚡ عروض الفلاش</h1>
        <p className="text-[#F5EFE0]/40 text-sm mt-1">{flashActive.length} منتج في عروض الفلاش حالياً</p>
      </div>

      {/* Settings */}
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6">
        <h2 className="font-bold text-[#F5EFE0] mb-4">إعدادات قسم الفلاش</h2>
        <form onSubmit={saveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#F5EFE0]/50 mb-2">عنوان القسم</label>
            <input name="flash_deals_title_ar" className={inp} defaultValue={settings.flash_deals_title_ar} placeholder="عروض الفلاش" />
          </div>
          <div>
            <label className="block text-xs text-[#F5EFE0]/50 mb-2">ينتهي العرض في</label>
            <input name="flash_deals_ends_at" type="datetime-local" className={inp} defaultValue={settings.flash_deals_ends_at?.slice(0, 16)} />
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-3 mt-auto">
              <input type="checkbox" name="flash_deals_active" id="flash_active"
                defaultChecked={settings.flash_deals_active === "true"}
                className="w-4 h-4 accent-[#C9A84C]" />
              <label htmlFor="flash_active" className="text-sm text-[#F5EFE0]/70 cursor-pointer">تفعيل القسم على الموقع</label>
            </div>
            <button type="submit" disabled={savingSettings}
              className="mt-3 px-4 py-2.5 rounded-lg text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#C9A84C,#F0D882)", color: "#0A0806", opacity: savingSettings ? 0.7 : 1 }}>
              {savingSettings ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </button>
          </div>
        </form>
      </div>

      {/* Flash logic explanation */}
      <div className="p-4 rounded-xl border border-[#C9A84C]/10 bg-[#C9A84C]/5 text-sm text-[#F5EFE0]/60 leading-relaxed">
        <strong className="text-[#C9A84C]">كيف تشتغل عروض الفلاش؟</strong> — المنتج يظهر في قسم الفلاش لو:
        <span className="text-[#F5EFE0]/80"> مفعّل ✓ + مميّز ✓ + عنده سعر أصلي أعلى من سعر البيع ✓</span>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <button onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "active" ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30" : "text-[#F5EFE0]/40 border border-white/5 hover:border-white/15"}`}>
          الفلاش فقط ({flashActive.length})
        </button>
        <button onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "all" ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30" : "text-[#F5EFE0]/40 border border-white/5 hover:border-white/15"}`}>
          كل المنتجات النشطة
        </button>
      </div>

      {/* Products table */}
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#F5EFE0]/25 text-sm">جاري التحميل...</div>
        ) : displayed.length === 0 ? (
          <div className="p-12 text-center text-[#F5EFE0]/30 text-sm">
            {filter === "active" ? "لا توجد منتجات في عروض الفلاش — فعّل منتجات وأضف لها سعر أصلي" : "لا توجد منتجات نشطة"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#C9A84C]/10">
                <th className="text-right px-6 py-3 text-[#C9A84C]/70 font-bold text-xs tracking-widest">المنتج</th>
                <th className="text-right px-4 py-3 text-[#C9A84C]/70 font-bold text-xs tracking-widest">سعر البيع</th>
                <th className="text-right px-4 py-3 text-[#C9A84C]/70 font-bold text-xs tracking-widest">السعر الأصلي</th>
                <th className="text-right px-4 py-3 text-[#C9A84C]/70 font-bold text-xs tracking-widest">الخصم</th>
                <th className="text-right px-4 py-3 text-[#C9A84C]/70 font-bold text-xs tracking-widest">مميّز (فلاش)</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((p, i) => {
                const discount = p.compare_at_price && p.compare_at_price > p.price
                  ? Math.round((1 - p.price / p.compare_at_price) * 100) : 0
                return (
                  <tr key={p.id} style={{ borderBottom: i < displayed.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <td className="px-6 py-3 text-[#F5EFE0]">
                      <div className="font-medium">{p.name_ar}</div>
                      <div className="text-xs text-[#F5EFE0]/30 font-mono">{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-[#C9A84C] font-bold">{p.price.toLocaleString("ar-EG")} ج.م</td>
                    <td className="px-4 py-3">
                      {editingPrice === p.id ? (
                        <div className="flex items-center gap-2">
                          <input type="number" min="0" autoFocus
                            value={priceVal} onChange={e => setPriceVal(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveComparePrice(p.id); if (e.key === "Escape") setEditingPrice(null) }}
                            className="w-24 bg-[#111009] border border-[#C9A84C]/40 rounded-lg px-2 py-1.5 text-[#F5EFE0] text-sm outline-none" dir="ltr"
                          />
                          <button onClick={() => saveComparePrice(p.id)} disabled={savingPrice}
                            className="text-xs px-2 py-1.5 rounded" style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                            {savingPrice ? "..." : "حفظ"}
                          </button>
                          <button onClick={() => setEditingPrice(null)} className="text-[#F5EFE0]/30 text-lg leading-none">×</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingPrice(p.id); setPriceVal(String(p.compare_at_price || "")) }}
                          className="flex items-center gap-2 text-[#F5EFE0]/60 hover:text-[#F5EFE0] transition-colors">
                          <span>{p.compare_at_price ? `${p.compare_at_price.toLocaleString("ar-EG")} ج.م` : "—"}</span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {discount > 0 ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/15 text-red-400">-{discount}%</span>
                      ) : <span className="text-[#F5EFE0]/20">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(p)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.is_featured ? "bg-[#C9A84C]" : "bg-white/10"}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.is_featured ? "-translate-x-6" : "-translate-x-1"}`} />
                      </button>
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
