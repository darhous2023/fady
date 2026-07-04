import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { orders } from "@/lib/db/drizzle/schema"
import { desc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const all = await db.select().from(orders).orderBy(desc(orders.created_at))
  const header = ["رقم الطلب", "الاسم", "الهاتف", "المحافظة", "العنوان", "الإجمالي", "الشحن", "الحالة", "الطريقة", "كود الخصم", "ملاحظات", "تاريخ الطلب"]
  const rows = all.map(o => [
    o.order_number,
    o.customer_name,
    o.phone,
    o.governorate,
    `"${(o.address || "").replace(/"/g, '""')}"`,
    o.total,
    o.shipping_cost,
    o.status,
    o.method,
    o.discount_code || "",
    `"${(o.notes || "").replace(/"/g, '""')}"`,
    o.created_at ? new Date(o.created_at).toLocaleDateString("ar-EG") : "",
  ])
  const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n")
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="elfady-orders-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  })
}
