"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"

interface Result { id: string; slug: string; name_ar: string; price: number; category_name: string | null; image: string | null }

const POPULAR = ["تويوتا", "هيونداي", "كيا", "سيارات أوتوماتيك", "أقل من 400 ألف", "موديل 2022"]
const RECENT_KEY = "elfady-recent-searches"
const MAX_RECENT = 5

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") } catch { return [] }
}
function saveRecent(q: string) {
  try {
    const prev = getRecent().filter(s => s !== q)
    localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)))
  } catch {}
}
function clearRecent() {
  try { localStorage.removeItem(RECENT_KEY) } catch {}
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
    setRecent(getRecent())
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (q.trim().length < 2) { setResults([]); setLoading(false); setError(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      setError(false)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
        if (!res.ok) { setResults([]); setError(true); return }
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
      } catch {
        setResults([]); setError(true)
      } finally { setLoading(false) }
    }, 250)
  }, [q])

  const handleSelect = useCallback((term: string) => {
    saveRecent(term)
    setQ(term)
    setRecent(getRecent())
  }, [])

  const handleLinkClick = () => {
    if (q.trim().length >= 2) saveRecent(q.trim())
    onClose()
  }

  const showSuggestions = q.trim().length < 2

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: 80,
      }}
    >
      <style>{`
        @keyframes searchSpin{to{transform:rotate(360deg)}}
        .so-chip { cursor: pointer; transition: all 0.2s; }
        .so-chip:hover { background: rgba(155,163,170,0.12) !important; border-color: rgba(155,163,170,0.4) !important; color: #F2F0EC !important; }
      `}</style>

      <div style={{
        background: "#131313", border: "1px solid rgba(155,163,170,0.2)",
        borderRadius: 16, width: "min(640px, 92vw)", overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        direction: "rtl",
      }}>
        {/* Input */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(155,163,170,0.1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="ابحث عن سيارة أو ماركة..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "Tajawal,sans-serif", fontSize: 16, color: "#F2F0EC",
              padding: "0 14px", direction: "rtl",
            }}
          />
          {loading && (
            <div style={{ width: 16, height: 16, border: "2px solid rgba(155,163,170,0.3)", borderTopColor: "#9BA3AA", borderRadius: "50%", animation: "searchSpin 0.7s linear infinite", flexShrink: 0, marginLeft: 8 }} />
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#F2F0EC", opacity: 0.4, fontSize: 18, padding: "0 4px", marginRight: 4 }}>✕</button>
        </div>

        {/* Suggestions (before typing) */}
        {showSuggestions && (
          <div style={{ padding: "20px 20px 16px" }}>
            {/* Recent searches */}
            {recent.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(242,240,236,0.35)", letterSpacing: "1px" }}>
                    🕐 بحثت مؤخرًا
                  </span>
                  <button
                    onClick={() => { clearRecent(); setRecent([]) }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.25)", padding: 0 }}>
                    مسح
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {recent.map(s => (
                    <button key={s} className="so-chip" onClick={() => handleSelect(s)} style={{
                      fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.6)",
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20, padding: "5px 14px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                        <polyline points="9,10 4,15 9,20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                      </svg>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            <div>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(242,240,236,0.35)", letterSpacing: "1px", marginBottom: 12 }}>
                🔥 الأكثر بحثاً
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {POPULAR.map(s => (
                  <button key={s} className="so-chip" onClick={() => handleSelect(s)} style={{
                    fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "rgba(242,240,236,0.55)",
                    background: "rgba(155,163,170,0.05)", border: "1px solid rgba(155,163,170,0.12)",
                    borderRadius: 20, padding: "5px 14px", cursor: "pointer",
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!showSuggestions && results.length > 0 && (
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {results.map(r => (
              <Link key={r.id} href={`/products/${r.slug}`} onClick={handleLinkClick}
                style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(155,163,170,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}>
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#1a1a1a" }}>
                  {r.image && <img src={r.image} alt={r.name_ar} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#F2F0EC" }}>{r.name_ar}</div>
                  {r.category_name && <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "rgba(242,240,236,0.35)", marginTop: 2 }}>{r.category_name}</div>}
                </div>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, fontWeight: 700, color: "#9BA3AA", flexShrink: 0 }}>
                  {r.price.toLocaleString("ar-EG")} ج.م
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Error */}
        {!showSuggestions && !loading && error && (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 12 }}>⚠️</div>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "#D9776A", margin: 0 }}>
              تعذر البحث حاليًا، حاول مرة أخرى
            </p>
          </div>
        )}

        {/* No results */}
        {!showSuggestions && !loading && !error && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 32, opacity: 0.12, marginBottom: 12 }}>🔍</div>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 14, color: "rgba(242,240,236,0.3)", margin: "0 0 6px" }}>
              لا توجد نتائج لـ &quot;{q}&quot;
            </p>
            <p style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(242,240,236,0.2)", margin: 0 }}>
              جرب كلمة أخرى أو تصفّح السيارات
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
