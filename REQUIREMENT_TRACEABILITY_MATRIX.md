# Requirement Traceability Matrix + Route Inventory

> Built as part of the Master Final Delivery campaign (Station 1, task #76). Maps every real route in the app to the feature/requirement it serves, its data source, its admin control surface, and its test/verification evidence. Source of truth: a live scan of `src/app/**/{page,route}.{ts,tsx}` on 2026-07-05, not a design doc.

## Storefront routes

| Route | Feature | Data source | Admin control | Verified live |
|---|---|---|---|---|
| `/` | Home (hero, gateways, marquee, pillars, showroom video) | `settings` (27 keys) | `/admin/home` | Yes (Master Delivery baseline) |
| `/used` | Used-cars listing + cinematic hero | `products`, `categories`, `settings` (`used_hero_*`) | `/admin/products`, `/admin/home` | Yes |
| `/new` | New-cars gateway (Neon catalog) | `CARS_DATABASE_URL` (Neon) | None yet — **gap, see Station 2** | Yes (921 real cars live) |
| `/new/browse` | New-cars filtered grid | Neon catalog | None yet | Yes |
| `/new/car/[normalizedKey]` | New-car detail | Neon catalog | None yet | Yes |
| `/products/[slug]` | Used-car detail (gallery, 360, reviews, share) | `products`, `product_images`, `product_360_frames`, `reviews` | `/admin/products/[id]/edit` | Yes |
| `/cart` | Viewing shortlist | Client-side `CartContext` | N/A (client state) | Yes |
| `/checkout` | Booking request form | `orders`, `order_items`, `customers` | `/admin/orders` | Yes |
| `/order-confirmed` | Booking confirmation | `orders` | `/admin/orders` | Yes |
| `/track` | Phone-based booking tracker | `orders` (by phone, trailing-digit match) | `/admin/orders/[id]` | Yes |
| `/wishlist` | Saved cars | `wishlist` (RLS: owner-only) | N/A | Yes |
| `/account`, `/account/profile`, `/account/orders` | Customer account | `customers`, `orders`, Better Auth `user` | N/A | Yes |
| `/signin`, `/signup` | Customer auth | Better Auth (`user`/`session`/`account`) | N/A | Yes |
| `/about`, `/faq`, `/privacy`, `/returns`, `/sale` | Static/policy content | Hardcoded copy (car-showroom-specific, rewritten Phase 9) | None (deliberate — policy text) | Yes |
| `/guide` | Customer-facing showroom guide | Hardcoded copy | None (deliberate) | Yes |

## Admin routes

| Route | Feature | Backing API | RLS-safe (Stage H fix) |
|---|---|---|---|
| `/admin` (redirect), `/admin/login` | Admin auth | Better Auth + `admins` table | Yes |
| `/admin/dashboard` | KPIs, visitor analytics, most-viewed cars | `/api/admin/*`, `page_views` | Yes |
| `/admin/products`, `/admin/products/create`, `/admin/products/[id]/edit` | Used-car CRUD, images, 360 frames | `/api/admin/products/*` | Yes |
| `/admin/categories` | Brand CRUD | `/api/admin/categories/*` | Yes |
| `/admin/banners` | Homepage banner CRUD | `/api/admin/banners/*` | Yes |
| `/admin/discounts` | Discount code CRUD | `/api/admin/discounts/*` | Yes |
| `/admin/orders`, `/admin/orders/[id]` | Booking management + status stepper | `/api/admin/orders/*` | Yes |
| `/admin/reviews` | Review moderation + admin-authored reviews | `/api/admin/reviews/*` | Yes |
| `/admin/customers` | Customer list | `/api/admin/customers` | Yes |
| `/admin/admins` | Admin account management | `/api/admin/admins/*` | Yes |
| `/admin/settings` | Global site settings | `/api/admin/settings` | Yes |
| `/admin/home` | Home page content (27 settings keys) | `/api/admin/settings` | Yes |
| `/admin/shipping` | **Orphaned** — booking flow doesn't use shipping zones since Phase 8 | `/api/admin/shipping/*` | Yes (low-priority cleanup candidate, not urgent) |
| `/admin/flash-deals` | Homepage flash-deals section (`FlashDeals.tsx`, discount-code-linked countdown) | `/api/admin/discounts/*` (flash deals are discount codes with a `flash_deals_*` settings-driven title/end time) | Yes |
| `/admin/guide`, `/admin/guide/print`, `/admin/guide/handover` | Admin onboarding docs | Hardcoded copy (rewritten this campaign) | N/A |

## New-cars gateway — requirement coverage (the actual ask of Station 2)

| Requirement | Status before Station 2 | Route/API |
|---|---|---|
| Browse by brand/model/generation/trim | Done (Phase migration) | `/new`, `/new/browse` |
| Full car detail page | Done | `/new/car/[normalizedKey]` |
| **Search** | **Missing** | — |
| **Compare** | **Missing** | — |
| **Favorites** | **Missing** | — |
| **Unified multi-image system (parity with used-cars)** | **Missing** — catalog images render as a single image, no gallery/lightbox | — |
| **Admin CRUD (brands/models/generations/trims)** | **Missing** — Neon catalog is sync-only, no admin write path | — |
| CarAPI legacy code removed | **Not done** — `src/lib/carapi.ts`, 4 `api/new-cars/*` routes, `NewCarsBrowser.tsx` still on disk, zero functional imports (re-confirmed) | — |

## Security/audit findings (traced to fix commits)

| Finding | Severity | Fix commit |
|---|---|---|
| `CARS_DATABASE_URL` unset crashes entire Vercel build | Critical | `3651577` |
| `EMAXCONNSESSION` connection-pool exhaustion (session-mode pooler) | Critical | `4e91fc7` (mitigation) + live `DATABASE_URL` port fix (Stage F) |
| 18 tables' RLS "backend" policy silently bypassable via public anon key under new Supabase key format | **Critical** | `adef1b8` |
| `session`/`account`/`verification` had no RLS at all | **Critical** | `adef1b8` |
| 6 used-car demo photos showing the wrong car | Medium (data integrity, not security) | `dd90294` |
| Dead fake-rating/fake-stock-status stub file | Low | `1b5e92d` |

## Test coverage (honest gap disclosure)

Only 1 test file exists in the whole project: `src/lib/cars/arabicSearch.test.ts` (11 unit tests, Arabic search normalization/alias expansion). **No E2E test suite, no admin-flow tests, no route-level integration tests exist yet** — this is `#87` in the standing TODO, not yet started. All verification in this campaign has been real but manual: live `curl`/API checks against Production, not an automated suite. Do not claim "tested" beyond what `arabicSearch.test.ts` actually covers.
