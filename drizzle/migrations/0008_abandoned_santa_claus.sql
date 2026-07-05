DROP POLICY "Backend can manage admins" ON "admins" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage banners" ON "banners" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage all cart items" ON "cart_items" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage categories" ON "categories" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage customers" ON "customers" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage discount codes" ON "discount_codes" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage order items" ON "order_items" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage orders" ON "orders" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage page views" ON "page_views" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage 360 frames" ON "product_360_frames" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage images" ON "product_images" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage variants" ON "product_variants" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage products" ON "products" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage reviews" ON "reviews" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage settings" ON "settings" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage shipping zones" ON "shipping_zones" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage auth users" ON "user" CASCADE;--> statement-breakpoint
DROP POLICY "Backend can manage all wishlists" ON "wishlist" CASCADE;--> statement-breakpoint
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;