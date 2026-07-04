export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { orders } from "@/lib/db/drizzle/schema";
import { desc } from "drizzle-orm";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import ExportCSVButton from "@/components/admin/ExportCSVButton";
import Link from "next/link";

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
          <h1 className="text-2xl font-bold text-[#F2F0EC]">طلبات حجز المعاينة</h1>
          <p className="text-[#F2F0EC]/40 text-sm mt-1">{allOrders.length} طلب</p>
        </div>
        <ExportCSVButton />
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#9BA3AA]/10">
              <th className="text-right px-6 py-3 text-[#F2F0EC]/40 font-medium">رقم الطلب</th>
              <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">العميل</th>
              <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">الميعاد المفضل</th>
              <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">الإجمالي</th>
              <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">الطريقة</th>
              <th className="text-right px-4 py-3 text-[#F2F0EC]/40 font-medium">الحالة</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#9BA3AA]/5">
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#F2F0EC]/30">
                  لا توجد طلبات بعد
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#9BA3AA]/3">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-[#9BA3AA]">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-[#F2F0EC]">{order.customer_name}</p>
                      <a
                        href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="text-xs text-[#25D366] hover:underline"
                      >
                        {order.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#F2F0EC]/60 text-xs">
                    {order.preferred_date ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-[#9BA3AA] font-medium">
                    {Number(order.total).toLocaleString("ar-EG")} ج
                  </td>
                  <td className="px-4 py-4 text-[#F2F0EC]/50 text-xs">
                    {METHOD_LABELS[order.method]}
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-[#9BA3AA] hover:underline"
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
