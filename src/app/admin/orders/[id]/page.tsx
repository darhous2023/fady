export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { db } from "@/lib/db/drizzle/connection"
import { orders, orderItems } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import OrderStatusSelect from "@/components/admin/OrderStatusSelect"

interface Props { params: Promise<{ id: string }> }

const STATUS_LABELS: Record<string, string> = {
  pending: "بانتظار التأكيد", confirmed: "تم تأكيد الموعد",
  shipped: "تم التواصل", delivered: "تمت المعاينة", cancelled: "ملغي",
}
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
}
const QUALITY_LABELS: Record<string, string> = {
  original: "ممتازة", mirror: "جيدة جدًا", hi_copy: "جيدة",
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params

  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) notFound()

  const items = await db.select().from(orderItems).where(eq(orderItems.order_id, id))

  const waPhone = order.phone.replace(/\D/g, "")
  const waMsg = encodeURIComponent(
    `السلام عليكم ${order.customer_name}، بخصوص طلب حجز المعاينة رقم ${order.order_number} من معرض الفادي`
  )

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin/orders" className="text-xs text-[#C9A84C]/60 hover:text-[#C9A84C] mb-2 inline-block">
            ← الطلبات
          </Link>
          <h1 className="text-2xl font-bold text-[#F5EFE0] font-mono">{order.order_number}</h1>
          <p className="text-[#F5EFE0]/40 text-sm mt-1">
            {new Date(order.created_at!).toLocaleDateString("ar-EG", {
              year: "numeric", month: "long", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a href={`https://wa.me/${waPhone}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#25D366] border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
            </svg>
            واتساب
          </a>
          {order.status === "delivered" && (
            <a href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`السلام عليكم ${order.customer_name}\nنأمل أن تكون معاينة السيارة (طلب رقم ${order.order_number}) في معرض الفادي قد أعجبتك.\nنودّ سماع رأيك — هل يمكنك تقييم تجربتك معنا؟ رأيك يهمنا جداً`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#C9A84C] border border-[#C9A84C]/30 rounded-lg hover:bg-[#C9A84C]/10 transition-colors">
              ⭐ اطلب تقييم
            </a>
          )}
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Status change */}
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-5">
        <h2 className="text-sm font-semibold text-[#F5EFE0]/60 mb-3 uppercase tracking-widest">تغيير الحالة</h2>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        <div className="flex gap-3 mt-3 flex-wrap">
          {["pending","confirmed","shipped","delivered","cancelled"].map(s => (
            <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s]}`}>
              {STATUS_LABELS[s]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer info */}
        <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#F5EFE0]/60 uppercase tracking-widest border-b border-[#C9A84C]/10 pb-3">
            بيانات العميل
          </h2>
          <Row label="الاسم" value={order.customer_name} />
          <Row label="التليفون"
            value={
              <a href={`https://wa.me/${waPhone}`} target="_blank" className="text-[#25D366] hover:underline">
                {order.phone}
              </a>
            }
          />
          <Row label="الميعاد المفضل" value={order.preferred_date ?? "لم يُحدَّد"} />
          <Row label="مكان المعاينة" value={order.branch ?? "—"} />
          {order.notes && <Row label="ملاحظات" value={order.notes} />}
        </div>

        {/* Order summary */}
        <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#F5EFE0]/60 uppercase tracking-widest border-b border-[#C9A84C]/10 pb-3">
            ملخص الحجز
          </h2>
          <Row label="طريقة الطلب" value={order.method === "cod" ? "نموذج الموقع" : "واتساب"} />
          <div className="border-t border-[#C9A84C]/10 pt-3">
            <Row label="الإجمالي"
              value={
                <span className="text-[#C9A84C] font-bold text-base">
                  {Number(order.total).toLocaleString("ar-EG")} ج.م
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 overflow-hidden">
        <h2 className="text-sm font-semibold text-[#F5EFE0]/60 uppercase tracking-widest px-6 py-4 border-b border-[#C9A84C]/10">
          السيارات المطلوب معاينتها ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-center text-[#F5EFE0]/30 py-8 text-sm">لا توجد سيارات</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#C9A84C]/5">
                <th className="text-right px-6 py-3 text-[#F5EFE0]/40 font-medium">السيارة</th>
                <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الجودة</th>
                <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الكمية</th>
                <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">السعر</th>
                <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A84C]/5">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-3 text-[#F5EFE0]">{item.product_name}</td>
                  <td className="px-4 py-3 text-[#F5EFE0]/50 text-xs">
                    {QUALITY_LABELS[item.quality_tier] ?? item.quality_tier}
                  </td>
                  <td className="px-4 py-3 text-[#F5EFE0]/70">{item.qty}</td>
                  <td className="px-4 py-3 text-[#F5EFE0]/70">{Number(item.unit_price).toLocaleString("ar-EG")} ج.م</td>
                  <td className="px-4 py-3 text-[#C9A84C] font-medium">
                    {(item.qty * Number(item.unit_price)).toLocaleString("ar-EG")} ج.م
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-[#F5EFE0]/40 shrink-0">{label}</span>
      <span className="text-sm text-[#F5EFE0] text-right">{value}</span>
    </div>
  )
}
