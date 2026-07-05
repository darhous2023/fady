// Deletes the temporary E2E test admin account created by
// e2e-admin-session-setup.ts (both the `admins` row and the Better Auth
// `user`/`session`/`account` rows), and removes the local session-cookie file.
// Run: npx tsx scripts/e2e-admin-session-teardown.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { existsSync, readFileSync, unlinkSync } from "fs";
import { db } from "../src/lib/db/drizzle/connection";
import { admins } from "../src/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

async function main() {
  if (!existsSync(".e2e-session.local.json")) {
    console.log("No .e2e-session.local.json found — nothing to tear down.");
    return;
  }
  const { email, userId } = JSON.parse(readFileSync(".e2e-session.local.json", "utf8"));

  await db.delete(admins).where(eq(admins.email, email));
  // Better Auth's own tables (user/session/account) live outside the Drizzle schema exports
  // used elsewhere in this project; delete by raw SQL scoped strictly to this one test user id.
  await db.execute(sql`delete from "session" where "userId" = ${userId}`);
  await db.execute(sql`delete from "account" where "userId" = ${userId}`);
  await db.execute(sql`delete from "user" where "id" = ${userId}`);

  unlinkSync(".e2e-session.local.json");
  console.log("Deleted temp admin + auth rows for:", email);
}

main().catch(e => { console.error("FAILED:", e); process.exit(1); });
