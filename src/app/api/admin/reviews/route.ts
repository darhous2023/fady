import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { reviews } from "@/lib/db/drizzle/schema"
import { desc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await db.select().from(reviews).orderBy(desc(reviews.created_at)).limit(100)
  return NextResponse.json(rows)
}
