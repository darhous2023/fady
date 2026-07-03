"use client"

import { useMemo, useRef, useState } from "react"
import { StaggerGroup, StaggerItem } from "./ScrollReveal"

const WA = "201555557745"
const CURRENT_YEAR = new Date().getFullYear()

interface Make { id: number; name: string }
interface ModelRow { id: number; name: string; make: string }
interface Trim { id: number; name: string; description?: string; msrp?: number }

function logoSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function BrandLogo({ name }: { name: string }) {
  const [broken, setBroken] = useState(false)
  if (broken) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/${logoSlug(name)}.png`}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
      style={{ width: 22, height: 22, objectFit: "contain" }}
    />
  )
}

type Step = "make" | "model" | "year" | "trim"

export default function NewCarsBrowser({ initialMakes }: { initialMakes: Make[] }) {
  const [query, setQuery] = useState("")
  const [selectedMake, setSelectedMake] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const [models, setModels] = useState<ModelRow[]>([])
  const [years, setYears] = useState<number[]>([])
  const [trims, setTrims] = useState<Trim[]>([])

  const [loading, setLoading] = useState<Step | null>(null)
  const [error, setError] = useState<Step | null>(null)

  // Guards against out-of-order responses when the user switches selections quickly
  // (previously caused the WhatsApp message to reference a different car than the one shown).
  const requestId = useRef(0)

  const filteredMakes = useMemo(() => {
    if (!query.trim()) return initialMakes.slice(0, 18)
    const q = query.trim().toLowerCase()
    return initialMakes.filter(m => m.name.toLowerCase().includes(q)).slice(0, 30)
  }, [query, initialMakes])

  async function pickMake(name: string) {
    const id = ++requestId.current
    setSelectedMake(name)
    setSelectedModel(null)
    setSelectedYear(null)
    setModels([]); setYears([]); setTrims([])
    setLoading("model"); setError(null)
    try {
      const res = await fetch(`/api/new-cars/models?make=${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (requestId.current !== id) return
      setModels(data)
    } catch {
      if (requestId.current === id) setError("model")
    } finally {
      if (requestId.current === id) setLoading(null)
    }
  }

  async function pickModel(name: string) {
    const id = ++requestId.current
    setSelectedModel(name)
    setSelectedYear(null)
    setYears([]); setTrims([])
    setLoading("year"); setError(null)
    try {
      const res = await fetch(`/api/new-cars/years`)
      if (!res.ok) throw new Error()
      const all: number[] = await res.json()
      if (requestId.current !== id) return
      const recent = all.filter(y => y >= CURRENT_YEAR - 1 && y <= CURRENT_YEAR + 1)
      setYears(recent.length ? recent : all.slice(-3))
    } catch {
      if (requestId.current === id) setError("year")
    } finally {
      if (requestId.current === id) setLoading(null)
    }
  }

  async function pickYear(year: number) {
    const id = ++requestId.current
    setSelectedYear(year)
    setTrims([])
    setLoading("trim"); setError(null)
    try {
      const res = await fetch(
        `/api/new-cars/trims?make=${encodeURIComponent(selectedMake!)}&model=${encodeURIComponent(selectedModel!)}&year=${year}`
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (requestId.current !== id) return
      setTrims(data)
    } catch {
      if (requestId.current === id) setError("trim")
    } finally {
      if (requestId.current === id) setLoading(null)
    }
  }

  function reset(step: Step) {
    requestId.current++ // invalidate any in-flight request
    if (step === "make") { setSelectedMake(null); setSelectedModel(null); setSelectedYear(null); setModels([]); setYears([]); setTrims([]) }
    if (step === "model") { setSelectedModel(null); setSelectedYear(null); setYears([]); setTrims([]) }
    if (step === "year") { setSelectedYear(null); setTrims([]) }
    setError(null); setLoading(null)
  }

  function waLink(trimName?: string) {
    const parts = [selectedMake, selectedModel, selectedYear, trimName].filter(Boolean)
    const text = `السلام عليكم، أريد الاستفسار عن توفر: ${parts.join(" ")}`
    return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px", direction: "rtl" }}>
      {/* Breadcrumb */}
      {(selectedMake || selectedModel || selectedYear) && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 32, fontFamily: "Tajawal,sans-serif", fontSize: 13 }}>
          <button onClick={() => reset("make")} style={crumbStyle(!selectedModel)}>{selectedMake ?? "الماركة"}</button>
          {selectedModel && <span style={{ color: "rgba(245,245,245,0.25)" }}>›</span>}
          {selectedModel && <button onClick={() => reset("model")} style={crumbStyle(!selectedYear)}>{selectedModel}</button>}
          {selectedYear && <span style={{ color: "rgba(245,245,245,0.25)" }}>›</span>}
          {selectedYear && <button onClick={() => reset("year")} style={crumbStyle(trims.length > 0)}>{selectedYear}</button>}
        </div>
      )}

      {/* Step 1: Makes — searchable, decluttered */}
      {!selectedMake && (
        <>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن ماركة… (تويوتا، هيونداي، BMW...)"
            style={{
              display: "block", width: "100%", maxWidth: 420, margin: "0 auto 28px",
              fontFamily: "Tajawal,sans-serif", fontSize: 15, color: "#F5F5F5",
              background: "#111111", border: "1px solid rgba(155,163,170,0.2)", borderRadius: 10,
              padding: "13px 18px", outline: "none",
            }}
          />
          <StaggerGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {initialMakes.length === 0 && (
              <p style={{ fontFamily: "Tajawal,sans-serif", color: "rgba(245,245,245,0.4)", gridColumn: "1 / -1", textAlign: "center" }}>
                تعذّر تحميل الماركات حاليًا، حاول لاحقًا أو تواصل معنا مباشرة على واتساب.
              </p>
            )}
            {filteredMakes.map(m => (
              <StaggerItem key={m.id}>
                <button
                  onClick={() => pickMake(m.name)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
                    fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14, minHeight: 44,
                    padding: "10px 16px", borderRadius: 10, cursor: "pointer",
                    border: "1px solid rgba(155,163,170,0.15)", background: "#111111",
                    color: "rgba(245,245,245,0.75)", transition: "all 0.2s ease",
                  }}
                >
                  <BrandLogo name={m.name} />
                  {m.name}
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>
          {!query && initialMakes.length > 18 && (
            <p style={{ textAlign: "center", marginTop: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, color: "rgba(245,245,245,0.35)" }}>
              اكتب اسم الماركة في الأعلى لعرض كل {initialMakes.length} ماركة
            </p>
          )}
        </>
      )}

      {/* Step 2: Models */}
      {selectedMake && !selectedModel && (
        <StepStatus loading={loading === "model"} error={error === "model"} label={`موديلات ${selectedMake}`} />
      )}
      {selectedMake && !selectedModel && models.length > 0 && (
        <StaggerGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {models.map(model => (
            <StaggerItem key={model.id}>
              <button onClick={() => pickModel(model.name)} style={cardStyle}>
                <div style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F5F5F5" }}>{model.name}</div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}

      {/* Step 3: Years */}
      {selectedModel && !selectedYear && (
        <StepStatus loading={loading === "year"} error={error === "year"} label="سنة الصنع" />
      )}
      {selectedModel && !selectedYear && years.length > 0 && (
        <StaggerGroup style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {years.map(y => (
            <StaggerItem key={y}>
              <button onClick={() => pickYear(y)} style={{ ...cardStyle, minWidth: 100, padding: "16px 20px" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18, color: "#F5F5F5" }}>{y}</div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}

      {/* Step 4: Trims */}
      {selectedYear && (
        <StepStatus loading={loading === "trim"} error={error === "trim"} label="الفئات المتاحة" />
      )}
      {selectedYear && trims.length > 0 && (
        <StaggerGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {trims.map(trim => (
            <StaggerItem key={trim.id} style={{
              background: "#111111", border: "1px solid rgba(155,163,170,0.1)", borderRadius: 14,
              padding: "24px 20px", textAlign: "center",
            }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 16, color: "#F5F5F5", marginBottom: 6 }}>
                {trim.name}
              </div>
              {trim.description && (
                <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 12, color: "rgba(245,245,245,0.45)", marginBottom: 10, lineHeight: 1.7 }}>
                  {trim.description}
                </div>
              )}
              {trim.msrp && (
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#9BA3AA", marginBottom: 16 }}>
                  MSRP ${trim.msrp.toLocaleString()}
                </div>
              )}
              <a href={waLink(trim.name)} target="_blank" rel="noopener noreferrer" style={waButtonStyle}>
                اسأل عن التوفر
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
      {selectedYear && !loading && trims.length === 0 && error !== "trim" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Tajawal,sans-serif", color: "rgba(245,245,245,0.4)", marginBottom: 16 }}>
            مفيش فئات تفصيلية متاحة لهذا الموديل، تقدر تسأل عن التوفر مباشرة.
          </p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" style={waButtonStyle}>
            اسأل عن التوفر
          </a>
        </div>
      )}
    </div>
  )
}

function StepStatus({ loading, error, label }: { loading: boolean; error: boolean; label: string }) {
  if (loading) {
    return (
      <p style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", color: "#9BA3AA", fontSize: 13, marginBottom: 24 }}>
        جاري تحميل {label}...
      </p>
    )
  }
  if (error) {
    return (
      <p style={{ textAlign: "center", fontFamily: "Tajawal,sans-serif", color: "rgba(245,245,245,0.4)", marginBottom: 24 }}>
        تعذّر جلب {label}، حاول اختيار تاني أو تواصل معنا مباشرة.
      </p>
    )
  }
  return null
}

function crumbStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: "Tajawal,sans-serif", fontWeight: 700, cursor: "pointer",
    background: "transparent", border: "none", padding: "4px 2px",
    color: active ? "#9BA3AA" : "rgba(245,245,245,0.85)",
    textDecoration: "underline", textUnderlineOffset: 4,
  }
}

const cardStyle: React.CSSProperties = {
  width: "100%", background: "#111111", border: "1px solid rgba(155,163,170,0.1)", borderRadius: 14,
  padding: "24px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s ease",
}

const waButtonStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Tajawal,sans-serif",
  fontWeight: 700, fontSize: 13, color: "#25D366",
  background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
  padding: "9px 18px", borderRadius: 8, textDecoration: "none",
}
