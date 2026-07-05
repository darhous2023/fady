export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"
import CarCard from "@/components/store/cars/CarCard"
import { getCanonicalCarDetail, getSimilarCars } from "@/lib/cars/repository"

type Params = { normalizedKey: string }

/**
 * canonicalCar.normalizedKey uses "|" as an internal field separator
 * (e.g. "aito|m5|2026|...|suv"), which is a fragile character to carry
 * through a raw URL path segment. Observed in testing: Next.js's dynamic
 * route param is not reliably pre-decoded for a direct/hard navigation
 * to a URL containing "%7C" (varies by request path — a client-side
 * <Link> navigation decodes it, a full page load sometimes doesn't).
 * decodeURIComponent on an already-decoded string (no "%XX" sequences,
 * true here since normalizedKey never contains "%") is a harmless
 * no-op, so this call is safe regardless of which state the param
 * arrives in.
 */
function decodeNormalizedKey(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { normalizedKey: raw } = await params
  const normalizedKey = decodeNormalizedKey(raw)
  const car = await getCanonicalCarDetail(normalizedKey)
  if (!car) return { title: "سيارة غير موجودة" }
  return {
    title: car.displayName,
    description: `مواصفات ${car.displayName} كاملة — ${car.bodyType ?? ""} ${car.fuelType ?? ""}`.trim(),
    alternates: { canonical: `/new/car/${encodeURIComponent(car.normalizedKey)}` },
  }
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.55)" }}>{label}</span>
      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", fontWeight: 700 }}>{value}</span>
    </div>
  )
}

export default async function CarDetailPage({ params }: { params: Promise<Params> }) {
  const { normalizedKey: raw } = await params
  const normalizedKey = decodeNormalizedKey(raw)
  const car = await getCanonicalCarDetail(normalizedKey)
  if (!car) notFound()

  const similar = await getSimilarCars(normalizedKey, 4)
  const mainImage = car.images.find((i) => i.isMain) ?? car.images[0]

  return (
    <>
      <StoreHeader />
      <style>{`body { margin: 0; background: #0A0A0A; } main { padding: 0 !important; min-height: unset !important; }`}</style>
      <div style={{ paddingTop: 64, maxWidth: 1100, margin: "0 auto", padding: "88px 24px 64px", direction: "rtl" }}>
        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.5)", marginBottom: 16 }}>
          <Link href="/new" style={{ color: "#9BA3AA", textDecoration: "none" }}>سيارات جديدة</Link> ←{" "}
          <Link href="/new/browse" style={{ color: "#9BA3AA", textDecoration: "none" }}>تصفّح</Link> ← {car.displayName}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "#111214", marginBottom: 10 }}>
              {mainImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainImage.url} alt={mainImage.altText ?? car.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(242,240,236,0.3)", fontFamily: "Tajawal,sans-serif" }}>
                  لا توجد صورة متاحة بعد
                </div>
              )}
            </div>
            {car.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {car.images.slice(0, 8).map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img.url} alt="" style={{ width: 64, height: 64, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2, color: "#9BA3AA", textTransform: "uppercase", marginBottom: 8 }}>
              {car.brand?.nameEn}{car.model ? ` · ${car.model.nameEn}` : ""}
            </div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: 28, color: "#F5F5F5", marginBottom: 16, lineHeight: 1.3 }}>
              {car.displayName}
            </h1>

            <div style={{ background: "#111214", borderRadius: 10, padding: "4px 16px", marginBottom: 20 }}>
              <InfoRow label="السنة" value={car.year} />
              <InfoRow label="نوع الهيكل" value={car.bodyType} />
              <InfoRow label="عدد الأبواب" value={car.doors} />
              <InfoRow label="عدد المقاعد" value={car.seatingCapacity} />
              <InfoRow label="ناقل الحركة" value={car.transmission} />
              <InfoRow label="نظام الدفع" value={car.drivetrain} />
              <InfoRow label="نوع الوقود" value={car.fuelType} />
              <InfoRow label="القوة الحصانية" value={car.powerHp ? `${Math.round(car.powerHp)} hp` : null} />
              <InfoRow label="العزم" value={car.torqueNm ? `${Math.round(car.torqueNm)} Nm` : null} />
            </div>

            <a
              href={`https://wa.me/201555557745?text=${encodeURIComponent(`السلام عليكم، أريد الاستفسار عن توفر: ${car.displayName}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 8, background: "#25D366", color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              اسأل عن التوفر عبر واتساب
            </a>

            {!car.publicationEligible && (
              <p style={{ marginTop: 12, fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(242,240,236,0.4)" }}>
                بيانات هذه السيارة قيد المراجعة، وقد تحتاج تحديثًا.
              </p>
            )}
          </div>
        </div>

        {car.specSections.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 18, color: "#F2F0EC", marginBottom: 16 }}>
              كل المواصفات
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {car.specSections.map((section) => (
                <div key={section.sectionKey} style={{ background: "#111214", borderRadius: 10, padding: "16px 20px" }}>
                  <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, color: "#9BA3AA", marginBottom: 8 }}>
                    {section.groupName}
                  </h3>
                  {section.items.map((item, i) => (
                    <InfoRow key={i} label={item.label} value={item.unit ? `${item.valueText} ${item.unit}` : item.valueText} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 18, color: "#F2F0EC", marginBottom: 16 }}>
              سيارات مشابهة
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {similar.map((c) => <CarCard key={c.normalizedKey} car={c} />)}
            </div>
          </div>
        )}

        {car.sourceUrl && (
          <p style={{ marginTop: 32, fontFamily: "'Space Mono',monospace", fontSize: 11, color: "rgba(242,240,236,0.3)" }}>
            مصدر البيانات: {new URL(car.sourceUrl).hostname}
            {car.lastScrapedAt && ` · آخر تحديث: ${new Date(car.lastScrapedAt).toLocaleDateString("ar-EG")}`}
          </p>
        )}
      </div>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
