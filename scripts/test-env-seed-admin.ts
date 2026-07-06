// Creates a disposable, least-privilege ("staff") admin account for use by
// the Playwright E2E smoke test, ONLY against an isolated test database
// (never production). Unlike scripts/e2e-admin-session-setup.ts, this script
// does NOT sign in via the server API -- Playwright itself types the
// plaintext password into the real /admin/login form, since this is the one
// carve-out in the project's "never type a password into /admin/login" rule
// (isolated test environment only, never Production).
//
// Run: npx tsx scripts/test-env-seed-admin.ts
// Cleanup: npx tsx scripts/test-env-teardown-admin.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { randomBytes } from "crypto";
import { writeFileSync } from "fs";

async function main() {
  // Dynamic imports: see e2e-admin-session-setup.ts for why static imports of
  // modules that read process.env.DATABASE_URL at module scope must be
  // deferred until after dotenv's config() above has actually run.
  const { auth } = await import("../src/utils/auth");
  const { db } = await import("../src/lib/db/drizzle/connection");
  const { admins } = await import("../src/lib/db/drizzle/schema");

  const suffix = randomBytes(4).toString("hex");
  const email = `e2e-playwright-${suffix}@elfady-test.internal`;
  const password = randomBytes(18).toString("base64url");
  const name = "Playwright Test Admin";

  const signUp = await auth.api.signUpEmail({ body: { email, password, name } });
  const userId = (signUp as { user?: { id?: string } })?.user?.id;
  if (!userId) throw new Error("signUpEmail did not return a user id: " + JSON.stringify(signUp));

  await db.insert(admins).values({ auth_user_id: userId, name, email, role: "staff", is_active: true });

  writeFileSync(
    ".e2e-test-admin.local.json",
    JSON.stringify({ email, password, userId, createdAt: new Date().toISOString() }, null, 2),
  );

  console.log("Disposable Playwright test admin created.");
  console.log("email:", email);
  console.log("credentials written to .e2e-test-admin.local.json (gitignored)");
}

main().catch(e => {
  console.error("FAILED:", e);
  process.exit(1);
});
