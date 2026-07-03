# Project Context

## Confirmed Facts

- Source project inspected read-only: `C:\Users\ahmed\Desktop\shahy store`.
- Source branch was clean at inspection: `main...origin/main`.
- Source remote: `https://github.com/Darhous/ShahY-Store.git`.
- Source latest inspected commit: `25ed027`.
- Package manager: npm with `package-lock.json`.
- Framework stack from `package.json`: Next.js `^16.1.1`, React `^19.2.0`, TypeScript `5.9.3`, Drizzle ORM `^0.45.1`, Better Auth `^1.3.28`, Supabase JS `^2.49.4`, Tailwind CSS `^3.4.18`.
- Database connection: `src/lib/db/drizzle/connection.ts` uses `DATABASE_URL` with `postgres` and Drizzle.
- Auth: `src/utils/auth.ts` uses Better Auth with Postgres and the `admin()` plugin.
- Admin route guard: `src/proxy.ts` protects `/admin/*` except `/admin/login` by requiring a session.
- Storefront products are database-driven in `src/app/page.tsx` through Drizzle selects from `products`, `productImages`, `categories`, `settings`, `productVariants`, and `banners`.
- Admin routes exist for products, orders, reviews, categories, shipping, discounts, banners, flash deals, customers, admins, settings, and guides under `src/app/admin`.
- Admin APIs exist under `src/app/api/admin`.
- Storage upload route: `src/app/api/admin/upload/route.ts` uploads to Supabase Storage bucket `product-images` using server-only `SUPABASE_SERVICE_ROLE_KEY`.

## Strongly Inferred Facts

- RLS is declared in Drizzle schema files with `pgPolicy(...).enableRLS()`.
- Server-side routes use privileged database access; route-level auth is the practical admin boundary.
- Some guide and historical files contain ShahY-specific operational content that must be treated as historical or demo content in this template.

## Historical Information

- Shared memory says ShahY Store reached v2.1.0 with live Vercel deployment and Phase 5 handoff work.
- Shared memory reports the live URL as `https://shah-y-store.vercel.app` and admin login as `/admin/login`.
- Historical notes mention GA4, avatar uploads, banner uploads, admin guide/handover, and Vercel cleanup.

## Unknown Information

- Live Vercel behavior must be verified independently.
- Supabase production schema beyond tracked migrations/types is not authenticated in this execution yet.
- GitHub PR/issues/actions require GitHub authentication and have not yet been inspected.

## Source-of-truth Documents

- Architecture: `docs/ARCHITECTURE.md`
- Admin: `docs/ADMIN_DASHBOARD.md`, `docs/ADMIN_CAPABILITY_MATRIX.md`
- Data ownership: `docs/DATA_OWNERSHIP.md`
- Database/Supabase: `docs/DATABASE_AND_SUPABASE.md`
- Deployment: `docs/DEPLOYMENT_AND_VERCEL.md`
- Security: `docs/SECURITY_AND_SECRETS.md`
- Handoff: `docs/FINAL_HANDOFF.md`
