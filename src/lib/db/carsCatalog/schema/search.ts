import { pgTable, text, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { carsCanonical } from "./canonicalCars";

/**
 * Mirrors VehicleSearchIndex from cars_catalog (already 100% covered,
 * per the audit) plus an Arabic search-text column built from the alias
 * tables below. searchTextAr stays empty until a brand/model has a
 * registered alias — no machine translation of technical values.
 */
export const carsSearchIndex = pgTable(
  "search_index",
  {
    canonicalKey: text("canonical_key").primaryKey().references(() => carsCanonical.normalizedKey, { onDelete: "cascade" }),
    brand: text("brand"),
    model: text("model"),
    generation: text("generation"),
    trim: text("trim"),
    year: integer("year"),
    bodyType: text("body_type"),
    fuelType: text("fuel_type"),
    transmission: text("transmission"),
    drivetrain: text("drivetrain"),
    powerHp: numeric("power_hp"),
    torqueNm: numeric("torque_nm"),
    searchTextEn: text("search_text_en").notNull(),
    searchTextAr: text("search_text_ar"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    brandModelYearIdx: index("search_index_brand_model_year_idx").on(table.brand, table.model, table.year),
    fuelTypeIdx: index("search_index_fuel_type_idx").on(table.fuelType),
    bodyTypeIdx: index("search_index_body_type_idx").on(table.bodyType),
  })
);

/**
 * Admin-editable Arabic brand/model aliases (e.g. BMW <-> بي إم دبليو).
 * Never overwrites the source's original English name — purely additive,
 * used to build searchTextAr and to render an optional Arabic label next
 * to the original name.
 */
export const carsAliases = pgTable(
  "aliases",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(), // "brand" | "model"
    entityId: text("entity_id").notNull(),
    aliasAr: text("alias_ar").notNull(),
    createdBy: text("created_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    entityIdx: index("aliases_entity_idx").on(table.entityType, table.entityId),
  })
);

export const selectCarsSearchIndexSchema = createSelectSchema(carsSearchIndex);
export const insertCarsSearchIndexSchema = createInsertSchema(carsSearchIndex);
export type CarsSearchIndexRow = typeof carsSearchIndex.$inferSelect;
export type InsertCarsSearchIndexRow = typeof carsSearchIndex.$inferInsert;

export const selectCarsAliasSchema = createSelectSchema(carsAliases);
export const insertCarsAliasSchema = createInsertSchema(carsAliases);
export type CarsAlias = typeof carsAliases.$inferSelect;
export type InsertCarsAlias = typeof carsAliases.$inferInsert;
