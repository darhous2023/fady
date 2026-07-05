CREATE TABLE "admin_overrides" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"field" text NOT NULL,
	"original_value" text,
	"override_value" text NOT NULL,
	"reason" text,
	"updated_by" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aliases" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"alias_ar" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text,
	"logo_url" text,
	"model_count" integer DEFAULT 0 NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "canonical_cars" (
	"normalized_key" text PRIMARY KEY NOT NULL,
	"source_canonical_id" text NOT NULL,
	"brand_id" text,
	"model_id" text,
	"generation_id" text,
	"trim_id" text,
	"display_name" text NOT NULL,
	"year" integer,
	"body_type" text,
	"engine" text,
	"transmission" text,
	"fuel_type" text,
	"drivetrain" text,
	"seating_capacity" integer,
	"doors" integer,
	"power_hp" numeric,
	"torque_nm" numeric,
	"source_is_current" boolean DEFAULT false NOT NULL,
	"source_status" text,
	"source_review_status" text DEFAULT 'needs_review' NOT NULL,
	"publication_eligible" boolean DEFAULT false NOT NULL,
	"publication_reason" text,
	"admin_hidden" boolean DEFAULT false NOT NULL,
	"admin_notes" text,
	"source_listing_id" text,
	"source_url" text,
	"last_scraped_at" timestamp,
	"last_synced_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canonical_car_images" (
	"id" text PRIMARY KEY NOT NULL,
	"canonical_key" text NOT NULL,
	"image_id" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"alt_text" text,
	CONSTRAINT "canonical_car_images_unique" UNIQUE("canonical_key","image_id")
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" text PRIMARY KEY NOT NULL,
	"model_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"production_start" text,
	"production_end" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" text PRIMARY KEY NOT NULL,
	"content_hash" text,
	"remote_url" text,
	"object_storage_url" text,
	"object_storage_key" text,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"slug" text NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text,
	"body_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_index" (
	"canonical_key" text PRIMARY KEY NOT NULL,
	"brand" text,
	"model" text,
	"generation" text,
	"trim" text,
	"year" integer,
	"body_type" text,
	"fuel_type" text,
	"transmission" text,
	"drivetrain" text,
	"power_hp" numeric,
	"torque_nm" numeric,
	"search_text_en" text NOT NULL,
	"search_text_ar" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canonical_car_specs" (
	"id" text PRIMARY KEY NOT NULL,
	"canonical_key" text NOT NULL,
	"section_key" text NOT NULL,
	"group_name" text NOT NULL,
	"label" text NOT NULL,
	"normalized_key" text,
	"value_text" text NOT NULL,
	"value_number" numeric,
	"unit" text,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"dataset_version" text NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"mode" text DEFAULT 'incremental' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"steps_completed" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"counts" jsonb,
	"error_message" text,
	"last_checkpoint_step" text,
	"last_checkpoint_offset" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "trims" (
	"id" text PRIMARY KEY NOT NULL,
	"generation_id" text,
	"model_id" text NOT NULL,
	"year" text,
	"name_en" text NOT NULL,
	"category" text,
	"engine_key" text,
	"transmission_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "canonical_cars" ADD CONSTRAINT "canonical_cars_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canonical_cars" ADD CONSTRAINT "canonical_cars_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canonical_cars" ADD CONSTRAINT "canonical_cars_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canonical_cars" ADD CONSTRAINT "canonical_cars_trim_id_trims_id_fk" FOREIGN KEY ("trim_id") REFERENCES "public"."trims"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canonical_car_images" ADD CONSTRAINT "canonical_car_images_canonical_key_canonical_cars_normalized_key_fk" FOREIGN KEY ("canonical_key") REFERENCES "public"."canonical_cars"("normalized_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canonical_car_images" ADD CONSTRAINT "canonical_car_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_index" ADD CONSTRAINT "search_index_canonical_key_canonical_cars_normalized_key_fk" FOREIGN KEY ("canonical_key") REFERENCES "public"."canonical_cars"("normalized_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canonical_car_specs" ADD CONSTRAINT "canonical_car_specs_canonical_key_canonical_cars_normalized_key_fk" FOREIGN KEY ("canonical_key") REFERENCES "public"."canonical_cars"("normalized_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trims" ADD CONSTRAINT "trims_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trims" ADD CONSTRAINT "trims_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "aliases_entity_idx" ON "aliases" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "canonical_cars_brand_idx" ON "canonical_cars" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "canonical_cars_model_idx" ON "canonical_cars" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "canonical_cars_public_idx" ON "canonical_cars" USING btree ("publication_eligible","admin_hidden");--> statement-breakpoint
CREATE INDEX "canonical_cars_body_type_idx" ON "canonical_cars" USING btree ("body_type");--> statement-breakpoint
CREATE INDEX "canonical_cars_fuel_type_idx" ON "canonical_cars" USING btree ("fuel_type");--> statement-breakpoint
CREATE INDEX "canonical_cars_year_idx" ON "canonical_cars" USING btree ("year");--> statement-breakpoint
CREATE INDEX "canonical_car_images_order_idx" ON "canonical_car_images" USING btree ("canonical_key","order");--> statement-breakpoint
CREATE INDEX "cars_images_hash_idx" ON "images" USING btree ("content_hash");--> statement-breakpoint
CREATE INDEX "search_index_brand_model_year_idx" ON "search_index" USING btree ("brand","model","year");--> statement-breakpoint
CREATE INDEX "search_index_fuel_type_idx" ON "search_index" USING btree ("fuel_type");--> statement-breakpoint
CREATE INDEX "search_index_body_type_idx" ON "search_index" USING btree ("body_type");--> statement-breakpoint
CREATE INDEX "canonical_car_specs_canonical_idx" ON "canonical_car_specs" USING btree ("canonical_key","section_key");--> statement-breakpoint
CREATE INDEX "canonical_car_specs_key_idx" ON "canonical_car_specs" USING btree ("normalized_key");