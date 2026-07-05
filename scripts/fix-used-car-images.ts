// Fixes the 6 demo used-car cover photos, which were found (via direct visual
// inspection, not caption/filename heuristics) to show the WRONG car entirely:
// Toyota Corolla -> a Thai taxi cab, Hyundai Elantra -> a Mazda, Kia Cerato and
// Nissan Sunny -> two different Mercedes-AMG cars, Chevrolet Aveo -> a night
// street scene, MG5 -> a crowded parking lot with no MG visible at all.
// Every replacement below was downloaded and visually confirmed to show the
// correct brand (badge/grille text visible) before being used here.
// Run: npx tsx scripts/fix-used-car-images.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { productImages } from "../src/lib/db/drizzle/schema/products"
import { eq } from "drizzle-orm"

const client = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(client)

const fixes: Array<{ productId: string; oldUrlContains: string; newUrl: string; altAr: string; note: string }> = [
  {
    productId: "de625084-284e-4940-8547-51c29035a510",
    oldUrlContains: "1559385988-439b04de16f8",
    newUrl: "https://images.unsplash.com/photo-1626072557464-90403d788e8d?w=1400&q=80",
    altAr: "تويوتا كورولا 2021 - صورة توضيحية",
    note: "was a Thai taxi cab, not a Corolla in dealer condition",
  },
  {
    productId: "5c4f732c-ec39-43a4-8ff8-2792cac8effa",
    oldUrlContains: "1569173455238-b885a4cad163",
    newUrl: "https://images.unsplash.com/photo-1728031401344-40811b71840c?w=1400&q=80",
    altAr: "هيونداي إلنترا 2020 - صورة توضيحية",
    note: "was a Mazda (visible Mazda grille/badge)",
  },
  {
    productId: "719d0274-0fc3-4489-8921-76a73767da96",
    oldUrlContains: "1561299593-7633f311838a",
    newUrl: "https://images.unsplash.com/photo-1602830364184-bcb58aa7d374?w=1400&q=80",
    altAr: "كيا سيراتو 2019 - صورة توضيحية",
    note: "was a Mercedes-AMG (visible AMG badge)",
  },
  {
    productId: "3822911c-548b-4548-8307-eac74557b1a8",
    oldUrlContains: "1575028401612-46bedd08ec81",
    newUrl: "https://images.unsplash.com/photo-1692713465453-393545b65976?w=1400&q=80",
    altAr: "شيفروليه أفيو 2018 - صورة توضيحية",
    note: "was a night street/building scene, barely showed a car",
  },
  {
    productId: "9db686ee-1aca-4d78-8878-adf9fe4cc8a4",
    oldUrlContains: "1559095380-3a7d465772a5",
    newUrl: "https://images.unsplash.com/photo-1770321297121-c942831285b4?w=1400&q=80",
    altAr: "نيسان صني 2022 - صورة توضيحية",
    note: "was a second, different Mercedes-AMG (visible AMG badge)",
  },
  {
    productId: "c18bab7e-65cd-4a30-968d-878fe9d0d3cf",
    oldUrlContains: "1573710459621-bb101783ca0f",
    newUrl: "https://images.unsplash.com/photo-1648178328042-b7c0f62e4181?w=1400&q=80",
    altAr: "أم جي 5 2021 - صورة توضيحية",
    note: "was a crowded parking lot, no MG visible in the frame",
  },
]

async function run() {
  for (const fix of fixes) {
    const rows = await db.select().from(productImages).where(eq(productImages.product_id, fix.productId))
    const target = rows.find(r => r.url.includes(fix.oldUrlContains))
    if (!target) {
      console.log(`SKIP ${fix.productId}: no image matching "${fix.oldUrlContains}" found (already fixed?)`)
      continue
    }
    await db.update(productImages)
      .set({ url: fix.newUrl, alt_ar: fix.altAr })
      .where(eq(productImages.id, target.id))
    console.log(`FIXED ${fix.productId}: ${fix.note}`)
  }
  await client.end()
}

run().catch(e => { console.error(e); process.exit(1) })
