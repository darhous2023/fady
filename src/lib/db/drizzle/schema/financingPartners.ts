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

export const financingPartners = pgTable(
  "financing_partners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name_ar: text("name_ar").notNull(),
    subtitle_ar: text("subtitle_ar"),
    logo_url: text("logo_url"),
    link: text("link"),
    sort_order: integer("sort_order").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  () => [
    pgPolicy("Anyone can view active financing partners", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`is_active = true`,
    }),
  ]
).enableRLS();

export const selectFinancingPartnerSchema = createSelectSchema(financingPartners);
export const insertFinancingPartnerSchema = createInsertSchema(financingPartners, {
  name_ar: z.string().min(1),
}).omit({ id: true, created_at: true, updated_at: true });

export type FinancingPartner = z.infer<typeof selectFinancingPartnerSchema>;
export type InsertFinancingPartner = z.infer<typeof insertFinancingPartnerSchema>;
