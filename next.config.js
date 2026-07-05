const getSupabaseHostname = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

const supabaseHostname = getSupabaseHostname();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Only include Supabase pattern if URL is configured
      ...(supabaseHostname
        ? [
            {
              protocol: "https",
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    // Static assets committed to the repo (logo/icons) only change via a new
    // deploy, never at runtime — safe to cache for a year. Deliberately
    // excludes manifest.json and sw.js, which must stay revalidatable.
    return [
      {
        source: "/:path(logo-400.png|logo.png|icon-192.png|icon-512.png|main-image.webp|next.svg|vercel.svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

module.exports = nextConfig;
