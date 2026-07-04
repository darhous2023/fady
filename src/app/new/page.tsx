export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import NewCarsBrowser from "@/components/store/NewCarsBrowser"
import { carapiFetch } from "@/lib/carapi"
import { db } from "@/lib/db/drizzle/connection"
import { settings } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"

const DEFAULT_WA = "201555557745"

async function getWaNumber(): Promise<string> {
  try {
    const [row] = await db.select({ value: settings.value }).from(settings).where(eq(settings.key, "whatsapp_number")).limit(1)
    return row?.value ? row.value.replace(/\D/g, "") : DEFAULT_WA
  } catch {
    return DEFAULT_WA
  }
}

export const metadata: Metadata = {
  title: "سيارات جديدة",
  description: "تصفّح كل الماركات والموديلات واسأل عن التوفر عبر واتساب — بوابة استعلام عن السيارات الجديدة",
}

async function getMakes(): Promise<{ id: number; name: string }[]> {
  try {
    const data = await carapiFetch("/makes", { limit: 100 })
    return data.data ?? []
  } catch {
    return []
  }
}

export default async function NewCarsPage() {
  const [makes, waNumber] = await Promise.all([getMakes(), getWaNumber()])

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64 }}>
        <div style={{ textAlign: "center", padding: "56px 24px 40px", direction: "rtl" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "4px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 12 }}>
            بوابة استعلام
          </div>
          <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: "clamp(30px,5vw,52px)", color: "#F5F5F5", margin: "0 0 16px" }}>
            سيارات جديدة
          </h1>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "rgba(245,245,245,0.5)", maxWidth: 560, margin: "0 auto", lineHeight: 1.9 }}>
            اختر الماركة والموديل، شوف المواصفات، وابعتلنا استفسارك عن التوفر مباشرة على واتساب — دي مش سيارات متاحة عندنا فعليًا، لكنها بوابة للتعرف على كل الموديلات وطلب توفيرها.
          </p>
        </div>
        <NewCarsBrowser initialMakes={makes} waNumber={waNumber} />
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
