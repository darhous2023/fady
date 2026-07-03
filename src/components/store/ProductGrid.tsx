"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useCart } from "@/contexts/CartContext"

const WA = "201555557745"

const QUALITY_LABELS: Record<string, string> = {
  original: "ممتازة",
  mirror:   "جيدة جدًا",
  hi_copy:  "جيدة",
}
const QUALITY_COLORS: Record<string, string> = {
  original: "#9BA3AA",
  mirror:   "#838B92",
  hi_copy:  "#6E747A",
}
const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: "أوتوماتيك",
  manual: "مانيوال",
}

export interface StoreProduct {
  id: string
  slug: string
  name_ar: string
  description_ar: string | null
  price: number
  compare_at_price: number | null
  quality_tier: string
  category_name: string | null
  is_featured: boolean
  image: { url: string; alt_ar: string | null } | null
  total_stock?: number | null
  year?: number | null
  mileage_km?: number | null
  transmission?: string | null
}

// ── Reveal on scroll ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// ── Single product card ──────────────────────────────────────────────────────
const WL_KEY = "elfady-wishlist"
function useWishlist(productId: string) {
  const [inWl, setInWl] = useState(false)
  useEffect(() => {
    try {
      const wl: { id: string }[] = JSON.parse(localStorage.getItem(WL_KEY) ?? "[]")
      setInWl(wl.some(i => i.id === productId))
    } catch {}
  }, [productId])

  const toggle = useCallback((e: React.MouseEvent, product: StoreProduct) => {
    e.preventDefault(); e.stopPropagation()
    try {
      const wl: StoreProduct[] = JSON.parse(localStorage.getItem(WL_KEY) ?? "[]")
      const exists = wl.some(i => i.id === product.id)
      const next = exists ? wl.filter(i => i.id !== product.id) : [...wl, product]
      localStorage.setItem(WL_KEY, JSON.stringify(next))
      setInWl(!exists)
      window.dispatchEvent(new Event("elfady-wl-change"))
    } catch {}
  }, [])

  return { inWl, toggle }
}

function ProductCard({ product, index }: { product: StoreProduct; index: number }) {
  const { ref, visible } = useReveal()
  const [tilt, setTilt]     = useState({ x: 0, y: 0, gx: 50, gy: 50 })
  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)
  const [adding, setAdding]   = useState(false)
  const raf = useRef<number>(0)
  const { addItem, openCart } = useCart()
  const { inWl, toggle: toggleWl } = useWishlist(product.id)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top)  / r.height
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() =>
      setTilt({ x: (ny - 0.5) * -16, y: (nx - 0.5) * 16, gx: nx * 100, gy: ny * 100 })
    )
  }, [])

  const onEnter = () => {
    setHovered(true)
    setShimmer(false)
    setTimeout(() => setShimmer(true), 20)
    setTimeout(() => setShimmer(false), 700)
  }
  const onLeave = () => { setHovered(false); setTilt({ x: 0, y: 0, gx: 50, gy: 50 }) }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addItem({
      id: product.id,
      slug: product.slug,
      name_ar: product.name_ar,
      price: product.price,
      image: product.image?.url ?? null,
      quality_tier: product.quality_tier,
    })
    openCart()
    toast.success(`تمت الإضافة: ${product.name_ar}`, { duration: 2000 })
    setTimeout(() => setAdding(false), 600)
  }

  const waText = encodeURIComponent(`السلام عليكم، أريد الاستفسار عن: ${product.name_ar} (${product.price.toLocaleString("ar-EG")} ج.م)`)
  const waHref = `https://wa.me/${WA}?text=${waText}`
  const qColor = QUALITY_COLORS[product.quality_tier] ?? "#4a4a4a"
  const delay  = `${index * 0.07}s`

  const entryTransform = visible
    ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`
    : `perspective(800px) rotateX(-4deg) rotateY(${index % 2 === 0 ? 3 : -3}deg) translateY(50px) scale(0.95)`

  return (
    <Link href={`/products/${product.slug}`} className="shahy-card-wrap" style={{ textDecoration: "none", display: "block" }}>
    <div ref={ref}>
      <div
        onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}
        style={{
          background: "linear-gradient(145deg,#141414 0%,#101010 100%)",
          border: `1px solid ${hovered ? "#9BA3AA55" : "#1E1E1E"}`,
          borderRadius: 16, overflow: "hidden", position: "relative",
          opacity: visible ? 1 : 0, transform: entryTransform,
          transition: `
            opacity 0.65s ease ${delay},
            transform ${hovered ? "0.1s" : "0.65s"} cubic-bezier(0.2,0,0.2,1) ${visible && !hovered ? delay : "0s"},
            border-color 0.3s ease, box-shadow 0.3s ease
          `,
          boxShadow: hovered
            ? "0 24px 64px rgba(155,163,170,0.18),0 8px 28px rgba(0,0,0,0.7),inset 0 1px 0 rgba(155,163,170,0.1)"
            : "0 4px 24px rgba(0,0,0,0.5)",
          willChange: "transform, box-shadow", cursor: "pointer",
        }}
      >
        {/* Gold light follow */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: `radial-gradient(ellipse 180px 160px at ${tilt.gx}% ${tilt.gy}%,rgba(155,163,170,0.12) 0%,transparent 70%)`,
          opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
        }} />

        {/* Shimmer sweep */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          background: "linear-gradient(105deg,transparent 30%,rgba(201,207,212,0.18) 50%,transparent 70%)",
          transform: `translateX(${shimmer ? "120%" : "-120%"})`,
          transition: shimmer ? "transform 0.55s cubic-bezier(0.4,0,0.2,1)" : "none",
        }} />

        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", paddingBottom: "100%" }}>
          {product.image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image.url} alt={product.image.alt_ar ?? product.name_ar}
              loading="lazy"
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                transform: hovered ? "scale(1.09)" : "scale(1)",
                transition: "transform 0.65s cubic-bezier(0.2,0,0.2,1)",
                filter: hovered ? "brightness(1.08) saturate(1.1)" : "brightness(1)",
              }} />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg,#1A1A1A 0%,#242424 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 52, opacity: 0.3,
            }}>🚗</div>
          )}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(to bottom,transparent 55%,rgba(10,10,10,0.55) 100%)",
          }} />
          <div style={{
            position: "absolute", top: 12, right: 12, zIndex: 2,
            background: qColor, color: "#fff",
            fontSize: 10, fontFamily: "Tajawal, sans-serif", fontWeight: 700,
            padding: "3px 10px", borderRadius: 20,
          }}>
            {QUALITY_LABELS[product.quality_tier] ?? product.quality_tier}
          </div>

          {/* Wishlist heart */}
          <button
            onClick={e => toggleWl(e, product)}
            aria-label={inWl ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            style={{
              position: "absolute", top: 10, left: 10, zIndex: 5,
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(10,10,10,0.8)", backdropFilter: "blur(6px)",
              border: inWl ? "1px solid rgba(178,58,54,0.5)" : "1px solid rgba(155,163,170,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.25s ease",
              transform: hovered ? "scale(1)" : "scale(0.9)",
              opacity: hovered || inWl ? 1 : 0.65,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={inWl ? "#C2453C" : "none"}
              stroke={inWl ? "#C2453C" : "rgba(242,240,236,0.7)"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {product.is_featured && (
            <div style={{
              position: "absolute", top: 48, left: 10, zIndex: 2,
              background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)",
              color: "#9BA3AA", fontSize: 12, padding: "2px 7px", borderRadius: 20,
              border: "1px solid rgba(155,163,170,0.3)",
            }}>⭐</div>
          )}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <div style={{
              position: "absolute", bottom: 12, right: 12, zIndex: 2,
              background: "#A5342C", color: "#fff",
              fontSize: 10, fontFamily: "Tajawal,sans-serif", fontWeight: 700,
              padding: "3px 8px", borderRadius: 20,
            }}>
              {Math.round((1 - product.price / product.compare_at_price) * 100)}% خصم
            </div>
          )}
          {product.total_stock != null && product.total_stock > 0 && product.total_stock <= 5 && (
            <div style={{
              position: "absolute", bottom: 12, left: 12, zIndex: 2,
              background: "rgba(10,10,10,0.88)", backdropFilter: "blur(4px)",
              border: "1px solid rgba(194,69,60,0.5)",
              color: "#C2453C", fontSize: 10, fontFamily: "Tajawal,sans-serif", fontWeight: 700,
              padding: "3px 9px", borderRadius: 20,
            }}>
              آخر {product.total_stock} قطع!
            </div>
          )}
        </div>

        {/* Card content */}
        <div style={{ padding: "18px 18px 14px", direction: "rtl", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 10, color: "#9BA3AA", fontFamily: "Tajawal,sans-serif", letterSpacing: "2px", opacity: 0.85, textTransform: "uppercase" }}>
            {product.category_name}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F2F0EC", fontFamily: "Tajawal,sans-serif", lineHeight: 1.4 }}>
            {product.name_ar}
          </div>
          {(product.year || product.mileage_km || product.transmission) && (
            <div style={{ fontSize: 12, color: "rgba(242,240,236,0.4)", fontFamily: "Tajawal,sans-serif", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.year && <span>{product.year}</span>}
              {product.mileage_km != null && <span>· {product.mileage_km.toLocaleString("ar-EG")} كم</span>}
              {product.transmission && <span>· {TRANSMISSION_LABELS[product.transmission] ?? product.transmission}</span>}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#9BA3AA", fontFamily: "Tajawal,sans-serif" }}>
              {product.price.toLocaleString("ar-EG")} ج.م
            </span>
            {product.compare_at_price && (
              <span style={{ fontSize: 13, color: "#444", fontFamily: "Tajawal,sans-serif", textDecoration: "line-through" }}>
                {product.compare_at_price.toLocaleString("ar-EG")}
              </span>
            )}
          </div>
          <div style={{ height: 1, margin: "8px 0", background: "linear-gradient(90deg,#9BA3AA44,transparent)" }} />

          {/* Dual CTAs */}
          <div style={{ display: "flex", gap: 8 }} onClick={e => e.preventDefault()}>
            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: adding
                  ? "linear-gradient(135deg,#9BA3AA,#C9CFD4)"
                  : "linear-gradient(135deg,#A5342C,#963D34)",
                color: adding ? "#0A0A0A" : "#F2F0EC",
                fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 13,
                padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.2,0,0.2,1)",
                letterSpacing: "0.03em",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {adding ? "✓ أُضيفت" : "احجز معاينة"}
            </button>

            {/* WhatsApp */}
            <button
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                window.open(waHref, "_blank", "noopener,noreferrer")
              }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                background: "rgba(37,160,85,0.15)",
                border: "1px solid rgba(37,160,85,0.35)",
                color: "#25D366",
                fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 12,
                padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                transition: "all 0.25s ease", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(37,160,85,0.25)"
                e.currentTarget.style.borderColor = "rgba(37,160,85,0.6)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(37,160,85,0.15)"
                e.currentTarget.style.borderColor = "rgba(37,160,85,0.35)"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
              </svg>
              واتساب
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader() {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 56 }}>
      <div style={{
        fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "6px",
        color: "#9BA3AA", textTransform: "uppercase",
        opacity: visible ? 0.7 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.7s ease", marginBottom: 16,
      }}>✦ &nbsp; luxury collection &nbsp; ✦</div>

      <div style={{
        fontFamily: "Tajawal,sans-serif", fontSize: "clamp(32px,4vw,46px)", fontWeight: 700,
        background: "linear-gradient(135deg,#6E747A,#9BA3AA,#C9CFD4,#9BA3AA,#6E747A)",
        backgroundSize: "300% auto", WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent", backgroundClip: "text",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) rotate(0deg)" : "translateY(30px) rotate(-1.5deg)",
        filter: visible ? "blur(0)" : "blur(4px)",
        transition: "all 0.8s cubic-bezier(0.2,0,0.2,1) 0.1s", marginBottom: 8,
        animation: visible ? "pgShimmer 6s linear 1s infinite" : "none",
      }}>
        تشكيلتنا الفاخرة
      </div>

      <div style={{
        fontFamily: "Tajawal,sans-serif", fontStyle: "italic",
        fontSize: 15, color: "#F2F0EC",
        opacity: visible ? 0.5 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.7s ease 0.25s", marginBottom: 20, letterSpacing: "1px",
      }}>
        أرقى الإكسسوارات المستوردة — Curated Luxury
      </div>

      <div style={{
        height: 1.5,
        background: "linear-gradient(90deg,transparent,#9BA3AA 20%,#C9CFD4 50%,#9BA3AA 80%,transparent)",
        margin: "0 auto",
        width: visible ? 200 : 0, transition: "width 0.9s cubic-bezier(0.2,0,0.2,1) 0.35s",
      }} />
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
const QUALITY_FILTER = [
  { key: "الكل", label: "الكل" },
  { key: "original", label: "ممتازة" },
  { key: "mirror", label: "جيدة جدًا" },
  { key: "hi_copy", label: "جيدة" },
]
const PRICE_RANGES = [
  { key: "الكل", label: "كل الأسعار", min: 0, max: Infinity },
  { key: "400k", label: "أقل من 400 ألف", min: 0, max: 400000 },
  { key: "600k", label: "400 — 600 ألف", min: 400000, max: 600000 },
  { key: "900k", label: "600 — 900 ألف", min: 600000, max: 900000 },
  { key: "900k+", label: "أكثر من 900 ألف", min: 900000, max: Infinity },
]

export default function ProductGrid({ initialProducts, initialCategory }: { initialProducts: StoreProduct[]; initialCategory?: string }) {
  const [products] = useState<StoreProduct[]>(initialProducts)
  const [activeCategory, setActiveCategory] = useState(initialCategory || "الكل")
  const [activeQuality, setActiveQuality] = useState("الكل")
  const [activePriceKey, setActivePriceKey] = useState("الكل")

  const categories = ["الكل", ...Array.from(new Set(products.map(p => p.category_name).filter(Boolean) as string[]))]

  const priceRange = PRICE_RANGES.find(r => r.key === activePriceKey) ?? PRICE_RANGES[0]
  const filtered = products.filter(p => {
    if (activeCategory !== "الكل" && p.category_name !== activeCategory) return false
    if (activeQuality !== "الكل" && p.quality_tier !== activeQuality) return false
    if (p.price < priceRange.min || p.price > priceRange.max) return false
    return true
  })

  return (
    <section style={{ background: "#0A0A0A", padding: "96px 40px 80px", direction: "rtl" }}>
      <style>{`
                @keyframes pgShimmer { from{background-position:200% center} to{background-position:-200% center} }
        .pg-cat-pill { cursor:pointer; transition:all 0.3s ease; background:transparent; border:none; }
        .pg-cat-pill:hover { background:rgba(155,163,170,0.12)!important; color:#9BA3AA!important; border-color:#9BA3AA!important; }
      `}</style>

      <SectionHeader />

      {/* Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginBottom: 48 }}>
        {/* Category */}
        {categories.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} className="pg-cat-pill"
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700,
                  padding: "7px 20px", borderRadius: 30, cursor: "pointer",
                  border: `1px solid ${activeCategory === cat ? "#9BA3AA" : "#232323"}`,
                  background: activeCategory === cat ? "#9BA3AA" : "transparent",
                  color: activeCategory === cat ? "#0A0A0A" : "#555",
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Quality row */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#444", marginLeft: 4 }}>الجودة:</span>
          {QUALITY_FILTER.map(q => (
            <button key={q.key} className="pg-cat-pill"
              onClick={() => setActiveQuality(q.key)}
              style={{
                fontFamily: "Tajawal,sans-serif", fontSize: 12, fontWeight: 700,
                padding: "5px 14px", borderRadius: 20, cursor: "pointer",
                border: `1px solid ${activeQuality === q.key ? "#A5342C" : "#1E1E1E"}`,
                background: activeQuality === q.key ? "#A5342C" : "transparent",
                color: activeQuality === q.key ? "#F2F0EC" : "#444",
              }}>
              {q.label}
            </button>
          ))}
        </div>

        {/* Price row */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#444", marginLeft: 4 }}>السعر:</span>
          {PRICE_RANGES.map(r => (
            <button key={r.key} className="pg-cat-pill"
              onClick={() => setActivePriceKey(r.key)}
              style={{
                fontFamily: "Tajawal,sans-serif", fontSize: 12, fontWeight: 700,
                padding: "5px 14px", borderRadius: 20, cursor: "pointer",
                border: `1px solid ${activePriceKey === r.key ? "rgba(155,163,170,0.5)" : "#1E1E1E"}`,
                background: activePriceKey === r.key ? "rgba(155,163,170,0.12)" : "transparent",
                color: activePriceKey === r.key ? "#9BA3AA" : "#444",
              }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Active filter count */}
        {(activeCategory !== "الكل" || activeQuality !== "الكل" || activePriceKey !== "الكل") && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(242,240,236,0.35)" }}>
              {filtered.length} منتج
            </span>
            <button onClick={() => { setActiveCategory("الكل"); setActiveQuality("الكل"); setActivePriceKey("الكل") }}
              style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#9BA3AA", background: "rgba(155,163,170,0.08)", border: "1px solid rgba(155,163,170,0.2)", padding: "3px 10px", borderRadius: 12, cursor: "pointer" }}>
              مسح الفلاتر ✕
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <style>{`
        .shahy-grid { display:flex; flex-wrap:wrap; justify-content:center; gap:24px; max-width:1340px; margin:0 auto; }
        .shahy-card-wrap { width:290px; }
        @media (max-width:680px) { .shahy-grid { gap:12px; } .shahy-card-wrap { width:calc(50% - 6px); } }
        @media (max-width:380px) { .shahy-card-wrap { width:100%; max-width:340px; } }
      `}</style>
      <div className="shahy-grid">
        {filtered.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
      </div>

      {/* Footer credit */}
      <div style={{ textAlign: "center", marginTop: 80, paddingTop: 40, borderTop: "1px solid #171717" }}>
        <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 8, letterSpacing: "4px", color: "#262626", textTransform: "uppercase" }}>
          ELFADY · معرض سيارات
        </div>
      </div>
    </section>
  )
}
