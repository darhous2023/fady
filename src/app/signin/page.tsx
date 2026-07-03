"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth/client"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        setLoading(false)
        return
      }
      // Check if admin
      const roleRes = await fetch("/api/check-admin")
      const { isAdmin } = await roleRes.json()
      router.push(isAdmin ? "/admin/dashboard" : "/account")
    } catch {
      setError("حدث خطأ، حاول مرة أخرى")
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "#131313", border: "1px solid rgba(155,163,170,0.2)",
    borderRadius: 10, padding: "12px 16px", color: "#F2F0EC",
    fontFamily: "Tajawal,sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box",
  }

  return (
    <>
      <StoreHeader />
      <style>{`* { box-sizing: border-box; } body { margin: 0; background: #0A0A0A; }`}</style>
      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
        <div style={{ width: "100%", maxWidth: 420, padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "Tajawal,sans-serif", fontSize: 10, letterSpacing: "6px", color: "#9BA3AA", opacity: 0.7, marginBottom: 12 }}>✦ &nbsp; ACCOUNT &nbsp; ✦</div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 30, fontWeight: 900, background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0 }}>
              تسجيل الدخول
            </h1>
          </div>

          <div style={{ background: "linear-gradient(145deg,#131313,#141414)", border: "1px solid rgba(155,163,170,0.12)", borderRadius: 16, padding: "32px 24px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#D9776A" }}>
                  {error}
                </div>
              )}
              <div>
                <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.55, marginBottom: 8 }}>البريد الإلكتروني</label>
                <input type="email" required style={inp} dir="ltr" placeholder="example@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.55, marginBottom: 8 }}>كلمة المرور</label>
                <input type="password" required style={inp} dir="ltr" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading}
                style={{
                  marginTop: 8, padding: "14px 24px", background: "linear-gradient(135deg,#9BA3AA,#C9CFD4)",
                  color: "#0A0A0A", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
                  border: "none", borderRadius: 10, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
                  transition: "all 0.2s",
                }}>
                {loading ? "جاري الدخول..." : "دخول"}
              </button>
            </form>
            <div style={{ marginTop: 20, textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F2F0EC", opacity: 0.4 }}>
              مش عندك حساب؟{" "}
              <Link href="/signup" style={{ color: "#9BA3AA", opacity: 1, textDecoration: "none", fontWeight: 700 }}>سجّل الآن</Link>
            </div>
          </div>

          {/* Subtle admin hint */}
          <div style={{ marginTop: 16, textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 11, color: "#F2F0EC", opacity: 0.18 }}>
            للأدمن: ادخل ببيانات الأدمن وهيتحول للوحة التحكم تلقائياً
          </div>
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
