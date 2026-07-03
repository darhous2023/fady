"use client"

import { ScrollReveal } from "./ScrollReveal"

export default function PosterStatement({ text }: { text: string }) {
  return (
    <section style={{ background: "#0A0A0A", padding: "80px 24px", textAlign: "center", overflow: "hidden" }}>
      <ScrollReveal y={44}>
        <h2 style={{
          fontFamily: "Tajawal,sans-serif", fontWeight: 900, textTransform: "uppercase",
          fontSize: "clamp(40px,9vw,120px)", lineHeight: 0.95, letterSpacing: "-0.02em",
          color: "#F5F5F5", margin: 0, direction: "rtl",
        }}>
          {text}
        </h2>
      </ScrollReveal>
    </section>
  )
}
