import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "ShahY Store — إكسسوارات فاخرة مستوردة"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0806",
          position: "relative",
          overflow: "hidden",
          fontFamily: "serif",
        }}
      >
        {/* Background radial glow */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Top decorative line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #C9A84C, #F0D882, #C9A84C, transparent)",
          display: "flex",
        }} />

        {/* Bottom decorative line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #C9A84C, #F0D882, #C9A84C, transparent)",
          display: "flex",
        }} />

        {/* Left burgundy accent */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: "linear-gradient(to bottom, transparent, #7B1C2E, transparent)",
          display: "flex",
        }} />

        {/* Right burgundy accent */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: "linear-gradient(to bottom, transparent, #7B1C2E, transparent)",
          display: "flex",
        }} />

        {/* Diagonal decorative lines */}
        <div style={{
          position: "absolute",
          top: 80,
          left: 80,
          width: 300,
          height: 1,
          background: "rgba(201,168,76,0.12)",
          transform: "rotate(-25deg)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute",
          bottom: 100,
          right: 80,
          width: 250,
          height: 1,
          background: "rgba(201,168,76,0.1)",
          transform: "rotate(-25deg)",
          display: "flex",
        }} />

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{
            fontSize: 13,
            letterSpacing: "10px",
            color: "#C9A84C",
            opacity: 0.7,
            marginBottom: 28,
            textTransform: "uppercase",
            fontFamily: "serif",
          }}>
            ✦  LUXURY COLLECTION  ✦
          </div>

          {/* ShahY logotype */}
          <div style={{
            fontSize: 130,
            fontWeight: 700,
            background: "linear-gradient(135deg, #A07030, #C9A84C, #F0D882, #E8C860, #C9A84C)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
            letterSpacing: "-2px",
            marginBottom: 4,
            display: "flex",
          }}>
            ShahY
          </div>

          {/* STORE subtitle */}
          <div style={{
            fontSize: 18,
            letterSpacing: "18px",
            color: "#9B8040",
            fontFamily: "serif",
            marginBottom: 32,
            display: "flex",
          }}>
            STORE
          </div>

          {/* Gold divider */}
          <div style={{
            width: 180,
            height: 1.5,
            background: "linear-gradient(90deg, transparent, #C9A84C, #F0D882, #C9A84C, transparent)",
            marginBottom: 28,
            display: "flex",
          }} />

          {/* Arabic tagline */}
          <div style={{
            fontSize: 28,
            color: "#F5EFE0",
            opacity: 0.65,
            fontFamily: "serif",
            letterSpacing: "2px",
            marginBottom: 10,
            display: "flex",
          }}>
            أرقى الإكسسوارات النسائية المستوردة
          </div>

          {/* Sub tagline */}
          <div style={{
            fontSize: 18,
            color: "#C9A84C",
            opacity: 0.55,
            fontFamily: "serif",
            letterSpacing: "1px",
            display: "flex",
          }}>
            شنط · محافظ · شوزات
          </div>
        </div>

        {/* Bottom URL */}
        <div style={{
          position: "absolute",
          bottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.3)", display: "flex" }} />
          <div style={{ fontSize: 14, color: "#C9A84C", opacity: 0.45, letterSpacing: "3px", fontFamily: "serif" }}>
            your-store.vercel.app
          </div>
          <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.3)", display: "flex" }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
