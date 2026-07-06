# Cars Catalog Image Cleanup — Review + Production Adoption Report

Date: 2026-07-06

## What this covers

A separate Codex session ran a full read-only-then-guarded-write audit of the cars catalog's image data on an isolated Neon branch (`image-cleanup-audit-20260706-0915` / `br-shy-cherry-as82mazk`, forked from production branch `br-late-glitter-aschag4p`). This report documents an **independent verification** of that work (not just trusting its own reports) and the **production adoption** that followed after the user's explicit go-ahead.

## Independent verification performed

Before adopting anything, every headline number in Codex's reports was re-derived from scratch by connecting directly to the audit branch (via the Neon API + a one-off script, never trusting the branch's own written reports as the only source):

| Metric | Codex's report | Independent recount |
| --- | --- | --- |
| `canonical_cars` | 1,202 | 1,202 ✓ |
| `images` | 11,307 | 11,307 ✓ |
| `canonical_car_images` | 42,079 | 42,079 ✓ |
| Cars without images | 10 | 10 ✓ (list matched car-for-car) |
| Published cars without images | 8 | 8 ✓ |
| Cars with wrong main-image count (0 or 2+) | 0 | 0 ✓ |
| Images linked across different brand IDs | 0 | 0 ✓ |
| Suspicious-pattern images (`error/dropdown/placeholder/logo/spacer/ruler/login/favicon/sprite/avatar/author`) still linked to any car | not explicitly re-stated | 0 ✓ |

A sample of 15+ newly-added "official brand page" image URLs (Hyundai, GMC, Chevrolet, Toyota, RAM, BYD, Mercedes-Benz, Nissan, Mahindra, and others) were fetched directly with `curl`: all returned HTTP 200 with real image content-types (JPEG/PNG/WebP/AVIF) and file sizes in the tens-to-thousands of KB range — not error pages, not 1×1 tracking pixels. Every URL's domain and path also matched the correct brand/model (cross-checked against `official_brand_domains.json`'s allow-list and the actual model names in the filenames/paths).

One image was downloaded and visually inspected because its filename looked suspicious (`gwm.az/.../chatgpt-image-sep-6-2025...avif`, used as the Tank 400's photo on GWM Azerbaijan's official regional site) — it turned out to be a genuine clean studio product photo of the correct vehicle, not an AI-generated fake.

## Real, currently-live bug found and confirmed

Independently querying **production** (not the audit branch) before any migration showed:

**1,196 of 1,202 cars (99.5% of the entire new-cars catalog) were serving `https://www.auto-data.net/img/logind.png` — a login icon — as their main image**, plus 6 more serving a transparent 1×1 tracking pixel (`spacer.gif`). This was not a theoretical risk Codex found in a vacuum; it is what every real visitor to `/new` was seeing at the time of this review. The audit branch's cleanup fixes this completely.

## Drift check before merging

Production's `images`/`canonical_car_images` row counts (11,271 / 49,252) still exactly matched Codex's own Phase 1 (pre-cleanup) baseline at review time, and the last `sync_runs` completion (2026-07-05 11:24 UTC) predates the audit branch's creation (2026-07-06 09:15 UTC). This confirms **no admin edits or re-syncs happened on production between the branch being cut and this review** — `canonical_cars`/`brands`/`models`/`generations`/`trims` are byte-identical between production and the branch, so only `images` and `canonical_car_images` needed migrating; nothing to reconcile/diff on the other tables.

## Verdict: adopted

Given: independently-reproducible numbers, a real currently-live defect fixed, zero specs/prices/names/brand data touched, a real rollback artifact for every write batch on the audit branch, and confirmed zero production drift — the branch's data was adopted into production.

## Migration performed (with explicit user approval)

1. Dumped `images` and `canonical_car_images` in full from both the audit branch and production to local files (not committed).
2. In a single production transaction:
   - Inserted the 36 new `images` rows the branch had that production didn't (`ON CONFLICT (id) DO NOTHING` — no existing image row touched or deleted).
   - Deleted all 49,252 existing `canonical_car_images` rows and inserted the branch's cleaned-up 42,079 rows in their place.
3. Committed. Verified immediately after commit:
   - `images`: 11,307. `canonical_car_images`: 42,079. Cars without images: 10. Cars with a wrong main-image count: 0. No `logind.png`/`spacer.gif`/other suspicious asset used as a main image anywhere: confirmed empty.
4. Live-tested on `https://fady-delta.vercel.app`: `/new/car/toyota%7Caqua%7C2026%7C1-5l-116-hp-hybrid-e-cvt%7Chatchback` now returns HTTP 200 and renders the real `global.toyota` product image instead of the former login icon.
5. Deleted the now-fully-merged Neon audit branch (`br-shy-cherry-as82mazk`) as routine cleanup — its data is now in production, and it was pure disposable audit infrastructure (matches this project's standing pattern of tearing down throwaway Neon branches once their purpose is served).

No `elfady` application code changed in this station — this was a pure catalog-data adoption. `products`/`orders`/`settings`/etc. (the store's own Supabase tables) were untouched; only the Neon `fady-cars-catalog` project's `images` and `canonical_car_images` tables were affected.

## Remaining known gaps (unchanged from Codex's own findings, left as-is deliberately)

10 cars still have no image because no acceptable official-manufacturer-page image could be found without resorting to third-party catalog sites or an unusable asset (login-walled media pages, dead model listings, or pages exposing only navigation/error assets):

- DongFeng Paladin 2026 2.0T (218 Hp) 4WD Automatic
- Ford Equator 2026 1.5T (218 Hp) Plug-in Hybrid DHT
- Ford Ranger 2015 2.2 TDCi (130 Hp) 4x4 / (160 Hp)
- Renault Espace 2002 Automatic
- Renault Espace 2006 (×3 trims)
- Renault Espace 2012 (×2 trims)

These are correctly left with no image rather than a fake/mismatched substitute. The admin can add real photos for these later via the existing admin cars-catalog UI whenever a legitimate source becomes available (or an admin-owned photo).

## Files/artifacts from this review (not part of the elfady repo)

Codex's full audit trail lives at `C:\Users\ahmed\Desktop\cars-image-audit\` (reports, SQL queries, rollback JSON per batch, HTTP/visual sample audit results). Kept as-is for historical reference; not copied into this repo.
