import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  uuid,
  text,
  numeric,
  boolean,
  integer,
  timestamp,
  index,
  check,
  pgEnum,
  pgPolicy,
  foreignKey,
} from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";
import { categories } from "./categories";

export const qualityTierEnum = pgEnum("quality_tier", [
  "hi_copy",
  "mirror",
  "original",
]);

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "draft",
  "archived",
]);

export const QualityTierZod = z.enum(["hi_copy", "mirror", "original"]);
export const ProductStatusZod = z.enum(["active", "draft", "archived"]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name_ar: text("name_ar").notNull(),
    slug: text("slug").notNull().unique(),
    description_ar: text("description_ar"),
    category_id: uuid("category_id").notNull(),
    quality_tier: qualityTierEnum("quality_tier").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    compare_at_price: numeric("compare_at_price", { precision: 10, scale: 2 }),
    is_featured: boolean("is_featured").notNull().default(false),
    status: productStatusEnum("status").notNull().default("draft"),
    // Used-car fields (elfady) — nullable/additive, do not affect the inherited fashion schema.
    make: text("make"),
    model: text("model"),
    year: integer("year"),
    mileage_km: integer("mileage_km"),
    transmission: text("transmission"),
    fuel_type: text("fuel_type"),
    body_type: text("body_type"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.category_id],
      foreignColumns: [categories.id],
      name: "products_category_id_fkey",
    }).onDelete("restrict"),
    index("idx_products_category_id").on(table.category_id),
    index("idx_products_status").on(table.status),
    index("idx_products_featured").on(table.is_featured),
    check("price_positive", sql`price > 0`),
    pgPolicy("Backend can manage products", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
    pgPolicy("Anyone can view active products", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`status = 'active'`,
    }),
  ]
).enableRLS();

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    product_id: uuid("product_id").notNull(),
    color_ar: text("color_ar"),
    size: text("size"),
    sku: text("sku"),
    stock: integer("stock").notNull().default(0),
    price_override: numeric("price_override", { precision: 10, scale: 2 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "product_variants_product_id_fkey",
    }).onDelete("cascade"),
    index("idx_variants_product_id").on(table.product_id),
    check("stock_non_negative", sql`stock >= 0`),
    pgPolicy("Backend can manage variants", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
    pgPolicy("Anyone can view variants", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
  ]
).enableRLS();

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    product_id: uuid("product_id").notNull(),
    variant_id: uuid("variant_id"),
    url: text("url").notNull(),
    alt_ar: text("alt_ar"),
    sort_order: integer("sort_order").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
      name: "product_images_product_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.variant_id],
      foreignColumns: [productVariants.id],
      name: "product_images_variant_id_fkey",
    }).onDelete("set null"),
    index("idx_images_product_id").on(table.product_id),
    pgPolicy("Backend can manage images", {
      as: "permissive",
      for: "all",
      to: "public",
      using: sql`current_setting('request.jwt.claim.role', true) is null`,
      withCheck: sql`current_setting('request.jwt.claim.role', true) is null`,
    }),
    pgPolicy("Anyone can view images", {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
  ]
).enableRLS();

// Zod schemas
export const selectProductSchema = createSelectSchema(products, {
  price: z.coerce.number(),
  compare_at_price: z.coerce.number().nullable(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
});

export const insertProductSchema = createInsertSchema(products, {
  name_ar: z.string().min(1),
  slug: z.string().min(1),
  price: z.coerce.number().positive(),
  compare_at_price: z.coerce.number().positive().nullable().optional(),
}).omit({ id: true, created_at: true, updated_at: true });

export const updateProductSchema = selectProductSchema
  .partial()
  .required({ id: true });

export const selectVariantSchema = createSelectSchema(productVariants, {
  price_override: z.coerce.number().nullable(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
});

export const insertVariantSchema = createInsertSchema(productVariants, {
  stock: z.number().int().min(0),
  price_override: z.coerce.number().positive().nullable().optional(),
}).omit({ id: true, created_at: true, updated_at: true });

export const selectImageSchema = createSelectSchema(productImages, {
  created_at: z.coerce.string(),
});

export const insertImageSchema = createInsertSchema(productImages, {
  url: z.string().url(),
}).omit({ id: true, created_at: true });

export type Product = z.infer<typeof selectProductSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type ProductVariant = z.infer<typeof selectVariantSchema>;
export type InsertProductVariant = z.infer<typeof insertVariantSchema>;
export type ProductImage = z.infer<typeof selectImageSchema>;
export type InsertProductImage = z.infer<typeof insertImageSchema>;
export type QualityTier = z.infer<typeof QualityTierZod>;
export type ProductStatus = z.infer<typeof ProductStatusZod>;
