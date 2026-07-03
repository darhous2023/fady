import { NextRequest, NextResponse } from "next/server";
import { carapiFetch } from "@/lib/carapi";

export async function GET(request: NextRequest) {
  const make = request.nextUrl.searchParams.get("make");
  if (!make) return NextResponse.json({ error: "الماركة مطلوبة" }, { status: 400 });

  try {
    const data = await carapiFetch("/models/v2", { make, limit: 100 });
    return NextResponse.json(data.data ?? []);
  } catch {
    return NextResponse.json({ error: "تعذّر جلب الموديلات، حاول لاحقًا" }, { status: 502 });
  }
}
