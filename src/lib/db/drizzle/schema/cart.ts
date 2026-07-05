import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  unique,
  index,
  check,
  pgPolicy,
  foreignKey,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { products, productVariants } from "./products";

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id").notNull(),
    product_id: uuid("product_id").notNull(),
    variant_id: uuid("variant_id"),
    quantity: integer("quantity").notNull().default(1),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("cart_user_product_variant_unique").on(
      table.user_id,
      table.product_id,
      table.variant_id,
    ),
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "cart_items_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "cart_items_product_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.variant_id],
      foreignColumns: [productVariants.id],
      name: "cart_items_variant_id_fkey",
    }).onDelete("set null"),
    index("idx_cart_user_id").on(table.user_id),
    check("cart_quantity_positive", sql`quantity > 0`),
    pgPolicy("Users can manage own cart", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`app.current_user_id() = user_id`,
      withCheck: sql`app.current_user_id() = user_id`,
    }),
  ]
).enableRLS();

export const selectCartItemSchema = createSelectSchema(cartItems, {
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
});

export const insertCartItemSchema = createInsertSchema(cartItems, {
  quantity: z.number().int().positive(),
}).omit({ id: true, created_at: true, updated_at: true });

export const updateCartItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const addToCartSchema = insertCartItemSchema.omit({ user_id: true });

export type CartItem = z.infer<typeof selectCartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
