import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "40px 24px",
      direction: "rtl",
    }}>
      <style>{`
                @keyframes floatIcon { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes nfShimmer { from{background-position:200% center} to{background-position:-200% center} }
      `}</style>

      <div style={{ animation: "floatIcon 3s ease-in-out infinite", marginBottom: 32 }}>
        <svg width="80" height="44" viewBox="0 0 120 64" fill="none">
          <path d="M5 60L18 18L38 42L60 5L82 42L102 18L115 60Z"
            stroke="url(#nfGold)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
          <circle cx="60" cy="5" r="4" fill="#C9CFD4"/>
          <line x1="5" y1="60" x2="115" y2="60" stroke="url(#nfGold)" strokeWidth="1.5"/>
          <defs>
            <linearGradient id="nfGold" x1="0" y1="0" x2="120" y2="0">
              <stop offset="0%" stopColor="#5C6167"/>
              <stop offset="50%" stopColor="#C9CFD4"/>
              <stop offset="100%" stopColor="#5C6167"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div style={{
        fontFamily: "Tajawal, sans-serif", fontSize: 80, fontWeight: 700, lineHeight: 1,
        background: "linear-gradient(135deg, #6E747A, #9BA3AA, #C9CFD4, #9BA3AA, #6E747A)",
        backgroundSize: "300% auto",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        animation: "nfShimmer 4s linear infinite",
        marginBottom: 8,
      }}>404</div>

      <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 10, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.5, marginBottom: 20 }}>
        PAGE NOT FOUND
      </div>

      <h1 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 24, fontWeight: 700, color: "#F2F0EC", marginBottom: 12 }}>
        الصفحة غير موجودة
      </h1>
      <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 15, color: "rgba(242,240,236,0.45)", marginBottom: 40, maxWidth: 360, lineHeight: 1.8 }}>
        يبدو إن الصفحة دي اتنقلت أو مش موجودة. ارجعي للصفحة الرئيسية وابدأي من هناك.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{
          fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 15,
          padding: "13px 36px", borderRadius: 8, textDecoration: "none",
          background: "linear-gradient(135deg, #9BA3AA, #C9CFD4)", color: "#0A0A0A",
          boxShadow: "0 8px 28px rgba(155,163,170,0.3)",
        }}>
          الصفحة الرئيسية
        </Link>
        <Link href="/sale" style={{
          fontFamily: "Tajawal, sans-serif", fontWeight: 700, fontSize: 15,
          padding: "13px 32px", borderRadius: 8, textDecoration: "none",
          background: "transparent", color: "#F2F0EC",
          border: "1px solid rgba(155,163,170,0.3)",
        }}>
          العروض
        </Link>
      </div>
    </div>
  )
}
