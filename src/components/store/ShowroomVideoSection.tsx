"use client"

import { ScrollReveal } from "./ScrollReveal"

export default function ShowroomVideoSection({ videoUrl, headline, desc, whatsapp }: { videoUrl?: string; headline: string; desc: string; whatsapp: string }) {
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent("السلام عليكم، أريد تحديد موعد لمعاينة سيارة")}`
  return (
    <section style={{ background: "#0A0A0A", padding: "100px 40px", direction: "rtl" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 48, flexWrap: "wrap", alignItems: "center" }}>
        <ScrollReveal style={{ flex: "1 1 420px" }}>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", paddingBottom: "62%", background: "#111" }}>
            {videoUrl && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={videoUrl} autoPlay muted loop playsInline
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.15} style={{ flex: "1 1 360px" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "4px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 18 }}>
            تجربة حقيقية
          </div>
          <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", color: "#F5F5F5", margin: "0 0 18px" }}>
            {headline}
          </h2>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "rgba(245,245,245,0.55)", lineHeight: 1.9, margin: "0 0 28px" }}>
            {desc}
          </p>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
            padding: "15px 36px", borderRadius: 8, textDecoration: "none",
            background: "#F5F5F5", color: "#0A0A0A",
          }}>
            احجز موعد معاينة
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
