"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProductOption { id: string; name_ar: string }

interface ReviewData {
  id: string
  customer_name: string
  rating: number
  comment_ar: string | null
  is_approved: boolean
  created_at: Date | string | null
  product_name: string | null
  product_id: string | null
}

function Stars({ n }: { n: number }) {
  return <span className="text-[#C9CFD4] text-xs">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
}

export default function ReviewCard({ review, products }: { review: ReviewData; products: ProductOption[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: review.customer_name,
    rating: review.rating,
    comment_ar: review.comment_ar ?? "",
    product_id: review.product_id ?? "",
  })

  async function toggleApproved() {
    setLoading(true)
    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: !review.is_approved }),
    })
    setLoading(false)
    if (res.ok) { toast.success(review.is_approved ? "تم الأرشفة (إخفاء)" : "تم الاعتماد"); router.refresh() }
    else toast.error("حدث خطأ")
  }

  async function remove() {
    if (!confirm("حذف هذا التقييم نهائياً؟")) return
    setLoading(true)
    await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" })
    setLoading(false)
    toast.success("تم الحذف")
    router.refresh()
  }

  async function saveEdit() {
    if (!form.customer_name.trim()) { toast.error("اكتب اسم العميل"); return }
    setLoading(true)
    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.customer_name,
        rating: form.rating,
        comment_ar: form.comment_ar,
        product_id: form.product_id || null,
      }),
    })
    setLoading(false)
    if (res.ok) { toast.success("تم الحفظ"); setEditing(false); router.refresh() }
    else toast.error("فشل الحفظ")
  }

  if (editing) {
    return (
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/25 p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
            placeholder="اسم العميل" className="bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC]" />
          <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
            className="bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC]">
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} نجوم</option>)}
          </select>
        </div>
        <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
          className="w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC]">
          <option value="">✦ تقييم عام عن المعرض</option>
          {products.map(p => <option key={p.id} value={p.id}>عن سيارة: {p.name_ar}</option>)}
        </select>
        <textarea value={form.comment_ar} onChange={e => setForm(f => ({ ...f, comment_ar: e.target.value }))}
          rows={2} placeholder="التعليق (اختياري)" className="w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] resize-y" />
        <div className="flex gap-2">
          <button onClick={saveEdit} disabled={loading} className="text-xs px-3 py-1.5 rounded-lg bg-[#9BA3AA] text-[#0A0A0A] font-bold disabled:opacity-50">حفظ</button>
          <button onClick={() => setEditing(false)} disabled={loading} className="text-xs px-3 py-1.5 rounded-lg border border-[#9BA3AA]/20 text-[#F2F0EC]/60">إلغاء</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-[#0A0A0A] rounded-xl border p-5 ${review.is_approved ? "border-[#9BA3AA]/8" : "border-yellow-500/20"}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className="font-semibold text-[#F2F0EC] text-sm">{review.customer_name}</span>
            <Stars n={review.rating} />
            <span className="text-xs text-[#F2F0EC]/30">
              {review.created_at ? new Date(review.created_at).toLocaleDateString("ar-EG") : ""}
            </span>
          </div>
          <p className="text-xs mb-2">
            {review.product_id
              ? <span className="text-[#9BA3AA]/60">عن سيارة: {review.product_name ?? review.product_id}</span>
              : <span className="text-[#9BA3AA]">✦ تقييم عام عن المعرض</span>}
          </p>
          {review.comment_ar && (
            <p className="text-sm text-[#F2F0EC]/55 leading-relaxed">{review.comment_ar}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setEditing(true)} disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#9BA3AA]/10 text-[#9BA3AA] hover:bg-[#9BA3AA]/20 transition-colors disabled:opacity-50">
            تعديل
          </button>
          <button onClick={toggleApproved} disabled={loading}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
              review.is_approved
                ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
            }`}>
            {loading ? "..." : review.is_approved ? "أرشفة" : "✓ اعتماد"}
          </button>
          <button onClick={remove} disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/8 text-red-400 hover:bg-red-500/18 transition-colors disabled:opacity-50">
            حذف
          </button>
        </div>
      </div>
    </div>
  )
}
