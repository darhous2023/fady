export const dynamic = "force-dynamic"

import { db } from "@/lib/db/drizzle/connection"
import { reviews, products } from "@/lib/db/drizzle/schema"
import { desc, eq } from "drizzle-orm"
import ReviewActions from "@/components/admin/ReviewActions"

export default async function AdminReviewsPage() {
  const rows = await db
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
    .orderBy(desc(reviews.created_at))

  const pending = rows.filter(r => !r.is_approved)
  const approved = rows.filter(r => r.is_approved)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F2F0EC]">التقييمات</h1>
        <p className="text-[#F2F0EC]/40 text-sm mt-1">
          {pending.length} في الانتظار · {approved.length} معتمد
        </p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-yellow-400/80 uppercase tracking-widest mb-3">⏳ في انتظار الموافقة ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-[#F2F0EC]/30 uppercase tracking-widest mb-3">✓ معتمدة ({approved.length})</h2>
        {approved.length === 0 ? (
          <p className="text-[#F2F0EC]/25 text-sm py-4">لا توجد تقييمات معتمدة</p>
        ) : (
          <div className="space-y-3">
            {approved.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function Stars({ n }: { n: number }) {
  return <span className="text-[#C9CFD4] text-xs">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
}

function ReviewCard({ review }: { review: {
  id: string; customer_name: string; rating: number
  comment_ar: string | null; is_approved: boolean
  created_at: Date | null; product_name: string | null; product_id: string
}}) {
  return (
    <div className={`bg-[#0A0A0A] rounded-xl border p-5 ${review.is_approved ? "border-[#9BA3AA]/8" : "border-yellow-500/20"}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className="font-semibold text-[#F2F0EC] text-sm">{review.customer_name}</span>
            <Stars n={review.rating} />
            <span className="text-xs text-[#F2F0EC]/30">
              {review.created_at ? new Date(review.created_at).toLocaleDateString("ar-EG") : ""}
            </span>
          </div>
          <p className="text-xs text-[#9BA3AA]/60 mb-2">{review.product_name ?? review.product_id}</p>
          {review.comment_ar && (
            <p className="text-sm text-[#F2F0EC]/55 leading-relaxed">{review.comment_ar}</p>
          )}
        </div>
        <ReviewActions reviewId={review.id} isApproved={review.is_approved} />
      </div>
    </div>
  )
}
