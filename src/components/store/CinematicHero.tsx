"use client"

import { motion, useReducedMotion } from "framer-motion"

interface CinematicHeroProps {
  videoUrl?: string
  eyebrow: string
  headline: string
  subheadline: string
  whatsapp: string
}

export default function CinematicHero({ videoUrl, eyebrow, headline, subheadline, whatsapp }: CinematicHeroProps) {
  const reduceMotion = useReducedMotion()
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن السيارات المتاحة")}`

  return (
    <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#0A0A0A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Space+Mono:wght@400;700&display=swap');
        .ch-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.55; }
        .ch-headline {
          font-family: Tajawal, sans-serif; font-weight: 900;
          font-size: clamp(64px, 15vw, 200px); line-height: 0.92; letter-spacing: -0.02em;
          color: #F5F5F5; margin: 0; text-transform: uppercase;
        }
        .ch-scrollhint { animation: chBounce 2s ease-in-out infinite; }
        @keyframes chBounce { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(8px);} }
      `}</style>

      {videoUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video className="ch-video" src={videoUrl} autoPlay muted loop playsInline />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 55%, #0A0A0A 100%)" }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 100px", direction: "rtl" }}>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "5px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 24 }}
        >
          ✦ {eyebrow} ✦
        </motion.div>

        <motion.h1
          className="ch-headline"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 40, filter: reduceMotion ? "none" : "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "Tajawal, sans-serif", fontSize: "clamp(15px,2vw,19px)", color: "rgba(245,245,245,0.65)", maxWidth: 640, margin: "28px 0 40px", lineHeight: 1.8 }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}
        >
          <a href="#gateways" style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 40px", borderRadius: 8, textDecoration: "none",
            background: "#F5F5F5", color: "#0A0A0A", letterSpacing: "0.5px",
          }}>تصفّح السيارات</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 36px", borderRadius: 8, textDecoration: "none",
            background: "transparent", color: "#F5F5F5", border: "1px solid rgba(245,245,245,0.35)",
          }}>تواصل معنا</a>
        </motion.div>

        <div className="ch-scrollhint" style={{ position: "absolute", bottom: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: "4px", color: "#9BA3AA" }}>SCROLL</div>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #9BA3AA, transparent)" }} />
        </div>
      </div>
    </section>
  )
}
