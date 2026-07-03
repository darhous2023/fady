"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Auto-reload on stale chunk error (happens after redeployment while user has old page cached)
    if (error?.name === "ChunkLoadError" || error?.message?.includes("Loading chunk") || error?.message?.includes("Failed to load chunk")) {
      window.location.reload()
    }
  }, [error])

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A",
      display: "flex", alignItems: "center", justifyContent: "center",
      direction: "rtl", padding: "40px 24px",
    }}>
      <style>{`
                @keyframes shimmer { from{background-position:200% center} to{background-position:-200% center} }
      `}</style>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          fontFamily: "Tajawal, sans-serif", fontSize: 80, fontWeight: 700,
          background: "linear-gradient(135deg,#5C6167,#9BA3AA,#C9CFD4,#9BA3AA,#5C6167)",
          backgroundSize: "300% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          animation: "shimmer 4s linear infinite",
          lineHeight: 1, marginBottom: 24,
        }}>500</div>
        <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900, color: "#F2F0EC", marginBottom: 12 }}>
          حدث خطأ ما
        </div>
        <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 14, color: "#F2F0EC", opacity: 0.45, lineHeight: 1.8, marginBottom: 32 }}>
          حدثت مشكلة مؤقتة في المتجر. يمكنك المحاولة مرة أخرى أو العودة للرئيسية.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 14,
              padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", color: "#0A0A0A",
            }}
          >
            حاول مرة أخرى
          </button>
          <Link href="/" style={{
            fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 14,
            padding: "12px 28px", borderRadius: 8, textDecoration: "none",
            border: "1px solid rgba(155,163,170,0.3)", color: "#9BA3AA",
          }}>
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
