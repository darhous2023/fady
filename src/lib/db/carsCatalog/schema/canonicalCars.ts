import { pgTable, text, integer, numeric, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { carsBrands } from "./brands";
import { carsModels, carsGenerations, carsTrims } from "./models";

/**
 * The public "product" entity for a car detail page. Keyed on
 * normalizedKey (= CanonicalCar.normalizedKey in cars_catalog — already
 * unique at the source), NOT on the source's internal cuid, so URLs stay
 * stable across re-syncs even if source ids ever regenerate.
 *
 * publicationEligible is a DERIVED flag computed by the sync engine —
 * never a copy of the source's raw isCurrent/status flags, per the
 * explicit instruction not to conflate source flags with a publish
 * decision. sourceIsCurrent/sourceStatus are kept as read-only reference
 * columns so an admin can see the raw source state without it silently
 * controlling visibility.
 */
export const carsCanonical = pgTable(
  "canonical_cars",
  {
    normalizedKey: text("normalized_key").primaryKey(),
    sourceCanonicalId: text("source_canonical_id").notNull(), // CanonicalCar.id in cars_catalog, for traceability only
    brandId: text("brand_id").references(() => carsBrands.id, { onDelete: "set null" }),
    modelId: text("model_id").references(() => carsModels.id, { onDelete: "set null" }),
    generationId: text("generation_id").references(() => carsGenerations.id, { onDelete: "set null" }),
    trimId: text("trim_id").references(() => carsTrims.id, { onDelete: "set null" }),
    displayName: text("display_name").notNull(),
    year: integer("year"),
    bodyType: text("body_type"),
    engine: text("engine"),
    transmission: text("transmission"),
    fuelType: text("fuel_type"),
    drivetrain: text("drivetrain"),
    seatingCapacity: integer("seating_capacity"),
    doors: integer("doors"),
    powerHp: numeric("power_hp"),
    torqueNm: numeric("torque_nm"),

    // reference-only, never used directly to decide visibility
    sourceIsCurrent: boolean("source_is_current").notNull().default(false),
    sourceStatus: text("source_status"),
    sourceReviewStatus: text("source_review_status").notNull().default("needs_review"),

    // derived publish decision — computed by the sync engine's eligibility rule
    publicationEligible: boolean("publication_eligible").notNull().default(false),
    publicationReason: text("publication_reason"), // short machine note: why eligible/ineligible, for admin debugging

    // admin moderation (independent of source data)
    adminHidden: boolean("admin_hidden").notNull().default(false),
    adminNotes: text("admin_notes"),

    sourceListingId: text("source_listing_id"), // for "data source" attribution on the detail page
    sourceUrl: text("source_url"),
    lastScrapedAt: timestamp("last_scraped_at"),
    lastSyncedAt: timestamp("last_synced_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    brandIdx: index("canonical_cars_brand_idx").on(table.brandId),
    modelIdx: index("canonical_cars_model_idx").on(table.modelId),
    publicIdx: index("canonical_cars_public_idx").on(table.publicationEligible, table.adminHidden),
    bodyTypeIdx: index("canonical_cars_body_type_idx").on(table.bodyType),
    fuelTypeIdx: index("canonical_cars_fuel_type_idx").on(table.fuelType),
    yearIdx: index("canonical_cars_year_idx").on(table.year),
  })
);

export const selectCarsCanonicalSchema = createSelectSchema(carsCanonical);
export const insertCarsCanonicalSchema = createInsertSchema(carsCanonical);
export type CarsCanonical = typeof carsCanonical.$inferSelect;
export type InsertCarsCanonical = typeof carsCanonical.$inferInsert;
