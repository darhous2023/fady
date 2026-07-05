import { pgTable, text, numeric, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { carsCanonical } from "./canonicalCars";

/**
 * Flattened, grouped specification rows for a canonical car — mirrors
 * Specification+SpecificationGroup from cars_catalog, but denormalized
 * (groupName inline) since the website only ever reads these grouped by
 * canonical car, never independently. sectionKey maps normalizedKey
 * families (engine/performance/transmission/fuel/dimensions/weight/
 * suspension/brakes/steering/wheels/electric) per the section-13 mapping
 * dictionary — populated by the sync engine, not guessed at read time.
 */
export const carsSpecs = pgTable(
  "canonical_car_specs",
  {
    id: text("id").primaryKey(),
    canonicalKey: text("canonical_key").notNull().references(() => carsCanonical.normalizedKey, { onDelete: "cascade" }),
    sectionKey: text("section_key").notNull(), // engine | performance | transmission | fuel | dimensions | weight | suspension | brakes | steering | wheels | electric | other
    groupName: text("group_name").notNull(),
    label: text("label").notNull(),
    normalizedKey: text("normalized_key"),
    valueText: text("value_text").notNull(),
    valueNumber: numeric("value_number"),
    unit: text("unit"),
    order: integer("order").notNull().default(0),
  },
  (table) => ({
    canonicalIdx: index("canonical_car_specs_canonical_idx").on(table.canonicalKey, table.sectionKey),
    normalizedKeyIdx: index("canonical_car_specs_key_idx").on(table.normalizedKey),
  })
);

export const selectCarsSpecSchema = createSelectSchema(carsSpecs);
export const insertCarsSpecSchema = createInsertSchema(carsSpecs);
export type CarsSpec = typeof carsSpecs.$inferSelect;
export type InsertCarsSpec = typeof carsSpecs.$inferInsert;
