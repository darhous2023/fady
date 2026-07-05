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

const carsQueryClient = postgres(connectionString, {
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // safe default for pooled/transaction-mode Postgres connections
});

export const carsDb = drizzle(carsQueryClient, { schema: carsSchema });
export { carsSchema };
export type CarsDatabase = typeof carsDb;
