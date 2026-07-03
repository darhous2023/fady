import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase env vars missing" }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 })

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const allowed = ["jpg", "jpeg", "png", "webp", "avif"]
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 })
  }

  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const arrayBuffer = await file.arrayBuffer()

  const uploadRes = await fetch(
    `${supabaseUrl}/storage/v1/object/product-images/${filename}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": file.type || "image/jpeg",
        "x-upsert": "true",
      },
      body: arrayBuffer,
    }
  )

  if (!uploadRes.ok) {
    const err = await uploadRes.text()
    return NextResponse.json({ error: `فشل الرفع: ${err}` }, { status: 500 })
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${filename}`
  return NextResponse.json({ url: publicUrl })
}
