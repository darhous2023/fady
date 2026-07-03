import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  pgEnum,
  pgPolicy,
  check,
} from "drizzle-orm/pg-core";

export const discountTypeEnum = pgEnum("discount_type", ["percent", "fixed"]);

export const discountCodes = pgTable(
  "discount_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    type: discountTypeEnum("type").notNull(),
    value: numeric("value", { precision: 8, scale: 2 }).notNull(),
    min_order: numeric("min_order", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    max_uses: integer("max_uses"),
    used_count: integer("used_count").notNull().default(0),
    expires_at: timestamp("expires_at", { withTimezone: true }),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    check("value_positive", sql`value > 0`),
    check("used_count_non_negative", sql`used_count >= 0`),
    pgPolicy("Backend can manage discount codes", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
  ]
).enableRLS();

export const selectDiscountCodeSchema = createSelectSchema(discountCodes, {
  value: z.coerce.number(),
  min_order: z.coerce.number(),
  expires_at: z.coerce.string().nullable(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
});
export const insertDiscountCodeSchema = createInsertSchema(discountCodes, {
  code: z.string().min(3).toUpperCase(),
  value: z.coerce.number().positive(),
  min_order: z.coerce.number().min(0),
}).omit({ id: true, used_count: true, created_at: true, updated_at: true });

export type DiscountCode = z.infer<typeof selectDiscountCodeSchema>;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
