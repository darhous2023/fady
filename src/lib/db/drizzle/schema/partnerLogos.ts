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

// A separate, logo-only strip shown directly under the homepage Hero --
// deliberately independent from `financing_partners` (the text-card
// marquee further down the page), per explicit user request. Every logo
// here is admin-managed: add/edit/reorder/archive from /admin/partner-logos.
export const partnerLogos = pgTable(
  "partner_logos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    logo_url: text("logo_url").notNull(),
    link: text("link"),
    sort_order: integer("sort_order").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  () => [
    pgPolicy("Anyone can view active partner logos", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`is_active = true`,
    }),
  ]
).enableRLS();

export const selectPartnerLogoSchema = createSelectSchema(partnerLogos);
export const insertPartnerLogoSchema = createInsertSchema(partnerLogos, {
  name: z.string().min(1),
  logo_url: z.string().min(1),
}).omit({ id: true, created_at: true, updated_at: true });

export type PartnerLogo = z.infer<typeof selectPartnerLogoSchema>;
export type InsertPartnerLogo = z.infer<typeof insertPartnerLogoSchema>;
