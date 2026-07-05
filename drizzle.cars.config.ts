import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

// Isolated migration config for the cars-catalog database — separate
// schema folder, separate migrations output, separate connection string.
// Never share this with drizzle.config.ts (the store's own DB).
export default defineConfig({
  schema: "./src/lib/db/carsCatalog/schema/index.ts",
  out: "./drizzle/cars-migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.CARS_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
