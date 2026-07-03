import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  pgPolicy,
  index,
} from "drizzle-orm/pg-core";

export const adminRoleEnum = pgEnum("admin_role", [
  "owner",
  "manager",
  "staff",
]);

export const admins = pgTable(
  "admins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auth_user_id: text("auth_user_id").notNull().unique(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: adminRoleEnum("role").notNull().default("staff"),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_admins_auth_user_id").on(table.auth_user_id),
    index("idx_admins_email").on(table.email),
    pgPolicy("Backend can manage admins", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
  ]
).enableRLS();

export const selectAdminSchema = createSelectSchema(admins);
export const insertAdminSchema = createInsertSchema(admins, {
  name: z.string().min(1),
  email: z.string().email(),
}).omit({ id: true, created_at: true, updated_at: true });

export type Admin = z.infer<typeof selectAdminSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type AdminRole = "owner" | "manager" | "staff";
