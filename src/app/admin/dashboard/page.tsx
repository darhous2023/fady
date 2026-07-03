export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { orders, products, customers } from "@/lib/db/drizzle/schema";
import { eq, count, sum, desc, sql } from "drizzle-orm";
import RevenueChart from "@/components/admin/RevenueChart";

async function getStats() {
  const [totalOrders] = await db.select({ count: count() }).from(orders);
  const [pendingOrders] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const [totalProducts] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.status, "active"));
  const [totalRevenue] = await db
    .select({ sum: sum(orders.total) })
    .from(orders)
    .where(eq(orders.status, "delivered"));

  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.created_at))
    .limit(5);

  const revenueRows = await db.execute(sql`
    SELECT
      DATE_TRUNC('day', created_at)::date AS day,
      SUM(total::numeric)::float AS revenue,
      COUNT(*)::int AS orders
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '30 days'
      AND status != 'cancelled'
    GROUP BY 1
    ORDER BY 1
  `);

  const revenueByDay = (() => {
    const map = new Map<string, { revenue: number; orders: number }>();
    const rows = Array.isArray(revenueRows) ? revenueRows : (revenueRows as { rows: unknown[] }).rows ?? []
    for (const row of rows as { day: string; revenue: number; orders: number }[]) {
      const d = new Date(row.day).toISOString().slice(0, 10);
      map.set(d, { revenue: row.revenue, orders: row.orders });
    }
    const result: { day: string; revenue: number; orders: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ day: key, ...(map.get(key) ?? { revenue: 0, orders: 0 }) });
    }
    return result;
  })();

  const topProductsRows = await db.execute(sql`
    SELECT p.name_ar, COUNT(oi.id)::int AS orders
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.id, p.name_ar
    ORDER BY orders DESC
    LIMIT 5
  `)

  const [totalCustomers] = await db.select({ count: count() }).from(customers)

  const topProducts = (Array.isArray(topProductsRows) ? topProductsRows : (topProductsRows as { rows: unknown[] }).rows ?? []) as { name_ar: string; orders: number }[]

  return {
    totalOrders: totalOrders.count,
    pendingOrders: pendingOrders.count,
    totalProducts: totalProducts.count,
    totalRevenue: Number(totalRevenue.sum || 0),
    totalCustomers: totalCustomers.count,
    recentOrders,
    revenueByDay,
    topProducts,
  };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default async function DashboardPage() {
  const stats = await getStats();
  const totalChartRevenue = stats.revenueByDay.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5EFE0]">الداشبورد</h1>
        <p className="text-[#F5EFE0]/40 text-sm mt-1">نظرة عامة على المتجر</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="إجمالي الطلبات" value={stats.totalOrders.toString()} icon="🧾" />
        <StatCard label="طلبات معلّقة" value={stats.pendingOrders.toString()} icon="⏳" highlight />
        <StatCard label="منتجات نشطة" value={stats.totalProducts.toString()} icon="📦" />
        <StatCard
          label="إجمالي المبيعات"
          value={`${stats.totalRevenue.toLocaleString("ar-EG")} ج`}
          icon="💰"
        />
        <StatCard label="العملاء" value={stats.totalCustomers.toString()} icon="🧑‍💼" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C9A84C]/10">
          <div>
            <h2 className="font-semibold text-[#F5EFE0]">الإيرادات — آخر 30 يوم</h2>
            <p className="text-xs text-[#F5EFE0]/30 mt-0.5">
              إجمالي: {totalChartRevenue.toLocaleString("ar-EG")} ج.م
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(135deg,#C9A84C,#F0D882)" }} />
            <span className="text-xs text-[#F5EFE0]/40">إيرادات الطلبات المسلّمة</span>
          </div>
        </div>
        <div className="p-6">
          <RevenueChart data={stats.revenueByDay} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C9A84C]/10">
          <h2 className="font-semibold text-[#F5EFE0]">آخر الطلبات</h2>
          <a href="/admin/orders" className="text-xs text-[#C9A84C] hover:underline">عرض الكل ←</a>
        </div>
        <div className="divide-y divide-[#C9A84C]/5">
          {stats.recentOrders.length === 0 ? (
            <p className="text-center text-[#F5EFE0]/30 py-8 text-sm">لا توجد طلبات بعد</p>
          ) : (
            stats.recentOrders.map((order) => (
              <a key={order.id} href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-[#C9A84C]/5 transition-colors no-underline">
                <div>
                  <p className="text-sm text-[#F5EFE0]">{order.customer_name}</p>
                  <p className="text-xs text-[#F5EFE0]/40">{order.order_number}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-sm text-[#C9A84C] font-medium">
                    {Number(order.total).toLocaleString("ar-EG")} ج
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
      {/* Top Products */}
      {stats.topProducts.length > 0 && (
        <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C9A84C]/10">
            <h2 className="font-semibold text-[#F5EFE0]">الأكثر مبيعاً</h2>
          </div>
          <div className="divide-y divide-[#C9A84C]/5">
            {stats.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#C9A84C]/40 w-5">{i + 1}</span>
                  <span className="text-sm text-[#F5EFE0]">{p.name_ar}</span>
                </div>
                <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-1 rounded-full">{p.orders} طلب</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, highlight }: {
  label: string; value: string; icon: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${highlight ? "bg-[#C9A84C]/10 border-[#C9A84C]/30" : "bg-[#0A0806] border-[#C9A84C]/10"}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-[#F5EFE0]/40">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#F5EFE0]">{value}</p>
    </div>
  );
}
