// One-off utility to create the first admin account.
// Usage: npx tsx scripts/bootstrap-admin.ts <email> <password> <name>
// Requires DATABASE_URL / BETTER_AUTH_SECRET already present in the environment
// (e.g. `set -a && source <(grep -v '^#' .env.local) && set +a` before running).
import { config } from "dotenv";
config({ path: ".env.local" });

import { auth } from "../src/utils/auth";
import { db } from "../src/lib/db/drizzle/connection";
import { admins } from "../src/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";

const [, , email, password, name] = process.argv;

async function main() {
  if (!email || !password || !name) {
    console.error("Usage: npx tsx scripts/bootstrap-admin.ts <email> <password> <name>");
    process.exit(1);
  }

  const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (existing.length > 0) {
    console.log("Admin row already exists:", existing[0]);
    process.exit(0);
  }

  const result = await auth.api.signUpEmail({ body: { email, password, name } });
  const userId = (result as { user?: { id?: string } })?.user?.id;
  if (!userId) {
    console.error("Sign-up did not return a user id:", JSON.stringify(result));
    process.exit(1);
  }

  await db.insert(admins).values({
    auth_user_id: userId,
    name,
    email,
    role: "owner",
    is_active: true,
  });

  console.log("OK: admin created ->", { userId, email });
  process.exit(0);
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
