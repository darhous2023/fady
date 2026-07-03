ALTER TABLE "orders" ALTER COLUMN "governorate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "preferred_date" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "branch" text;
