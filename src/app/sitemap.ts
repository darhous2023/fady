import { db } from "@/lib/db/drizzle/connection"
import { products, categories } from "@/lib/db/drizzle/schema"
import { eq } from "drizzle-orm"
import type { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://fady-delta.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let allProducts: { slug: string; updated_at: Date | null }[] = []
  let allCategories: { slug: string }[] = []
  try {
    ;[allProducts, allCategories] = await Promise.all([
      db.select({ slug: products.slug, updated_at: products.updated_at })
        .from(products).where(eq(products.status, "active")),
      db.select({ slug: categories.slug })
        .from(categories).where(eq(categories.is_active, true)),
    ])
  } catch { /* DB unavailable, return static routes only */ }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/new`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/used`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/sale`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/returns`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = (allCategories ?? []).map(c => ({
    url: `${BASE}/used?brand=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const productRoutes: MetadataRoute.Sitemap = (allProducts ?? []).map(p => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: p.updated_at ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
