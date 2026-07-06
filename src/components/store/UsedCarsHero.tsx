"use client"

// Cinematic full-viewport video hero for the Used Cars portal (/used).
// Copy + video URL come from `settings` (admin → بوابات المعرض); the live
// inventory count comes from the database via the page.
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface UsedCarsHeroProps {
  videoUrl?: string
  eyebrow: string
  headline: string
  subheadline: string
  whatsapp: string
  carsCount?: number
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function UsedCarsHero({ videoUrl, eyebrow, headline, subheadline, whatsapp, carsCount = 0 }: UsedCarsHeroProps) {
  const reduceMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن السيارات المستعملة المتاحة في المعرض")}`

  const scrollToInventory = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById("inventory")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
  }

  return (
    <section style={{ position: "relative", minHeight: "88svh", overflow: "hidden", background: "#0A0A0A" }}>
      <style>{`
        .uch-video {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: opacity 1.4s ease;
        }
        .uch-kenburns { animation: uchZoom 26s ease-in-out infinite alternate; }
        @keyframes uchZoom { from { transform: scale(1.06); } to { transform: scale(1); } }
        .uch-headline {
          font-family: Tajawal, sans-serif; font-weight: 900;
          font-size: clamp(44px, 9vw, 120px); line-height: 1.05; letter-spacing: -0.01em;
          color: #F5F5F5; margin: 0;
        }
        .uch-scrollhint { animation: uchBounce 2s ease-in-out infinite; }
        @keyframes uchBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @media (prefers-reduced-motion: reduce) {
          .uch-kenburns { animation: none; }
          .uch-scrollhint { animation: none; }
        }
      `}</style>

      {videoUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          className={`uch-video${reduceMotion ? "" : " uch-kenburns"}`}
          src={videoUrl}
          autoPlay muted loop playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedData={() => setVideoReady(true)}
          style={{ opacity: videoReady ? 0.45 : 0 }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.3) 45%, rgba(10,10,10,0.7) 80%, #0A0A0A 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(10,10,10,0.5) 100%)" }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "88svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "150px 24px 100px", direction: "rtl" }}>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}
        >
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 12px rgba(74,222,128,0.8)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "5px", color: "#9BA3AA", textTransform: "uppercase" }}>{eyebrow}</span>
        </motion.div>

        <motion.h1
          className="uch-headline"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 36, filter: reduceMotion ? "none" : "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          style={{ fontFamily: "Tajawal, sans-serif", fontSize: "clamp(15px,2vw,19px)", color: "rgba(245,245,245,0.65)", maxWidth: 620, margin: "24px 0 36px", lineHeight: 1.9 }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
        >
          <a href="#inventory" onClick={scrollToInventory} style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 42px", borderRadius: 8, textDecoration: "none",
            background: "#F5F5F5", color: "#0A0A0A", letterSpacing: "0.5px",
          }}>
            {carsCount > 0 ? `شاهد ${carsCount.toLocaleString("ar-EG")} سيارة متاحة` : "شاهد السيارات المتاحة"}
          </a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 36px", borderRadius: 8, textDecoration: "none",
            background: "rgba(10,10,10,0.35)", color: "#F5F5F5", border: "1px solid rgba(245,245,245,0.35)",
            backdropFilter: "blur(8px)",
          }}>احجز معاينة مجانية</a>
        </motion.div>

        <div className="uch-scrollhint" style={{ position: "absolute", bottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: "4px", color: "#9BA3AA" }}>SCROLL</div>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #9BA3AA, transparent)" }} />
        </div>
      </div>
    </section>
  )
}
