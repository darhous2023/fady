import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const carsBrands = pgTable("brands", {
  id: text("id").primaryKey(), // = Brand.id from cars_catalog (stable source id)
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar"), // admin-editable alias, nullable — never invented
  logoUrl: text("logo_url"),
  modelCount: integer("model_count").notNull().default(0), // denormalized, refreshed by sync
  isPublic: boolean("is_public").notNull().default(false), // derived: modelCount > 0
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const selectCarsBrandSchema = createSelectSchema(carsBrands);
export const insertCarsBrandSchema = createInsertSchema(carsBrands);
export type CarsBrand = typeof carsBrands.$inferSelect;
export type InsertCarsBrand = typeof carsBrands.$inferInsert;
