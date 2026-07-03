"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface Frame360 { id: string; url: string; sequence_index: number }

interface Props {
  frames: Frame360[]
  productName: string
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

export default function Product360Viewer({ frames, productName }: Props) {
  const frameCount = frames.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)
  const reducedMotion = useReducedMotion()

  const containerRef = useRef<HTMLDivElement>(null)
  const activePointerId = useRef<number | null>(null)
  const startX = useRef(0)
  const startIndex = useRef(0)
  const sensitivity = useRef(6) // px per frame step, recomputed on drag start
  const rafRef = useRef(0)
  const pendingIndex = useRef<number | null>(null)

  // Preload all frames once; show a loading state until they're in the browser cache.
  useEffect(() => {
    let cancelled = false
    let loaded = 0
    frames.forEach(f => {
      const img = new window.Image()
      img.onload = img.onerror = () => {
        loaded += 1
        if (!cancelled) setLoadedCount(loaded)
      }
      img.src = f.url
    })
    return () => { cancelled = true }
  }, [frames])

  useEffect(() => {
    if (!hintVisible) return
    const t = setTimeout(() => setHintVisible(false), 3500)
    return () => clearTimeout(t)
  }, [hintVisible])

  const applyDelta = useCallback((deltaX: number) => {
    const steps = Math.round(deltaX / sensitivity.current)
    let next = (startIndex.current - steps) % frameCount
    if (next < 0) next += frameCount
    pendingIndex.current = next
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingIndex.current !== null) setCurrentIndex(pendingIndex.current)
        rafRef.current = 0
      })
    }
  }, [frameCount])

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (frameCount <= 1) return
    if (activePointerId.current !== null) return // multi-touch protection
    activePointerId.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
    startX.current = e.clientX
    startIndex.current = currentIndex
    const width = containerRef.current?.getBoundingClientRect().width ?? 320
    // A drag across ~45% of the frame's width completes one full rotation.
    sensitivity.current = Math.max(3, (width * 0.45) / frameCount)
    setDragging(true)
    setHintVisible(false)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== e.pointerId) return
    applyDelta(e.clientX - startX.current)
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== e.pointerId) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    activePointerId.current = null
    setDragging(false)
  }

  function step(dir: 1 | -1) {
    setCurrentIndex(i => (i + dir + frameCount) % frameCount)
    setHintVisible(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") { step(-1); e.preventDefault() }
    if (e.key === "ArrowLeft") { step(1); e.preventDefault() }
  }

  const allLoaded = loadedCount >= frameCount

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${productName} — عرض 360 درجة، إطار ${currentIndex + 1} من ${frameCount}`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{
        position: "relative", borderRadius: 20, overflow: "hidden", paddingBottom: "100%",
        background: "#141414", cursor: frameCount > 1 ? (dragging ? "grabbing" : "grab") : "default",
        touchAction: "none", userSelect: "none", outline: "none",
        border: "1px solid rgba(155,163,170,0.12)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
      }}
    >
      {frames.map((f, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={f.id}
          src={f.url}
          alt={i === currentIndex ? `${productName} — إطار ${i + 1}` : ""}
          draggable={false}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: i === currentIndex ? 1 : 0, pointerEvents: "none",
          }}
        />
      ))}

      {/* 360 badge */}
      <div style={{
        position: "absolute", top: 16, right: 16, zIndex: 5, display: "flex", alignItems: "center", gap: 6,
        background: "rgba(10,10,10,0.7)", border: "1px solid rgba(155,163,170,0.3)", color: "#9BA3AA",
        fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" />
        </svg>
        360°
      </div>

      {/* Drag hint */}
      <div style={{
        position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 5,
        display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
        background: "rgba(10,10,10,0.7)", color: "#F2F0EC", fontFamily: "Tajawal,sans-serif", fontSize: 12,
        padding: "8px 16px", borderRadius: 20, pointerEvents: "none",
        opacity: hintVisible ? 1 : 0,
        transition: reducedMotion ? "none" : "opacity 0.4s ease",
      }}>
        <span>↔</span> اسحب للتدوير 360°
      </div>

      {/* Preload overlay */}
      {!allLoaded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 6, background: "rgba(10,10,10,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10,
        }}>
          {reducedMotion ? (
            <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#9BA3AA" }}>{loadedCount}/{frameCount}</span>
          ) : (
            <span style={{ display: "inline-block", width: 26, height: 26, border: "2px solid rgba(155,163,170,0.3)", borderTopColor: "#9BA3AA", borderRadius: "50%", animation: "p360spin 0.8s linear infinite" }} />
          )}
          <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "#9BA3AA" }}>جاري تحميل صور الـ 360...</span>
        </div>
      )}
      <style>{`@keyframes p360spin { to { transform: rotate(360deg) } }`}</style>

      {/* Arrow fallback (accessibility / non-drag input) */}
      {frameCount > 1 && (
        <>
          <button type="button" aria-label="الإطار السابق" onClick={() => step(-1)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 6, background: "rgba(10,10,10,0.6)", border: "1px solid rgba(155,163,170,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9BA3AA", fontSize: 16 }}>‹</button>
          <button type="button" aria-label="الإطار التالي" onClick={() => step(1)}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 6, background: "rgba(10,10,10,0.6)", border: "1px solid rgba(155,163,170,0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9BA3AA", fontSize: 16 }}>›</button>
        </>
      )}
    </div>
  )
}
