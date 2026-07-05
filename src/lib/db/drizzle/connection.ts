import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Cache on globalThis in dev: without this, every Turbopack hot reload
// re-executes this module and opens a brand-new pool without closing the
// previous one — the same connection-leak class already fixed for the
// cars-catalog client (src/lib/cars/db.ts). Confirmed via live Vercel logs
// that EMAXCONNSESSION (session-mode pooler's 15-connection cap) is real and
// currently reproducible in production; part of the fix is DATABASE_URL
// itself pointing at the transaction-mode pooler (6543) instead of session
// mode (5432) — see .env.example / FINAL_DELIVERY_PROGRESS.md. `prepare:
// false` is required for correctness under a transaction-mode pooler, since
// server-side prepared statements can't reliably persist across pooled
// connections there.
declare global {
  // eslint-disable-next-line no-var
  var __storeQueryClient: ReturnType<typeof postgres> | undefined;
}

const queryClient =
  globalThis.__storeQueryClient ??
  postgres(connectionString, {
    // A single request to `/` fans out to 7+ concurrent queries (see
    // src/app/page.tsx's top-level Promise.all plus each helper's own nested
    // queries) — with max=5, every single homepage load already self-queued
    // for a free connection even with zero concurrent traffic. postgres-js
    // has no acquire/queue timeout (confirmed: no such option exists), so a
    // saturated pool queues indefinitely rather than failing fast, which
    // surfaced as an intermittent 504 (Vercel's own function timeout, not
    // EMAXCONNSESSION) under a synthetic 30-concurrent-request load test.
    // Raised to 10 — safe under the transaction-mode pooler (port 6543,
    // designed for many short-lived connections), unlike the old 15-hard-cap
    // session-mode pooler this project was on before.
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__storeQueryClient = queryClient;
}

export const db = drizzle(queryClient, { schema });
export { schema };
export type Database = typeof db;
export type RLSClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Sets the current user ID in PostgreSQL session for RLS policies */
export async function setCurrentUserId(
  client: RLSClient,
  userId: string | null | undefined
): Promise<void> {
  const value = userId || "";
  await client.execute(
    sql`SELECT set_config('app.current_user_id', ${value}, true)`,
  );
}

export async function clearCurrentUserId(client: RLSClient): Promise<void> {
  await client.execute(sql`SELECT set_config('app.current_user_id', '', true)`);
}

/**
 * Executes a database operation with user context set for RLS policies.
 * @example
 * const items = await withRLS(userId, () => db.select().from(cartItems));
 */
export async function withRLS<T>(
  userId: string | null | undefined,
  operation: (tx: RLSClient) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await setCurrentUserId(tx, userId);
    return operation(tx);
  });
}

/** Creates a database transaction with RLS context */
export async function withRLSTransaction<T>(
  userId: string,
  operation: (tx: RLSClient) => Promise<T>,
): Promise<T> {
  return withRLS(userId, operation);
}
