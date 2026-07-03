import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { admins } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/utils/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.email) return NextResponse.json({ isAdmin: false })

    const [admin] = await db.select({ id: admins.id }).from(admins)
      .where(eq(admins.email, session.user.email)).limit(1)

    return NextResponse.json({ isAdmin: !!admin })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
