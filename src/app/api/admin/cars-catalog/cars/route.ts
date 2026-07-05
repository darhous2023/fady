import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { isCarsDbConfigured } from "@/lib/cars/db"
import { adminListCars, adminCreateCar } from "@/lib/cars/adminRepository"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const sp = req.nextUrl.searchParams
  const result = await adminListCars({
    q: sp.get("q") ?? undefined,
    brandId: sp.get("brandId") ?? undefined,
    page: sp.get("page") ? Number(sp.get("page")) : undefined,
    pageSize: sp.get("pageSize") ? Number(sp.get("pageSize")) : undefined,
  })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const body = await req.json()
  const displayName = String(body.displayName ?? "").trim()
  if (!displayName) return NextResponse.json({ error: "اسم السيارة مطلوب" }, { status: 400 })

  const row = await adminCreateCar({
    displayName,
    brandId: body.brandId || null,
    modelId: body.modelId || null,
    year: body.year ? Number(body.year) : null,
    bodyType: body.bodyType || null,
    fuelType: body.fuelType || null,
    transmission: body.transmission || null,
  })
  return NextResponse.json(row, { status: 201 })
}
