// Users (Better Auth managed)
export {
  users,
  selectUserSchema,
  insertUserSchema,
  updateUserSchema,
  type SelectUser,
  type InsertUser,
  type UpdateUser,
} from "./users";

// Categories
export {
  categories,
  selectCategorySchema,
  insertCategorySchema,
  type Category,
  type InsertCategory,
} from "./categories";

// Products
export {
  qualityTierEnum,
  productStatusEnum,
  QualityTierZod,
  ProductStatusZod,
  products,
  productVariants,
  productImages,
  selectProductSchema,
  insertProductSchema,
  updateProductSchema,
  selectVariantSchema,
  insertVariantSchema,
  selectImageSchema,
  insertImageSchema,
  type Product,
  type InsertProduct,
  type UpdateProduct,
  type ProductVariant,
  type InsertProductVariant,
  type ProductImage,
  type InsertProductImage,
  type QualityTier,
  type ProductStatus,
} from "./products";

// Customers
export {
  customers,
  selectCustomerSchema,
  insertCustomerSchema,
  type Customer,
  type InsertCustomer,
} from "./customers";

// Orders
export {
  orderStatusEnum,
  orderMethodEnum,
  OrderStatusZod,
  OrderMethodZod,
  orders,
  orderItems,
  selectOrderSchema,
  insertOrderSchema,
  selectOrderItemSchema,
  insertOrderItemSchema,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderStatus,
  type OrderMethod,
} from "./orders";

// Admins
export {
  adminRoleEnum,
  admins,
  selectAdminSchema,
  insertAdminSchema,
  type Admin,
  type InsertAdmin,
  type AdminRole,
} from "./admins";

// Shipping
export {
  shippingZones,
  selectShippingZoneSchema,
  insertShippingZoneSchema,
  type ShippingZone,
  type InsertShippingZone,
} from "./shipping";

// Discounts
export {
  discountTypeEnum,
  discountCodes,
  selectDiscountCodeSchema,
  insertDiscountCodeSchema,
  type DiscountCode,
  type InsertDiscountCode,
} from "./discounts";

// Reviews
export {
  reviews,
  selectReviewSchema,
  insertReviewSchema,
  type Review,
  type InsertReview,
} from "./reviews";

// Banners
export {
  banners,
  selectBannerSchema,
  insertBannerSchema,
  type Banner,
  type InsertBanner,
} from "./banners";

// Settings
export {
  settings,
  selectSettingSchema,
  insertSettingSchema,
  type Setting,
  type InsertSetting,
} from "./settings";

// Cart
export {
  cartItems,
  selectCartItemSchema,
  insertCartItemSchema,
  updateCartItemSchema,
  addToCartSchema,
  type CartItem,
  type InsertCartItem,
  type UpdateCartItem,
  type AddToCartInput,
} from "./cart";

// Wishlist
export {
  wishlist,
  selectWishlistItemSchema,
  insertWishlistItemSchema,
  addToWishlistSchema,
  type WishlistItem,
  type InsertWishlistItem,
  type AddToWishlistInput,
} from "./wishlist";

// Relations
export {
  usersRelations,
  categoriesRelations,
  productsRelations,
  productVariantsRelations,
  productImagesRelations,
  customersRelations,
  ordersRelations,
  orderItemsRelations,
  cartItemsRelations,
  wishlistRelations,
  reviewsRelations,
} from "./relations";
