"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { useCart } from "@/contexts/CartContext"
import { saveRecentlyViewed } from "./RecentlyViewed"
import RecentlyViewed from "./RecentlyViewed"

const Product360Viewer = dynamic(() => import("./Product360Viewer"), { ssr: false })

const WL_KEY = "elfady-wishlist"

const WA = "201555557745"

const QUALITY_LABELS: Record<string, string> = { original: "ممتازة", mirror: "جيدة جدًا", hi_copy: "جيدة" }
const QUALITY_COLORS: Record<string, string> = { original: "#9BA3AA", mirror: "#838B92", hi_copy: "#6E747A" }
const QUALITY_DESC: Record<string, string> = {
  original: "حالة ممتازة، فحص شامل متاح",
  mirror:   "حالة جيدة جدًا، جاهزة للمعاينة",
  hi_copy:  "حالة جيدة، مناسبة للاستخدام اليومي",
}

interface RelatedProduct {
  id: string; slug: string; name_ar: string; price: number
  compare_at_price: number | null; quality_tier: string
  image: { url: string; alt_ar: string | null } | null
}

interface Variant {
  id: string; color_ar: string | null; size: string | null
  stock: number; price_override: number | null
}

interface ProductDetailProps {
  product: {
    id: string; slug: string; name_ar: string; description_ar: string | null
    price: number; compare_at_price: number | null; quality_tier: string
    is_featured: boolean; category_name: string | null
    year?: number | null; mileage_km?: number | null
    transmission?: string | null; fuel_type?: string | null; body_type?: string | null
  }
  images: { id: string; url: string; alt_ar: string | null; sort_order: number }[]
  frames360?: { id: string; url: string; sequence_index: number }[]
  related?: RelatedProduct[]
  variants?: Variant[]
}

const TRANSMISSION_LABELS: Record<string, string> = { automatic: "أوتوماتيك", manual: "مانيوال" }

export default function ProductDetail({ product, images, frames360 = [], related = [], variants = [] }: ProductDetailProps) {
  const has360 = frames360.length > 1
  const [activeIdx, setActiveIdx] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 })
  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)
  const [adding, setAdding] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const raf = useRef<number>(0)
  const { addItem } = useCart()

  const sizes = Array.from(new Set(variants.filter(v => v.size).map(v => v.size!)))
  const colors = Array.from(new Set(variants.filter(v => v.color_ar).map(v => v.color_ar!)))
  const effectivePrice = selectedVariant?.price_override ?? product.price
  const hasVariants = variants.length > 0

  useEffect(() => {
    try {
      const wl = JSON.parse(localStorage.getItem(WL_KEY) ?? "[]")
      setWishlisted(wl.some((i: { id: string }) => i.id === product.id))
    } catch {}
    saveRecentlyViewed({ id: product.id, slug: product.slug, name_ar: product.name_ar, price: product.price, image: images[0]?.url ?? null })
  }, [product.id, product.slug, product.name_ar, product.price, images])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (images.length <= 1) return
      if (e.key === "ArrowRight") setActiveIdx(i => (i + 1) % images.length)
      if (e.key === "ArrowLeft") setActiveIdx(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [images.length])

  function toggleWishlist() {
    try {
      const wl = JSON.parse(localStorage.getItem(WL_KEY) ?? "[]")
      let next
      if (wishlisted) {
        next = wl.filter((i: { id: string }) => i.id !== product.id)
        toast("تم الإزالة من قائمة الأمنيات")
      } else {
        next = [{ id: product.id, slug: product.slug, name_ar: product.name_ar, price: product.price, quality_tier: product.quality_tier, image: images[0]?.url ?? null }, ...wl]
        toast.success("تمت الإضافة لقائمة الأمنيات 🤍")
      }
      localStorage.setItem(WL_KEY, JSON.stringify(next))
      setWishlisted(!wishlisted)
      window.dispatchEvent(new Event("elfady-wl-change"))
    } catch {}
  }

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() =>
      setTilt({ x: (ny - 0.5) * -12, y: (nx - 0.5) * 12, gx: nx * 100, gy: ny * 100 })
    )
  }, [])

  const onEnter = () => {
    setHovered(true)
    setShimmer(false)
    setTimeout(() => setShimmer(true), 20)
    setTimeout(() => setShimmer(false), 700)
  }
  const onLeave = () => { setHovered(false); setTilt({ x: 0, y: 0, gx: 50, gy: 50 }) }

  const handleAddToCart = () => {
    setAdding(true)
    addItem({
      id: product.id, slug: product.slug, name_ar: product.name_ar,
      price: product.price, image: images[0]?.url ?? null, quality_tier: product.quality_tier,
    })
    toast.success("تمت الإضافة للسلة!", {
      description: product.name_ar, duration: 2500,
      action: { label: "عرض السلة", onClick: () => window.location.href = "/cart" },
    })
    setTimeout(() => setAdding(false), 700)
  }

  const handleShare = () => {
    const url = window.location.href
    const text = `شوف السيارة دي في ELFADY 🚗\n${product.name_ar} — ${product.price.toLocaleString("ar-EG")} ج.م\n${url}`
    if (navigator.share) {
      navigator.share({ title: product.name_ar, text, url }).catch(() => {})
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(waUrl, "_blank")
    }
  }

  const activeImg = images[activeIdx]
  const qColor = QUALITY_COLORS[product.quality_tier] ?? "#4a4a4a"
  const variantDesc = selectedVariant
    ? [selectedVariant.color_ar, selectedVariant.size].filter(Boolean).join(" — ")
    : ""
  const waText = encodeURIComponent(
    `السلام عليكم، أريد الطلب:\n` +
    `المنتج: ${product.name_ar}\n` +
    (variantDesc ? `المواصفات: ${variantDesc}\n` : "") +
    `السعر: ${effectivePrice.toLocaleString("ar-EG")} ج.م`
  )
  const waHref = `https://wa.me/${WA}?text=${waText}`

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, direction: "rtl" }}>
      <style>{`
                @keyframes pdShimmer { from{background-position:200% center} to{background-position:-200% center} }
        .pd-thumb { cursor:pointer; border-radius:8px; overflow:hidden; transition:all 0.25s ease; }
        .pd-thumb:hover { border-color:rgba(155,163,170,0.6)!important; }
        .pd-cart-btn:hover { background:linear-gradient(135deg,#838B92,#AEB6BC)!important; transform:translateY(-1px); box-shadow:0 12px 40px rgba(155,163,170,0.35)!important; }
        .pd-wa-btn:hover { background:rgba(37,160,85,0.25)!important; border-color:rgba(37,160,85,0.6)!important; transform:translateY(-1px); }
        .pd-share-btn:hover { background:rgba(155,163,170,0.12)!important; border-color:rgba(155,163,170,0.4)!important; }
        .pd-rel-card { transition:all 0.3s ease; }
        .pd-rel-card:hover { border-color:rgba(155,163,170,0.3)!important; transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.5)!important; }
        .pd-rel-img { transition:transform 0.5s ease; }
        .pd-rel-card:hover .pd-rel-img { transform:scale(1.06); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
          <Link href="/" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.4, textDecoration: "none" }}>الرئيسية</Link>
          <span style={{ color: "#9BA3AA", opacity: 0.4, fontSize: 10 }}>›</span>
          <Link href="/#products" style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.4, textDecoration: "none" }}>{product.category_name ?? "المنتجات"}</Link>
          <span style={{ color: "#9BA3AA", opacity: 0.4, fontSize: 10 }}>›</span>
          <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#9BA3AA", opacity: 0.8 }}>{product.name_ar}</span>
        </div>

        {/* Main layout */}
        <div style={{ display: "flex", gap: 64, flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* ── Left: Image gallery ── */}
          <div style={{ flex: "1 1 420px", minWidth: 320 }}>
            {has360 ? (
              <Product360Viewer frames={frames360} productName={product.name_ar} />
            ) : (
            <div
              onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}
              style={{
                borderRadius: 20, overflow: "hidden", position: "relative", paddingBottom: "100%",
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
                transition: hovered ? "transform 0.1s ease" : "transform 0.6s cubic-bezier(0.2,0,0.2,1)",
                boxShadow: hovered ? "0 32px 80px rgba(155,163,170,0.2),0 12px 40px rgba(0,0,0,0.8)" : "0 8px 40px rgba(0,0,0,0.6)",
                border: `1px solid ${hovered ? "rgba(155,163,170,0.3)" : "rgba(155,163,170,0.08)"}`,
                willChange: "transform", cursor: "pointer", background: "#141414",
              }}
            >
              <div style={{
                position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                background: `radial-gradient(ellipse 240px 200px at ${tilt.gx}% ${tilt.gy}%,rgba(155,163,170,0.1) 0%,transparent 70%)`,
                opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
              }} />
              <div style={{
                position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
                background: "linear-gradient(105deg,transparent 25%,rgba(201,207,212,0.15) 50%,transparent 75%)",
                transform: `translateX(${shimmer ? "130%" : "-130%"})`,
                transition: shimmer ? "transform 0.6s cubic-bezier(0.4,0,0.2,1)" : "none",
              }} />
              {activeImg?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeImg.url} alt={activeImg.alt_ar ?? product.name_ar}
                  loading="eager"
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                    transform: hovered ? "scale(1.04)" : "scale(1)",
                    transition: "transform 0.65s cubic-bezier(0.2,0,0.2,1)",
                  }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1A1A1A,#242424)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, opacity: 0.2 }}>🚗</div>
              )}
              <div style={{ position: "absolute", top: 16, right: 16, zIndex: 5, background: qColor, color: "#fff", fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>
                {QUALITY_LABELS[product.quality_tier] ?? product.quality_tier}
              </div>
              {/* Arrow navigation */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 6, background: "rgba(10,10,10,0.6)", border: "1px solid rgba(155,163,170,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9BA3AA", fontSize: 16 }}>‹</button>
                  <button onClick={() => setActiveIdx(i => (i + 1) % images.length)}
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 6, background: "rgba(10,10,10,0.6)", border: "1px solid rgba(155,163,170,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9BA3AA", fontSize: 16 }}>›</button>
                  <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", zIndex: 6, display: "flex", gap: 5 }}>
                    {images.map((_, i) => <div key={i} style={{ width: i === activeIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === activeIdx ? "#9BA3AA" : "rgba(242,240,236,0.3)", transition: "all 0.3s" }} />)}
                  </div>
                </>
              )}
            </div>
            )}

            {images.length > 1 && (
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <div key={img.id} className="pd-thumb"
                    onClick={() => setActiveIdx(i)}
                    style={{ width: 72, height: 72, flexShrink: 0, position: "relative", border: `2px solid ${i === activeIdx ? "rgba(155,163,170,0.7)" : "rgba(155,163,170,0.15)"}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt_ar ?? product.name_ar} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {i === activeIdx && <div style={{ position: "absolute", inset: 0, background: "rgba(155,163,170,0.12)" }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product info ── */}
          <div style={{ flex: "1 1 360px", minWidth: 300, paddingTop: 8 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "4px", color: "#9BA3AA", textTransform: "uppercase", opacity: 0.8, marginBottom: 12 }}>
              ✦ &nbsp; {product.category_name ?? ""}
            </div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#F2F0EC", lineHeight: 1.3, margin: "0 0 20px" }}>
              {product.name_ar}
            </h1>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
              <span style={{
                fontFamily: "Tajawal,sans-serif", fontSize: 36, fontWeight: 900, color: "#9BA3AA",
                background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                animation: "pdShimmer 6s linear infinite", backgroundSize: "300% auto",
              }}>{effectivePrice.toLocaleString("ar-EG")} ج.م</span>
              {product.compare_at_price && (
                <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 18, color: "#555", textDecoration: "line-through" }}>
                  {product.compare_at_price.toLocaleString("ar-EG")} ج.م
                </span>
              )}
              {product.compare_at_price && (
                <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", background: "#A5342C", padding: "3px 10px", borderRadius: 20 }}>
                  خصم {Math.round((1 - product.price / product.compare_at_price) * 100)}%
                </span>
              )}
            </div>

            <div style={{ height: 1, background: "linear-gradient(90deg,#9BA3AA44,transparent)", marginBottom: 24 }} />

            {product.description_ar && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, color: "#9BA3AA", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>تفاصيل المنتج</h3>
                <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F2F0EC", opacity: 0.65, lineHeight: 2, whiteSpace: "pre-wrap" }}>
                  {product.description_ar}
                </p>
              </div>
            )}

            {(product.year || product.mileage_km != null || product.transmission || product.fuel_type || product.body_type) && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "سنة الصنع", value: product.year },
                  { label: "العداد", value: product.mileage_km != null ? `${product.mileage_km.toLocaleString("ar-EG")} كم` : null },
                  { label: "ناقل الحركة", value: product.transmission ? (TRANSMISSION_LABELS[product.transmission] ?? product.transmission) : null },
                  { label: "الوقود", value: product.fuel_type },
                  { label: "الهيكل", value: product.body_type },
                ].filter(s => s.value).map(s => (
                  <div key={s.label} style={{ background: "rgba(155,163,170,0.05)", border: "1px solid rgba(155,163,170,0.1)", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, color: "#9BA3AA", opacity: 0.7, marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F2F0EC" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: "rgba(155,163,170,0.05)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: qColor, flexShrink: 0 }} />
                <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F2F0EC" }}>{QUALITY_LABELS[product.quality_tier] ?? product.quality_tier}</span>
              </div>
              <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.5, margin: 0 }}>{QUALITY_DESC[product.quality_tier] ?? ""}</p>
            </div>

            {/* ── Variants selector ── */}
            {hasVariants && (
              <div style={{ marginBottom: 24 }}>
                {sizes.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#9BA3AA", letterSpacing: "2px", marginBottom: 10 }}>
                      المقاس {selectedVariant?.size ? `— ${selectedVariant.size}` : ""}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {sizes.map(s => {
                        const v = variants.find(v => v.size === s && (!selectedVariant?.color_ar || v.color_ar === selectedVariant.color_ar))
                          ?? variants.find(v => v.size === s)
                        const outOfStock = v ? v.stock === 0 : false
                        const active = selectedVariant?.size === s
                        return (
                          <button key={s} onClick={() => !outOfStock && setSelectedVariant(v ?? null)}
                            disabled={outOfStock}
                            style={{
                              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
                              padding: "8px 18px", borderRadius: 8, cursor: outOfStock ? "not-allowed" : "pointer",
                              border: `2px solid ${active ? "#9BA3AA" : "rgba(155,163,170,0.2)"}`,
                              background: active ? "rgba(155,163,170,0.12)" : "transparent",
                              color: outOfStock ? "#333" : active ? "#9BA3AA" : "#F2F0EC",
                              opacity: outOfStock ? 0.4 : 1,
                              transition: "all 0.2s ease",
                              textDecoration: outOfStock ? "line-through" : "none",
                            }}>
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {colors.length > 0 && (
                  <div>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#9BA3AA", letterSpacing: "2px", marginBottom: 10 }}>
                      اللون {selectedVariant?.color_ar ? `— ${selectedVariant.color_ar}` : ""}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {colors.map(c => {
                        const v = variants.find(v => v.color_ar === c && (!selectedVariant?.size || v.size === selectedVariant.size))
                          ?? variants.find(v => v.color_ar === c)
                        const outOfStock = v ? v.stock === 0 : false
                        const active = selectedVariant?.color_ar === c
                        return (
                          <button key={c} onClick={() => !outOfStock && setSelectedVariant(v ?? null)}
                            disabled={outOfStock}
                            style={{
                              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 13,
                              padding: "7px 16px", borderRadius: 8, cursor: outOfStock ? "not-allowed" : "pointer",
                              border: `2px solid ${active ? "#9BA3AA" : "rgba(155,163,170,0.2)"}`,
                              background: active ? "rgba(155,163,170,0.12)" : "transparent",
                              color: outOfStock ? "#333" : active ? "#9BA3AA" : "#F2F0EC",
                              opacity: outOfStock ? 0.4 : 1, transition: "all 0.2s ease",
                            }}>
                            {c}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                  <div style={{ marginTop: 10, fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#C2453C", fontWeight: 700 }}>
                    ⚠ آخر {selectedVariant.stock} قطع فقط!
                  </div>
                )}
              </div>
            )}

            {/* Dual CTAs */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <button onClick={handleAddToCart} disabled={adding} className="pd-cart-btn"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: adding ? "linear-gradient(135deg,#9BA3AA,#C9CFD4)" : "linear-gradient(135deg,#9BA3AA,#AEB6BC)",
                  color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16,
                  padding: "15px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(155,163,170,0.25)", transition: "all 0.3s cubic-bezier(0.2,0,0.2,1)",
                }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {adding ? "✓ تمت الإضافة لقائمة المعاينة" : "احجز معاينة"}
              </button>

              <a href={waHref} target="_blank" rel="noopener noreferrer" className="pd-wa-btn"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "rgba(37,160,85,0.12)", border: "1px solid rgba(37,160,85,0.35)",
                  color: "#25D366", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
                  padding: "15px 20px", borderRadius: 10, textDecoration: "none",
                  transition: "all 0.3s ease", whiteSpace: "nowrap",
                }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                </svg>
                واتساب
              </a>
            </div>

            {/* Wishlist + Share */}
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button onClick={toggleWishlist}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: wishlisted ? "rgba(155,163,170,0.1)" : "transparent",
                  border: `1px solid ${wishlisted ? "rgba(155,163,170,0.4)" : "rgba(155,163,170,0.15)"}`,
                  color: wishlisted ? "#9BA3AA" : "#F2F0EC", opacity: wishlisted ? 1 : 0.55,
                  fontFamily: "Tajawal,sans-serif", fontSize: 13,
                  padding: "11px 20px", borderRadius: 10, cursor: "pointer", transition: "all 0.25s ease",
                }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? "#9BA3AA" : "none"} stroke={wishlisted ? "#9BA3AA" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wishlisted ? "في قائمتك" : "أضف للأمنيات"}
              </button>

              <button onClick={handleShare} className="pd-share-btn"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "transparent", border: "1px solid rgba(155,163,170,0.15)",
                  color: "#F2F0EC", fontFamily: "Tajawal,sans-serif", fontSize: 13, opacity: 0.55,
                  padding: "11px 20px", borderRadius: 10, cursor: "pointer", transition: "all 0.25s ease",
                }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                شارك
              </button>
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "🔍", title: "معاينة كاملة", desc: "زور المعرض وعاين السيارة قبل الشراء" },
                { icon: "📋", title: "فحص شامل", desc: "بيانات دقيقة عن الحالة والعداد والمواصفات" },
                { icon: "💬", title: "دعم فوري", desc: "تواصل معنا على واتساب في أي وقت" },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(155,163,170,0.07)",
                  borderRadius: 10,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, fontWeight: 700, color: "#F2F0EC" }}>{title}</div>
                    <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.38)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,transparent,rgba(155,163,170,0.2))" }} />
              <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "5px", color: "#9BA3AA", opacity: 0.7, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                ✦ منتجات مشابهة ✦
              </span>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(155,163,170,0.2),transparent)" }} />
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {related.map(rel => (
                <Link key={rel.id} href={`/products/${rel.slug}`} style={{ textDecoration: "none", flex: "1 1 200px", maxWidth: 240 }}>
                  <div className="pd-rel-card" style={{
                    background: "linear-gradient(145deg,#131313,#141414)",
                    border: "1px solid rgba(155,163,170,0.1)",
                    borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}>
                    <div style={{ paddingBottom: "100%", position: "relative", overflow: "hidden" }}>
                      {rel.image?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rel.image.url} alt={rel.image.alt_ar ?? rel.name_ar}
                          className="pd-rel-img" loading="lazy"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, opacity: 0.2 }}>🚗</div>
                      )}
                    </div>
                    <div style={{ padding: "14px 14px 16px", direction: "rtl" }}>
                      <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F2F0EC", margin: "0 0 6px", lineHeight: 1.4 }}>{rel.name_ar}</p>
                      <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, fontWeight: 900, color: "#9BA3AA" }}>
                        {rel.price.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Recently Viewed */}
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  )
}
