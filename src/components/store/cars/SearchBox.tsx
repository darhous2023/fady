"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBox({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    router.push(trimmed ? `/new/search?q=${encodeURIComponent(trimmed)}` : "/new/search")
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ابحث عن ماركة أو موديل (عربي أو إنجليزي)..."
        style={{
          flex: 1, padding: "14px 16px", borderRadius: 10, background: "#111214",
          border: "1px solid rgba(255,255,255,0.1)", color: "#F2F0EC",
          fontFamily: "Tajawal,sans-serif", fontSize: 14, outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "14px 24px", borderRadius: 10, background: "#9BA3AA", color: "#0A0A0A",
          fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
        }}
      >
        بحث
      </button>
    </form>
  )
}
