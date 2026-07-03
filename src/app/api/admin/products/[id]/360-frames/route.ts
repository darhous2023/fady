import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { product360Frames } from "@/lib/db/drizzle/schema"
import { eq, and, asc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const frames = await db
    .select()
    .from(product360Frames)
    .where(eq(product360Frames.product_id, id))
    .orderBy(asc(product360Frames.sequence_index))

  return NextResponse.json(frames)
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { url, sequence_index } = body

  if (!url) return NextResponse.json({ error: "url مطلوب" }, { status: 400 })

  const [frame] = await db.insert(product360Frames).values({
    product_id: id,
    url,
    sequence_index: sequence_index ?? 0,
  }).returning()

  return NextResponse.json(frame, { status: 201 })
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { frames } = body as { frames: { id: string; sequence_index: number }[] }

  if (!Array.isArray(frames)) return NextResponse.json({ error: "frames مطلوبة" }, { status: 400 })

  await Promise.all(
    frames.map(f =>
      db.update(product360Frames)
        .set({ sequence_index: f.sequence_index })
        .where(and(eq(product360Frames.id, f.id), eq(product360Frames.product_id, id)))
    )
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { frame_id } = body

  if (!frame_id) return NextResponse.json({ error: "frame_id مطلوب" }, { status: 400 })

  await db
    .delete(product360Frames)
    .where(and(eq(product360Frames.id, frame_id), eq(product360Frames.product_id, id)))

  return NextResponse.json({ success: true })
}
