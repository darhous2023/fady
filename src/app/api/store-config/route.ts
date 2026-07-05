export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { settings } from "@/lib/db/drizzle/schema"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    const rows = await db.select().from(settings).where(
      sql`${settings.key} IN ('whatsapp_number','store_name_ar','store_tagline_ar','instagram_showroom_url','instagram_manager_url','facebook_url','tiktok_url','maps_url','address_ar','intro_tagline_ar')`
    )
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return NextResponse.json({
      whatsapp_number: map.whatsapp_number || "",
      store_name_ar:   map.store_name_ar   || "متجر جديد",
      store_tagline_ar:map.store_tagline_ar || "",
      instagram_showroom_url: map.instagram_showroom_url || "",
      instagram_manager_url:  map.instagram_manager_url  || "",
      facebook_url:    map.facebook_url    || "",
      tiktok_url:      map.tiktok_url      || "",
      maps_url:        map.maps_url        || "",
      address_ar:      map.address_ar      || "",
      intro_tagline_ar: map.intro_tagline_ar || "حيث تلتقي الفخامة بالثقة",
    }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } })
  } catch {
    return NextResponse.json({ whatsapp_number: "", store_name_ar: "متجر جديد" })
  }
}
