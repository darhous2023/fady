"use client"

const WA = "201555557745"
const FACEBOOK = "https://www.facebook.com/elfadywaelmeladcars"
const INSTAGRAM_SHOWROOM = "https://www.instagram.com/el_fady_car_trading/"
const INSTAGRAM_MANAGER = "https://www.instagram.com/fadywael_1/"
const MAPS = "https://share.google/LGW6xLBwVygbOUn0I"
const ADDRESS = "المهندسين — شارع أحمد عرابي — معرض الفادي لتجارة السيارات"

export default function StoreFooter() {
  return (
    <footer style={{
      background: "#0D0D0D", borderTop: "1px solid #171717",
      padding: "64px 40px 40px", direction: "rtl",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap');
        .sf-link { color: #F2F0EC; opacity: 0.45; text-decoration: none; transition: opacity 0.2s; display: flex; align-items: center; gap: 8px; font-family: Tajawal, sans-serif; font-size: 14px; }
        .sf-link:hover { opacity: 0.9; }
        .sf-social { display: flex; align-items: center; gap: 10px; text-decoration: none; transition: opacity 0.2s; }
        .sf-social:hover { opacity: 0.85; }

        .sf-dicon {
          width: 40px; height: 40px; border-radius: 10px;
          display: inline-flex; align-items: center; justify-content: center;
          text-decoration: none; transition: all 0.3s cubic-bezier(0.2,0,0.2,1);
          flex-shrink: 0;
          background: rgba(155,163,170,0.05);
          border: 1px solid rgba(155,163,170,0.1);
        }
        .sf-dicon:hover {
          transform: translateY(-3px) scale(1.08);
          background: rgba(155,163,170,0.12);
          border-color: rgba(155,163,170,0.35);
          box-shadow: 0 8px 28px rgba(155,163,170,0.15);
        }
        .sf-dicon-wa:hover { box-shadow: 0 8px 28px rgba(37,211,102,0.15); border-color: rgba(37,211,102,0.3); }
        .sf-credit {
          font-family: Tajawal, sans-serif; font-size: 10px; letter-spacing: 2px;
          color: #F2F0EC; opacity: 0.25;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top columns */}
        <div style={{ display: "flex", gap: 80, flexWrap: "wrap", marginBottom: 56 }}>

          {/* Brand column */}
          <div style={{ flex: "0 0 280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="32" height="18" viewBox="0 0 120 64" fill="none">
                <path d="M5 60L18 18L38 42L60 5L82 42L102 18L115 60Z"
                  stroke="url(#fSteel)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
                <circle cx="60" cy="5" r="4" fill="#C9CFD4"/>
                <line x1="5" y1="60" x2="115" y2="60" stroke="url(#fSteel)" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="fSteel" x1="0" y1="0" x2="120" y2="0">
                    <stop offset="0%" stopColor="#5C6167"/>
                    <stop offset="50%" stopColor="#C9CFD4"/>
                    <stop offset="100%" stopColor="#5C6167"/>
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <span style={{
                  fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900,
                  background: "linear-gradient(135deg,#9BA3AA,#C9CFD4,#9BA3AA)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>ELFADY</span>
                <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 10, color: "#666", letterSpacing: "3px", display: "block", lineHeight: 1, marginTop: 1 }}>معرض سيارات</span>
              </div>
            </div>
            <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.35, lineHeight: 1.8, marginBottom: 20 }}>
              معرض الفادي لتجارة السيارات — سيارات جديدة ومستعملة بثقة وشفافية.
            </p>
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className="sf-link" style={{ marginBottom: 4, alignItems: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ opacity: 0.7 }}>{ADDRESS}</span>
            </a>
          </div>

          {/* Links column */}
          <div style={{ flex: "0 0 160px" }}>
            <h4 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, fontWeight: 700, color: "#9BA3AA", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              المعرض
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="/new" className="sf-link">سيارات جديدة</a>
              <a href="/used" className="sf-link">سيارات مستعملة</a>
              <a href="/about" className="sf-link">من نحن</a>
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار")}`}
                target="_blank" rel="noopener noreferrer" className="sf-link">تواصل معنا</a>
            </div>
          </div>

          {/* Policy column */}
          <div style={{ flex: "0 0 160px" }}>
            <h4 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, fontWeight: 700, color: "#9BA3AA", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              سياساتنا
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="/returns" className="sf-link">الاسترجاع والاستبدال</a>
              <a href="/privacy" className="sf-link">سياسة الخصوصية</a>
              <a href="/faq" className="sf-link">الأسئلة الشائعة</a>
            </div>
          </div>

          {/* Contact column */}
          <div style={{ flex: "0 0 200px" }}>
            <h4 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, fontWeight: 700, color: "#9BA3AA", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              تواصل معنا
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="sf-social" style={{ opacity: 0.6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10c0 5 3.5 7.5 7.5 7.5"/>
                </svg>
                <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F2F0EC" }}>+{WA}</span>
              </a>
              <a href={INSTAGRAM_SHOWROOM} target="_blank" rel="noopener noreferrer" className="sf-social" style={{ opacity: 0.6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#9BA3AA"/>
                </svg>
                <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F2F0EC" }}>@el_fady_car_trading</span>
              </a>
              <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="sf-social" style={{ opacity: 0.6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F2F0EC" }}>فيسبوك</span>
              </a>
            </div>
          </div>
        </div>

        {/* Social icon row */}
        <div style={{
          borderTop: "1px solid #171717", paddingTop: 28, marginBottom: 28,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap",
        }}>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="sf-dicon sf-dicon-wa" title="واتساب">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10c0 5 3.5 7.5 7.5 7.5"/>
            </svg>
          </a>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="sf-dicon" title="فيسبوك">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href={INSTAGRAM_SHOWROOM} target="_blank" rel="noopener noreferrer" className="sf-dicon" title="إنستجرام المعرض">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#9BA3AA"/>
            </svg>
          </a>
          <a href={INSTAGRAM_MANAGER} target="_blank" rel="noopener noreferrer" className="sf-dicon" title="إنستجرام المدير">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </a>
          <a href={MAPS} target="_blank" rel="noopener noreferrer" className="sf-dicon" title="الموقع على الخريطة">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </a>
        </div>

        {/* Bottom strip */}
        <div style={{
          borderTop: "1px solid #171717", paddingTop: 28,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <p className="sf-credit" style={{ textTransform: "uppercase" }}>
            © {new Date().getFullYear()} ELFADY — جميع الحقوق محفوظة
          </p>
          {/* Hidden admin entry — not for public eyes */}
          <a href="/admin/login" title="." style={{
            opacity: 0.06, fontSize: 9, color: "#9BA3AA",
            textDecoration: "none", lineHeight: 1, transition: "opacity 0.3s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.35")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.06")}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
