// Builds the store's full schema from scratch on an isolated test database
// (a fresh Neon test branch, or a CI Postgres service container) without
// using `drizzle-kit migrate` directly.
//
// Why not just call `drizzle-kit migrate`: real production history applied
// `scripts/better-auth-schema.sql` (which CREATE TABLEs "session"/"account"/
// "verification") in between migrations 0007 and 0008 -- migration 0008
// itself only ALTERs those tables (enables RLS), it doesn't create them.
// `drizzle-kit migrate` runs the whole batch as one all-or-nothing
// transaction, so on a genuinely fresh DB it fails at 0008 with
// `relation "session" does not exist` and rolls back everything (confirmed
// while building this harness). This script replays the real historical
// order instead: migrations 0000-0007, then better-auth-schema.sql, then
// 0008-0009. Also creates the harmless placeholder `anon`/`authenticated`/
// `service_role` NOLOGIN roles Supabase provides by convention (referenced
// by RLS policies in the migrations) -- plain Postgres/Neon don't have them.
//
// Usage: DATABASE_URL=... npx tsx scripts/test-env-bootstrap-db.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import path from "path";
import { Client } from "pg";

const MIGRATIONS_DIR = path.join(__dirname, "..", "drizzle", "migrations");
const BETTER_AUTH_SQL = path.join(__dirname, "better-auth-schema.sql");
const BEFORE_TAG = "0008_abandoned_santa_claus"; // insert better-auth-schema.sql right before this one

async function runMigrationFile(client: Client, tag: string) {
  const sql = readFileSync(path.join(MIGRATIONS_DIR, `${tag}.sql`), "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map(s => s.trim())
    .filter(Boolean);
  await client.query("BEGIN");
  try {
    for (const statement of statements) {
      await client.query(statement);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw new Error(`Migration ${tag} failed: ${(e as Error).message}`);
  }
  console.log(`  applied ${tag}`);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const client = new Client({ connectionString });
  await client.connect();

  console.log("Creating Supabase-convention placeholder roles (anon/authenticated/service_role)...");
  for (const role of ["anon", "authenticated", "service_role"]) {
    await client.query(
      `DO $do$ BEGIN CREATE ROLE ${role} NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $do$;`,
    );
  }

  const journal = JSON.parse(
    readFileSync(path.join(MIGRATIONS_DIR, "meta", "_journal.json"), "utf8"),
  ) as { entries: { tag: string }[] };

  console.log("Applying migrations (real historical order, better-auth-schema.sql interleaved)...");
  for (const entry of journal.entries) {
    if (entry.tag === BEFORE_TAG) {
      console.log("  applying better-auth-schema.sql (creates session/account/verification)");
      await client.query(readFileSync(BETTER_AUTH_SQL, "utf8"));
    }
    await runMigrationFile(client, entry.tag);
  }

  await client.end();
  console.log("Store schema bootstrap complete.");
}

main().catch(e => {
  console.error("FAILED:", e);
  process.exit(1);
});
