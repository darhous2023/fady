// Seed: demo discount code + flash end date + announcement
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { settings, discountCodes } from "../src/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

async function seed() {
  // 1. Set flash deals end date (30 days from now)
  const flashEnd = new Date()
  flashEnd.setDate(flashEnd.getDate() + 30)
  const flashEndStr = flashEnd.toISOString().slice(0, 16)

  await db.update(settings).set({ value: flashEndStr }).where(eq(settings.key, "flash_deals_ends_at"))
  console.log(`✅ Flash deals end: ${flashEndStr}`)

  // 2. Set announcement
  await db.update(settings).set({ value: "🚗 عروض خاصة على مجموعة مختارة من السيارات هذا الشهر" }).where(eq(settings.key, "announcement_text"))
  await db.update(settings).set({ value: "true" }).where(eq(settings.key, "announcement_active"))
  console.log(`✅ Announcement set`)

  // 3. Add demo discount code
  const existing = await db.select().from(discountCodes).where(eq(discountCodes.code, "FADY10")).limit(1)
  if (!existing.length) {
    await db.insert(discountCodes).values({
      code: "FADY10",
      type: "percent",
      value: "10",
      min_order: "200",
      is_active: true,
      expires_at: null,
      max_uses: null,
      used_count: 0,
    })
    console.log("✅ Discount code FADY10 created (10% off, min order 200ج)")
  } else {
    await db.update(discountCodes).set({ is_active: true, value: "10", type: "percent", min_order: "200" }).where(eq(discountCodes.code, "FADY10"))
    console.log("✅ Discount code FADY10 updated")
  }

  // Also add WELCOME50 fixed discount
  const existing2 = await db.select().from(discountCodes).where(eq(discountCodes.code, "WELCOME50")).limit(1)
  if (!existing2.length) {
    await db.insert(discountCodes).values({
      code: "WELCOME50",
      type: "fixed",
      value: "50",
      min_order: "500",
      is_active: true,
      expires_at: null,
      max_uses: null,
      used_count: 0,
    })
    console.log("✅ Discount code WELCOME50 created (50ج off, min order 500ج)")
  }

  await client.end()
}

seed().catch(e => { console.error(e); process.exit(1) })
