import StoreHeader from "@/components/store/StoreHeader"
import StoreFooter from "@/components/store/StoreFooter"

// Shown on /new, /new/browse, /new/car/[normalizedKey] when CARS_DATABASE_URL
// isn't configured yet (the isolated cloud catalog DB is still pending —
// see FINAL_DELIVERY_PROGRESS.md). Keeps these 3 routes from ever hard-500ing
// the whole site if the env var is briefly missing/misconfigured.
export default function CarsCatalogUnavailable() {
  return (
    <>
      <StoreHeader />
      <div style={{
        minHeight: "70vh", background: "#0A0A0A", direction: "rtl",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 24px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: "Tajawal, sans-serif", fontSize: 24, fontWeight: 900, color: "#F2F0EC", marginBottom: 12 }}>
            بوابة السيارات الجديدة قريبًا
          </h1>
          <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: 14, color: "rgba(242,240,236,0.5)", lineHeight: 1.8 }}>
            نعمل حاليًا على ربط كتالوج السيارات الجديدة. تصفّح سياراتنا المستعملة المتاحة الآن من الصفحة الرئيسية.
          </p>
        </div>
      </div>
      <StoreFooter />
    </>
  )
}
