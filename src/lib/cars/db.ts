import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as carsSchema from "../db/carsCatalog/schema";

/**
 * Dedicated connection for the cars-catalog database — intentionally
 * NOT the same client/pool as src/lib/db/drizzle/connection.ts (the
 * store's own DB). Uses its own env var (CARS_DATABASE_URL) so the two
 * databases can never be accidentally pointed at each other, and so this
 * pool's size can be tuned independently of the store's connection.
 *
 * Currently points at a local Postgres database (elfady_cars_catalog)
 * standing in for the not-yet-provisioned isolated cloud project — see
 * the execution report for why (Supabase account is at its free-project
 * limit). Swapping to a real cloud connection string later is purely an
 * env var change; no code here needs to change.
 */
const connectionString = process.env.CARS_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "CARS_DATABASE_URL is not set. The cars-catalog database is separate from DATABASE_URL — see .env.example."
  );
}

// Cache the client on globalThis in development: Next.js/Turbopack hot
// reloads re-execute this module on every file change, and without this
// guard each reload creates a brand-new postgres() client/pool without
// closing the previous one — a real connection-leak observed locally
// during development (transient CONNECT_TIMEOUT against the local
// stand-in Postgres after repeated edits). Production serverless
// invocations are short-lived processes, so this only matters for dev.
declare global {
  // eslint-disable-next-line no-var
  var __carsQueryClient: ReturnType<typeof postgres> | undefined;
}

const carsQueryClient =
  globalThis.__carsQueryClient ??
  postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // safe default for pooled/transaction-mode Postgres connections
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__carsQueryClient = carsQueryClient;
}

export const carsDb = drizzle(carsQueryClient, { schema: carsSchema });
export { carsSchema };
export type CarsDatabase = typeof carsDb;
