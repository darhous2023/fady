export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { db } from "@/lib/db/drizzle/connection"
import { orders, orderItems, settings } from "@/lib/db/drizzle/schema"
import { eq, inArray } from "drizzle-orm"
import Link from "next/link"
import OrderStatusSelect from "@/components/admin/OrderStatusSelect"
import OrderStatusStepper from "@/components/admin/OrderStatusStepper"
import { ORDER_STATUS_KEYS, ORDER_STATUS_SETTING_KEY, getOrderStatusLabels } from "@/lib/orderStatusLabels"

interface Props { params: Promise<{ id: string }> }

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

  const [items, statusSettingRows] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.order_id, id)),
    db.select().from(settings).where(inArray(settings.key, ORDER_STATUS_KEYS.map(ORDER_STATUS_SETTING_KEY))),
  ])
  const STATUS_LABELS = getOrderStatusLabels(Object.fromEntries(statusSettingRows.map(r => [r.key, r.value])))

  const waPhone = order.phone.replace(/\D/g, "")
  const waMsg = encodeURIComponent(
    `السلام عليكم ${order.customer_name}، بخصوص طلب حجز المعاينة رقم ${order.order_number} من معرض الفادي`
  )

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin/orders" className="text-xs text-[#9BA3AA]/60 hover:text-[#9BA3AA] mb-2 inline-block">
            ← الطلبات
          </Link>
          <h1 className="text-2xl font-bold text-[#F2F0EC] font-mono">{order.order_number}</h1>
          <p className="text-[#F2F0EC]/40 text-sm mt-1">
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#9BA3AA] border border-[#9BA3AA]/30 rounded-lg hover:bg-[#9BA3AA]/10 transition-colors">
              ⭐ اطلب تقييم
            </a>
          )}
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Status change */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-5 space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-[#F2F0EC]/60 mb-3 uppercase tracking-widest">مراحل الحجز</h2>
          <OrderStatusStepper orderId={order.id} currentStatus={order.status} labels={STATUS_LABELS} />
        </div>
        <div className="border-t border-[#9BA3AA]/10 pt-4">
          <h2 className="text-xs font-semibold text-[#F2F0EC]/40 mb-2 uppercase tracking-widest">تغيير مباشر</h2>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer info */}
        <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#F2F0EC]/60 uppercase tracking-widest border-b border-[#9BA3AA]/10 pb-3">
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
        <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#F2F0EC]/60 uppercase tracking-widest border-b border-[#9BA3AA]/10 pb-3">
            ملخص الحجز
          </h2>
          <Row label="طريقة الطلب" value={order.method === "cod" ? "نموذج الموقع" : "واتساب"} />
          <div className="border-t border-[#9BA3AA]/10 pt-3">
            <Row label="الإجمالي"
              value={
                <span className="text-[#9BA3AA] font-bold text-base">
                  {Number(order.total).toLocaleString("ar-EG")} ج.م
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        <h2 className="text-sm font-semibold text-[#F2F0EC]/60 uppercase tracking-widest px-6 py-4 border-b border-[#9BA3AA]/10">
          السيارات المطلوب معاينتها ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-center text-[#F2F0EC]/30 py-8 text-sm">لا توجد سيارات</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#9BA3AA]/5">
                <th className="text-right px-6 py-3 text-[#F2F0EC]/40 font-medium">السيارة</th>
                <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">الجودة</th>
                <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">الكمية</th>
                <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">السعر</th>
                <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9BA3AA]/5">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-3 text-[#F2F0EC]">{item.product_name}</td>
                  <td className="px-4 py-3 text-[#F2F0EC]/50 text-xs">
                    {QUALITY_LABELS[item.quality_tier] ?? item.quality_tier}
                  </td>
                  <td className="px-4 py-3 text-[#F2F0EC]/70">{item.qty}</td>
                  <td className="px-4 py-3 text-[#F2F0EC]/70">{Number(item.unit_price).toLocaleString("ar-EG")} ج.م</td>
                  <td className="px-4 py-3 text-[#9BA3AA] font-medium">
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
      <span className="text-xs text-[#F2F0EC]/40 shrink-0">{label}</span>
      <span className="text-sm text-[#F2F0EC] text-right">{value}</span>
    </div>
  )
}
