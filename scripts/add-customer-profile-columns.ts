// Migration: add avatar_url, instagram_url, facebook_url, tiktok_url to customers table
import postgres from "postgres"

const client = postgres(process.env.DATABASE_URL!)

async function migrate() {
  await client`
    ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS instagram_url TEXT,
    ADD COLUMN IF NOT EXISTS facebook_url TEXT,
    ADD COLUMN IF NOT EXISTS tiktok_url TEXT
  `
  console.log("✅ Added profile columns to customers table")
  await client.end()
}

migrate().catch(e => { console.error(e); process.exit(1) })
