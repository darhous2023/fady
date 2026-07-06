"use client"

// Cinematic full-viewport video hero for the New Cars portal (/new).
// All copy and the video URL are DB-driven via `settings` (admin → بوابات المعرض);
// the page passes safe fallbacks so the hero never renders empty.
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface NewCarsHeroProps {
  videoUrl?: string
  eyebrow: string
  headline: string
  subheadline: string
  whatsapp: string
  makesCount?: number
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function NewCarsHero({ videoUrl, eyebrow, headline, subheadline, whatsapp, makesCount = 0 }: NewCarsHeroProps) {
  const reduceMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن سيارة جديدة")}`

  const scrollToFinder = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById("finder")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
  }

  return (
    <section style={{ position: "relative", minHeight: "100svh", overflow: "hidden", background: "#0A0A0A" }}>
      <style>{`
        .nch-video {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: opacity 1.4s ease;
        }
        .nch-kenburns { animation: nchZoom 26s ease-in-out infinite alternate; }
        @keyframes nchZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
        .nch-headline {
          font-family: Tajawal, sans-serif; font-weight: 900;
          font-size: clamp(48px, 11vw, 150px); line-height: 1.02; letter-spacing: -0.01em;
          color: #F5F5F5; margin: 0;
        }
        .nch-scrollhint { animation: nchBounce 2s ease-in-out infinite; }
        @keyframes nchBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @media (prefers-reduced-motion: reduce) {
          .nch-kenburns { animation: none; }
          .nch-scrollhint { animation: none; }
        }
      `}</style>

      {videoUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          className={`nch-video${reduceMotion ? "" : " nch-kenburns"}`}
          src={videoUrl}
          autoPlay muted loop playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedData={() => setVideoReady(true)}
          style={{ opacity: videoReady ? 0.5 : 0 }}
        />
      )}
      {/* Layered scrims: readable copy on any footage */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.25) 40%, rgba(10,10,10,0.65) 78%, #0A0A0A 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(10,10,10,0.55) 100%)" }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "150px 24px 110px", direction: "rtl" }}>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}
        >
          <span style={{ width: 44, height: 1, background: "linear-gradient(to left, transparent, #9BA3AA)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "5px", color: "#9BA3AA", textTransform: "uppercase" }}>{eyebrow}</span>
          <span style={{ width: 44, height: 1, background: "linear-gradient(to right, transparent, #9BA3AA)" }} />
        </motion.div>

        <motion.h1
          className="nch-headline"
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
          style={{ fontFamily: "Tajawal, sans-serif", fontSize: "clamp(15px,2vw,19px)", color: "rgba(245,245,245,0.65)", maxWidth: 640, margin: "26px 0 38px", lineHeight: 1.9 }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}
        >
          <a href="#finder" onClick={scrollToFinder} style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 42px", borderRadius: 8, textDecoration: "none",
            background: "#F5F5F5", color: "#0A0A0A", letterSpacing: "0.5px",
          }}>ابدأ البحث في الكتالوج</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 36px", borderRadius: 8, textDecoration: "none",
            background: "rgba(10,10,10,0.35)", color: "#F5F5F5", border: "1px solid rgba(245,245,245,0.35)",
            backdropFilter: "blur(8px)",
          }}>استفسر على واتساب</a>
        </motion.div>

        {makesCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            style={{ display: "flex", gap: 28, marginTop: 44, flexWrap: "wrap", justifyContent: "center" }}
          >
            {[
              { num: `${makesCount}+`, label: "ماركة عالمية" },
              { num: "٤", label: "خطوات للسيارة المناسبة" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, color: "#F5F5F5" }}>{s.num}</div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(245,245,245,0.45)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        <div className="nch-scrollhint" style={{ position: "absolute", bottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: "4px", color: "#9BA3AA" }}>SCROLL</div>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #9BA3AA, transparent)" }} />
        </div>
      </div>
    </section>
  )
}
