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

export const banners = pgTable(
  "banners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    image_url: text("image_url").notNull(),
    title_ar: text("title_ar"),
    link: text("link"),
    sort_order: integer("sort_order").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  () => [
    pgPolicy("Backend can manage banners", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
    pgPolicy("Anyone can view active banners", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`is_active = true`,
    }),
  ]
).enableRLS();

export const selectBannerSchema = createSelectSchema(banners);
export const insertBannerSchema = createInsertSchema(banners, {
  image_url: z.string().url(),
}).omit({ id: true, created_at: true, updated_at: true });

export type Banner = z.infer<typeof selectBannerSchema>;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
