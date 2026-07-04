"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface AuthUser {
  id: string
  name: string
  email: string
  createdAt: string
  phone: string | null
  orderCount: number
  isAdmin: boolean
  adminId: string | null
}

export const dynamic = "force-dynamic"

export default function CustomersPage() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) setUsers(await res.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleAdmin(user: AuthUser) {
    setToggling(user.id)
    try {
      const res = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: user.isAdmin ? "demote" : "promote", email: user.email, name: user.name }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "حدث خطأ"); return }
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isAdmin: !u.isAdmin, adminId: data.adminId || null } : u))
      toast.success(user.isAdmin ? "تم إلغاء صلاحيات الأدمن" : "تم الترقية لأدمن ✅")
    } finally { setToggling(null) }
  }

  return (
    <div className="space-y-6" dir="rtl" style={{ fontFamily: "Tajawal,sans-serif" }}>
      <style>{``}</style>

      <div>
        <h1 className="text-2xl font-bold text-[#F2F0EC]">الأعضاء والعملاء</h1>
        <p className="text-[#F2F0EC]/40 text-sm mt-1">{users.length} مستخدم مسجّل</p>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#F2F0EC]/25 text-sm">جاري التحميل...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-[#F2F0EC]/25 text-sm">لا يوجد أعضاء مسجّلين بعد</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#9BA3AA]/10">
                <th className="text-right px-6 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الاسم</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">البريد</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الهاتف</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الطلبات</th>
                <th className="text-right px-4 py-3 text-[#9BA3AA]/70 font-bold text-xs tracking-widest">الدور</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <td className="px-6 py-4 text-[#F2F0EC] font-medium">{u.name}</td>
                  <td className="px-4 py-4 text-[#F2F0EC]/50 text-xs" dir="ltr">{u.email}</td>
                  <td className="px-4 py-4 text-[#F2F0EC]/50 font-mono text-xs" dir="ltr">{u.phone || "—"}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#9BA3AA]/10 text-[#9BA3AA]">
                      {u.orderCount} طلب
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.isAdmin ? "bg-[#A5342C]/20 text-[#E8756A] border border-[#A5342C]/30" : "bg-white/5 text-[#F2F0EC]/40 border border-white/10"}`}>
                      {u.isAdmin ? "أدمن" : "عضو"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => toggleAdmin(u)} disabled={toggling === u.id}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        u.isAdmin
                          ? "border-red-400/20 text-red-400/60 hover:border-red-400/40 hover:text-red-400"
                          : "border-[#9BA3AA]/20 text-[#9BA3AA]/60 hover:border-[#9BA3AA]/50 hover:text-[#9BA3AA]"
                      }`}>
                      {toggling === u.id ? "..." : u.isAdmin ? "إلغاء صلاحيات" : "ترقية لأدمن"}
                    </button>
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
