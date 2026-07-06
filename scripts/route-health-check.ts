// Crawls every known real route (storefront + admin + API) and reports its
// HTTP status. Flags anything >= 500 as a hard failure, and anything in the
// 400s that ISN'T an expected auth/validation response as a warning.
// Usage: npx tsx scripts/route-health-check.ts [baseUrl]
// Defaults to the live production URL.

export {};

const BASE = process.argv[2] || "https://fady-delta.vercel.app";

interface RouteCheck {
  path: string;
  expect?: number[]; // acceptable status codes; defaults to [200, 307, 308]
}

const STATIC_ROUTES: RouteCheck[] = [
  { path: "/" },
  { path: "/new" },
  { path: "/new/browse" },
  { path: "/new/search" },
  { path: "/new/compare" },
  { path: "/new/favorites" },
  { path: "/used" },
  { path: "/about" },
  { path: "/faq" },
  { path: "/privacy" },
  { path: "/returns" },
  { path: "/sale" },
  { path: "/guide" },
  { path: "/cart" },
  { path: "/checkout" },
  { path: "/track" },
  { path: "/wishlist" },
  { path: "/signin" },
  { path: "/signup" },
  { path: "/order-confirmed" },
  { path: "/account/profile" },
  { path: "/account/orders" },
  { path: "/sitemap.xml" },
  { path: "/robots.txt" },
  { path: "/manifest.json" },
  { path: "/icon.png" },
  { path: "/opengraph-image" },
  // Admin pages with no session should redirect to login (307/308), never 500.
  { path: "/admin/login" },
  { path: "/admin/dashboard", expect: [200, 307, 308] },
  { path: "/admin/products", expect: [200, 307, 308] },
  { path: "/admin/categories", expect: [200, 307, 308] },
  { path: "/admin/banners", expect: [200, 307, 308] },
  { path: "/admin/financing-partners", expect: [200, 307, 308] },
  { path: "/admin/partner-logos", expect: [200, 307, 308] },
  { path: "/admin/discounts", expect: [200, 307, 308] },
  { path: "/admin/orders", expect: [200, 307, 308] },
  { path: "/admin/reviews", expect: [200, 307, 308] },
  { path: "/admin/customers", expect: [200, 307, 308] },
  { path: "/admin/admins", expect: [200, 307, 308] },
  { path: "/admin/settings", expect: [200, 307, 308] },
  { path: "/admin/home", expect: [200, 307, 308] },
  { path: "/admin/cars-catalog", expect: [200, 307, 308] },
  { path: "/admin/guide", expect: [200, 307, 308] },
  // Public read APIs.
  { path: "/api/store-config" },
  { path: "/api/products" },
  { path: "/api/announcement" },
  { path: "/api/order-status-labels" },
  { path: "/api/new-cars/compare" },
  // Admin-gated APIs with no session must be 401, never 500.
  { path: "/api/admin/banners", expect: [401] },
  { path: "/api/admin/financing-partners", expect: [401] },
  { path: "/api/admin/partner-logos", expect: [401] },
  { path: "/api/admin/products", expect: [401] },
  { path: "/api/admin/categories", expect: [401] },
  { path: "/api/admin/discounts", expect: [401] },
  { path: "/api/admin/orders/export", expect: [401] },
  { path: "/api/admin/reviews", expect: [401] },
  { path: "/api/admin/customers", expect: [401] },
  { path: "/api/admin/admins", expect: [401] },
  { path: "/api/admin/settings", expect: [401] },
  { path: "/api/admin/cars-catalog/brands", expect: [401] },
  { path: "/api/admin/cars-catalog/models", expect: [401] },
  { path: "/api/admin/cars-catalog/cars", expect: [401] },
  // Intentional 404s must stay 404, never 500.
  { path: "/products/this-slug-does-not-exist", expect: [404] },
  { path: "/this-route-does-not-exist-at-all", expect: [404] },
];

async function check(base: string, r: RouteCheck): Promise<{ path: string; status: number; ok: boolean }> {
  const expect = r.expect || [200, 307, 308];
  try {
    const res = await fetch(base + r.path, { redirect: "manual" });
    return { path: r.path, status: res.status, ok: expect.includes(res.status) };
  } catch {
    return { path: r.path, status: 0, ok: false };
  }
}

async function getDynamicRoutes(base: string): Promise<RouteCheck[]> {
  const dynamic: RouteCheck[] = [];
  try {
    const res = await fetch(base + "/api/products");
    const json = await res.json();
    const arr = Array.isArray(json) ? json : (json.products ?? []);
    if (arr[0]?.slug) dynamic.push({ path: `/products/${arr[0].slug}` });
  } catch { /* non-fatal: dynamic route check just gets skipped */ }
  return dynamic;
}

async function main() {
  console.log(`Route health check against ${BASE}\n`);
  const dynamicRoutes = await getDynamicRoutes(BASE);
  const all = [...STATIC_ROUTES, ...dynamicRoutes];

  const results = await Promise.all(all.map((r) => check(BASE, r)));

  let failures = 0;
  for (const r of results) {
    const marker = r.ok ? "OK " : "FAIL";
    if (!r.ok) failures++;
    console.log(`${marker}  ${r.status}  ${r.path}`);
  }

  console.log(`\n${results.length - failures}/${results.length} routes passed.`);
  if (failures > 0) {
    console.error(`${failures} route(s) returned an unexpected status.`);
    process.exit(1);
  }
}

main();
