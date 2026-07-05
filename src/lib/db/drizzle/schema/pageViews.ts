import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { pgTable, uuid, text, timestamp, index, pgPolicy } from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";

export const pageViews = pgTable(
  "page_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    path: text("path").notNull(),
    visitor_id: text("visitor_id").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_page_views_created_at").on(table.created_at),
    index("idx_page_views_path").on(table.path),
    index("idx_page_views_visitor_id").on(table.visitor_id),
    pgPolicy("Anyone can record a page view", {
      as: "permissive",
      for: "insert",
      to: anonRole,
      withCheck: sql`true`,
    }),
  ]
).enableRLS();

export const selectPageViewSchema = createSelectSchema(pageViews, {
  created_at: z.coerce.string(),
});
export const insertPageViewSchema = createInsertSchema(pageViews, {
  path: z.string().min(1),
  visitor_id: z.string().min(1),
}).omit({ id: true, created_at: true });

export type PageView = z.infer<typeof selectPageViewSchema>;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
