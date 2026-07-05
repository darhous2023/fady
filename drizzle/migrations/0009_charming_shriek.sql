CREATE TABLE "financing_partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"subtitle_ar" text,
	"logo_url" text,
	"link" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "financing_partners" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Anyone can view active financing partners" ON "financing_partners" AS PERMISSIVE FOR SELECT TO "anon" USING (is_active = true);