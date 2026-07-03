import { relations } from "drizzle-orm";
import { users } from "./users";
import { categories } from "./categories";
import { products, productVariants, productImages } from "./products";
import { customers } from "./customers";
import { orders, orderItems } from "./orders";
import { cartItems } from "./cart";
import { wishlist } from "./wishlist";
import { reviews } from "./reviews";

export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  wishlist: many(wishlist),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  cartItems: many(cartItems),
  wishlistItems: many(wishlist),
  reviews: many(reviews),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.product_id],
    references: [products.id],
  }),
  images: many(productImages),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.product_id],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variant_id],
    references: [productVariants.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customer_id],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.product_id],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variant_id],
    references: [productVariants.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.user_id],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.product_id],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variant_id],
    references: [productVariants.id],
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.user_id],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlist.product_id],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.product_id],
    references: [products.id],
  }),
}));
