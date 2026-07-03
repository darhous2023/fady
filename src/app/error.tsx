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
      minHeight: "100vh", background: "#0A0806",
      display: "flex", alignItems: "center", justifyContent: "center",
      direction: "rtl", padding: "40px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Cinzel:wght@400&display=swap');
        @keyframes shimmer { from{background-position:200% center} to{background-position:-200% center} }
      `}</style>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          fontFamily: "Cinzel, serif", fontSize: 80, fontWeight: 700,
          background: "linear-gradient(135deg,#8B6020,#C9A84C,#F0D882,#C9A84C,#8B6020)",
          backgroundSize: "300% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          animation: "shimmer 4s linear infinite",
          lineHeight: 1, marginBottom: 24,
        }}>500</div>
        <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900, color: "#F5EFE0", marginBottom: 12 }}>
          حدث خطأ ما
        </div>
        <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 14, color: "#F5EFE0", opacity: 0.45, lineHeight: 1.8, marginBottom: 32 }}>
          حدثت مشكلة مؤقتة في المتجر. يمكنك المحاولة مرة أخرى أو العودة للرئيسية.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 14,
              padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#C9A84C,#F0D882)", color: "#0A0806",
            }}
          >
            حاول مرة أخرى
          </button>
          <Link href="/" style={{
            fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 14,
            padding: "12px 28px", borderRadius: 8, textDecoration: "none",
            border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C",
          }}>
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
