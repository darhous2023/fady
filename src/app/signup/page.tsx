"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth/client"
import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return }
    setLoading(true)
    try {
      const result = await signUp.email({ name, email, password, callbackURL: "/account" })
      if (result.error) { setError("هذا البريد الإلكتروني مسجّل مسبقاً"); return }
      router.push("/account")
    } catch {
      setError("حدث خطأ، حاول مرة أخرى")
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "#0E0C09", border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 10, padding: "12px 16px", color: "#F5EFE0",
    fontFamily: "Tajawal,sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box",
  }

  return (
    <>
      <StoreHeader />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Cinzel&display=swap'); * { box-sizing: border-box; } body { margin: 0; background: #0A0806; }`}</style>
      <main style={{ background: "#0A0806", minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
        <div style={{ width: "100%", maxWidth: 420, padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: 10, letterSpacing: "6px", color: "#C9A84C", opacity: 0.7, marginBottom: 12 }}>✦ &nbsp; JOIN US &nbsp; ✦</div>
            <h1 style={{ fontFamily: "Tajawal,sans-serif", fontSize: 30, fontWeight: 900, background: "linear-gradient(135deg,#C9A84C,#F0D882)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0 }}>
              إنشاء حساب
            </h1>
          </div>

          <div style={{ background: "linear-gradient(145deg,#0E0C09,#111009)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 16, padding: "32px 24px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#f87171" }}>
                  {error}
                </div>
              )}
              <div>
                <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>الاسم</label>
                <input required style={inp} placeholder="اسمك الكامل"
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>البريد الإلكتروني</label>
                <input type="email" required style={inp} dir="ltr" placeholder="example@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.55, marginBottom: 8 }}>كلمة المرور (8 أحرف على الأقل)</label>
                <input type="password" required style={inp} dir="ltr" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading}
                style={{
                  marginTop: 8, padding: "14px 24px", background: "linear-gradient(135deg,#C9A84C,#F0D882)",
                  color: "#0A0806", fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: 15,
                  border: "none", borderRadius: 10, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
                }}>
                {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
              </button>
            </form>
            <div style={{ marginTop: 20, textAlign: "center", fontFamily: "Tajawal,sans-serif", fontSize: 13, color: "#F5EFE0", opacity: 0.4 }}>
              عندك حساب بالفعل؟{" "}
              <Link href="/signin" style={{ color: "#C9A84C", opacity: 1, textDecoration: "none", fontWeight: 700 }}>سجّل دخول</Link>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </>
  )
}
