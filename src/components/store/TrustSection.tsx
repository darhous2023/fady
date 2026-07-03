const TRUST_ITEMS = [
  {
    icon: "🚚",
    title: "شحن سريع",
    desc: "خلال 2-5 أيام لكل محافظات مصر",
  },
  {
    icon: "💰",
    title: "دفع عند الاستلام",
    desc: "ادفعي لما الطلب يوصلك — بدون مخاطرة",
  },
  {
    icon: "🔄",
    title: "استبدال واسترجاع",
    desc: "خلال 7 أيام من تاريخ الاستلام",
  },
  {
    icon: "👑",
    title: "جودة مختارة",
    desc: "كل منتج مفحوص بعناية قبل الشحن",
  },
]

export default function TrustSection() {
  return (
    <section style={{
      background: "linear-gradient(180deg, #0A0806 0%, #0f0d0a 50%, #0A0806 100%)",
      borderTop: "1px solid rgba(201,168,76,0.06)",
      borderBottom: "1px solid rgba(201,168,76,0.06)",
      padding: "48px 40px",
      direction: "rtl",
    }}>
      <style>{`
        @keyframes trustFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .trust-card { transition: all 0.3s ease; }
        .trust-card:hover { transform: translateY(-3px); border-color: rgba(201,168,76,0.2) !important; }
        @media (max-width: 640px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 360px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="trust-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}>
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="trust-card"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,168,76,0.08)",
                borderRadius: 14,
                padding: "22px 18px",
                textAlign: "center",
                animation: `trustFadeUp 0.5s ease ${i * 0.08}s both`,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{
                fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 14,
                color: "#F5EFE0", marginBottom: 6,
              }}>
                {item.title}
              </div>
              <div style={{
                fontFamily: "Tajawal, sans-serif", fontSize: 12,
                color: "rgba(245,239,224,0.38)", lineHeight: 1.5,
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
