"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface LightboxImage { url: string; alt_ar: string | null }

interface Props {
  images: LightboxImage[]
  startIndex: number
  productName: string
  onClose: () => void
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

export default function ImageLightbox({ images, startIndex, productName, onClose }: Props) {
  const [index, setIndex] = useState(startIndex)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })
  const dragStartX = useRef<number | null>(null)
  const dragStartIndex = useRef(0)
  const reducedMotion = useReducedMotion()
  const imgWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setIndex(i => (i - 1 + images.length) % images.length)
      if (e.key === "ArrowLeft") setIndex(i => (i + 1) % images.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [images.length, onClose])

  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragStartX.current = e.clientX
    dragStartIndex.current = index
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) {
      // Magnifier: track cursor position as % of the image box, only when not dragging.
      const rect = imgWrapRef.current?.getBoundingClientRect()
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoom({ active: true, x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) })
      }
      return
    }
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > 60) {
      if (delta < 0) next()
      else prev()
      dragStartX.current = e.clientX
    }
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    dragStartX.current = null
    ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
  }
  function onPointerLeave() {
    setZoom(z => ({ ...z, active: false }))
  }

  const current = images[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`معرض صور ${productName}`}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(6,6,6,0.97)", backdropFilter: "blur(6px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        animation: reducedMotion ? "none" : "ilbFadeIn 0.25s ease both",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`
        @keyframes ilbFadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>

      {/* Close */}
      <button onClick={onClose} aria-label="إغلاق المعاينة" style={{
        position: "absolute", top: 20, left: 20, zIndex: 3,
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
        color: "#F2F0EC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div style={{
          position: "absolute", top: 28, right: 28, zIndex: 3,
          fontFamily: "'Space Mono',monospace", fontSize: 13, color: "#9BA3AA",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          padding: "6px 14px", borderRadius: 20,
        }}>
          {index + 1} / {images.length}
        </div>
      )}

      {/* Image with magnifier */}
      <div
        ref={imgWrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
        style={{
          position: "relative", width: "min(88vw, 1000px)", height: "min(74vh, 760px)",
          cursor: "grab", touchAction: "none", userSelect: "none", borderRadius: 8, overflow: "hidden",
        }}
      >
        {current?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.alt_ar ?? productName}
            draggable={false}
            style={{
              width: "100%", height: "100%", objectFit: "contain",
              transform: zoom.active && !reducedMotion ? "scale(2)" : "scale(1)",
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transition: zoom.active ? "none" : "transform 0.2s ease",
            }}
          />
        )}
        {zoom.active && !reducedMotion && (
          <div style={{
            position: "absolute", top: 12, left: 12, zIndex: 2,
            fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.5)",
            background: "rgba(10,10,10,0.6)", padding: "4px 10px", borderRadius: 14,
            pointerEvents: "none",
          }}>
            عدسة تكبير
          </div>
        )}
      </div>

      {/* Arrow nav */}
      {images.length > 1 && (
        <>
          <button onClick={prev} aria-label="الصورة السابقة" style={{
            position: "absolute", right: "max(16px, calc(50% - min(44vw, 500px) - 60px))", top: "50%", transform: "translateY(-50%)", zIndex: 3,
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#F2F0EC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button onClick={next} aria-label="الصورة التالية" style={{
            position: "absolute", left: "max(16px, calc(50% - min(44vw, 500px) - 60px))", top: "50%", transform: "translateY(-50%)", zIndex: 3,
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#F2F0EC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 8, maxWidth: "90vw", overflowX: "auto", padding: "4px" }}>
          {images.map((img, i) => (
            <button key={img.url + i} onClick={() => setIndex(i)} aria-label={`صورة ${i + 1}`} style={{
              width: 56, height: 56, flexShrink: 0, borderRadius: 6, overflow: "hidden", padding: 0, cursor: "pointer",
              border: `2px solid ${i === index ? "#9BA3AA" : "rgba(255,255,255,0.15)"}`,
              opacity: i === index ? 1 : 0.55, transition: "all 0.2s ease",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
