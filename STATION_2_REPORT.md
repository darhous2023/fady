# Station 2 Report — Database, Image, and Settings Audit + Admin CRUD Verification

**Date:** 2026-07-06
**Scope:** Read-only audit of the cars-catalog database (Neon) and the store's own settings (Supabase), plus a real, live E2E verification that the cars-catalog admin panel can add/edit/archive/delete — per explicit user request. No visual/hero work (that's Station 5, after Station 3's audit).

---

## 1. Cars-catalog database — full categorization (real counts, not estimates)

Queried directly against the live Neon database.

| Metric | Count |
|---|---|
| Total canonical cars | 1202 |
| Publication-eligible & visible to customers | **921** |
| Ineligible (excluded from the public site) | 281 |
| Admin-hidden (archived) | 0 |
| Rows missing a brand/model link | 0 |

**All 281 ineligible rows share exactly one reason** (`publication_reason = "source_status_missing"`) — a clean, fully-attributed exclusion, not a mystery bucket.

**Brands:** 392 total, 78 marked "public" (have ≥1 model). Of those 78, **9 had zero eligible cars** despite being publicly listed — see §4.

**Images:** 0 eligible/visible cars have zero image rows. Every visible car has at least one linked image row in the database.

**Duplicates:** 98 groups of rows sharing the same `displayName` + `year` (e.g. 3 near-identical Hyundai i30 2026 trims). This is a source-data/sync-engine characteristic — the `scraping` project is read-only to this repo, so no fix was attempted here; flagged for awareness only.

---

## 2. Image reachability — sample audit (not a full 60K+ crawl)

Sampled one main image per public brand (78 samples) via a real `HEAD` request against the URL the site actually renders (`remoteUrl` — `objectStorageUrl` is still null; the image-migration step hasn't run yet, so every photo is hotlinked from the original source site).

- **88.5% hit rate** (69/78 reachable, HTTP 200).
- The 9 "misses" were not broken links — they were brands whose first-sampled car had no image *linked at all in that specific slot* (see §4: these are the same 9 brands with zero eligible cars, so there was nothing valid to sample).
- **Honest limit:** this is a representative sample, not proof that all ~60,000 image links resolve. A wider/full crawl is a reasonable future task, not attempted here (would take hours and provide diminishing signal for a catalog this size).

---

## 3. Settings dead-key sweep (Supabase)

Compared the live `settings` table (35 real rows) against actual code usage.

- **`tiktok_url`** had a live admin input field (`SettingsForm.tsx`) and was exposed via `/api/store-config`, but is rendered **nowhere** on the storefront (confirmed: zero usages in `src/components/store/*`). Removed the admin field and the API exposure — a phantom setting the admin could fill in with zero effect.
- The still-wired `db:seed` script (`npm run db:seed`) seeded three stale/dead keys: `instagram_url` (superseded by `instagram_showroom_url`/`instagram_manager_url` since Station 3), `tiktok_url` (see above), and `free_shipping_threshold` (a pure e-commerce leftover, never read anywhere in the app). Removed all three.

---

## 4. Real bug found and fixed: 9 "public" brands led to a dead end

The audit surfaced something the CRUD test then made concrete: **Acura, Aston Martin, Fiat, Lexus, Lincoln, Mercedes, Saab, Tesla, and Volvo** all pass the sync engine's `isPublic` flag (they have ≥1 model) but have **zero publication-eligible cars**. Picking any of them from the brand dropdown or the homepage's top-brands grid led to a real "0 results" page with no explanation.

**Fix:** `getPublicBrands()` (elfady's own read-side function — the sync-owned `isPublic` column itself was not touched) now additionally requires at least one eligible, non-hidden car. Verified live: these 9 brands no longer appear in the picker.

Also confirmed a genuine near-duplicate: **"Mercedes" (3 models, 0 cars) vs. "Mercedes-Benz" (real, eligible cars)** — almost certainly the same real-world brand split by the source scraper into two DB rows. This is a source-data/sync-engine matter, out of scope for this repo to fix directly; flagged for awareness.

---

## 5. Admin CRUD verification — the user's explicit ask

> "تأكد ان الادمن يقدر يضيف يعدل يحذف يأرشف"

Verified with a **real, live E2E test against Production** (`fady-delta.vercel.app`), using a disposable, least-privilege temp admin account authenticated via Better Auth's own server API — never through the `/admin/login` form, per the standing rule. All 10 checks below are real HTTP requests against the real deployed API, not unit tests of internal functions:

| # | Action | Result |
|---|---|---|
| 1 | Create a brand | ✅ 201 |
| 2 | Create a model under that brand | ✅ 201 |
| 3 | Create a car under that model | ✅ 201 |
| 4 | Edit the car (admin notes + a field override) | ✅ override correctly reflected |
| 5 | **Archive the car** (hide it) | ❌ **first run: FAILED** — see below |
| 6 | Un-archive the car | ✅ (after fix) |
| 7 | Delete the car | ✅ 200 |
| 8 | Delete the model | ✅ 200 |
| 9 | Delete the brand | ✅ 200 |
| 10 | Confirm a **real synced** car cannot be hard-deleted | ✅ 409, left untouched |

**A real bug was caught by check #5 on the first run**: archiving a car (`adminHidden = true`) did **not** actually remove it from its public detail page — the page kept returning `200` for a car the admin had just hidden. Root cause: `getCanonicalCarDetail()` silently dropped `adminHidden` from its returned shape entirely, and the detail page never checked `publicationEligible` either, so both hidden and source-ineligible cars stayed fully reachable by direct URL.

**Fixed and re-verified**: `adminHidden` is now part of `CarsCanonicalDetail`, and `/new/car/[normalizedKey]` calls `notFound()` when a car is hidden or ineligible. Re-ran the full 10-check sequence after deploying the fix — **all 10 passed**, including confirming the archived car now correctly 404s and the un-archived car comes back.

All test data (the temp brand/model/car and the temp admin account itself) was created and deleted within this same session — nothing left behind, confirmed by a follow-up query finding zero leftover test rows.

---

## 6. Dependency cleanup

**9 npm packages confirmed unused anywhere in the codebase** (verified via `rg`, not `grep -r`, so results aren't polluted by `node_modules`): `@auth/supabase-adapter`, `@supabase/auth-helpers-nextjs`, `@vercel/kv`, `ahooks`, `bcrypt`, `bcryptjs`, `date-fns`, `fuse.js`, `stripe` — plus their `@types` packages. All removed. Vulnerability count dropped from 47 to 41 as a side effect.

**Env var documentation cleanup**: `.env.example` still listed `CARAPI_TOKEN`/`CARAPI_SECRET`/`ONEAUTO_API_KEY`/`KV_REST_API_URL`/`KV_REST_API_TOKEN` as if needed. Confirmed via the Vercel API that none of these are actually set on Production/Preview (they were already removed from the real environment in an earlier campaign) — this was documentation drift only. Cleaned up.

---

## 7. Verification

- `npm run build` — clean, twice (once after the dependency removal, once after the archive-bug fix).
- `npx vitest run` — 27/27 unit tests pass.
- `scripts/route-health-check.ts` against Production — **63/63 routes, zero unexpected 500/400**.
- Full admin CRUD E2E — 10/10 checks pass live on Production (see §5).
- Deployed commit `1618168`, tagged and released as `v1.1.0` alongside the Immediate fix + Station 1.

## What was explicitly NOT done (honest limits, not silently skipped)

- The 98 duplicate-listing groups and the Mercedes/Mercedes-Benz split are source-data issues in the separate `scraping` project — read-only to this repo, not touched.
- The 88.5% image hit-rate is a 1-per-brand sample, not a full 60K-link crawl.
- Backup/PITR, hosting migration — still out of scope per the locked plan.
