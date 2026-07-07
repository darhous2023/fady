"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

const FALLBACK_IMAGE = "/logo-400.png"

interface Props {
  src: string | null | undefined
  alt: string
  loading?: "eager" | "lazy"
  onClick?: () => void
  style?: CSSProperties
}

export default function CarImage({ src, alt, loading = "lazy", onClick, style }: Props) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const hasImage = Boolean(src) && !failed

  useEffect(() => {
    setFailed(false)
  }, [src])

  useEffect(() => {
    if (!hasImage) return

    const checkImage = () => {
      const img = imgRef.current
      if (img?.complete && img.naturalWidth === 0) setFailed(true)
    }

    const timeout = window.setTimeout(checkImage, 1500)
    return () => window.clearTimeout(timeout)
  }, [hasImage, src])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={hasImage ? src! : FALLBACK_IMAGE}
      alt={alt}
      loading={loading}
      onClick={onClick}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if (e.currentTarget.complete && e.currentTarget.naturalWidth === 0) {
          setFailed(true)
        }
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: hasImage ? "cover" : "contain",
        opacity: hasImage ? 1 : 0.35,
        padding: hasImage ? 0 : 24,
        ...style,
      }}
    />
  )
}
