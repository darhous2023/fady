"use client"
import { useEffect, useState } from "react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="ارجعي لأعلى"
      style={{
        position: "fixed", bottom: 100, left: 24, zIndex: 8000,
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(10,10,10,0.85)",
        border: "1px solid rgba(155,163,170,0.35)",
        backdropFilter: "blur(8px)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.25s ease",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(155,163,170,0.7)"
        e.currentTarget.style.background = "rgba(155,163,170,0.12)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(155,163,170,0.35)"
        e.currentTarget.style.background = "rgba(10,10,10,0.85)"
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#9BA3AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  )
}
