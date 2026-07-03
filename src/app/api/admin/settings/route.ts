import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { settings } from "@/lib/db/drizzle/schema";
import { getSessionFromRequest } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(settings);
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { settings: updates } = body as { settings: { key: string; value: string }[] };

  if (!Array.isArray(updates)) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  await Promise.all(
    updates.map(({ key, value }) =>
      db
        .insert(settings)
        .values({ key, value, updated_at: new Date() })
        .onConflictDoUpdate({ target: settings.key, set: { value, updated_at: new Date() } })
    )
  );

  return NextResponse.json({ success: true });
}
