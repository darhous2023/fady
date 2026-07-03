import { NextResponse } from "next/server";
import { carapiFetch } from "@/lib/carapi";

export async function GET() {
  try {
    const data = await carapiFetch("/makes", { limit: 100 });
    return NextResponse.json(data.data ?? []);
  } catch {
    return NextResponse.json({ error: "تعذّر جلب الماركات، حاول لاحقًا" }, { status: 502 });
  }
}
