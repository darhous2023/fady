// Deletes the disposable Playwright test admin created by
// test-env-seed-admin.ts (both the `admins` row and the Better Auth
// `user`/`session`/`account` rows), and removes the local credentials file.
// Run: npx tsx scripts/test-env-teardown-admin.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { existsSync, readFileSync, unlinkSync } from "fs";
import { eq, sql } from "drizzle-orm";

async function main() {
  if (!existsSync(".e2e-test-admin.local.json")) {
    console.log("No .e2e-test-admin.local.json found -- nothing to tear down.");
    return;
  }

  const { db } = await import("../src/lib/db/drizzle/connection");
  const { admins } = await import("../src/lib/db/drizzle/schema");

  const { email, userId } = JSON.parse(readFileSync(".e2e-test-admin.local.json", "utf8"));

  await db.delete(admins).where(eq(admins.email, email));
  await db.execute(sql`delete from "session" where "userId" = ${userId}`);
  await db.execute(sql`delete from "account" where "userId" = ${userId}`);
  await db.execute(sql`delete from "user" where "id" = ${userId}`);

  unlinkSync(".e2e-test-admin.local.json");
  console.log("Deleted Playwright test admin + auth rows for:", email);
}

main().catch(e => {
  console.error("FAILED:", e);
  process.exit(1);
});
