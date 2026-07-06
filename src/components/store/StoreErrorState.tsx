import { touchTarget } from "@/lib/designTokens"

// Shared "couldn't load right now" state for public pages whose main DB
// query fails. Distinct from a genuine empty result (0 rows) — this is only
// shown when the query itself threw. The real error is logged server-side
// by the caller; this component only ever shows a generic customer-safe
// message, never internals.
export default function StoreErrorState({
  message = "تعذر تحميل البيانات حاليًا. يرجى المحاولة مرة أخرى بعد قليل.",
  minHeight = "40vh",
}: {
  message?: string
  minHeight?: string | number
}) {
  return (
    <div style={{
      minHeight, background: "#0A0A0A", direction: "rtl",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px 24px", textAlign: "center",
    }}>
      <div style={{ maxWidth: 420 }}>
        <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>⚠️</div>
        <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 15, color: "rgba(242,240,236,0.55)", lineHeight: 1.8, margin: "0 0 20px" }}>
          {message}
        </p>
        <a href="" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          minHeight: touchTarget.comfortable, fontFamily: "Tajawal, sans-serif", fontSize: 13, fontWeight: 700,
          color: "#9BA3AA", border: "1px solid rgba(155,163,170,0.3)", borderRadius: 8,
          padding: "0 22px", textDecoration: "none",
        }}>
          إعادة المحاولة
        </a>
      </div>
    </div>
  )
}
