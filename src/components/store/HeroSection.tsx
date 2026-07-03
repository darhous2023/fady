"use client"

import { useState, useEffect } from "react"

const DEFAULT_WORDS = ["شُعوراً", "هويّتكِ", "قوّتكِ", "أُسلوباً", "تميّزكِ"]

export default function HeroSection({ words }: { words?: string[] }) {
  const W = words?.length ? words : DEFAULT_WORDS
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % W.length)
        setVisible(true)
      }, 320)
    }, 2400)
    return () => clearInterval(interval)
  }, [W.length])

  return (
    <section style={{
      background: "radial-gradient(ellipse 80% 60% at 50% 20%, #1C0A0A 0%, #0A0806 70%)",
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "120px 40px 80px",
      direction: "rtl", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes heroFloat{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(7px)}}
        @keyframes wordIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wordOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-18px)}}
        @keyframes pulseGold{0%,100%{opacity:0.12}50%{opacity:0.22}}
      `}</style>

      {/* Decorative lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <line x1="-50" y1="200" x2="800" y2="50" stroke="#7B1C2E" strokeWidth="0.6" opacity="0.15" />
        <line x1="600" y1="850" x2="1500" y2="300" stroke="#7B1C2E" strokeWidth="0.6" opacity="0.12" />
        <line x1="200" y1="-20" x2="1100" y2="600" stroke="#C9A84C" strokeWidth="0.4" opacity="0.1" />
        <line x1="-100" y1="600" x2="700" y2="350" stroke="#C9A84C" strokeWidth="0.3" opacity="0.08" />
      </svg>

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "25%", left: "50%", transform: "translate(-50%,-50%)",
        width: 700, height: 500, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
        animation: "pulseGold 4s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, width: "100%" }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: "Cinzel, serif", fontSize: 10, letterSpacing: "7px",
          color: "#C9A84C", opacity: 0.7, marginBottom: 32, textTransform: "uppercase",
        }}>
          ✦ &nbsp; منتجات مستوردة فاخرة &nbsp; ✦
        </div>

        {/* Pre-label */}
        <p style={{
          fontFamily: "Tajawal, sans-serif", fontWeight: 300,
          fontSize: "clamp(16px, 2.5vw, 22px)",
          color: "#F5EFE0", opacity: 0.45, letterSpacing: "2px",
          margin: "0 0 8px",
        }}>
          حين تُصبح&nbsp;
          <span style={{
            background: "linear-gradient(135deg,#C9A84C,#F0D882)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            fontWeight: 700,
          }}>الأناقةُ</span>
        </p>

        {/* Big cycling word */}
        <div style={{ position: "relative", height: "clamp(90px,14vw,160px)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 0 8px", overflow: "hidden" }}>
          <h1 style={{
            fontFamily: "Tajawal, sans-serif",
            fontSize: "clamp(72px, 14vw, 148px)",
            fontWeight: 900,
            background: "linear-gradient(135deg,#A07030,#C9A84C,#F0D882,#E8C860,#C9A84C)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            margin: 0, lineHeight: 1,
            animation: visible ? "wordIn 0.32s cubic-bezier(0.2,0,0.2,1) both" : "wordOut 0.28s cubic-bezier(0.4,0,1,1) both",
          }}>
            {W[idx]}
          </h1>
        </div>

        {/* Post-label */}
        <p style={{
          fontFamily: "Tajawal, sans-serif", fontWeight: 300,
          fontSize: "clamp(16px, 2.5vw, 22px)",
          color: "#F5EFE0", opacity: 0.4, letterSpacing: "2px",
          margin: "0 0 48px",
        }}>
          حين تختارين&nbsp;
          <span style={{ color: "#C9A84C", fontWeight: 700, opacity: 1 }}>ShahY</span>
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#products" style={{
            fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 15,
            padding: "14px 40px", borderRadius: 8, textDecoration: "none",
            background: "linear-gradient(135deg, #C9A84C, #F0D882)",
            color: "#0A0806", letterSpacing: "0.5px",
            boxShadow: "0 8px 32px rgba(201,168,76,0.3)",
            transition: "all 0.3s ease",
          }}>
            تسوّقي الآن
          </a>
          <a href="/sale"
            style={{
              fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 15,
              padding: "14px 36px", borderRadius: 8, textDecoration: "none",
              background: "transparent", color: "#F5EFE0",
              border: "1px solid rgba(201,168,76,0.3)", letterSpacing: "0.5px",
            }}>
            اكتشفي العروض ✦
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.35 }}>
          <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "4px", color: "#C9A84C" }}>SCROLL</div>
          <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, #C9A84C, transparent)" }} />
        </div>
      </div>
    </section>
  )
}
