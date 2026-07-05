"use client"

export default function ExportCSVButton() {
  return (
    <a
      href="/api/admin/orders/export"
      download
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "8px 18px", borderRadius: 8, textDecoration: "none",
        background: "rgba(155, 163, 170,0.1)", border: "1px solid rgba(155, 163, 170,0.25)",
        color: "#9BA3AA", fontFamily: "Tajawal,sans-serif", fontSize: 13, fontWeight: 700,
        transition: "all 0.2s",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      تصدير CSV
    </a>
  )
}
