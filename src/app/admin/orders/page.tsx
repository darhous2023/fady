export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { orders } from "@/lib/db/drizzle/schema";
import { desc } from "drizzle-orm";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import ExportCSVButton from "@/components/admin/ExportCSVButton";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  pending: "بانتظار التأكيد",
  confirmed: "تم تأكيد الموعد",
  shipped: "تم التواصل",
  delivered: "تمت المعاينة",
  cancelled: "ملغي",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const METHOD_LABELS: Record<string, string> = {
  whatsapp: "واتساب",
  cod: "نموذج الموقع",
};

export default async function OrdersPage() {
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.created_at));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5EFE0]">طلبات حجز المعاينة</h1>
          <p className="text-[#F5EFE0]/40 text-sm mt-1">{allOrders.length} طلب</p>
        </div>
        <ExportCSVButton />
      </div>

      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#C9A84C]/10">
              <th className="text-right px-6 py-3 text-[#F5EFE0]/40 font-medium">رقم الطلب</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">العميل</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الميعاد المفضل</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الإجمالي</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الطريقة</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الحالة</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9A84C]/5">
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#F5EFE0]/30">
                  لا توجد طلبات بعد
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#C9A84C]/3">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-[#C9A84C]">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-[#F5EFE0]">{order.customer_name}</p>
                      <a
                        href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="text-xs text-[#25D366] hover:underline"
                      >
                        {order.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#F5EFE0]/60 text-xs">
                    {order.preferred_date ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-[#C9A84C] font-medium">
                    {Number(order.total).toLocaleString("ar-EG")} ج
                  </td>
                  <td className="px-4 py-4 text-[#F5EFE0]/50 text-xs">
                    {METHOD_LABELS[order.method]}
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-[#C9A84C] hover:underline"
                    >
                      تفاصيل
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
