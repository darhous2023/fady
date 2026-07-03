import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { customers } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/utils/auth"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BUCKET = "avatars"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!SERVICE_KEY) return NextResponse.json({ error: "Storage not configured" }, { status: 503 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const maxSize = 3 * 1024 * 1024 // 3 MB
    if (file.size > maxSize) return NextResponse.json({ error: "File too large (max 3MB)" }, { status: 400 })

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) return NextResponse.json({ error: "Only JPEG/PNG/WebP allowed" }, { status: 400 })

    const ext = file.type.split("/")[1]
    const path = `${session.user.id}/avatar.${ext}`
    const bytes = await file.arrayBuffer()

    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: bytes,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      console.error("Supabase storage error:", err)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`

    await db.update(customers)
      .set({ avatar_url: publicUrl, updated_at: new Date() })
      .where(eq(customers.auth_user_id, session.user.id))

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
