"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProductOption { id: string; name_ar: string }

export default function AddReviewForm({ products }: { products: ProductOption[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value

    setLoading(true)
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: get("customer_name"),
        rating: Number(get("rating")),
        comment_ar: get("comment_ar") || null,
        product_id: get("product_id") || null,
      }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success("تمت إضافة التقييم")
      formRef.current?.reset()
      setOpen(false)
      router.refresh()
    } else {
      toast.error("فشل إضافة التقييم")
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#9BA3AA] hover:bg-[#7d858c] text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors">
        + إضافة تقييم
      </button>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/20 p-5 space-y-3">
      <h3 className="font-semibold text-[#F2F0EC] text-sm mb-1">إضافة تقييم جديد</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="customer_name" required placeholder="اسم العميل"
          className="bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] placeholder:text-[#F2F0EC]/20" />
        <select name="rating" defaultValue="5" className="bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC]">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} نجوم</option>)}
        </select>
      </div>
      <select name="product_id" defaultValue="" className="w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC]">
        <option value="">✦ تقييم عام عن المعرض</option>
        {products.map(p => <option key={p.id} value={p.id}>عن سيارة: {p.name_ar}</option>)}
      </select>
      <textarea name="comment_ar" rows={2} placeholder="التعليق (اختياري)"
        className="w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-3 py-2 text-sm text-[#F2F0EC] placeholder:text-[#F2F0EC]/20 resize-y" />
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="px-4 py-2 bg-[#9BA3AA] hover:bg-[#7d858c] disabled:opacity-50 text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors">
          {loading ? "جاري الإضافة..." : "إضافة"}
        </button>
        <button type="button" onClick={() => setOpen(false)} disabled={loading}
          className="px-4 py-2 border border-[#9BA3AA]/20 text-[#F2F0EC]/60 text-sm rounded-lg">
          إلغاء
        </button>
      </div>
    </form>
  )
}
