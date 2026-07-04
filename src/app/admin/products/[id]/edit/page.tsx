export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/drizzle/connection";
import { products, categories } from "@/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!rows[0]) notFound();

  const cats = await db
    .select()
    .from(categories)
    .where(eq(categories.is_active, true))
    .orderBy(categories.sort_order);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F2F0EC]">تعديل السيارة</h1>
        <p className="text-[#F2F0EC]/40 text-sm mt-1">{rows[0].name_ar}</p>
      </div>
      <ProductForm categories={cats} product={rows[0]} />
    </div>
  );
}
