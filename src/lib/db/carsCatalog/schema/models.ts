import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { carsBrands } from "./brands";

export const carsModels = pgTable("models", {
  id: text("id").primaryKey(), // = Model.id from cars_catalog
  brandId: text("brand_id").notNull().references(() => carsBrands.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar"),
  bodyType: text("body_type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const carsGenerations = pgTable("generations", {
  id: text("id").primaryKey(), // = Generation.id
  modelId: text("model_id").notNull().references(() => carsModels.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  productionStart: text("production_start"), // stored as text to allow null year cleanly in queries; cast at read time
  productionEnd: text("production_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const carsTrims = pgTable("trims", {
  id: text("id").primaryKey(), // = Trim.id
  generationId: text("generation_id").references(() => carsGenerations.id, { onDelete: "set null" }),
  modelId: text("model_id").notNull().references(() => carsModels.id, { onDelete: "cascade" }),
  year: text("year"),
  nameEn: text("name_en").notNull(),
  category: text("category"),
  engineKey: text("engine_key"),
  transmissionKey: text("transmission_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const selectCarsModelSchema = createSelectSchema(carsModels);
export const insertCarsModelSchema = createInsertSchema(carsModels);
export type CarsModel = typeof carsModels.$inferSelect;
export type InsertCarsModel = typeof carsModels.$inferInsert;

export const selectCarsGenerationSchema = createSelectSchema(carsGenerations);
export const insertCarsGenerationSchema = createInsertSchema(carsGenerations);
export type CarsGeneration = typeof carsGenerations.$inferSelect;
export type InsertCarsGeneration = typeof carsGenerations.$inferInsert;

export const selectCarsTrimSchema = createSelectSchema(carsTrims);
export const insertCarsTrimSchema = createInsertSchema(carsTrims);
export type CarsTrim = typeof carsTrims.$inferSelect;
export type InsertCarsTrim = typeof carsTrims.$inferInsert;
