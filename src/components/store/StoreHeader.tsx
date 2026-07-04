"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useCart } from "@/contexts/CartContext"
import SearchOverlay from "./SearchOverlay"

export default function StoreHeader() {
  const [scrolled, setScrolled]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [wlCount, setWlCount]       = useState(0)
  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean } | null>(null)
  const [tagline, setTagline] = useState("حيث تلتقي الفخامة بالثقة")
  const { count } = useCart()

  useEffect(() => {
    fetch("/api/announcement").then(r => r.json()).then(setAnnouncement).catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/api/store-config").then(r => r.json()).then(d => { if (d.intro_tagline_ar) setTagline(d.intro_tagline_ar) }).catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    function syncWl() {
      try { setWlCount(JSON.parse(localStorage.getItem("elfady-wishlist") ?? "[]").length) } catch {}
    }
    syncWl()
    window.addEventListener("storage", syncWl)
    window.addEventListener("elfady-wl-change", syncWl)
    return () => { window.removeEventListener("storage", syncWl); window.removeEventListener("elfady-wl-change", syncWl) }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const showAnnouncement = announcement?.active && !!announcement.text

  return (
    <>
    <style>{`
            .sh-icon-btn { position:relative; background:none; border:none; cursor:pointer; padding:6px; border-radius:8px; transition:background 0.2s; display:flex; align-items:center; justify-content:center; color:#9BA3AA; min-width:44px; min-height:44px; }
      .sh-icon-btn:hover { background:rgba(155,163,170,0.1); }
      .sh-badge { position:absolute; top:-2px; left:-2px; min-width:16px; height:16px; border-radius:8px; background:#A5342C; color:#fff; font-size:9px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 4px; font-family:Tajawal,sans-serif; animation:badgePop 0.25s cubic-bezier(0.34,1.56,0.64,1); }
      @keyframes badgePop { from{transform:scale(0)} to{transform:scale(1)} }
      @keyframes announceFade { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
      @keyframes mobileMenuIn { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
      @keyframes mobileMenuOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(100%)} }
      .sh-mobile-nav { display:none; }
      .sh-desktop-nav { display:flex; }
      .sh-hamburger { display:none; }
      @media (max-width: 768px) {
        .sh-desktop-nav { display:none !important; }
        .sh-hamburger { display:flex !important; }
      }
    `}</style>

    {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

    {/* Announcement bar */}
    {showAnnouncement && (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9001,
        background: "linear-gradient(135deg, #A5342C, #9C4038)",
        borderBottom: "1px solid rgba(155,163,170,0.2)",
        padding: "8px 24px", textAlign: "center",
        animation: "announceFade 0.4s ease both",
      }}>
        <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, fontWeight: 700, color: "#F2F0EC", letterSpacing: "0.3px" }}>
          ✦ &nbsp; {announcement.text} &nbsp; ✦
        </span>
      </div>
    )}

    <header style={{
      position: "fixed", top: showAnnouncement ? 36 : 0, left: 0, right: 0, zIndex: 9000,
      background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(155,163,170,0.12)" : "1px solid transparent",
      transition: "top 0.3s ease, background 0.4s cubic-bezier(0.2,0,0.2,1), backdrop-filter 0.4s cubic-bezier(0.2,0,0.2,1), border-color 0.4s cubic-bezier(0.2,0,0.2,1)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(16px, 4vw, 40px)", height: 64,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-400.png" alt="ELFADY" width={32} height={32} style={{ borderRadius: 6, objectFit: "cover" }} />
        <div>
          <span style={{
            fontFamily: "Tajawal, sans-serif", fontSize: 20, fontWeight: 900,
            background: "linear-gradient(135deg, #9BA3AA, #C9CFD4, #9BA3AA)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            letterSpacing: "1px",
          }}>ELFADY</span>
          <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: 9, color: "#666", letterSpacing: "1px", display: "block", lineHeight: 1.3, marginTop: 1, whiteSpace: "nowrap" }}>{tagline}</span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav className="sh-desktop-nav" style={{ alignItems: "center", gap: 20 }}>
        <a href="/#products" style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.6, textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}>المنتجات</a>

        <a href="/sale" style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#C97169", opacity: 0.85, textDecoration: "none", transition: "opacity 0.2s", fontWeight: 700 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}>العروض</a>

        <a href="/track" style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.6, textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}>تتبّع الحجز</a>

        <a href={`https://wa.me/201555557745?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن منتجاتكم")}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.6, textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}>تواصل معنا</a>

        {/* Search */}
        <button onClick={() => setSearchOpen(true)} className="sh-icon-btn" aria-label="بحث">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        {/* Wishlist */}
        <Link href="/wishlist" className="sh-icon-btn" aria-label="قائمة الأمنيات">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {wlCount > 0 && <span className="sh-badge">{wlCount}</span>}
        </Link>

        {/* Account */}
        <Link href="/account" className="sh-icon-btn" aria-label="حسابي">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </Link>

        {/* Cart */}
        <Link href="/cart" className="sh-icon-btn" aria-label="قائمة المعاينة">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {count > 0 && <span className="sh-badge">{count > 99 ? "99+" : count}</span>}
        </Link>


      </nav>

      {/* Mobile right icons + hamburger */}
      <div className="sh-hamburger" style={{ alignItems: "center", gap: 4 }}>
        <button onClick={() => setSearchOpen(true)} className="sh-icon-btn" aria-label="بحث">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <Link href="/cart" className="sh-icon-btn" aria-label="قائمة المعاينة">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {count > 0 && <span className="sh-badge">{count > 99 ? "99+" : count}</span>}
        </Link>
        <button onClick={() => setMenuOpen(v => !v)} className="sh-icon-btn" aria-label="القائمة"
          style={{ flexDirection: "column", gap: 5, padding: 8 }}>
          <span style={{ display: "block", width: 20, height: 1.5, background: menuOpen ? "#9BA3AA" : "#F2F0EC", transition: "all 0.3s ease", transform: menuOpen ? "translateY(3.25px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: 14, height: 1.5, background: menuOpen ? "transparent" : "#F2F0EC", transition: "all 0.3s ease", opacity: menuOpen ? 0 : 0.8, alignSelf: "flex-end" }} />
          <span style={{ display: "block", width: 20, height: 1.5, background: menuOpen ? "#9BA3AA" : "#F2F0EC", transition: "all 0.3s ease", transform: menuOpen ? "translateY(-3.25px) rotate(-45deg)" : "none" }} />
        </button>
      </div>
    </header>

    {/* Mobile menu overlay */}
    {menuOpen && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 8999,
        background: "rgba(10,10,10,0.96)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, direction: "rtl",
        animation: "mobileMenuIn 0.3s cubic-bezier(0.2,0,0.2,1) both",
      }} onClick={() => setMenuOpen(false)}>
        {[
          { href: "/#products", label: "المنتجات" },
          { href: "/sale",      label: "العروض",   color: "#C97169" },
          { href: "/wishlist",  label: "المفضلة" },
          { href: "/cart",      label: "قائمة المعاينة" },
          { href: "/track",     label: "تتبّع الحجز" },
          { href: "/account",   label: "حسابي" },
        ].map(({ href, label, color }) => (
          <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
            fontFamily: "Tajawal, sans-serif", fontSize: 28, fontWeight: 700,
            color: color || "#F2F0EC", textDecoration: "none",
            padding: "12px 40px", letterSpacing: "0.5px",
            transition: "color 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#9BA3AA"; e.currentTarget.style.transform = "scale(1.05)" }}
            onMouseLeave={e => { e.currentTarget.style.color = color || "#F2F0EC"; e.currentTarget.style.transform = "scale(1)" }}
          >{label}</Link>
        ))}

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <a href={`https://wa.me/201555557745?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن منتجاتكم")}`}
            target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "Tajawal, sans-serif", fontSize: 14, color: "#25a055", textDecoration: "none", border: "1px solid rgba(37,160,85,0.4)", padding: "10px 24px", borderRadius: 8 }}>
            واتساب
          </a>
        </div>
      </div>
    )}
    </>
  )
}
