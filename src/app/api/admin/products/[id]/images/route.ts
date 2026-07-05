import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { productImages } from "@/lib/db/drizzle/schema"
import { eq, and } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const imgs = await db
    .select()
    .from(productImages)
    .where(eq(productImages.product_id, id))
    .orderBy(productImages.sort_order)

  return NextResponse.json(imgs)
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { url, alt_ar, sort_order } = body

  if (!url) return NextResponse.json({ error: "url مطلوب" }, { status: 400 })

  const [img] = await db.insert(productImages).values({
    product_id: id,
    url,
    alt_ar: alt_ar || null,
    sort_order: sort_order ?? 0,
  }).returning()

  return NextResponse.json(img, { status: 201 })
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { images } = body as { images: { id: string; sort_order: number; alt_ar?: string | null }[] }

  if (!Array.isArray(images)) return NextResponse.json({ error: "images مطلوبة" }, { status: 400 })

  await Promise.all(
    images.map(img =>
      db.update(productImages)
        .set({ sort_order: img.sort_order, ...(img.alt_ar !== undefined ? { alt_ar: img.alt_ar } : {}) })
        .where(and(eq(productImages.id, img.id), eq(productImages.product_id, id)))
    )
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { image_id } = body

  if (!image_id) return NextResponse.json({ error: "image_id مطلوب" }, { status: 400 })

  await db
    .delete(productImages)
    .where(and(eq(productImages.id, image_id), eq(productImages.product_id, id)))

  return NextResponse.json({ success: true })
}
