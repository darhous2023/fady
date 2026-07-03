"use client"

import Link from "next/link"
import { ScrollReveal } from "./ScrollReveal"

interface Brand { id: string; name_ar: string; slug: string }

export default function BrandsStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null
  return (
    <section style={{ background: "#0A0A0A", padding: "56px 40px", borderTop: "1px solid rgba(155,163,170,0.08)", direction: "rtl" }}>
      <ScrollReveal>
        <div style={{ textAlign: "center", marginBottom: 32, fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "4px", color: "#9BA3AA", textTransform: "uppercase" }}>
          الماركات المتاحة لدينا
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
          {brands.map(b => (
            <Link key={b.id} href={`/used?brand=${b.slug}`} style={{
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
              color: "rgba(245,245,245,0.55)", textDecoration: "none",
              border: "1px solid rgba(155,163,170,0.15)", borderRadius: 30,
              padding: "10px 26px", transition: "all 0.25s ease",
            }}>
              {b.name_ar}
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
