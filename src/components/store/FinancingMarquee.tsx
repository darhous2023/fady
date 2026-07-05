"use client"

interface Partner { id: string; name_ar: string; subtitle_ar: string | null; logo_url: string | null; link: string | null }

function PartnerCard({ p }: { p: Partner }) {
  const inner = (
    <div className="fm-card">
      {p.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.logo_url} alt={p.name_ar} className="fm-logo" onError={e => { e.currentTarget.style.display = "none" }} />
      ) : (
        <span className="fm-icon" aria-hidden="true">💳</span>
      )}
      <div className="fm-text">
        <span className="fm-name">{p.name_ar}</span>
        {p.subtitle_ar && <span className="fm-subtitle">{p.subtitle_ar}</span>}
      </div>
    </div>
  )
  return p.link ? (
    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
  ) : inner
}

export default function FinancingMarquee({ partners, title }: { partners: Partner[]; title?: string }) {
  if (!partners.length) return null
  const track = [...partners, ...partners]

  return (
    <div style={{ background: "#0D0D0D", borderTop: "1px solid rgba(155,163,170,0.08)", borderBottom: "1px solid rgba(155,163,170,0.08)", padding: "36px 0", overflow: "hidden" }}>
      <style>{`
        .fm-title {
          text-align: center; font-family: Tajawal, sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: #9BA3AA; opacity: 0.8; margin-bottom: 22px;
        }
        @keyframes fm-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .fm-track { display: inline-flex; gap: 16px; white-space: nowrap; animation: fm-scroll 32s linear infinite; padding: 0 8px; }
        @media (prefers-reduced-motion: reduce) { .fm-track { animation: none; } }
        .fm-card {
          display: inline-flex; align-items: center; gap: 12px; white-space: normal;
          background: rgba(155,163,170,0.04); border: 1px solid rgba(155,163,170,0.12);
          border-radius: 12px; padding: 12px 20px; min-width: 220px; max-width: 280px;
        }
        .fm-logo { width: 32px; height: 32px; object-fit: contain; border-radius: 6px; flex-shrink: 0; }
        .fm-icon { font-size: 20px; flex-shrink: 0; }
        .fm-text { display: flex; flex-direction: column; direction: rtl; min-width: 0; }
        .fm-name { font-family: Tajawal, sans-serif; font-weight: 700; font-size: 13px; color: #F2F0EC; }
        .fm-subtitle { font-family: Tajawal, sans-serif; font-size: 11px; color: #9BA3AA; opacity: 0.7; }
      `}</style>
      {title && <p className="fm-title">{title}</p>}
      <div style={{ display: "flex" }}>
        <div className="fm-track">
          {track.map((p, i) => <PartnerCard key={`${p.id}-${i}`} p={p} />)}
        </div>
      </div>
    </div>
  )
}
