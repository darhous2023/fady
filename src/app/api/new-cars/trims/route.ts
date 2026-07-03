import { NextRequest, NextResponse } from "next/server";
import { carapiFetch } from "@/lib/carapi";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const make = params.get("make");
  const model = params.get("model");
  const year = params.get("year");

  if (!make) return NextResponse.json({ error: "الماركة مطلوبة" }, { status: 400 });

  try {
    const data = await carapiFetch("/trims/v2", {
      make,
      model: model || undefined,
      year: year || undefined,
      limit: 50,
    });
    return NextResponse.json(data.data ?? []);
  } catch {
    return NextResponse.json({ error: "تعذّر جلب المواصفات، حاول لاحقًا" }, { status: 502 });
  }
}
