CREATE TABLE "product_360_frames" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sequence_index" integer DEFAULT 0 NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "product_360_frames" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_360_frames" ADD CONSTRAINT "product_360_frames_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_360_frames_product_id" ON "product_360_frames" USING btree ("product_id");--> statement-breakpoint
CREATE POLICY "Backend can manage 360 frames" ON "product_360_frames" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can view 360 frames" ON "product_360_frames" AS PERMISSIVE FOR SELECT TO "anon" USING (true);