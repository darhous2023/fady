import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function setupStorage() {
  console.log("🪣 Setting up Supabase Storage buckets...");

  // Products images bucket
  const { data, error } = await supabase.storage.createBucket("products", {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  });

  if (error && error.message !== "The resource already exists") {
    console.error("❌ Products bucket error:", error.message);
  } else {
    console.log("  ✓ products bucket ready");
  }

  // Banners bucket
  const { error: bannerError } = await supabase.storage.createBucket("banners", {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (bannerError && bannerError.message !== "The resource already exists") {
    console.error("❌ Banners bucket error:", bannerError.message);
  } else {
    console.log("  ✓ banners bucket ready");
  }

  console.log("✅ Storage setup complete!");
}

setupStorage().catch(console.error);
