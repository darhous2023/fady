"use client"

import { useEffect, useState } from "react"

const DEFAULT_WA = "201555557745"
const FACEBOOK = "https://www.facebook.com/elfadywaelmeladcars"
const INSTAGRAM_SHOWROOM = "https://www.instagram.com/el_fady_car_trading/"
const INSTAGRAM_MANAGER = "https://www.instagram.com/fadywael_1/"
const MAPS = "https://share.google/LGW6xLBwVygbOUn0I"
const ADDRESS = "المهندسين — شارع أحمد عرابي — معرض الفادي لتجارة السيارات"

// Developer credit — Ahmed Darhous (site builder), separate from the elfady business socials above.
const DEV_SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/darhous/",
    path: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/darhous/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ahmed.darhous",
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/201030002331",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  },
  {
    name: "GitHub",
    href: "https://github.com/darhous",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
] as const

const DEV_PHONE_DISPLAY = "+20 103 000 2331"
const DEV_PHONE_TEL = "tel:+201030002331"
const DEV_EMAIL = "ahmeddarhous@gmail.com"
const DEV_EMAIL_MAILTO = "mailto:ahmeddarhous@gmail.com"

export default function StoreFooter() {
  const [tagline, setTagline] = useState("حيث تلتقي الفخامة بالثقة")
  const [WA, setWA] = useState(DEFAULT_WA)

  useEffect(() => {
    fetch("/api/store-config").then(r => r.json()).then(d => {
      if (d.intro_tagline_ar) setTagline(d.intro_tagline_ar)
      if (d.whatsapp_number) setWA(d.whatsapp_number.replace(/\D/g, ""))
    }).catch(() => {})
  }, [])

  return (
    <footer style={{
      background: "#0D0D0D", borderTop: "1px solid #171717",
      padding: "64px 40px 40px", direction: "rtl",
    }}>
      <style>{`
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

        .sf-dev-icon {
          width: 34px; height: 34px; border-radius: 8px;
          display: inline-flex; align-items: center; justify-content: center;
          color: #6b7076; transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .sf-dev-icon:hover { color: #C9CFD4; background: rgba(155,163,170,0.08); transform: translateY(-2px); }
        .sf-dev-name { color: #9BA3AA; text-decoration: none; font-weight: 700; transition: color 0.2s ease; }
        .sf-dev-name:hover { color: #C9CFD4; text-decoration: underline; text-underline-offset: 3px; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top columns */}
        <div style={{ display: "flex", gap: 80, flexWrap: "wrap", marginBottom: 56 }}>

          {/* Brand column */}
          <div style={{ flex: "0 0 280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-400.png" alt="ELFADY" width={30} height={30} style={{ borderRadius: 6, objectFit: "cover" }} />
              <div>
                <span style={{
                  fontFamily: "Tajawal, sans-serif", fontSize: 22, fontWeight: 900,
                  background: "linear-gradient(135deg,#9BA3AA,#C9CFD4,#9BA3AA)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>ELFADY</span>
                <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 10, color: "#666", letterSpacing: "0.5px", display: "block", lineHeight: 1.3, marginTop: 1 }}>{tagline}</span>
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
              <a href="/guide" className="sf-link">دليل المعرض</a>
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
              <a href="/returns" className="sf-link">سياسة الحجز والإلغاء</a>
              <a href="/privacy" className="sf-link">سياسة الخصوصية</a>
              <a href="/faq" className="sf-link">الأسئلة الشائعة</a>
            </div>
          </div>

          {/* Contact column */}
          <div style={{ flex: "0 0 200px" }}>
            <h4 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, fontWeight: 700, color: "#9BA3AA", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
              تواصل معنا
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="sf-dicon sf-dicon-wa" aria-label="واتساب" title="واتساب">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10c0 5 3.5 7.5 7.5 7.5"/>
                </svg>
              </a>
              <a href={INSTAGRAM_SHOWROOM} target="_blank" rel="noopener noreferrer" className="sf-dicon" aria-label="إنستجرام المعرض" title="إنستجرام المعرض">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#9BA3AA"/>
                </svg>
              </a>
              <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="sf-dicon" aria-label="فيسبوك" title="فيسبوك">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9BA3AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
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

        {/* Developer credit bar */}
        <div style={{
          borderTop: "1px solid #171717", marginTop: 28, paddingTop: 24,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            {DEV_SOCIALS.map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                title={s.name}
                className="sf-dev-icon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
            <span style={{ width: 1, height: 16, background: "#232323", margin: "0 4px" }} />
            <a href={DEV_PHONE_TEL} className="sf-dev-icon" aria-label={`اتصل بنا: ${DEV_PHONE_DISPLAY}`} title={DEV_PHONE_DISPLAY}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
              </svg>
            </a>
            <a href={DEV_EMAIL_MAILTO} className="sf-dev-icon" aria-label={`راسلنا: ${DEV_EMAIL}`} title={DEV_EMAIL}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>
              </svg>
            </a>
          </div>

          <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, color: "#4d4d4d", margin: 0, direction: "ltr" }}>
            Designed &amp; Developed by <a href={DEV_EMAIL_MAILTO} className="sf-dev-name">Ahmed Darhous</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
