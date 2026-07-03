import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgPolicy,
  index,
} from "drizzle-orm/pg-core";

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auth_user_id: text("auth_user_id").unique(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    avatar_url: text("avatar_url"),
    instagram_url: text("instagram_url"),
    facebook_url: text("facebook_url"),
    tiktok_url: text("tiktok_url"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_customers_phone").on(table.phone),
    index("idx_customers_auth_user_id").on(table.auth_user_id),
    pgPolicy("Backend can manage customers", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
  ]
).enableRLS();

export const selectCustomerSchema = createSelectSchema(customers);
export const insertCustomerSchema = createInsertSchema(customers, {
  name: z.string().min(1),
  phone: z.string().min(11),
  email: z.string().email().optional(),
}).omit({ id: true, created_at: true, updated_at: true });

export type Customer = z.infer<typeof selectCustomerSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
