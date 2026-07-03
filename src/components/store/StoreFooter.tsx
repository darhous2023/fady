"use client"
export default function StoreFooter() {
  return (
    <footer style={{
      background: "#060504", borderTop: "1px solid #151210",
      padding: "64px 40px 40px", direction: "rtl",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700&family=Cinzel:wght@400&family=Playfair+Display:wght@700&display=swap');
        .sf-link { color: #F5EFE0; opacity: 0.45; text-decoration: none; transition: opacity 0.2s; display: flex; align-items: center; gap: 8px; font-family: Tajawal, sans-serif; font-size: 14px; }
        .sf-link:hover { opacity: 0.9; }
        .sf-social { display: flex; align-items: center; gap: 10px; text-decoration: none; transition: opacity 0.2s; }
        .sf-social:hover { opacity: 0.85; }

        .sf-dicon {
          width: 36px; height: 36px; border-radius: 10px;
          display: inline-flex; align-items: center; justify-content: center;
          text-decoration: none; transition: all 0.3s cubic-bezier(0.2,0,0.2,1);
          flex-shrink: 0;
          background: rgba(201,168,76,0.05);
          border: 1px solid rgba(201,168,76,0.1);
        }
        .sf-dicon:hover {
          transform: translateY(-3px) scale(1.08);
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.35);
          box-shadow: 0 8px 28px rgba(201,168,76,0.15);
        }
        .sf-dicon-ig {}
        .sf-dicon-li {}
        .sf-dicon-fb {}
        .sf-dicon-wa {}
        .sf-dicon-wa:hover { box-shadow: 0 8px 28px rgba(37,211,102,0.15); border-color: rgba(37,211,102,0.3); }
        .sf-designer-link {
          font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 3px;
          color: #F5EFE0; opacity: 0.38; text-decoration: none;
          transition: opacity 0.25s ease;
        }
        .sf-designer-link:hover { opacity: 0.8; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top columns */}
        <div style={{ display: "flex", gap: 80, flexWrap: "wrap", marginBottom: 56 }}>

          {/* Brand column */}
          <div style={{ flex: "0 0 260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="32" height="18" viewBox="0 0 120 64" fill="none">
                <path d="M5 60L18 18L38 42L60 5L82 42L102 18L115 60Z"
                  stroke="url(#fGold)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
                <circle cx="60" cy="5" r="4" fill="#F0D882"/>
                <line x1="5" y1="60" x2="115" y2="60" stroke="url(#fGold)" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="fGold" x1="0" y1="0" x2="120" y2="0">
                    <stop offset="0%" stopColor="#8B6020"/>
                    <stop offset="50%" stopColor="#F0D882"/>
                    <stop offset="100%" stopColor="#8B6020"/>
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <span style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
                  background: "linear-gradient(135deg,#C9A84C,#F0D882,#C9A84C)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>ShahY</span>
                <span style={{ fontFamily: "Cinzel, serif", fontSize: 10, color: "#666", letterSpacing: "4px", display: "block", lineHeight: 1, marginTop: 1 }}>STORE</span>
              </div>
            </div>
            <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.35, lineHeight: 1.8, marginBottom: 24 }}>
              أرقى الإكسسوارات النسائية المستوردة — شنط، محافظ، وشوزات بأفضل الأسعار.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="https://www.instagram.com/shah.ystore/" target="_blank" rel="noopener noreferrer" className="sf-social"
                style={{ opacity: 0.55 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#C9A84C" }}>
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F5EFE0" }}>@shah.ystore</span>
              </a>
              <a href="https://wa.me/201015835455" target="_blank" rel="noopener noreferrer" className="sf-social"
                style={{ opacity: 0.55 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#C9A84C" }}>
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                  <path d="M9 10c0 5 3.5 7.5 7.5 7.5"/>
                </svg>
                <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F5EFE0" }}>+201015835455</span>
              </a>
            </div>
          </div>

          {/* Links column */}
          <div style={{ flex: "0 0 160px" }}>
            <h4 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, fontWeight: 700, color: "#C9A84C", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              المتجر
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="/#products" className="sf-link">المنتجات</a>
              <a href="/sale" className="sf-link">
                <span style={{ color: "#7B1C2E", fontWeight: 700, fontSize: 10, background: "rgba(123,28,46,0.12)", padding: "1px 5px", borderRadius: 4 }}>SALE</span>
                العروض
              </a>
              <a href="/track" className="sf-link">تتبّع طلبك</a>
              <a href="/wishlist" className="sf-link">قائمة الأمنيات</a>
              <a href="/cart" className="sf-link">سلة الشراء</a>
              <a href="/about" className="sf-link">عن ShahY</a>
              <a href={`https://wa.me/201015835455?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن منتجاتكم")}`}
                target="_blank" rel="noopener noreferrer" className="sf-link">تواصل معنا</a>
            </div>
          </div>

          {/* Policy column */}
          <div style={{ flex: "0 0 160px" }}>
            <h4 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, fontWeight: 700, color: "#C9A84C", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              سياساتنا
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="/returns" className="sf-link">الاسترجاع والاستبدال</a>
              <a href="/privacy" className="sf-link">سياسة الخصوصية</a>
            </div>
          </div>

          {/* Help column */}
          <div style={{ flex: "0 0 160px" }}>
            <h4 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, fontWeight: 700, color: "#C9A84C", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              خدمة العملاء
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="/faq" className="sf-link">الأسئلة الشائعة</a>
              <a href="/track" className="sf-link">تتبّع طلبك</a>
              <a href={`https://wa.me/201015835455?text=${encodeURIComponent("السلام عليكم، أريد المساعدة")}`}
                target="_blank" rel="noopener noreferrer" className="sf-link">
                دعم واتساب
              </a>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{
          borderTop: "1px solid #151210", paddingTop: 24, marginBottom: 28,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap",
        }}>
          <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 11, color: "rgba(245,239,224,0.2)", letterSpacing: "1px" }}>
            الدفع المتاح:
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8, padding: "6px 14px",
            fontFamily: "Tajawal, sans-serif", fontSize: 12, color: "rgba(245,239,224,0.35)",
          }}>
            💵 الدفع عند الاستلام (كاش)
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(37,160,85,0.05)", border: "1px solid rgba(37,160,85,0.12)",
            borderRadius: 8, padding: "6px 14px",
            fontFamily: "Tajawal, sans-serif", fontSize: 12, color: "rgba(37,160,85,0.5)",
          }}>
            📱 تحويل إنستاباي
          </div>
        </div>

        {/* ── Designer bottom strip ── */}
        <div style={{
          borderTop: "1px solid #151210", paddingTop: 36,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Instagram */}
            <a href="https://www.instagram.com/darhous/" target="_blank" rel="noopener noreferrer"
              className="sf-dicon sf-dicon-ig" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="#C9A84C"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/darhous/" target="_blank" rel="noopener noreferrer"
              className="sf-dicon sf-dicon-li" title="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/ahmed.darhous" target="_blank" rel="noopener noreferrer"
              className="sf-dicon sf-dicon-fb" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/201030002331" target="_blank" rel="noopener noreferrer"
              className="sf-dicon sf-dicon-wa" title="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                <path d="M9 10c0 5 3.5 7.5 7.5 7.5"/>
              </svg>
            </a>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 8, letterSpacing: "3px", color: "#252018", textTransform: "uppercase", marginBottom: 6 }}>
              designed &amp; developed by
            </div>
            <a href="https://www.instagram.com/darhous/" target="_blank" rel="noopener noreferrer"
              className="sf-designer-link">
              Ahmed Darhous
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <p style={{ fontFamily: "Cinzel, serif", fontSize: 7, letterSpacing: "4px", color: "#1c1914", textTransform: "uppercase" }}>
              © 2025 ShahY Store — All rights reserved
            </p>
            {/* Hidden admin entry — not for public eyes */}
            <a href="/admin/login" title="." style={{
              opacity: 0.06, fontSize: 9, color: "#C9A84C",
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
      </div>
    </footer>
  )
}
