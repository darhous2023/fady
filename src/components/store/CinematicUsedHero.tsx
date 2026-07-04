"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

interface Brand { id: string; name_ar: string; slug: string }

interface Props {
  videoUrl?: string
  eyebrow: string
  headline: string
  subheadline: string
  whatsapp: string
  availableCount: number
  brands: Brand[]
}

export default function CinematicUsedHero({ videoUrl, eyebrow, headline, subheadline, whatsapp, availableCount, brands }: Props) {
  const reduceMotion = useReducedMotion()
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن السيارات المستعملة المتاحة")}`

  return (
    <section style={{ position: "relative", minHeight: "92vh", overflow: "hidden", background: "#0A0A0A" }}>
      <style>{`
        .cuh-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.45; }
        .cuh-headline {
          font-family: Tajawal, sans-serif; font-weight: 900;
          font-size: clamp(48px, 11vw, 140px); line-height: 0.95; letter-spacing: normal;
          color: #F5F5F5; margin: 0;
        }
        .cuh-chip { transition: all 0.25s ease; }
        .cuh-chip:hover { border-color: rgba(155,163,170,0.5) !important; color: #9BA3AA !important; }
      `}</style>

      {videoUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video className="cuh-video" src={videoUrl} autoPlay muted loop playsInline />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.6) 55%, #0A0A0A 100%)" }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "150px 24px 60px", direction: "rtl" }}>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "5px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 20 }}
        >
          ✦ {eyebrow} ✦
        </motion.div>

        <motion.h1
          className="cuh-headline"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 40, filter: reduceMotion ? "none" : "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "Tajawal, sans-serif", fontSize: "clamp(15px,2vw,19px)", color: "rgba(245,245,245,0.65)", maxWidth: 640, margin: "20px 0 24px", lineHeight: 1.8 }}
        >
          {subheadline}
        </motion.p>

        {availableCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(155,163,170,0.08)", border: "1px solid rgba(155,163,170,0.25)",
              borderRadius: 30, padding: "8px 20px", marginBottom: 32,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ae60", boxShadow: "0 0 8px #27ae60" }} />
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700, color: "#F2F0EC" }}>
              {availableCount} سيارة متاحة الآن في المعرض
            </span>
          </motion.div>
        )}

        {brands.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 32, maxWidth: 700 }}
          >
            {brands.slice(0, 8).map(b => (
              <Link key={b.id} href={`/used?brand=${b.slug}`} className="cuh-chip" style={{
                fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 13,
                color: "rgba(245,245,245,0.55)", textDecoration: "none",
                border: "1px solid rgba(155,163,170,0.18)", borderRadius: 20,
                padding: "7px 18px",
              }}>
                {b.name_ar}
              </Link>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}
        >
          <a href="#used-grid" style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 40px", borderRadius: 8, textDecoration: "none",
            background: "#F5F5F5", color: "#0A0A0A", letterSpacing: "0.5px",
          }}>تصفّح كل السيارات</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 36px", borderRadius: 8, textDecoration: "none",
            background: "transparent", color: "#F5F5F5", border: "1px solid rgba(245,245,245,0.35)",
          }}>تواصل معنا</a>
        </motion.div>
      </div>
    </section>
  )
}
