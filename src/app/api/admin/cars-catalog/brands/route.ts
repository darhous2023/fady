import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { isCarsDbConfigured } from "@/lib/cars/db"
import { adminListBrands, adminCreateBrand } from "@/lib/cars/adminRepository"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const rows = await adminListBrands()
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const body = await req.json()
  const nameEn = String(body.nameEn ?? "").trim()
  const slug = String(body.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-")
  const nameAr = body.nameAr ? String(body.nameAr).trim() : null
  if (!nameEn || !slug) return NextResponse.json({ error: "الاسم بالإنجليزي والـ slug مطلوبان" }, { status: 400 })

  try {
    const row = await adminCreateBrand({ nameEn, slug, nameAr })
    return NextResponse.json(row, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "الـ slug موجود بالفعل" }, { status: 409 })
    }
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
