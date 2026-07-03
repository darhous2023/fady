import type { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://fady-delta.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin", "/api/auth", "/account", "/cart", "/checkout", "/order-confirmed"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
