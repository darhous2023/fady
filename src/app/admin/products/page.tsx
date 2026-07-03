export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { products, categories } from "@/lib/db/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

const QUALITY_LABELS: Record<string, string> = {
  original: "ممتازة",
  mirror: "جيدة جدًا",
  hi_copy: "جيدة",
};

const QUALITY_COLORS: Record<string, string> = {
  original: "bg-green-500/20 text-green-400",
  mirror: "bg-[#9BA3AA]/20 text-[#9BA3AA]",
  hi_copy: "bg-blue-500/20 text-blue-400",
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
      year: products.year,
      mileage_km: products.mileage_km,
      transmission: products.transmission,
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
          <h1 className="text-2xl font-bold text-[#F5EFE0]">السيارات المستعملة</h1>
          <p className="text-[#F5EFE0]/40 text-sm mt-1">
            {items.length} سيارة
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="bg-[#9BA3AA] hover:bg-[#838B92] text-[#0A0A0A] font-bold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          + سيارة جديدة
        </Link>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#9BA3AA]/10">
              <th className="text-right px-6 py-3 text-[#F5EFE0]/40 font-medium">السيارة</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الماركة</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">سنة / عداد</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">الحالة</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">السعر</th>
              <th className="text-right px-4 py-3 text-[#F5EFE0]/40 font-medium">النشر</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#9BA3AA]/5">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#F5EFE0]/30">
                  لا توجد سيارات. أضف أول سيارة الآن.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="hover:bg-[#9BA3AA]/3">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.is_featured && (
                        <span className="text-[#9BA3AA] text-xs">★</span>
                      )}
                      <span className="text-[#F5EFE0] font-medium">{p.name_ar}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#F5EFE0]/60">
                    {p.category_name || "—"}
                  </td>
                  <td className="px-4 py-4 text-[#F5EFE0]/60 text-xs">
                    {p.year || "—"} {p.mileage_km ? `· ${Number(p.mileage_km).toLocaleString("ar-EG")} كم` : ""}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${QUALITY_COLORS[p.quality_tier]}`}
                    >
                      {QUALITY_LABELS[p.quality_tier]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#9BA3AA] font-medium">
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
                      className="text-xs text-[#9BA3AA] hover:underline"
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
