import type { Metadata } from "next"
import { db } from "@/lib/db/drizzle/connection"
import { products, productImages, categories } from "@/lib/db/drizzle/schema"
import { eq, and, isNotNull, sql } from "drizzle-orm"
import Link from "next/link"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"
import FloatingWA from "@/components/store/FloatingWA"

export const metadata: Metadata = {
  title: "عروض السيارات",
  description: "سيارات مستعملة بأسعار مخفّضة في معرض الفادي لتجارة السيارات — عروض حصرية لفترة محدودة",
}

export const dynamic = "force-dynamic"

async function getSaleProducts() {
  try {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name_ar: products.name_ar,
      price: products.price,
      compare_at_price: products.compare_at_price,
      quality_tier: products.quality_tier,
      category_name: categories.name_ar,
    })
    .from(products)
    .leftJoin(categories, eq(products.category_id, categories.id))
    .where(and(
      eq(products.status, "active"),
      isNotNull(products.compare_at_price),
      sql`${products.compare_at_price} > ${products.price}`,
    ))

  const images = rows.length > 0
    ? await db.select({ product_id: productImages.product_id, url: productImages.url })
        .from(productImages).where(eq(productImages.sort_order, 0))
    : []
  const imgMap = Object.fromEntries(images.map(i => [i.product_id, i.url]))

  return rows
    .map(r => ({
      ...r,
      price: Number(r.price),
      compare_at_price: Number(r.compare_at_price),
      image: imgMap[r.id] ?? null,
      discount: Math.round((1 - Number(r.price) / Number(r.compare_at_price)) * 100),
    }))
    .sort((a, b) => b.discount - a.discount)
  } catch { return [] }
}

const QUALITY_LABELS: Record<string, string> = { hi_copy: "جيدة", mirror: "جيدة جدًا", original: "ممتازة" }
const QUALITY_COLORS: Record<string, string> = { hi_copy: "#888", mirror: "#A5342C", original: "#9BA3AA" }

export default async function SalePage() {
  const items = await getSaleProducts()

  return (
    <>
      <StoreHeader />
      <style>{`
                * { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }
        .sale-card { background: linear-gradient(145deg,#131313,#141414); border: 1px solid rgba(155,163,170,0.1); border-radius: 16px; overflow: hidden; text-decoration: none; display: block; transition: all 0.3s ease; }
        .sale-card:hover { transform: translateY(-4px); border-color: rgba(155,163,170,0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .sale-card:hover .card-img { transform: scale(1.04); }
        .card-img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; transition: transform 0.4s ease; background: #111; }
        .card-img-placeholder { width: 100%; aspect-ratio: 1; background: linear-gradient(135deg,#111,#1a1a1a); display: flex; align-items: center; justify-content: center; font-size: 40px; opacity: 0.2; }
        @keyframes badgePulse { 0%,100%{opacity:1}50%{opacity:0.7} }
      `}</style>

      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
        {/* Hero */}
        <section style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, #1a0808 0%, #0A0A0A 60%)",
          padding: "60px 40px 48px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 9, letterSpacing: "7px", color: "#9BA3AA", opacity: 0.7, marginBottom: 16, textTransform: "uppercase" }}>
            ✦ &nbsp; SALE &nbsp; ✦
          </div>
          <h1 style={{
            fontFamily: "Tajawal,sans-serif", fontSize: "clamp(32px,6vw,56px)", fontWeight: 900,
            color: "#F2F0EC", margin: "0 0 12px",
          }}>
            عروض السيارات
          </h1>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F2F0EC", opacity: 0.4 }}>
            {items.length > 0 ? `${items.length} سيارة بأسعار مخفّضة` : "لا توجد عروض حالياً"}
          </p>
        </section>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.2 }}>🏷️</div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, color: "#F2F0EC", opacity: 0.3 }}>
                لا توجد عروض في الوقت الحالي
              </p>
              <Link href="/used" style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 8, textDecoration: "none", background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A", display: "inline-block", marginTop: 24 }}>
                تصفّح السيارات
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
              {items.map(item => (
                <Link key={item.id} href={`/products/${item.slug}`} className="sale-card">
                  {/* Discount badge */}
                  <div style={{ position: "relative" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name_ar} className="card-img" loading="lazy" />
                    ) : (
                      <div className="card-img-placeholder">🚗</div>
                    )}
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "#A5342C", color: "#F2F0EC",
                      fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: 14,
                      padding: "5px 12px", borderRadius: 20,
                      animation: "badgePulse 2s ease-in-out infinite",
                    }}>
                      خصم {item.discount}٪
                    </div>
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      background: `rgba(${item.quality_tier === "original" ? "155,163,170" : item.quality_tier === "mirror" ? "165,52,44" : "100,100,100"},0.15)`,
                      border: `1px solid ${QUALITY_COLORS[item.quality_tier]}44`,
                      color: QUALITY_COLORS[item.quality_tier],
                      fontFamily: "Tajawal,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1px",
                      padding: "3px 8px", borderRadius: 6,
                    }}>
                      {QUALITY_LABELS[item.quality_tier]}
                    </div>
                  </div>

                  <div style={{ padding: "16px 14px" }}>
                    <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F2F0EC", margin: "0 0 6px", lineHeight: 1.4 }}>
                      {item.name_ar}
                    </p>
                    {item.category_name && (
                      <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.35)", margin: "0 0 12px" }}>{item.category_name}</p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontFamily: "Tajawal,sans-serif", fontSize: 18, fontWeight: 900,
                        background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      }}>
                        {item.price.toLocaleString("ar-EG")} ج.م
                      </span>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.3)", textDecoration: "line-through" }}>
                        {item.compare_at_price.toLocaleString("ar-EG")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
      <FloatingWA />
    </>
  )
}
