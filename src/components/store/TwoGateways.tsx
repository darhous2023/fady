"use client"

import Link from "next/link"
import { useState } from "react"
import { ScrollReveal } from "./ScrollReveal"

interface GatewayContent {
  title: string
  desc: string
  image: string
}

function GatewayCard({ index, href, badge, content }: { index: string; href: string; badge: string; content: GatewayContent }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={href} style={{ textDecoration: "none", flex: "1 1 420px", display: "block" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        position: "relative", height: 480, borderRadius: 18, overflow: "hidden",
        border: "1px solid rgba(155,163,170,0.15)",
        transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}>
        {content.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.image} alt={content.title} style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)", filter: "grayscale(0.15) brightness(0.75)",
          }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1A1A1A,#0A0A0A)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.85) 100%)" }} />

        <div style={{ position: "absolute", top: 24, insetInlineStart: 24, fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#9BA3AA", letterSpacing: "3px" }}>
          .{index}
        </div>
        <div style={{
          position: "absolute", top: 24, insetInlineEnd: 24, fontFamily: "'Space Mono',monospace",
          fontSize: 10, letterSpacing: "2px", color: "#0A0A0A", background: "#9BA3AA",
          padding: "4px 12px", borderRadius: 20, textTransform: "uppercase",
        }}>
          {badge}
        </div>

        <div style={{ position: "absolute", bottom: 0, insetInlineStart: 0, insetInlineEnd: 0, padding: "0 32px 32px", direction: "rtl" }}>
          <h3 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: "clamp(28px,3.5vw,40px)", color: "#F5F5F5", margin: "0 0 10px" }}>
            {content.title}
          </h3>
          <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(245,245,245,0.6)", lineHeight: 1.7, margin: "0 0 20px", maxWidth: 340 }}>
            {content.desc}
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Tajawal,sans-serif",
            fontWeight: 700, fontSize: 14, color: "#F5F5F5",
            borderBottom: "1px solid rgba(245,245,245,0.4)", paddingBottom: 4,
            transform: hovered ? "translateX(-6px)" : "translateX(0)", transition: "transform 0.3s ease",
          }}>
            تصفّح الآن ←
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function TwoGateways({ newCar, usedCar }: { newCar: GatewayContent; usedCar: GatewayContent }) {
  return (
    <section id="gateways" style={{ background: "#0A0A0A", padding: "100px 40px", direction: "rtl" }}>
      <ScrollReveal>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "5px", color: "#9BA3AA", textTransform: "uppercase", marginBottom: 14 }}>
            اختر وجهتك
          </div>
          <h2 style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 900, fontSize: "clamp(30px,4vw,48px)", color: "#F5F5F5", margin: 0 }}>
            بوابتين، تجربة واحدة
          </h2>
        </div>
      </ScrollReveal>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", maxWidth: 1200, margin: "0 auto" }}>
        <ScrollReveal delay={0.05} style={{ flex: "1 1 420px" }}>
          <GatewayCard index="01" href="/new" badge="جديدة · API" content={newCar} />
        </ScrollReveal>
        <ScrollReveal delay={0.15} style={{ flex: "1 1 420px" }}>
          <GatewayCard index="02" href="/used" badge="متاحة الآن" content={usedCar} />
        </ScrollReveal>
      </div>
    </section>
  )
}
