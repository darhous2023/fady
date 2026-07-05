import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  numeric,
  boolean,
  timestamp,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";

export const shippingZones = pgTable(
  "shipping_zones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    governorate_ar: text("governorate_ar").notNull().unique(),
    cost: numeric("cost", { precision: 8, scale: 2 }).notNull().default("50"),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  () => [
    pgPolicy("Anyone can view shipping zones", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`is_active = true`,
    }),
  ]
).enableRLS();

export const selectShippingZoneSchema = createSelectSchema(shippingZones, {
  cost: z.coerce.number(),
});
export const insertShippingZoneSchema = createInsertSchema(shippingZones, {
  governorate_ar: z.string().min(1),
  cost: z.coerce.number().min(0),
}).omit({ id: true, created_at: true, updated_at: true });

export type ShippingZone = z.infer<typeof selectShippingZoneSchema>;
export type InsertShippingZone = z.infer<typeof insertShippingZoneSchema>;
