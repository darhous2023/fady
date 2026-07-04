export const dynamic = "force-dynamic"

import { db } from "@/lib/db/drizzle/connection"
import { reviews, products } from "@/lib/db/drizzle/schema"
import { desc, eq } from "drizzle-orm"
import ReviewCard from "@/components/admin/ReviewCard"
import AddReviewForm from "@/components/admin/AddReviewForm"

export default async function AdminReviewsPage() {
  const [rows, productOptions] = await Promise.all([
    db
      .select({
        id: reviews.id,
        customer_name: reviews.customer_name,
        rating: reviews.rating,
        comment_ar: reviews.comment_ar,
        is_approved: reviews.is_approved,
        created_at: reviews.created_at,
        product_id: reviews.product_id,
        product_name: products.name_ar,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.product_id, products.id))
      .orderBy(desc(reviews.created_at)),
    db.select({ id: products.id, name_ar: products.name_ar }).from(products).orderBy(products.name_ar),
  ])

  const pending = rows.filter(r => !r.is_approved)
  const approved = rows.filter(r => r.is_approved)
  const showroomCount = rows.filter(r => !r.product_id).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F0EC]">التقييمات</h1>
          <p className="text-[#F2F0EC]/40 text-sm mt-1">
            {pending.length} في الانتظار · {approved.length} معتمد · {showroomCount} عن المعرض عمومًا
          </p>
        </div>
        <AddReviewForm products={productOptions} />
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-yellow-400/80 uppercase tracking-widest mb-3">⏳ في انتظار الموافقة ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map(r => <ReviewCard key={r.id} review={r} products={productOptions} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-[#F2F0EC]/30 uppercase tracking-widest mb-3">✓ معتمدة ({approved.length})</h2>
        {approved.length === 0 ? (
          <p className="text-[#F2F0EC]/25 text-sm py-4">لا توجد تقييمات معتمدة</p>
        ) : (
          <div className="space-y-3">
            {approved.map(r => <ReviewCard key={r.id} review={r} products={productOptions} />)}
          </div>
        )}
      </div>
    </div>
  )
}
