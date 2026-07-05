import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { isCarsDbConfigured } from "@/lib/cars/db"
import {
  adminSetCarHidden, adminSetCarNotes, adminSetCarFieldOverride,
  adminGetCarOverrides, adminDeleteCar, isOverridableCarField,
} from "@/lib/cars/adminRepository"
import { getCanonicalCarDetail } from "@/lib/cars/repository"

type Params = { key: string }

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const { key } = await params
  const normalizedKey = decodeURIComponent(key)
  const [car, overrides] = await Promise.all([
    getCanonicalCarDetail(normalizedKey),
    adminGetCarOverrides(normalizedKey),
  ])
  if (!car) return NextResponse.json({ error: "غير موجود" }, { status: 404 })
  return NextResponse.json({ car, overrides })
}

/**
 * Body shape (any subset):
 * { hidden?: boolean, notes?: string|null, overrides?: { field: string, value: string }[] }
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<Params> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const { key } = await params
  const normalizedKey = decodeURIComponent(key)
  const body = await req.json()
  const updatedBy = (session.user as { email?: string } | undefined)?.email ?? "admin"

  if ("hidden" in body) await adminSetCarHidden(normalizedKey, Boolean(body.hidden))
  if ("notes" in body) await adminSetCarNotes(normalizedKey, body.notes ? String(body.notes) : null)
  if (Array.isArray(body.overrides)) {
    for (const o of body.overrides) {
      if (!isOverridableCarField(o.field)) continue
      await adminSetCarFieldOverride(normalizedKey, o.field, String(o.value), updatedBy)
    }
  }

  const car = await getCanonicalCarDetail(normalizedKey)
  if (!car) return NextResponse.json({ error: "غير موجود" }, { status: 404 })
  return NextResponse.json(car)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const { key } = await params
  const normalizedKey = decodeURIComponent(key)
  const result = await adminDeleteCar(normalizedKey)
  if (!result.deleted) {
    return NextResponse.json(
      { error: "السيارات المستوردة من قاعدة السيارات لا يمكن حذفها نهائيًا — استخدم الأرشفة (إخفاء) بدلًا من ذلك" },
      { status: 409 },
    )
  }
  return NextResponse.json({ ok: true })
}
