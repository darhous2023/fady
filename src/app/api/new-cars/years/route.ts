import { NextResponse } from "next/server";
import { carapiFetch } from "@/lib/carapi";

export async function GET() {
  try {
    const years: number[] = await carapiFetch("/years");
    return NextResponse.json(years);
  } catch {
    return NextResponse.json({ error: "تعذّر جلب سنوات الصنع، حاول لاحقًا" }, { status: 502 });
  }
}
