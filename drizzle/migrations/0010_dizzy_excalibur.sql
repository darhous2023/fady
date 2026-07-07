CREATE TABLE "partner_logos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo_url" text NOT NULL,
	"link" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "partner_logos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Anyone can view active partner logos" ON "partner_logos" AS PERMISSIVE FOR SELECT TO "anon" USING (is_active = true);