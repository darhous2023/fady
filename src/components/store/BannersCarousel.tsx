"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface Banner { id: string; image_url: string; title_ar: string | null; link: string | null }

function BannerSlide({ b }: { b: Banner }) {
  const inner = (
    <div style={{ position: "relative", width: "100%", paddingBottom: "33.33%", overflow: "hidden", maxHeight: 480 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.image_url} alt={b.title_ar ?? "بانر"}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {b.title_ar && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top,rgba(10,8,6,0.75),transparent)",
          padding: "40px 40px 24px",
        }}>
          <p style={{
            fontFamily: "Tajawal, sans-serif", fontWeight: 700,
            fontSize: "clamp(18px,3vw,32px)", color: "#F5EFE0",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)", direction: "rtl",
          }}>{b.title_ar}</p>
        </div>
      )}
    </div>
  )
  return b.link
    ? <Link href={b.link} style={{ display: "block", textDecoration: "none" }}>{inner}</Link>
    : <div>{inner}</div>
}

export default function BannersCarousel({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (banners.length <= 1 || paused) return
    timer.current = setInterval(() => setIdx(i => (i + 1) % banners.length), 4500)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [banners.length, paused])

  if (!banners.length) return null

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", background: "#0E0C09" }}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <style>{`@keyframes bannerFade{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}`}</style>

      {banners.map((b, i) => (
        <div key={b.id} style={{
          display: i === idx ? "block" : "none",
          animation: i === idx ? "bannerFade 0.6s ease both" : "none",
        }}>
          <BannerSlide b={b} />
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
            {banners.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 24 : 8, height: 8, borderRadius: 4,
                background: i === idx ? "#C9A84C" : "rgba(245,239,224,0.3)",
                border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <button onClick={() => setIdx(i => (i - 1 + banners.length) % banners.length)}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(10,8,6,0.55)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <button onClick={() => setIdx(i => (i + 1) % banners.length)}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(10,8,6,0.55)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </>
      )}
    </div>
  )
}
