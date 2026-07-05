// Lists every real key in the store's `settings` table (Supabase), for a
// dead-key sweep. Read-only.
import { config } from "dotenv";
config({ path: ".env.local" });
export {};

async function main() {
  const { db } = await import("../src/lib/db/drizzle/connection");
  const { settings } = await import("../src/lib/db/drizzle/schema");

  const rows = await db.select({ key: settings.key, value: settings.value }).from(settings);
  console.log(JSON.stringify(rows.map(r => ({ key: r.key, valuePreview: (r.value ?? "").toString().slice(0, 40) })), null, 2));
  process.exit(0);
}

main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
