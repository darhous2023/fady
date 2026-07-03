"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ReviewActions({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: !isApproved }),
    })
    setLoading(false)
    if (res.ok) { toast.success(isApproved ? "تم إلغاء الاعتماد" : "تم الاعتماد"); router.refresh() }
    else toast.error("حدث خطأ")
  }

  async function remove() {
    if (!confirm("حذف هذا التقييم نهائياً؟")) return
    setLoading(true)
    await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" })
    setLoading(false)
    toast.success("تم الحذف")
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button onClick={toggle} disabled={loading}
        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
          isApproved
            ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
        }`}>
        {loading ? "..." : isApproved ? "إلغاء الاعتماد" : "✓ اعتماد"}
      </button>
      <button onClick={remove} disabled={loading}
        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/8 text-red-400 hover:bg-red-500/18 transition-colors disabled:opacity-50">
        حذف
      </button>
    </div>
  )
}
