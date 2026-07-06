"use client"

interface Logo { id: string; name: string; logo_url: string; link: string | null }

function LogoCard({ l }: { l: Logo }) {
  const inner = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={l.logo_url} alt={l.name} className="pl-logo" onError={e => { e.currentTarget.style.display = "none" }} />
  )
  return l.link ? (
    <a href={l.link} target="_blank" rel="noopener noreferrer" className="pl-card" aria-label={l.name}>{inner}</a>
  ) : (
    <div className="pl-card" role="img" aria-label={l.name}>{inner}</div>
  )
}

export default function PartnerLogosMarquee({ logos, title }: { logos: Logo[]; title?: string }) {
  if (!logos.length) return null
  const doubled = [...logos, ...logos]
  const track = [...doubled, ...doubled]

  return (
    <div style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(155,163,170,0.08)", padding: "24px 0", overflow: "hidden" }}>
      <style>{`
        .pl-title {
          text-align: center; font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: #9BA3AA; opacity: 0.6; margin-bottom: 18px;
        }
        @keyframes pl-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .pl-track { display: inline-flex; align-items: center; gap: 20px; white-space: nowrap; animation: pl-scroll 36s linear infinite; padding: 0 8px; }
        @media (prefers-reduced-motion: reduce) { .pl-track { animation: none; } }
        .pl-card {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(155,163,170,0.04); border: 1px solid rgba(155,163,170,0.1);
          border-radius: 10px; padding: 10px 22px; height: 52px; flex-shrink: 0;
        }
        .pl-logo { max-height: 26px; max-width: 84px; object-fit: contain; filter: grayscale(0.15) brightness(1.4); opacity: 0.9; }
      `}</style>
      {title && <p className="pl-title">{title}</p>}
      <div style={{ display: "flex" }}>
        <div className="pl-track">
          {track.map((l, i) => <LogoCard key={`${l.id}-${i}`} l={l} />)}
        </div>
      </div>
    </div>
  )
}
