// Read-only audit: dump every used-car product with its make/model/year, images, and
// alt-text/filename mismatch flags. No writes. Run: npx tsx scripts/audit-used-cars.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { products, productImages } from "../src/lib/db/drizzle/schema/products"
import { eq } from "drizzle-orm"

const client = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(client)

function filenameHints(url: string): string[] {
  const decoded = decodeURIComponent(url).toLowerCase()
  const brands = ["toyota", "kia", "hyundai", "nissan", "chevrolet", "mg", "bmw", "mercedes", "ford", "honda", "mazda", "renault", "peugeot", "fiat", "audi", "volkswagen", "opel", "skoda", "seat", "mitsubishi", "suzuki", "jeep", "porsche", "lexus"]
  return brands.filter(b => decoded.includes(b))
}

async function audit() {
  const all = await db.select().from(products).where(eq(products.status, "active"))
  const usedCars = all.filter(p => p.make || p.model || p.year)

  console.log(`\nTotal active products: ${all.length}`)
  console.log(`Products with car fields (make/model/year set): ${usedCars.length}\n`)

  const rows: Array<Record<string, string>> = []

  for (const p of usedCars) {
    const images = await db.select().from(productImages).where(eq(productImages.product_id, p.id))
    const sorted = images.sort((a, b) => a.sort_order - b.sort_order)
    const cover = sorted[0]

    const brandLower = (p.make ?? "").toLowerCase()
    const mismatches: string[] = []

    for (const img of sorted) {
      const hints = filenameHints(img.url)
      const conflicting = hints.filter(h => h !== brandLower && !brandLower.includes(h) && !h.includes(brandLower))
      if (conflicting.length && brandLower) {
        mismatches.push(`image #${img.sort_order} URL mentions [${conflicting.join(",")}] but product.make="${p.make}"`)
      }
      if (img.alt_ar) {
        const altLower = img.alt_ar.toLowerCase()
        const altHints = filenameHints(altLower)
        const altConflict = altHints.filter(h => h !== brandLower && !brandLower.includes(h) && !h.includes(brandLower))
        if (altConflict.length && brandLower) {
          mismatches.push(`image #${img.sort_order} alt_ar="${p.name_ar ? "" : ""}${img.alt_ar}" mentions [${altConflict.join(",")}] but product.make="${p.make}"`)
        }
      }
    }

    rows.push({
      id: p.id,
      slug: p.slug,
      name_ar: p.name_ar,
      make: p.make ?? "",
      model: p.model ?? "",
      year: String(p.year ?? ""),
      imageCount: String(sorted.length),
      coverUrl: cover?.url ?? "(none)",
      coverAlt: cover?.alt_ar ?? "(none)",
      mismatches: mismatches.length ? mismatches.join(" | ") : "none",
    })
  }

  console.log("id,slug,name_ar,make,model,year,imageCount,coverUrl,coverAlt,mismatches")
  for (const r of rows) {
    console.log([r.id, r.slug, r.name_ar, r.make, r.model, r.year, r.imageCount, r.coverUrl, r.coverAlt, r.mismatches]
      .map(v => `"${v.replace(/"/g, '""')}"`).join(","))
  }

  const flagged = rows.filter(r => r.mismatches !== "none")
  console.log(`\n${flagged.length} product(s) flagged with possible brand/image mismatches.`)
  const noImages = rows.filter(r => r.imageCount === "0")
  console.log(`${noImages.length} product(s) with zero images.`)

  await client.end()
}

audit().catch(e => { console.error(e); process.exit(1) })
