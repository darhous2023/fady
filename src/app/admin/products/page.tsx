export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { products, categories } from "@/lib/db/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

const QUALITY_LABELS: Record<string, string> = {
  hi_copy: "هاي كوبي",
  mirror: "ميرو",
  original: "أورجنال",
};

const QUALITY_COLORS: Record<string, string> = {
  hi_copy: "bg-blue-500/20 text-blue-400",
  mirror: "bg-[#C9A84C]/20 text-[#C9A84C]",
  original: "bg-green-500/20 text-green-400",
};

const STATUS_LABELS: Record<string, string> = {
  active: "نشط",
  draft: "مسودة",
  archived: "مؤرشف",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/20 text-green-400",
  draft: "bg-gray-500/20 text-gray-400",
  archived: "bg-red-500/20 text-red-400",
};

async function getProducts() {
  return db
    .select({
      id: products.id,
      name_ar: products.name_ar,
      price: products.price,
      compare_at_price: products.compare_at_price,
      quality_tier: products.quality_tier,
      status: products.status,
      is_featured: products.is_featured,
      category_name: categories.name_ar,
      created_at: products.created_at,
    })
    .from(products)
    .leftJoin(categories, eq(products.category_id, categories.id))
    .orderBy(desc(products.created_at));
}

export default async function ProductsPage() {
  const items = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5EFE0]">المنتجات</h1>
          <p className="text-[#F5EFE0]/40 text-sm mt-1">
            {items.length} منتج
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="bg-[#C9A84C] hover:bg-[#B89440] text-[#0A0806] font-bold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          + منتج جديد
        </Link>
      </div>

      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#C9A84C]/10">
              <th className="text-right px-6 py-3 text-[#F5EFE0]/40 font-medium">المنتج</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">القسم</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الجودة</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">السعر</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الحالة</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9A84C]/5">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#F5EFE0]/30">
                  لا توجد منتجات. أضف أول منتج الآن.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="hover:bg-[#C9A84C]/3">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.is_featured && (
                        <span className="text-[#C9A84C] text-xs">★</span>
                      )}
                      <span className="text-[#F5EFE0] font-medium">{p.name_ar}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#F5EFE0]/60">
                    {p.category_name || "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${QUALITY_COLORS[p.quality_tier]}`}
                    >
                      {QUALITY_LABELS[p.quality_tier]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#C9A84C] font-medium">
                    {Number(p.price).toLocaleString("ar-EG")} ج
                    {p.compare_at_price && (
                      <span className="text-[#F5EFE0]/30 line-through text-xs mr-2">
                        {Number(p.compare_at_price).toLocaleString("ar-EG")} ج
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}
                    >
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs text-[#C9A84C] hover:underline"
                    >
                      تعديل
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
