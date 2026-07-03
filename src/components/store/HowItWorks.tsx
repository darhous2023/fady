"use client"

import { StaggerGroup, StaggerItem } from "./ScrollReveal"

interface Step { title: string; desc: string }

export default function HowItWorks({ steps }: { steps: Step[] }) {
  const valid = steps.filter(s => s.title)
  if (!valid.length) return null

  return (
    <section style={{ background: "#111111", padding: "100px 40px", direction: "rtl" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "5px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 14 }}>
          خطوات بسيطة
        </div>
        <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", color: "#F5F5F5", margin: 0 }}>
          كيف تشتري سيارتك منّا
        </h2>
      </div>
      <StaggerGroup style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", maxWidth: 1100, margin: "0 auto" }}>
        {valid.map((s, i) => (
          <StaggerItem key={s.title} style={{ flex: "1 1 260px", maxWidth: 320, textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", border: "1px solid rgba(155,163,170,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
              fontFamily: "'Space Mono',monospace", fontSize: 18, color: "#9BA3AA",
            }}>
              {i + 1}
            </div>
            <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 18, color: "#F5F5F5", margin: "0 0 10px" }}>
              {s.title}
            </h3>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(245,245,245,0.45)", lineHeight: 1.8, margin: 0 }}>
              {s.desc}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
