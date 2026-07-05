import { pgTable, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Admin field overrides — kept fully separate from synced source data so
 * a re-sync can NEVER silently discard an admin edit. The repository
 * layer must apply these on top of synced values at read time, never
 * write them into canonical_cars/brands/models directly.
 */
export const carsAdminOverrides = pgTable("admin_overrides", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(), // "canonical_car" | "brand" | "model"
  entityId: text("entity_id").notNull(),
  field: text("field").notNull(),
  originalValue: text("original_value"),
  overrideValue: text("override_value").notNull(),
  reason: text("reason"),
  updatedBy: text("updated_by").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Sync checkpoint/state tracking — one row per sync run, keyed on the
 * source DatasetVersion.version so re-runs are idempotent and resumable.
 */
export const carsSyncRuns = pgTable("sync_runs", {
  id: text("id").primaryKey(),
  datasetVersion: text("dataset_version").notNull(),
  status: text("status").notNull().default("running"), // running | completed | failed
  mode: text("mode").notNull().default("incremental"), // bootstrap | incremental | dry_run
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
  stepsCompleted: jsonb("steps_completed").notNull().default([]),
  counts: jsonb("counts"), // per-entity upserted/skipped/failed counts
  errorMessage: text("error_message"),
  lastCheckpointStep: text("last_checkpoint_step"),
  lastCheckpointOffset: integer("last_checkpoint_offset").default(0),
});

export const selectCarsAdminOverrideSchema = createSelectSchema(carsAdminOverrides);
export const insertCarsAdminOverrideSchema = createInsertSchema(carsAdminOverrides);
export type CarsAdminOverride = typeof carsAdminOverrides.$inferSelect;
export type InsertCarsAdminOverride = typeof carsAdminOverrides.$inferInsert;

export const selectCarsSyncRunSchema = createSelectSchema(carsSyncRuns);
export const insertCarsSyncRunSchema = createInsertSchema(carsSyncRuns);
export type CarsSyncRun = typeof carsSyncRuns.$inferSelect;
export type InsertCarsSyncRun = typeof carsSyncRuns.$inferInsert;
