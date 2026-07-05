import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { isCarsDbConfigured } from "@/lib/cars/db"
import { adminUpdateBrand, adminDeleteBrand } from "@/lib/cars/adminRepository"

type Params = { id: string }

export async function PATCH(req: NextRequest, { params }: { params: Promise<Params> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const { id } = await params
  const body = await req.json()
  const patch: { nameAr?: string | null; isPublic?: boolean } = {}
  if ("nameAr" in body) patch.nameAr = body.nameAr ? String(body.nameAr).trim() : null
  if ("isPublic" in body) patch.isPublic = Boolean(body.isPublic)

  const row = await adminUpdateBrand(id, patch)
  if (!row) return NextResponse.json({ error: "غير موجود" }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const { id } = await params
  const result = await adminDeleteBrand(id)
  if (!result.deleted) {
    return NextResponse.json(
      { error: "الماركات المستوردة من قاعدة السيارات لا يمكن حذفها — استخدم إظهار/إخفاء بدلًا من ذلك" },
      { status: 409 },
    )
  }
  return NextResponse.json({ ok: true })
}
