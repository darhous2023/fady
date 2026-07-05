import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  timestamp,
  index,
  check,
  pgEnum,
  pgPolicy,
  foreignKey,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { products } from "./products";
import { productVariants } from "./products";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orderMethodEnum = pgEnum("order_method", ["whatsapp", "cod"]);

export const OrderStatusZod = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);
export const OrderMethodZod = z.enum(["whatsapp", "cod"]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    order_number: text("order_number").notNull().unique(),
    customer_id: uuid("customer_id"),
    customer_name: text("customer_name").notNull(),
    phone: text("phone").notNull(),
    governorate: text("governorate"),
    address: text("address"),
    preferred_date: text("preferred_date"),
    branch: text("branch"),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    shipping_cost: numeric("shipping_cost", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    method: orderMethodEnum("method").notNull().default("cod"),
    status: orderStatusEnum("status").notNull().default("pending"),
    discount_code: text("discount_code"),
    notes: text("notes"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.customer_id],
      foreignColumns: [customers.id],
      name: "orders_customer_id_fkey",
    }).onDelete("set null"),
    index("idx_orders_status").on(table.status),
    index("idx_orders_customer_id").on(table.customer_id),
    index("idx_orders_created_at").on(table.created_at),
    index("idx_orders_phone").on(table.phone),
    check("subtotal_positive", sql`subtotal >= 0`),
    check("total_positive", sql`total >= 0`),
  ]
).enableRLS();

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    order_id: uuid("order_id").notNull(),
    product_id: uuid("product_id").notNull(),
    variant_id: uuid("variant_id"),
    product_name: text("product_name").notNull(),
    quality_tier: text("quality_tier").notNull(),
    qty: integer("qty").notNull().default(1),
    unit_price: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [orders.id],
      name: "order_items_order_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "order_items_product_id_fkey",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.variant_id],
      foreignColumns: [productVariants.id],
      name: "order_items_variant_id_fkey",
    }).onDelete("set null"),
    index("idx_order_items_order_id").on(table.order_id),
    check("qty_positive", sql`qty > 0`),
  ]
).enableRLS();

// Zod schemas
export const selectOrderSchema = createSelectSchema(orders, {
  subtotal: z.coerce.number(),
  shipping_cost: z.coerce.number(),
  total: z.coerce.number(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
});

export const insertOrderSchema = createInsertSchema(orders, {
  customer_name: z.string().min(1),
  phone: z.string().min(11),
  governorate: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  preferred_date: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  subtotal: z.coerce.number().min(0),
  shipping_cost: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
}).omit({ id: true, created_at: true, updated_at: true });

export const selectOrderItemSchema = createSelectSchema(orderItems, {
  unit_price: z.coerce.number(),
  created_at: z.coerce.string(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems, {
  qty: z.number().int().positive(),
  unit_price: z.coerce.number().positive(),
}).omit({ id: true, created_at: true });

export type Order = z.infer<typeof selectOrderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = z.infer<typeof selectOrderItemSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderStatus = z.infer<typeof OrderStatusZod>;
export type OrderMethod = z.infer<typeof OrderMethodZod>;
