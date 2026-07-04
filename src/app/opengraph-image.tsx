import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "ELFADY — معرض سيارات"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// next/og (Satori) cannot shape Arabic script with its default fallback font —
// it silently fails (0-byte response in production) without an explicit font
// buffer. Bundling Tajawal locally instead of fetching Google Fonts at request
// time avoids relying on Satori's own fragile dynamic-font-fetch pathway.
async function loadFont(weight: "Regular" | "Bold" | "Black") {
  const url = new URL(`../assets/fonts/Tajawal-${weight}.ttf`, import.meta.url)
  const res = await fetch(url)
  return res.arrayBuffer()
}

export default async function OGImage() {
  const [regular, bold, black] = await Promise.all([
    loadFont("Regular"),
    loadFont("Bold"),
    loadFont("Black"),
  ])

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
          background: "#0A0A0A",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Tajawal",
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
          background: "radial-gradient(ellipse, rgba(155,163,170,0.12) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Top decorative line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #9BA3AA, #C9CFD4, #9BA3AA, transparent)",
          display: "flex",
        }} />

        {/* Bottom decorative line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #9BA3AA, #C9CFD4, #9BA3AA, transparent)",
          display: "flex",
        }} />

        {/* Left burgundy accent */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: "linear-gradient(to bottom, transparent, #A5342C, transparent)",
          display: "flex",
        }} />

        {/* Right burgundy accent */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: "linear-gradient(to bottom, transparent, #A5342C, transparent)",
          display: "flex",
        }} />

        {/* Diagonal decorative lines */}
        <div style={{
          position: "absolute",
          top: 80,
          left: 80,
          width: 300,
          height: 1,
          background: "rgba(155,163,170,0.12)",
          transform: "rotate(-25deg)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute",
          bottom: 100,
          right: 80,
          width: 250,
          height: 1,
          background: "rgba(155,163,170,0.1)",
          transform: "rotate(-25deg)",
          display: "flex",
        }} />

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{
            fontSize: 13,
            letterSpacing: "10px",
            color: "#9BA3AA",
            opacity: 0.7,
            marginBottom: 28,
            textTransform: "uppercase",
            fontFamily: "Tajawal",
          }}>
            TRUSTED CAR DEALERSHIP
          </div>

          {/* ELFADY logotype */}
          <div style={{
            fontSize: 130,
            fontWeight: 700,
            background: "linear-gradient(135deg, #6E747A, #9BA3AA, #C9CFD4, #BEC4C9, #9BA3AA)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
            letterSpacing: "-2px",
            marginBottom: 4,
            display: "flex",
          }}>
            ELFADY
          </div>

          {/* subtitle */}
          <div style={{
            fontSize: 22,
            letterSpacing: "4px",
            color: "#9BA3AA",
            fontFamily: "Tajawal",
            marginBottom: 32,
            display: "flex",
            textTransform: "uppercase",
          }}>
            Car Dealership
          </div>

          {/* Gold divider */}
          <div style={{
            width: 180,
            height: 1.5,
            background: "linear-gradient(90deg, transparent, #9BA3AA, #C9CFD4, #9BA3AA, transparent)",
            marginBottom: 28,
            display: "flex",
          }} />

          {/* Tagline */}
          <div style={{
            fontSize: 28,
            color: "#F2F0EC",
            opacity: 0.65,
            fontFamily: "Tajawal",
            letterSpacing: "2px",
            marginBottom: 10,
            display: "flex",
          }}>
            Mohandessin, Cairo — Egypt
          </div>

          {/* Sub tagline */}
          <div style={{
            fontSize: 18,
            color: "#9BA3AA",
            opacity: 0.55,
            fontFamily: "Tajawal",
            letterSpacing: "1px",
            display: "flex",
          }}>
            New Cars · Used Cars
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
          <div style={{ width: 40, height: 1, background: "rgba(155,163,170,0.3)", display: "flex" }} />
          <div style={{ fontSize: 14, color: "#9BA3AA", opacity: 0.45, letterSpacing: "3px", fontFamily: "Tajawal" }}>
            fady-delta.vercel.app
          </div>
          <div style={{ width: 40, height: 1, background: "rgba(155,163,170,0.3)", display: "flex" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Tajawal", data: regular, weight: 400, style: "normal" },
        { name: "Tajawal", data: bold, weight: 700, style: "normal" },
        { name: "Tajawal", data: black, weight: 900, style: "normal" },
      ],
    }
  )
}
