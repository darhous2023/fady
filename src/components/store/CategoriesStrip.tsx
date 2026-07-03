import Link from "next/link"

interface Category {
  id: string
  name_ar: string
  slug: string
}

const CATEGORY_ICONS: Record<string, string> = {
  "شنط":        "👜",
  "محافظ":      "👛",
  "كلتشات":     "💼",
  "أحذية":      "👠",
  "إكسسوارات":  "💍",
  "ساعات":      "⌚",
  "نظارات":     "🕶️",
  "بالطوهات":   "🎩",
}

export default function CategoriesStrip({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  return (
    <section style={{
      padding: "40px 40px 0",
      direction: "rtl",
      background: "#0A0806",
    }}>
      <style>{`
        @keyframes catFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .cat-pill { transition: all 0.25s ease; text-decoration: none; }
        .cat-pill:hover { transform: translateY(-2px); }
        .cat-pill:hover .cat-inner {
          border-color: rgba(201,168,76,0.45) !important;
          background: rgba(201,168,76,0.08) !important;
        }
        .cat-pill:hover .cat-name { color: #C9A84C !important; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ height: 1, width: 40, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.3))" }} />
          <span style={{ fontFamily: "Cinzel, serif", fontSize: 9, letterSpacing: "5px", color: "#C9A84C", opacity: 0.65, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            تصفّحي بالتصنيف
          </span>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(201,168,76,0.3),transparent)" }} />
        </div>

        {/* Pills row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* "All" pill */}
          <a href="#products" className="cat-pill" style={{ animation: "catFade 0.4s ease both" }}>
            <div className="cat-inner" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 50,
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.18)",
            }}>
              <span style={{ fontSize: 16 }}>✦</span>
              <span className="cat-name" style={{
                fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 13,
                color: "#F5EFE0",
              }}>
                الكل
              </span>
            </div>
          </a>

          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href={`#products`}
              className="cat-pill"
              style={{ animation: `catFade 0.4s ease ${(i + 1) * 0.06}s both` }}
            >
              <div className="cat-inner" style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 50,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,168,76,0.1)",
              }}>
                <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[cat.name_ar] ?? "✦"}</span>
                <span className="cat-name" style={{
                  fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 13,
                  color: "rgba(245,239,224,0.75)",
                }}>
                  {cat.name_ar}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
