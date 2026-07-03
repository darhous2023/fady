"use client"

import { StaggerGroup, StaggerItem } from "./ScrollReveal"

interface Pillar { title: string; desc: string }

export default function TrustPillars({ pillars }: { pillars: Pillar[] }) {
  const valid = pillars.filter(p => p.title)
  if (!valid.length) return null

  return (
    <section style={{ background: "#0A0A0A", padding: "40px 40px 100px", direction: "rtl" }}>
      <StaggerGroup className="tp-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${valid.length}, 1fr)`, gap: 1, maxWidth: 1200, margin: "0 auto", background: "rgba(155,163,170,0.1)" }}>
        <style>{`@media (max-width: 800px) { .tp-grid { grid-template-columns: 1fr !important; } }`}</style>
        {valid.map((p, i) => (
          <StaggerItem key={p.title} style={{ background: "#0A0A0A", padding: "40px 32px" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#9BA3AA", marginBottom: 20 }}>
              .0{i + 1}
            </div>
            <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 20, color: "#F5F5F5", margin: "0 0 14px" }}>
              {p.title}
            </h3>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(245,245,245,0.5)", lineHeight: 1.9, margin: 0 }}>
              {p.desc}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
