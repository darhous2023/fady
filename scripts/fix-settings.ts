import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { settings } from "../src/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

async function fixSettings() {
  const fixes = [
    { key: "whatsapp_number",  value: "+201015835455" },
    { key: "store_name_ar",    value: "شاهي" },
    { key: "store_tagline_ar", value: "فخامة حقيقية. منتجات مستوردة." },
  ]

  for (const { key, value } of fixes) {
    const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1)
    if (existing.length) {
      await db.update(settings).set({ value }).where(eq(settings.key, key))
      console.log(`✅ Updated  ${key} = "${value}"`)
    } else {
      await db.insert(settings).values({ key, value })
      console.log(`✅ Inserted ${key} = "${value}"`)
    }
  }

  const all = await db.select().from(settings)
  console.log("\n📋 All settings after fix:")
  all.forEach(r => console.log(`   ${r.key}: ${r.value}`))

  await client.end()
}

fixSettings().catch(e => { console.error(e); process.exit(1) })
