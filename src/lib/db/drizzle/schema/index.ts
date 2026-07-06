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
  product360Frames,
  selectProductSchema,
  insertProductSchema,
  updateProductSchema,
  selectVariantSchema,
  insertVariantSchema,
  selectImageSchema,
  insertImageSchema,
  select360FrameSchema,
  insert360FrameSchema,
  type Product,
  type InsertProduct,
  type UpdateProduct,
  type ProductVariant,
  type InsertProductVariant,
  type ProductImage,
  type InsertProductImage,
  type Product360Frame,
  type InsertProduct360Frame,
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

// Financing partners
export {
  financingPartners,
  selectFinancingPartnerSchema,
  insertFinancingPartnerSchema,
  type FinancingPartner,
  type InsertFinancingPartner,
} from "./financingPartners";

// Partner logos (independent strip under the Hero)
export {
  partnerLogos,
  selectPartnerLogoSchema,
  insertPartnerLogoSchema,
  type PartnerLogo,
  type InsertPartnerLogo,
} from "./partnerLogos";

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

// Page views (internal analytics)
export {
  pageViews,
  selectPageViewSchema,
  insertPageViewSchema,
  type PageView,
  type InsertPageView,
} from "./pageViews";

// Relations
export {
  usersRelations,
  categoriesRelations,
  productsRelations,
  productVariantsRelations,
  productImagesRelations,
  product360FramesRelations,
  customersRelations,
  ordersRelations,
  orderItemsRelations,
  cartItemsRelations,
  wishlistRelations,
  reviewsRelations,
} from "./relations";
