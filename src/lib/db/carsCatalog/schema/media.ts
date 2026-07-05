import { pgTable, text, integer, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { carsCanonical } from "./canonicalCars";

/**
 * One row per unique image BYTE (deduplicated by contentHash at sync
 * time — see the duplicate-image finding in the audit: 25 hashes were
 * stored redundantly under multiple source Image rows). objectStorageUrl
 * is the only URL the website should ever render; remoteUrl is kept as a
 * fallback/attribution reference only, never a production dependency.
 */
export const carsImages = pgTable(
  "images",
  {
    id: text("id").primaryKey(), // = contentHash when available, else source Image.id
    contentHash: text("content_hash"),
    remoteUrl: text("remote_url"),
    objectStorageUrl: text("object_storage_url"), // null until image migration step runs
    objectStorageKey: text("object_storage_key"),
    width: integer("width"),
    height: integer("height"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    hashIdx: index("cars_images_hash_idx").on(table.contentHash),
  })
);

export const carsCanonicalImages = pgTable(
  "canonical_car_images",
  {
    id: text("id").primaryKey(),
    canonicalKey: text("canonical_key").notNull().references(() => carsCanonical.normalizedKey, { onDelete: "cascade" }),
    imageId: text("image_id").notNull().references(() => carsImages.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    isMain: boolean("is_main").notNull().default(false),
    altText: text("alt_text"),
  },
  (table) => ({
    uniqueLink: unique("canonical_car_images_unique").on(table.canonicalKey, table.imageId),
    orderIdx: index("canonical_car_images_order_idx").on(table.canonicalKey, table.order),
  })
);

export const selectCarsImageSchema = createSelectSchema(carsImages);
export const insertCarsImageSchema = createInsertSchema(carsImages);
export type CarsImage = typeof carsImages.$inferSelect;
export type InsertCarsImage = typeof carsImages.$inferInsert;

export const selectCarsCanonicalImageSchema = createSelectSchema(carsCanonicalImages);
export const insertCarsCanonicalImageSchema = createInsertSchema(carsCanonicalImages);
export type CarsCanonicalImage = typeof carsCanonicalImages.$inferSelect;
export type InsertCarsCanonicalImage = typeof carsCanonicalImages.$inferInsert;
