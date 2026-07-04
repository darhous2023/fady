"use client"

import { useEffect, useState } from "react"

interface LoadingIntroProps {
  duration?: number
  logoUrl?: string
  tagline?: string
}

export default function LoadingIntro({ duration = 2200, logoUrl, tagline }: LoadingIntroProps) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in")

  function skip() {
    setPhase("out")
    setTimeout(() => {
      setPhase("gone")
      try { sessionStorage.setItem("elfady-intro", "1") } catch {}
    }, 550)
  }

  useEffect(() => {
    try { if (sessionStorage.getItem("elfady-intro")) { setPhase("gone"); return } } catch {}
    const t1 = setTimeout(() => setPhase("out"), duration)
    const t2 = setTimeout(() => {
      setPhase("gone")
      try { sessionStorage.setItem("elfady-intro", "1") } catch {}
    }, duration + 550)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [duration])

  if (phase === "gone") return null

  return (
    <div className="ei-intro" data-phase={phase}>
      <style>{`
        .ei-intro {
          position: fixed; inset: 0; z-index: 99999;
          background: #0A0A0A;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          opacity: 1; transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1);
          pointer-events: all;
        }
        .ei-intro[data-phase="out"] { opacity: 0; pointer-events: none; }
        .ei-intro[data-phase="gone"] { display: none; }

        .ei-line {
          position: absolute; top: 50%; left: 50%;
          width: min(70vw, 560px); height: 1px;
          background: linear-gradient(90deg, transparent, rgba(155,163,170,0.55) 50%, transparent);
          transform: translate(-50%, -50%) scaleX(0);
          animation: ei-line 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        @keyframes ei-line { from { transform: translate(-50%,-50%) scaleX(0); } to { transform: translate(-50%,-50%) scaleX(1); } }

        .ei-logo {
          position: relative; z-index: 1;
          width: clamp(52px, 8vw, 76px); height: clamp(52px, 8vw, 76px);
          border-radius: 14px; object-fit: cover;
          margin: 0 auto 20px; display: block;
          opacity: 0; filter: blur(6px); transform: scale(0.9);
          animation: ei-logo 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s both;
        }
        @keyframes ei-logo {
          from { opacity: 0; filter: blur(6px); transform: scale(0.9); }
          to   { opacity: 1; filter: blur(0); transform: scale(1); }
        }

        .ei-word {
          position: relative; z-index: 1;
          font-family: Tajawal, sans-serif; font-weight: 900;
          font-size: clamp(40px, 8vw, 64px);
          letter-spacing: 0.5em; color: #F2F0EC;
          opacity: 0; filter: blur(6px);
          animation: ei-word 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both;
        }
        @keyframes ei-word {
          from { opacity: 0; letter-spacing: 0.9em; filter: blur(6px); }
          to   { opacity: 1; letter-spacing: 0.08em; filter: blur(0); }
        }

        .ei-sub {
          font-family: Tajawal, sans-serif; font-weight: 400; font-size: 12px;
          letter-spacing: 6px; color: rgba(242,240,236,0.4);
          opacity: 0; margin-top: 14px; text-align: center;
          animation: ei-fade 0.6s ease 1.05s both;
        }
        @keyframes ei-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 0.75; transform: translateY(0); } }

        .ei-bar {
          height: 1px; width: 0; margin: 22px auto 0;
          background: rgba(155,163,170,0.6);
          animation: ei-bar 0.7s cubic-bezier(0.22,1,0.36,1) 1.15s forwards;
        }
        @keyframes ei-bar { from { width: 0; } to { width: 88px; } }

        .ei-skip {
          position: absolute; bottom: 32px; inset-inline-end: 32px;
          font-family: Tajawal, sans-serif; font-size: 11px; letter-spacing: 3px;
          color: #9BA3AA; opacity: 0.35; background: none; border: none;
          cursor: pointer; transition: opacity 0.2s ease;
        }
        .ei-skip:hover { opacity: 0.8; }

        .ei-credit {
          position: absolute; bottom: 28px; left: 0; right: 0;
          text-align: center;
          font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 1px;
          color: rgba(155,163,170,0.35);
          opacity: 0;
          animation: ei-credit-fade 1s ease 1.6s both;
        }
        @keyframes ei-credit-fade { from { opacity: 0; } to { opacity: 1; } }

        @media (prefers-reduced-motion: reduce) {
          .ei-line, .ei-logo, .ei-word, .ei-sub, .ei-bar, .ei-credit { animation: none !important; }
          .ei-line { transform: translate(-50%,-50%) scaleX(1); }
          .ei-logo { opacity: 1; filter: blur(0); transform: scale(1); }
          .ei-word { opacity: 1; filter: blur(0); letter-spacing: 0.08em; }
          .ei-sub { opacity: 0.75; transform: none; }
          .ei-bar { width: 88px; }
          .ei-credit { opacity: 1; }
        }
      `}</style>

      <div className="ei-line" />

      <div style={{ textAlign: "center", position: "relative" }}>
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="ei-logo" />
        )}
        <div className="ei-word">ELFADY</div>
        <div className="ei-sub">{tagline || "معرض سيارات"}</div>
        <div className="ei-bar" />
      </div>

      <div className="ei-credit">by Ahmed Darhous</div>

      <button onClick={skip} className="ei-skip" aria-label="تخطي المقدمة">تخطي ›</button>
    </div>
  )
}
