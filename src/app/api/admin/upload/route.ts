import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/middleware"
import { checkRateLimit } from "@/lib/rateLimit"
import { sniffImageType } from "@/lib/images/sniffImageType"

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { limited, retryAfterSeconds } = await checkRateLimit("upload", session.user.id)
  if (limited) {
    return NextResponse.json(
      { error: "عدد كبير من عمليات الرفع، حاول مرة أخرى بعد قليل" },
      { status: 429, headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined },
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase env vars missing" }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 })

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "حجم الملف أكبر من الحد المسموح (10 ميجابايت)" }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()

  // Real content sniffing (magic bytes), not the filename extension --
  // an extension is trivially spoofable (Station 7 finding: the previous
  // check only looked at `file.name.split(".").pop()`).
  const sniffed = sniffImageType(new Uint8Array(arrayBuffer.slice(0, 32)))
  if (!sniffed) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 })
  }
  const ext = sniffed === "jpg" ? "jpg" : sniffed

  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const uploadRes = await fetch(
    `${supabaseUrl}/storage/v1/object/products/${filename}`,
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

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${filename}`
  return NextResponse.json({ url: publicUrl })
}
