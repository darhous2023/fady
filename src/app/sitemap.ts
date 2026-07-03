import { db } from "@/lib/db/drizzle/connection"
import { products } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import type { MetadataRoute } from "next"

const BASE = "https://your-store.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let allProducts: { slug: string; updated_at: Date | null }[] = []
  try {
    allProducts = await db.select({ slug: products.slug, updated_at: products.updated_at })
      .from(products).where(eq(products.status, "active"))
  } catch { /* DB unavailable, return static routes only */ }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/sale`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/wishlist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/cart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/track`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  const productRoutes: MetadataRoute.Sitemap = (allProducts ?? []).map(p => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: p.updated_at ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
