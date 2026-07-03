"use client"

import { useState } from "react"
import { StaggerGroup, StaggerItem } from "./ScrollReveal"

const WA = "201555557745"

interface Make { id: number; name: string }
interface ModelRow { id: number; name: string; make: string }

export default function NewCarsBrowser({ initialMakes }: { initialMakes: Make[] }) {
  const [selectedMake, setSelectedMake] = useState<string | null>(null)
  const [models, setModels] = useState<ModelRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function pickMake(name: string) {
    setSelectedMake(name)
    setModels([])
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/new-cars/models?make=${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setModels(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  function waLink(modelName: string) {
    const text = `السلام عليكم، أريد الاستفسار عن توفر: ${selectedMake} ${modelName}`
    return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 100px", direction: "rtl" }}>
      {/* Makes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 48 }}>
        {initialMakes.length === 0 && (
          <p style={{ fontFamily: "Tajawal,sans-serif", color: "rgba(245,245,245,0.4)" }}>
            تعذّر تحميل الماركات حاليًا، حاول لاحقًا أو تواصل معنا مباشرة على واتساب.
          </p>
        )}
        {initialMakes.map(m => (
          <button
            key={m.id}
            onClick={() => pickMake(m.name)}
            style={{
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 14,
              padding: "9px 22px", borderRadius: 24, cursor: "pointer",
              border: `1px solid ${selectedMake === m.name ? "#9BA3AA" : "rgba(155,163,170,0.2)"}`,
              background: selectedMake === m.name ? "#9BA3AA" : "transparent",
              color: selectedMake === m.name ? "#0A0A0A" : "rgba(245,245,245,0.6)",
              transition: "all 0.2s ease",
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Models */}
      {loading && (
        <p style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", color: "#9BA3AA", fontSize: 13 }}>
          جاري تحميل الموديلات...
        </p>
      )}
      {error && (
        <p style={{ textAlign: "center", fontFamily: "Tajawal,sans-serif", color: "rgba(245,245,245,0.4)" }}>
          تعذّر جلب موديلات {selectedMake}، حاول ماركة تانية أو تواصل معنا مباشرة.
        </p>
      )}

      {!loading && models.length > 0 && (
        <StaggerGroup style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {models.map(model => (
            <StaggerItem key={model.id} style={{
              background: "#111111", border: "1px solid rgba(155,163,170,0.1)", borderRadius: 14,
              padding: "24px 20px", textAlign: "center",
            }}>
              <div style={{ fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 17, color: "#F5F5F5", marginBottom: 4 }}>
                {model.name}
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#9BA3AA", marginBottom: 18 }}>
                {selectedMake}
              </div>
              <a href={waLink(model.name)} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Tajawal,sans-serif",
                fontWeight: 700, fontSize: 13, color: "#25D366",
                background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
                padding: "9px 18px", borderRadius: 8, textDecoration: "none",
              }}>
                اسأل عن التوفر
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  )
}
