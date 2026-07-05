"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CarsQuickSearch() {
  const router = useRouter()
  const [q, setQ] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    router.push(query ? `/new/search?q=${encodeURIComponent(query)}` : "/new/browse")
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, maxWidth: 480, margin: "28px auto 0" }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث بالماركة أو الموديل — BMW، تويوتا كورولا..."
        aria-label="بحث عن سيارة"
        style={{
          flex: 1, height: 48, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.04)", color: "#F2F0EC", padding: "0 16px",
          fontFamily: "Tajawal,sans-serif", fontSize: 14, direction: "rtl",
        }}
      />
      <button
        type="submit"
        style={{
          height: 48, padding: "0 22px", borderRadius: 8, border: "none",
          background: "#9BA3AA", color: "#0A0A0A", fontFamily: "Tajawal,sans-serif",
          fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}
      >
        بحث
      </button>
    </form>
  )
}
