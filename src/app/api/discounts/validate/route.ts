import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { discountCodes } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.toUpperCase().trim()
  const orderTotal = Number(req.nextUrl.searchParams.get("total") ?? 0)

  if (!code) return NextResponse.json({ error: "الكود مطلوب" }, { status: 400 })

  try {
    const [dc] = await db.select().from(discountCodes).where(eq(discountCodes.code, code)).limit(1)

    if (!dc) return NextResponse.json({ error: "الكود غير صحيح" }, { status: 404 })
    if (!dc.is_active) return NextResponse.json({ error: "الكود غير مفعل" }, { status: 400 })
    if (dc.expires_at && new Date(dc.expires_at) < new Date()) {
      return NextResponse.json({ error: "الكود منتهي الصلاحية" }, { status: 400 })
    }
    if (dc.max_uses !== null && dc.used_count >= dc.max_uses) {
      return NextResponse.json({ error: "الكود استُنفد" }, { status: 400 })
    }
    if (orderTotal < Number(dc.min_order)) {
      return NextResponse.json({
        error: `الحد الأدنى للطلب ${Number(dc.min_order).toLocaleString("ar-EG")} ج.م`,
      }, { status: 400 })
    }

    const discount = dc.type === "percent"
      ? Math.round(orderTotal * Number(dc.value) / 100)
      : Math.min(Number(dc.value), orderTotal)

    return NextResponse.json({ id: dc.id, code: dc.code, type: dc.type, value: Number(dc.value), discount })
  } catch (err) {
    console.error("[api/discounts/validate] failed:", err)
    return NextResponse.json({ error: "حدث خطأ، حاول مرة أخرى" }, { status: 500 })
  }
}
