import { NextRequest, NextResponse } from "next/server"
import { getCarsByKeys } from "@/lib/cars/repository"
import { isCarsDbConfigured } from "@/lib/cars/db"

// Kept as a literal (not imported from useCarLists.ts, a "use client" module)
// to avoid pulling a client-boundary file into a server route handler. Must
// match MAX_COMPARE in src/lib/cars/useCarLists.ts.
const MAX_COMPARE = 4

export async function GET(req: NextRequest) {
  if (!isCarsDbConfigured) return NextResponse.json({ error: "Cars catalog not configured" }, { status: 503 })

  const keysParam = req.nextUrl.searchParams.get("keys") ?? ""
  const keys = keysParam.split(",").map((k) => k.trim()).filter(Boolean).slice(0, MAX_COMPARE)
  const cars = await getCarsByKeys(keys)
  return NextResponse.json({ cars })
}
