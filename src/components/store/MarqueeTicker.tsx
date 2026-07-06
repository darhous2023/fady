"use client"

export default function MarqueeTicker({ text }: { text: string }) {
  const item = text || "سيارات جديدة  ·  سيارات مستعملة  ·  فحص شامل  ·  "
  const repeated = Array(6).fill(item).join("")

  return (
    <div style={{ background: "#0A0A0A", borderTop: "1px solid rgba(155,163,170,0.1)", borderBottom: "1px solid rgba(155,163,170,0.1)", overflow: "hidden", padding: "20px 0" }}>
      <style>{`
        @keyframes mq-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mq-track { display: inline-flex; white-space: nowrap; animation: mq-scroll 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .mq-track { animation: none; } }
      `}</style>
      <div style={{ display: "flex" }}>
        <div className="mq-track" style={{
          fontFamily: "'Space Mono', monospace", fontSize: 18, letterSpacing: "2.5px",
          color: "rgba(155,163,170,0.85)", textTransform: "uppercase",
        }}>
          {repeated}{repeated}
        </div>
      </div>
    </div>
  )
}
