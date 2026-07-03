export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { categories } from "@/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";
import ProductForm from "@/components/admin/ProductForm";

export default async function CreateProductPage() {
  const cats = await db
    .select()
    .from(categories)
    .where(eq(categories.is_active, true))
    .orderBy(categories.sort_order);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5EFE0]">سيارة جديدة</h1>
        <p className="text-[#F5EFE0]/40 text-sm mt-1">أضف سيارة مستعملة للمعرض</p>
      </div>
      <ProductForm categories={cats} />
    </div>
  );
}
