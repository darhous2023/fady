// Creates a temporary, least-privilege ("staff") admin test account and signs
// in via Better Auth's own server API (never via the login form/UI — this
// script never types a password into any browser field). Writes the session
// cookie name+value to a local, gitignored file so a separate step can inject
// it into an authenticated browser tab for real E2E verification.
// Run: npx tsx scripts/e2e-admin-session-setup.ts
// Cleanup: npx tsx scripts/e2e-admin-session-teardown.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { randomBytes } from "crypto";
import { writeFileSync } from "fs";

async function main() {
  // Dynamic imports: static ESM imports hoist above this file's own top-level
  // statements, so a static `import { auth } from "../src/utils/auth"` would
  // run auth.ts's module-scope `new Pool({ connectionString: process.env.DATABASE_URL })`
  // before the config() call above ever populates DATABASE_URL — resulting in
  // pg trying to connect with an empty connection string and failing with a
  // misleading "SASL: client password must be a string" error. Deferring these
  // imports until after config() has run fixes it.
  const { auth } = await import("../src/utils/auth");
  const { db } = await import("../src/lib/db/drizzle/connection");
  const { admins } = await import("../src/lib/db/drizzle/schema");

  const suffix = randomBytes(4).toString("hex");
  const email = `e2e-temp-${suffix}@elfady-test.internal`;
  const password = randomBytes(18).toString("base64url");
  const name = "E2E Temp Test Account";

  const signUp = await auth.api.signUpEmail({ body: { email, password, name } });
  const userId = (signUp as { user?: { id?: string } })?.user?.id;
  if (!userId) throw new Error("signUpEmail did not return a user id: " + JSON.stringify(signUp));

  await db.insert(admins).values({ auth_user_id: userId, name, email, role: "staff", is_active: true });

  const signIn = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  }) as Response;

  const setCookie = signIn.headers.get("set-cookie") ?? "";
  const match = setCookie.match(/([^=;]+)=([^;]+)/);
  if (!match) throw new Error("No session cookie returned from signInEmail: " + setCookie);
  const [, cookieName, cookieValue] = match;

  writeFileSync(
    ".e2e-session.local.json",
    JSON.stringify({ email, userId, cookieName, cookieValue, createdAt: new Date().toISOString() }, null, 2),
  );

  console.log("Temp admin created and signed in.");
  console.log("email:", email);
  console.log("userId:", userId);
  console.log("cookie written to .e2e-session.local.json (gitignored)");
}

main().catch(e => { console.error("FAILED:", e); process.exit(1); });
