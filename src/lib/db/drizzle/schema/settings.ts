import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";

export const settings = pgTable(
  "settings",
  {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  () => [
    pgPolicy("Backend can manage settings", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
    pgPolicy("Anyone can read settings", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
  ]
).enableRLS();

export const selectSettingSchema = createSelectSchema(settings);
export const insertSettingSchema = createInsertSchema(settings, {
  key: z.string().min(1),
  value: z.string(),
});

export type Setting = z.infer<typeof selectSettingSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
