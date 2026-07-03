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
} from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name_ar: text("name_ar").notNull(),
    slug: text("slug").notNull().unique(),
    sort_order: integer("sort_order").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  () => [
    pgPolicy("Backend can manage categories", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
    pgPolicy("Anyone can view active categories", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`is_active = true`,
    }),
  ]
).enableRLS();

export const selectCategorySchema = createSelectSchema(categories);
export const insertCategorySchema = createInsertSchema(categories, {
  name_ar: z.string().min(1),
  slug: z.string().min(1),
}).omit({ id: true, created_at: true, updated_at: true });

export type Category = z.infer<typeof selectCategorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
