import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
  index,
  pgPolicy,
  foreignKey,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";

export const wishlist = pgTable(
  "wishlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id").notNull(),
    product_id: uuid("product_id").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("wishlist_user_product_unique").on(table.user_id, table.product_id),
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "wishlist_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "wishlist_product_id_fkey",
    }).onDelete("cascade"),
    index("idx_wishlist_user_id").on(table.user_id),
    index("idx_wishlist_product_id").on(table.product_id),
    pgPolicy("Users can manage own wishlist", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`app.current_user_id() = user_id`,
      withCheck: sql`app.current_user_id() = user_id`,
    }),
    pgPolicy("Backend can manage all wishlists", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
  ]
).enableRLS();

export const selectWishlistItemSchema = createSelectSchema(wishlist, {
  created_at: z.coerce.string(),
});

export const insertWishlistItemSchema = createInsertSchema(wishlist).omit({
  id: true,
  created_at: true,
});

export const addToWishlistSchema = insertWishlistItemSchema.omit({ user_id: true });

export type WishlistItem = z.infer<typeof selectWishlistItemSchema>;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
