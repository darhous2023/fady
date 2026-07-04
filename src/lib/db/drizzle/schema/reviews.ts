import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgPolicy,
  foreignKey,
  index,
  check,
} from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";
import { products } from "./products";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Nullable: null means a showroom-wide review, not tied to a specific car.
    product_id: uuid("product_id"),
    customer_name: text("customer_name").notNull(),
    rating: integer("rating").notNull(),
    comment_ar: text("comment_ar"),
    is_approved: boolean("is_approved").notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "reviews_product_id_fkey",
    }).onDelete("cascade"),
    index("idx_reviews_product_id").on(table.product_id),
    index("idx_reviews_approved").on(table.is_approved),
    check("rating_range", sql`rating >= 1 AND rating <= 5`),
    pgPolicy("Backend can manage reviews", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
    pgPolicy("Anyone can view approved reviews", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`is_approved = true`,
    }),
    pgPolicy("Anyone can insert reviews", {
      as: "permissive",
      for: "insert",
      to: anonRole,
      withCheck: sql`true`,
    }),
  ]
).enableRLS();

export const selectReviewSchema = createSelectSchema(reviews);
export const insertReviewSchema = createInsertSchema(reviews, {
  customer_name: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  product_id: z.string().uuid().nullable().optional(),
}).omit({ id: true, is_approved: true, created_at: true });

export type Review = z.infer<typeof selectReviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
