CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text NOT NULL,
	"visitor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "page_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "idx_page_views_created_at" ON "page_views" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_page_views_path" ON "page_views" USING btree ("path");--> statement-breakpoint
CREATE INDEX "idx_page_views_visitor_id" ON "page_views" USING btree ("visitor_id");--> statement-breakpoint
CREATE POLICY "Backend can manage page views" ON "page_views" AS PERMISSIVE FOR ALL TO public USING (current_setting('request.jwt.claim.role', true) is null) WITH CHECK (current_setting('request.jwt.claim.role', true) is null);--> statement-breakpoint
CREATE POLICY "Anyone can record a page view" ON "page_views" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK (true);