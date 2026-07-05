import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { isCarsDbConfigured } from "@/lib/cars/db"
import { adminListModels, adminCreateModel } from "@/lib/cars/adminRepository"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const brandId = req.nextUrl.searchParams.get("brandId") ?? undefined
  const rows = await adminListModels(brandId)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const body = await req.json()
  const brandId = String(body.brandId ?? "").trim()
  const nameEn = String(body.nameEn ?? "").trim()
  const slug = String(body.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-")
  const nameAr = body.nameAr ? String(body.nameAr).trim() : null
  const bodyType = body.bodyType ? String(body.bodyType).trim() : null
  if (!brandId || !nameEn || !slug) {
    return NextResponse.json({ error: "الماركة والاسم بالإنجليزي والـ slug مطلوبة" }, { status: 400 })
  }

  try {
    const row = await adminCreateModel({ brandId, nameEn, slug, nameAr, bodyType })
    return NextResponse.json(row, { status: 201 })
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
