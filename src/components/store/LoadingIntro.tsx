"use client"

import { useEffect, useState } from "react"

export default function LoadingIntro({ duration = 4500 }: { duration?: number }) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in")

  function skip() {
    setPhase("out")
    setTimeout(() => {
      setPhase("gone")
      try { sessionStorage.setItem("shahy-intro", "1") } catch {}
    }, 900)
  }

  useEffect(() => {
    try { if (sessionStorage.getItem("shahy-intro")) { setPhase("gone"); return } } catch {}
    const t1 = setTimeout(() => setPhase("out"), duration)
    const t2 = setTimeout(() => {
      setPhase("gone")
      try { sessionStorage.setItem("shahy-intro", "1") } catch {}
    }, duration + 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [duration])

  if (phase === "gone") return null

  const lines = [
    { x1: -50,  y1: 150, x2: 900,  y2: 30,  w: 1,   delay: 0.05, op: 0.18 },
    { x1: 150,  y1: 900, x2: 1100, y2: 80,  w: 0.5, delay: 0.2,  op: 0.12 },
    { x1: 500,  y1: 920, x2: 1550, y2: 250, w: 1,   delay: 0.35, op: 0.2  },
    { x1: -100, y1: 420, x2: 750,  y2: 190, w: 0.5, delay: 0.15, op: 0.1  },
    { x1: 350,  y1: -20, x2: 1600, y2: 550, w: 1,   delay: 0.4,  op: 0.15 },
    { x1: -50,  y1: 700, x2: 950,  y2: 380, w: 0.5, delay: 0.55, op: 0.1  },
    { x1: 650,  y1: -30, x2: 1500, y2: 480, w: 0.8, delay: 0.1,  op: 0.12 },
    { x1: 100,  y1: 820, x2: 820,  y2: 520, w: 0.5, delay: 0.3,  op: 0.08 },
  ]
  const goldLines = [
    { x1: 280, y1: -20, x2: 1050, y2: 480, delay: 0.7, op: 0.25 },
    { x1: -80, y1: 350, x2: 560,  y2: 650, delay: 0.9, op: 0.2  },
  ]
  const sparkles = [
    { cx: 430, cy: 290, delay: 0.9  },
    { cx: 820, cy: 410, delay: 1.1  },
    { cx: 290, cy: 540, delay: 1.3  },
    { cx: 970, cy: 165, delay: 0.85 },
    { cx: 610, cy: 700, delay: 1.05 },
    { cx: 1100,cy: 380, delay: 1.2  },
  ]

  return (
    <div className="shahy-intro" data-phase={phase}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Cinzel:wght@400&family=Cormorant+Garamond:ital,wght@1,300&display=swap');
        @keyframes si-auto-dismiss {
          0%, 82% { opacity: 1; pointer-events: all; }
          96%     { opacity: 0; pointer-events: none; }
          100%    { opacity: 0; pointer-events: none; visibility: hidden; }
        }
        .shahy-intro {
          position: fixed; inset: 0; z-index: 99999;
          background: #0A0806;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          opacity: 1; transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1);
          pointer-events: all;
          animation: si-auto-dismiss 7s ease forwards;
        }
        .shahy-intro[data-phase="out"] { opacity: 0; pointer-events: none; animation: none; }
        .shahy-intro[data-phase="gone"] { display: none; }
        @keyframes si-draw {
          from { stroke-dashoffset: 2200; opacity: 0; }
          10%  { opacity: 1; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes si-gold-draw {
          from { stroke-dashoffset: 2200; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 0.4; }
        }
        @keyframes si-crown {
          from { opacity: 0; transform: translateY(-12px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes si-crown-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(201,168,76,0.3)); }
          50%       { filter: drop-shadow(0 0 14px rgba(240,216,130,0.7)); }
        }
        @keyframes si-wordmark {
          from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes si-shimmer {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        @keyframes si-sub {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 0.55; transform: translateY(0); }
        }
        @keyframes si-credit {
          from { opacity: 0; }
          to   { opacity: 0.22; }
        }
        @keyframes si-bar {
          from { width: 0; }
          to   { width: 180px; }
        }
        @keyframes si-spark {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50%       { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes si-glow {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.12); }
        }
        .si-crown    { animation: si-crown 0.7s cubic-bezier(0.2,0,0.2,1) 0.5s both; }
        .si-svg-icon { animation: si-crown-pulse 3s ease 1.5s infinite; }
        .si-wordmark { animation: si-wordmark 0.9s cubic-bezier(0.2,0,0.2,1) 0.9s both; }
        .si-shah     {
          font-family: 'Playfair Display', serif; font-size: clamp(56px, 8vw, 88px);
          font-weight: 700; letter-spacing: 2px;
          background: linear-gradient(135deg, #A07030 0%, #C9A84C 35%, #F0D882 55%, #C9A84C 75%, #A07030 100%);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: si-shimmer 5s linear 1.8s infinite;
        }
        .si-y {
          font-family: 'Playfair Display', serif; font-size: clamp(56px, 8vw, 88px);
          font-weight: 700; font-style: italic; color: #F0D882; letter-spacing: 2px;
        }
        .si-store {
          font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 10px;
          color: #666; text-transform: uppercase;
          animation: si-sub 0.7s ease 1.5s both;
        }
        .si-bar {
          height: 1px; width: 0;
          background: linear-gradient(90deg, transparent, #C9A84C 25%, #F0D882 50%, #C9A84C 75%, transparent);
          animation: si-bar 0.8s ease 1.7s forwards;
        }
        .si-by {
          font-family: 'Cormorant Garamond', serif; font-size: 15px;
          font-weight: 300; font-style: italic; color: #F5EFE0; letter-spacing: 1px;
          animation: si-sub 0.7s ease 2s both;
        }
        .si-credit {
          font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 3px;
          color: #3a3530; text-transform: uppercase;
          animation: si-credit 0.7s ease 2.3s both;
        }
        .si-glow-orb {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
          animation: si-glow 3s ease infinite;
          pointer-events: none;
        }
      `}</style>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {lines.map((l, i) => {
          const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1)
          return <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#7B1C2E" strokeWidth={l.w} strokeDasharray={len + 200}
            style={{ strokeDashoffset: len + 200, opacity: l.op,
              animation: `si-draw 1.4s cubic-bezier(0.4,0,0.2,1) ${l.delay}s forwards` }} />
        })}
        {goldLines.map((l, i) => {
          const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1)
          return <line key={`g${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#C9A84C" strokeWidth={0.6} strokeDasharray={len + 200}
            style={{ strokeDashoffset: len + 200, opacity: l.op,
              animation: `si-gold-draw 1.8s ease ${l.delay}s forwards` }} />
        })}
        {sparkles.map((s, i) => (
          <g key={`sp${i}`} transform={`translate(${s.cx},${s.cy})`}>
            <polygon points="0,-5 3.5,0 0,5 -3.5,0" fill="#C9A84C"
              style={{ opacity: 0, animation: `si-spark 2.2s ease ${s.delay}s infinite` }} />
          </g>
        ))}
        <line x1="0" y1="450" x2="1440" y2="450"
          stroke="#C9A84C" strokeWidth="0.4" strokeDasharray="1500"
          style={{ strokeDashoffset: 1500, animation: "si-draw 2s ease 0.6s forwards", opacity: 0.12 }} />
      </svg>

      <div className="si-glow-orb" />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="si-crown" style={{ marginBottom: 16 }}>
          <svg className="si-svg-icon" width="120" height="64" viewBox="0 0 120 64" fill="none"
            style={{ display: "block", margin: "0 auto" }}>
            <path d="M5 60L18 18L38 42L60 5L82 42L102 18L115 60Z"
              stroke="url(#siGold)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="5"   cy="60" r="3.5" fill="#C9A84C" />
            <circle cx="115" cy="60" r="3.5" fill="#C9A84C" />
            <circle cx="60"  cy="5"  r="4"   fill="#F0D882" />
            <circle cx="38"  cy="42" r="2.5" fill="#C9A84C" opacity="0.7" />
            <circle cx="82"  cy="42" r="2.5" fill="#C9A84C" opacity="0.7" />
            <line x1="5" y1="60" x2="115" y2="60" stroke="url(#siGold)" strokeWidth="1.5" />
            <path d="M22 60L32 38L44 50L60 28L76 50L88 38L98 60"
              stroke="#C9A84C" strokeWidth="0.6" fill="none" strokeLinejoin="round" opacity="0.4" />
            <defs>
              <linearGradient id="siGold" x1="0" y1="0" x2="120" y2="0">
                <stop offset="0%"   stopColor="#8B6020" />
                <stop offset="30%"  stopColor="#C9A84C" />
                <stop offset="55%"  stopColor="#F0D882" />
                <stop offset="75%"  stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#8B6020" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="si-wordmark" style={{ lineHeight: 1, marginBottom: 4 }}>
          <span className="si-shah">Shah</span>
          <span className="si-y">Y</span>
        </div>

        <div className="si-store" style={{ marginBottom: 20 }}>STORE</div>

        <div className="si-bar" style={{ margin: "0 auto 18px" }} />

        <div className="si-by" style={{ marginBottom: 8 }}>by Shahenda Souliman</div>

        <div className="si-credit">designed by ahmed darhous</div>
      </div>

      {/* Skip button */}
      <button onClick={skip} style={{
        position: "absolute", bottom: 32, right: 40,
        fontFamily: "Cinzel, serif", fontSize: 9, letterSpacing: "4px",
        color: "#C9A84C", opacity: 0.3, background: "none", border: "none",
        cursor: "pointer", textTransform: "uppercase",
        animation: "si-credit 0.7s ease 2s both",
        transition: "opacity 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "0.3")}
      >
        SKIP ›
      </button>
    </div>
  )
}
