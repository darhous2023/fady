CREATE TYPE "public"."admin_role" AS ENUM('owner', 'manager', 'staff');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('percent', 'fixed');--> statement-breakpoint
CREATE TYPE "public"."order_method" AS ENUM('whatsapp', 'cod');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('active', 'draft', 'archived');--> statement-breakpoint
CREATE TYPE "public"."quality_tier" AS ENUM('hi_copy', 'mirror', 'original');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "admin_role" DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "admins_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"title_ar" text,
	"link" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "banners" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "cart_user_product_variant_unique" UNIQUE("user_id","product_id","variant_id"),
	CONSTRAINT "cart_quantity_positive" CHECK (quantity > 0)
);
--> statement-breakpoint
ALTER TABLE "cart_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" text,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "customers_auth_user_id_unique" UNIQUE("auth_user_id")
);
--> statement-breakpoint
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "discount_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"type" "discount_type" NOT NULL,
	"value" numeric(8, 2) NOT NULL,
	"min_order" numeric(10, 2) DEFAULT '0' NOT NULL,
	"max_uses" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "discount_codes_code_unique" UNIQUE("code"),
	CONSTRAINT "value_positive" CHECK (value > 0),
	CONSTRAINT "used_count_non_negative" CHECK (used_count >= 0)
);
--> statement-breakpoint
ALTER TABLE "discount_codes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"product_name" text NOT NULL,
	"quality_tier" text NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "qty_positive" CHECK (qty > 0)
);
--> statement-breakpoint
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"customer_id" uuid,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"governorate" text NOT NULL,
	"address" text NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"method" "order_method" DEFAULT 'cod' NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"discount_code" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "subtotal_positive" CHECK (subtotal >= 0),
	CONSTRAINT "total_positive" CHECK (total >= 0)
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"url" text NOT NULL,
	"alt_ar" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"color_ar" text,
	"size" text,
	"sku" text,
	"stock" integer DEFAULT 0 NOT NULL,
	"price_override" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "stock_non_negative" CHECK (stock >= 0)
);
--> statement-breakpoint
ALTER TABLE "product_variants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"slug" text NOT NULL,
	"description_ar" text,
	"category_id" uuid NOT NULL,
	"quality_tier" "quality_tier" NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"compare_at_price" numeric(10, 2),
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "price_positive" CHECK (price > 0)
);
--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"customer_name" text NOT NULL,
	"rating" integer NOT NULL,
	"comment_ar" text,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "rating_range" CHECK (rating >= 1 AND rating <= 5)
);
--> statement-breakpoint
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "shipping_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"governorate_ar" text NOT NULL,
	"cost" numeric(8, 2) DEFAULT '50' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "shipping_zones_governorate_ar_unique" UNIQUE("governorate_ar")
);
--> statement-breakpoint
ALTER TABLE "shipping_zones" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "wishlist_user_product_unique" UNIQUE("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "wishlist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_admins_auth_user_id" ON "admins" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "idx_admins_email" ON "admins" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_cart_user_id" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_customers_phone" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "idx_customers_auth_user_id" ON "customers" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_order_id" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_customer_id" ON "orders" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_orders_created_at" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_orders_phone" ON "orders" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "idx_images_product_id" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_variants_product_id" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_products_category_id" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_products_status" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_products_featured" ON "products" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "idx_reviews_product_id" ON "reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_reviews_approved" ON "reviews" USING btree ("is_approved");--> statement-breakpoint
CREATE INDEX "idx_user_email" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_user_created_at" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_wishlist_user_id" ON "wishlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_wishlist_product_id" ON "wishlist" USING btree ("product_id");--> statement-breakpoint
CREATE POLICY "Backend can manage admins" ON "admins" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Backend can manage banners" ON "banners" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view active banners" ON "banners" AS PERMISSIVE FOR SELECT TO "anon" USING (is_active = true);--> statement-breakpoint
CREATE POLICY "Users can manage own cart" ON "cart_items" AS PERMISSIVE FOR ALL TO public USING (app.current_user_id() = user_id) WITH CHECK (app.current_user_id() = user_id);--> statement-breakpoint
CREATE POLICY "Backend can manage all cart items" ON "cart_items" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Backend can manage categories" ON "categories" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view active categories" ON "categories" AS PERMISSIVE FOR SELECT TO "anon" USING (is_active = true);--> statement-breakpoint
CREATE POLICY "Backend can manage customers" ON "customers" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Backend can manage discount codes" ON "discount_codes" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Backend can manage order items" ON "order_items" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Backend can manage orders" ON "orders" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Backend can manage images" ON "product_images" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view images" ON "product_images" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Backend can manage variants" ON "product_variants" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view variants" ON "product_variants" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Backend can manage products" ON "products" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view active products" ON "products" AS PERMISSIVE FOR SELECT TO "anon" USING (status = 'active');--> statement-breakpoint
CREATE POLICY "Backend can manage reviews" ON "reviews" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view approved reviews" ON "reviews" AS PERMISSIVE FOR SELECT TO "anon" USING (is_approved = true);--> statement-breakpoint
CREATE POLICY "Anyone can insert reviews" ON "reviews" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Backend can manage settings" ON "settings" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can read settings" ON "settings" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Backend can manage shipping zones" ON "shipping_zones" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view shipping zones" ON "shipping_zones" AS PERMISSIVE FOR SELECT TO "anon" USING (is_active = true);--> statement-breakpoint
CREATE POLICY "Backend can manage auth users" ON "user" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Users can view own profile" ON "user" AS PERMISSIVE FOR SELECT TO public USING (app.current_user_id() = id);--> statement-breakpoint
CREATE POLICY "Users can update own profile" ON "user" AS PERMISSIVE FOR UPDATE TO public USING (app.current_user_id() = id) WITH CHECK (app.current_user_id() = id);--> statement-breakpoint
CREATE POLICY "Users can manage own wishlist" ON "wishlist" AS PERMISSIVE FOR ALL TO public USING (app.current_user_id() = user_id) WITH CHECK (app.current_user_id() = user_id);--> statement-breakpoint
CREATE POLICY "Backend can manage all wishlists" ON "wishlist" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);
