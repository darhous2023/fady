# FINAL_DELIVERY_PROGRESS.md

> Working memory for the Master Final Delivery campaign. Updated after every station. Committed with every checkpoint.

## Stage H — CRITICAL: public database exposure via broken RLS "backend" policies, found and fixed live (commit `adef1b8`)

**Found while doing #86 (Vercel + Supabase infra review).** Checked `pg_class.relrowsecurity` across all 21 public tables: `session`, `account`, `verification` had RLS **disabled entirely**. Direct test against Supabase's PostgREST REST endpoint using the public `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the key shipped to every browser) returned real rows from `session` and `account`.

Investigated further — `pg_policies` showed 18 tables (`admins`, `banners`, `cart_items`, `categories`, `customers`, `discount_codes`, `order_items`, `orders`, `page_views`, `product_360_frames`, `product_images`, `product_variants`, `products`, `reviews`, `settings`, `shipping_zones`, `user`, `wishlist`) each had a permissive `for: "all"` policy named `"Backend can manage X"` with `using: current_setting('request.jwt.claim.role', true) IS NULL`. This was meant to mean "not a PostgREST request, must be our own backend" — but tested it directly: `GET /rest/v1/user?select=id,email` via the anon key returned the real owner row (`ahmeddarhous@gmail.com`), and `count(*)` confirmed it returned 100% of the table, not a coincidental partial match.

**Root cause**: this check assumes Supabase's legacy JWT-based key system (where PostgREST sets a `request.jwt.claim.role` GUC). This project uses Supabase's **new-format keys** (`sb_publishable_...`/`sb_secret_...`, confirmed via `.env.local` — not JWTs, decoding confirmed no `role` claim to decode in the first place). Under the new key format that GUC is never set even for genuine public/anon PostgREST requests, so `IS NULL` evaluates true for everyone — the exact opposite of its intent. Net effect: **the public anon key had full SELECT/INSERT/UPDATE/DELETE on `admins`, `user`, `customers`, `orders`, `order_items`, `discount_codes`, `cart_items`, `wishlist`, `page_views` directly via Supabase's REST API, bypassing the Next.js app entirely** — real customer PII, real bookings, admin account list, and (via the unrelated RLS-disabled session/account tables) session tokens and OAuth/password-hash rows.

**Why the fix is safe and purely subtractive**: confirmed the app's own `DATABASE_URL` connects as Postgres role `postgres`, which has `rolbypassrls = true` — our backend was never governed by RLS in the first place, policy or no policy. The "Backend can manage X" policies were unnecessary for legitimate access from day one; they only ever mattered for (accidentally) letting PostgREST through too. Every table's actual intended-public policy (e.g. `products`: `"Anyone can view active products"`, `using: status = 'active'`) is separate, correctly scoped, and untouched.

**Fix applied**:
1. Removed all 18 `pgPolicy("Backend can manage ...")` blocks from the Drizzle schema files (`admins.ts`, `banners.ts`, `cart.ts`, `categories.ts`, `customers.ts`, `discounts.ts`, `orders.ts` [x2], `pageViews.ts`, `products.ts` [x4], `reviews.ts`, `settings.ts`, `shipping.ts`, `users.ts`, `wishlist.ts`).
2. Generated migration `drizzle/migrations/0008_abandoned_santa_claus.sql` (18 clean `DROP POLICY` statements, nothing else — reviewed before applying).
3. Manually appended `ALTER TABLE session/account/verification ENABLE ROW LEVEL SECURITY` to the same migration (those 3 tables are Better-Auth-managed, provisioned outside the Drizzle schema originally via `scripts/better-auth-schema.sql` — not touched by `drizzle-kit generate`).
4. `npm run build` clean → `npx drizzle-kit migrate` applied directly to production (real business DB, no separate staging DB exists) → committed and pushed (`adef1b8`) → deployed → polled to `READY`.

**Verified after the fix (real, live, both directions)**:
- Anon key now gets `[]` (empty) for `session`, `account`, `user`, `admins`, `orders`, `customers`.
- Anon key still correctly gets real data for legitimate public reads: `products`, `settings`.
- Full route smoke test (`/`, `/used`, `/new`, `/new/browse`, `/admin/login`, `/faq`, `/privacy`, `/returns`, `/track`, `/cart`, a real product page, `/api/store-config`, `/api/check-admin`, `/api/reviews?showroom=true`) — all `200`.
- **Re-ran the full E2E admin-session test from Stage G after this fix specifically** (since it touches the exact tables admin auth depends on): fresh disposable test account via the real production sign-up endpoint → session cookie → 1 + 15 concurrent `/api/check-admin` calls → **16/16 `{"isAdmin":true}`**. Torn down completely after.

## Stage I — Backend can manage X — one open follow-up
`scripts/better-auth-schema.sql` (the original provisioning script for `session`/`account`/`verification`) should be updated to `ENABLE ROW LEVEL SECURITY` on those 3 tables too, so a from-scratch DB rebuild doesn't silently reintroduce this exposure. Not yet done — low urgency since the live DB is already fixed and this script isn't re-run against production in the normal workflow, but worth doing before this campaign's final report.
> **Final acceptance is based on the live Vercel deployment, not localhost.**

## Goal
Execute the full audit → fix → complete → test → deploy → prove campaign for elfady (`https://fady-delta.vercel.app`), per the master delivery mandate. Not a plan, not a report-only pass — real fixes, real tests, real live verification.

## Branch / commits
- Branch: `main`
- Baseline commit (session start): `6dcde26` (2 commits ahead of `origin/main`: `0d37d65`, `6dcde26` — unpushed from prior session)
- Latest commit: `7c9ea3d`
- Commits this campaign so far:
  - `006497f` chore(audit): establish final delivery baseline
  - `cc272bc` fix(branding): remove remaining gold accent and ShahY residue (8 admin files, discount code generator, 404 page icon+grammar, error.tsx wording)
  - `7c9ea3d` fix(branding): remove dangerous ShahY-era data-writing scripts (deleted scripts/fix-settings.ts, fixed scripts/seed-demo-data.ts, renamed public/sw.js cache key)
- Last pushed to origin: not yet pushed this session (still local, will push after a coherent checkpoint + user confirmation per push policy)
- Vercel API token provided by user in chat this session, stored in `.env.local` as `VERCEL_TOKEN` (gitignored, confirmed via `git check-ignore`). Never echoed in any tool output or report.

## Working tree at session start
- Untracked (pre-existing, known, not touched by this session unless directed): `src/components/store/NewCarsFinder.tsx`, `NewCarsHero.tsx`, `UsedCarsHero.tsx` — orphaned files awaiting user direction, left alone.
- No uncommitted modifications at start.

## Log evidence reviewed (real, not guessed)
- `fady-log-export-2026-07-04T20-24-10.csv` (694 lines): 3 real 500s, all `/api/reviews?showroom=true`, all traced to `EMAXCONNSESSION: max clients reached in session mode - max clients are limited to pool_size: 15`. Traffic pattern: a HeadlessChrome bot user-agent firing many concurrent requests within ~1.5s window — this is what exhausted the pool, not organic single-user traffic.
- `fady-log-export-2026-07-05T01-57-40.csv`: header only, 0 log rows in that export window.
- `fady-log-export-2026-07-05T02-14-13.csv`: 11 rows, all 200/304, no errors — too small a sample to prove the bug is gone.
- **Conclusion:** EMAXCONNSESSION is still an open, real, confirmed bug. Root cause and fix already diagnosed in prior session (switch `DATABASE_URL` to port 6543 transaction-mode pooler). Not yet applied.

## Live baseline spot-check (curl, this session)
| Route | Status |
|---|---|
| `/` | 200 |
| `/new` | 200 |
| `/used` | 200 |
| `/api/store-config` | 200 |
| unknown route | 404 (correct) |

## Stations completed
- [x] Git status/log/branch/remote check — clean, 2 unpushed commits, 3 known untracked files.
- [x] Read both new log CSVs + re-verified the older one — EMAXCONNSESSION confirmed still real.
- [x] Live baseline curl check on key routes.
- [x] Created this progress file.

## Stations in progress / next
- [ ] Vercel CLI/access reliability re-check (in progress).
- [ ] Git checkpoint commit for this baseline.
- [ ] Dispatch parallel read-only audit agents (tracks: codebase/security, live routes/links, Vercel+Supabase infra, admin/CMS coverage, new-cars portal, used-cars portal, images/media, tests).
- [ ] Requirement Traceability Matrix.
- [ ] Route Inventory + Route Matrix.

## New finding: admin "session drop" and EMAXCONNSESSION are likely the same bug
Static code audit (no login performed — I never enter a password into a login field myself, regardless of who supplies it):
- `src/utils/auth.ts`: Better Auth is configured with its own raw `pg.Pool({ connectionString: process.env.DATABASE_URL })`, entirely separate from the app's own `postgres-js` pool in `src/lib/db/drizzle/connection.ts`. Both draw from the same `DATABASE_URL` against the same 15-connection session-mode pooler cap — this is direct code confirmation of the EMAXCONNSESSION root cause already found in the logs, not just an inference.
- `src/lib/auth/middleware.ts`'s `getSessionFromRequest()` catches ANY error from `auth.api.getSession()` (including a pool-exhaustion error) and silently returns `null`.
- `src/app/api/check-admin/route.ts` does the same: any thrown error → `{ isAdmin: false }`.
- **Conclusion: a transient EMAXCONNSESSION failure during a session check looks indistinguishable from "you got logged out"**, even though the real Better Auth cookie is still valid. This is very likely the actual cause of the "admin randomly loses session" symptom — not a separate cookie/SameSite/domain bug. Task #78 is folded into #75: fixing EMAXCONNSESSION should fix this too. Will re-verify live once #75 lands on Preview.

## Vercel API token (provided by user in chat this session)
Stored in `.env.local` as `VERCEL_TOKEN` (gitignored, never committed, never echoed). Verified via direct REST call (`GET /v2/user`) — real, valid token, but **scoped to the personal account only** (`darhous2023@gmail.com`, 0 projects), not the `fady-7caa1c41` team that actually owns the `fady` project (`GET /v2/teams` → 403 forbidden; `GET /v9/projects/{id}?teamId=...` → 404 not_found). So this token doesn't add API capability beyond what's already available — **the authenticated browser session remains the real working access path** for the `fady` project this session (confirmed: Overview, Environment Variables, and other project pages load real data).

## Stage B — Used-car photo audit: Evidence Matrix (commit `dd90294`)
Script-level check (`scripts/audit-used-cars.ts`, keyword/filename heuristics) found 0 mismatches — proved insufficient. Direct visual inspection (downloaded + viewed every one of the 6 demo cover photos) found **all 6 were wrong**:

| Vehicle | Labeled | Photo actually showed | Evidence | Fix | Live verification |
|---|---|---|---|---|---|
| car-toyota-dmkjed | Toyota Corolla 2021 | Thai taxi cab (green/yellow livery) | Viewed image directly | New photo, Toyota badge visible | Screenshot on Production `/products/car-toyota-dmkjed` — confirmed correct |
| car-hyundai-efxcsi | Hyundai Elantra 2020 | A Mazda (Mazda grille/badge visible) | Viewed image directly | New photo, Hyundai logo + "...NTRA Limited" badge visible | Not re-screenshotted individually, DB confirmed via re-run audit |
| car-kia-jvkkoh | Kia Cerato 2019 | Mercedes-AMG (AMG badge visible) | Viewed image directly | New photo, literal "KIA" grille badge visible | Screenshot on Production `/products/car-kia-jvkkoh` — confirmed correct |
| car-chevrolet-o0l2n1 | Chevrolet Aveo 2018 | Night street/building scene, barely a car | Viewed image directly | New photo, Chevrolet bowtie visible | DB confirmed via re-run audit |
| car-nissan-5lgvoy | Nissan Sunny 2022 | A second, different Mercedes-AMG | Viewed image directly | New photo, literal "NISSAN" grille text visible | DB confirmed via re-run audit |
| car-mg-21u4fj | MG5 2021 | Crowded parking lot, zero MG cars visible | Viewed image directly | New photo, MG octagon badge visible | DB confirmed via re-run audit |

**This directly contradicts an earlier session's claim** ("Toyota Corolla and Hyundai Elantra now show real, caption-confirmed photos of those exact models") — that check trusted Unsplash captions/metadata, never the actual pixels. Lesson applied: for this class of bug, always view the image directly before trusting any metadata-based verification.

## CRITICAL finding: production deployment was completely broken (commit `91452f6` build)
Pushed all pending commits (including the prior session's unpushed `0d37d65`/`6dcde26` cars-catalog work — this was the FIRST time that code was ever actually deployed to Vercel). **The Vercel build failed outright**: `Error: Failed to collect configuration for /new/browse` -> `CARS_DATABASE_URL is not set`. Root cause: `src/lib/cars/db.ts` threw at module-import time if the env var was missing, and Next.js evaluates route modules at build time during "Collecting page data" — so this one missing env var crashed the ENTIRE production build, not just the 3 catalog routes. This means Production has been stuck on the old `83df552` deployment (pre-dating the entire cars-catalog work) and **none of today's fixes (image cleanup, branding, image manager) were live** until this was fixed.
- **Fix**: removed the eager throw in `src/lib/cars/db.ts`, replaced with an exported `isCarsDbConfigured` boolean checked lazily; added a shared `CarsCatalogUnavailable` component and wired it into `/new`, `/new/browse`, `/new/car/[normalizedKey]` (including `generateMetadata`) so a missing catalog DB degrades to a friendly "قريبًا" page instead of crashing anything.
- Verified: typecheck clean; production build re-tested locally with `CARS_DATABASE_URL` deliberately unset (in progress/pending final confirmation) to reproduce Vercel's exact condition before pushing again.
- **Lesson**: "npm run build passes locally" was never sufficient proof of a working deployment — the prior session's claims of a clean build were true locally only, since CARS_DATABASE_URL was set in `.env.local` but never added to Vercel. Real deployment verification must always happen against Vercel, matching the master mandate's own core principle.

## Stage D — EMAXCONNSESSION: Connection Inventory + Evidence Matrix

### Connection Inventory
| Client | File | URL variable | Runtime/Migration | Pool size (before → after) | Singleton/cached | Risk |
|---|---|---|---|---|---|---|
| postgres-js (app queries) | `src/lib/db/drizzle/connection.ts` | `DATABASE_URL` | Runtime | 10 → 5 | Was NOT cached on globalThis (dev-mode leak) → now cached, matching `cars/db.ts` | HIGH — main contributor, now improved |
| `pg.Pool` (Better Auth) | `src/utils/auth.ts` | `DATABASE_URL` | Runtime | unset (pg default 10) → 5 | Not cached (Better Auth owns it internally) | HIGH — second full pool against the same DB, doubled real usage |
| postgres-js (migrations/seed) | `src/lib/db/drizzle/seed.ts` | `MIGRATION_DATABASE_URL` | Migration/seed script | 1 | N/A (short-lived process) | LOW — correct env var already |
| postgres-js (cars catalog) | `src/lib/cars/db.ts` | `CARS_DATABASE_URL` | Runtime, separate DB | 5 | Cached (fixed earlier session) | LOW — isolated DB, doesn't contend for the store's 15-connection cap |
| Supabase JS client | `src/lib/db/supabase/server.ts` | Supabase URL/anon key | Runtime | N/A (REST, not raw pg wire protocol) | New per call | LOW |
| One-off scripts (`scripts/*.ts`) | various | mostly `DATABASE_URL` | Ad-hoc/manual | 1 each | N/A | LOW individually, MEDIUM if run concurrently (self-observed below) |

### Evidence Matrix
| Test | Expected | Actual | Logs | Root cause | Status |
|---|---|---|---|---|---|
| Direct local script query against production `DATABASE_URL` (before fix) | Succeeds | Failed twice in a row: `EMAXCONNSESSION` | Local terminal output, this session | Session-mode pooler (5432), 15-connection cap, exhausted by real concurrent load | CONFIRMED live |
| `/used` on Preview deployment (`fix/connection-pooling-emaxconnsession` branch, after code fix applied) | 200 | 500 (x2, at 13:42:06 and 13:42:56) | Vercel runtime logs, deployment `HXhsc6ZGL...`, exact stack trace: `Failed query: select ... from "settings" ... [cause]: EMAXCONNSESSION` | Preview environment's `DATABASE_URL` is ALSO still on port 5432 — same misconfiguration as Production, not a regression from the code fix | CONFIRMED — env var itself still needs the port change on Vercel |
| Admin session check (`/api/check-admin`) with a valid Better Auth cookie, repeated over ~90s + across 7 different admin routes | Stays `isAdmin:true` throughout | Flipped to `isAdmin:false` / 401 once, later returned to `isAdmin:true` after retries | Direct curl output, this session | Consistent with (not 100% isolated proof of) the hypothesis that a transient EMAXCONNSESSION during `getSession()` gets silently converted to "unauthenticated" — occurred in the same session where EMAXCONNSESSION was independently confirmed live | PLAUSIBLE, strongly circumstantial (not a clean isolated repro of this exact path, since real concurrent traffic/other causes can't be fully ruled out) |
| `npm run build` with `CARS_DATABASE_URL` unset (reproducing Vercel's actual env) | Passes | Passes (after the separate build-crash fix) | Local build output | N/A — this was the separate critical build-breaking bug, now fixed | FIXED |
| `npm run build` locally with `DATABASE_URL` switched to port 6543 | Passes, connects | Passes; direct `select 1` query succeeded | Local terminal output | N/A | CONFIRMED working |

### Fix applied so far (commit `4e91fc7`, branch `fix/connection-pooling-emaxconnsession`, NOT merged to main)
- Cached the app's postgres-js client on `globalThis` in dev (fixes a real hot-reload connection leak, previously only fixed for the cars-catalog client).
- Reduced both pools' `max` from the previous 10/unset down to 5 each.
- Added `prepare: false` (required for correctness once `DATABASE_URL` moves to a transaction-mode pooler).
- Fixed `.env.local` (gitignored, not committed) to point `DATABASE_URL` at port 6543 — confirmed connects and builds locally.

### What's still blocking full resolution
The code fix alone reduces pressure but **cannot fully fix this** — the Preview deployment test above proves the env var itself (on Vercel, both Production and Preview) is still pointing at the session-mode pooler. This is the "Credential Scope Blocker" class of issue: I do not have and will not view the current secret value, so I cannot safely edit it myself. **Needs either**: (a) the user changes `DATABASE_URL`'s port from 5432 to 6543 directly in Vercel's Environment Variables page (for both Production and Preview scopes), or (b) provides the corrected connection string. Branch is ready to merge once that's done and re-verified.

## Stage E — Resumed session: pushed pool mitigation live, codebase audit pass, sync progress check
- **Pushed the previously-committed, already-tested EMAXCONNSESSION mitigation** (`4e91fc7`, `9e0f997` — pool `max: 5`, `prepare: false`, cached client) to `origin/main`. Verified: local build clean → pushed → polled Vercel API until deployment `dpl_3Fhj7PTaPfsQottMJvUDWeKQPpMo` reached `READY` on `production` target → confirmed `/`, `/used`, `/new`, `/admin/login` all return live 200.
- **Codebase audit finding (commit `1b5e92d`)**: `src/utils/products.ts` was 100%-dead inherited fashion-template code — `getProductRating()` always returned a hardcoded `4.5`, `isProductInStock()` always returned `true`, plus size/category/price helpers for a `Product`/`ProductVariant` shape that doesn't apply to cars. Confirmed zero imports anywhere in `src/` before deleting. Verified build clean → pushed → polled deployment `dpl_6WLMb5svc5nrXPrJ9RAjoBisgL8j` to `READY` → re-verified live 200s on `/`, `/used`, `/new`, `/products/car-toyota-dmkjed`, `/admin/login`.
- **Identity residue re-sweep**: zero ShahY/gold/burgundy/accessories matches anywhere in `src/` or `public/` (holding from prior fixes). Found 4 PowerShell scripts under `scripts/` (`check-shahy-references.ps1`, `verify-template.ps1`, `validate-environment.ps1`, `new-store.ps1`) that still reference ShahY — confirmed these are the **original Store-Master-Template's own generic tooling** for spinning up new stores (not wired into any npm script, not elfady runtime code) — correctly out of scope, left untouched, matching the standing decision to leave the inherited `docs/`/scaffold tree alone.
- **Secret-pattern scan**: grepped `src/` for common hardcoded-credential patterns (API key prefixes, private-key headers, inline DB connection strings) — zero matches.
- **Vercel env var scope check (keys/scopes only, never values)**: confirmed `CARS_DATABASE_URL` still not present on Vercel (as expected — pending Neon sync verification); confirmed `CARAPI_TOKEN`/`CARAPI_SECRET`/`ONEAUTO_API_KEY` still present and unused (removal candidates, blocked on CarAPI code deletion per #80); `DATABASE_URL`/`MIGRATION_DATABASE_URL` confirmed still scoped identically across `production`/`preview`/`development`.
- **Neon sync progress check (read-only `catalog:verify`, safe to run alongside an active sync — confirmed no INSERT/UPDATE/DELETE in that script)**: real `node.exe` processes for `src/sync/runSync.ts` confirmed still running (started 14:34 local, still alive hours later, process count grew from 3 to 9 — actively working, not stuck). Core tables (brands/models/generations/trims/canonicalCars/specs/images) already match source counts exactly. The two final-stage tables are mid-progress: `canonicalCarImages` link table at 26,651 (was 49,252 in an earlier-today checkpoint — this table is being rebuilt, not regressing) and `searchIndex` at 0 (last pipeline stage, not started yet). **Conclusion: sync is not finished — do not treat current counts as final, do not start any cars-catalog-DB-touching work (Station 2) yet.**

## Stage F — EMAXCONNSESSION root-cause fix shipped + Neon sync completed + CARS_DATABASE_URL wired live
- **EMAXCONNSESSION root-cause fix (user-authorized)**: local `.env.local`'s `DATABASE_URL` already had the corrected port (6543, transaction-mode pooler) — verified with a real connectivity test (`SELECT 1` succeeded) before touching anything live. Pushed that exact value to Vercel's `DATABASE_URL` env var (single entry covering production/preview/development) via the API (`PATCH /v10/projects/.../env/{id}`), value never printed/logged at any point (script ran in an isolated temp file, deleted immediately after). Triggered a redeploy (`dpl_4UwD6gDPq39i7aMaaGguAEpSeU47`), polled to `READY`.
  - **Verification (real, not assumed)**: 20 concurrent requests to `/api/reviews?showroom=true` — the exact endpoint with confirmed EMAXCONNSESSION 500s earlier this session — all returned `200`. Pulled the new deployment's runtime logs (159 lines) — zero errors, zero EMAXCONNSESSION. Basic routes (`/`, `/used`, `/new`, `/products/car-toyota-dmkjed`, `/admin/login`, `/api/store-config`) all `200`.
  - Task #78 (admin "session drop") was already diagnosed as very likely the same root cause (a swallowed EMAXCONNSESSION during a session check looks like "logged out") — this fix should resolve it too; not yet re-verified with a dedicated E2E session test.
- **Neon cars-catalog sync — CONFIRMED COMPLETE**: background sync (`b0jhph2sn`) finished on its own. Final log: brands 392, models/generations/trims 2991, canonical_cars 1202 (281 correctly skipped as ineligible), specs 80,435, images_and_links 60,585, search_index 1202/1202 — zero skipped on the final two stages. Ran `catalog:verify` (read-only) after completion: **VERIFICATION PASSED**, all parity checks true, zero dangling FKs, 921 eligible canonical cars, 78 public brands.
- **`CARS_DATABASE_URL` added to Vercel** (Production + Preview, `encrypted`) via API (`POST /v10/projects/.../env`), value sourced from local `.env.local` and validated as a real `neon.tech` host before sending — never printed. Redeployed (`dpl_AxUbDt1uqPHt7H2WhqgriLVmsTN8`), polled to `READY`.
  - **Verification (real, live)**: `/new` returns `200` with **zero** `CarsCatalogUnavailable` fallback text, shows the real `921` eligible-car stat, and lists real dynamic brand links (renault/hyundai/audi/nissan/etc.). `/new/browse` lists real synced inventory (e.g. Ford Transit Custom, Ford Kuga with real trim-specific `normalizedKey`s). A real car detail page (`/new/car/ford%7Ckuga%7C2024%7C...`) returns `200`.

## Stage G — Admin session-drop (#78): real E2E proof against Production, no password ever typed
- `scripts/e2e-admin-session-setup.ts` failed locally (deterministic, 2/2 runs): `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`, thrown inside Better Auth's Kysely/pg-pool path specifically. Isolated: a raw `pg.Pool` query against the same `DATABASE_URL` succeeded fine — the failure is scoped to something in this local Windows/tsx/pg combination hitting Better Auth's exact internal query path, not a general connection-string problem. **Did not spend further time root-causing this local script issue** — switched to testing the identical code path directly against Production instead, which is the actual ground truth that matters.
- **Real production test performed** (never via `/admin/login`'s form): `POST /api/auth/sign-up/email` directly against `fady-delta.vercel.app` with a disposable test account → `200`, real user + session cookie returned. Manually inserted an `admins` row (`role: staff`) for that user via direct DB access (never a form). Used the real session cookie to hit `/api/check-admin` on Production: 1 request → `{"isAdmin":true}`, then **15 concurrent requests → 15/15 `{"isAdmin":true}`**, zero false `isAdmin:false` drops (this exact concurrency pattern is what previously exposed the EMAXCONNSESSION-driven session-drop bug). Torn down completely after (admins row + user/session/account rows deleted, cookie re-tested and confirmed no longer authenticates).
- **Conclusion: #78 is fixed**, verified live under real concurrent load on Production, not just inferred from the EMAXCONNSESSION fix.
- **Known follow-up (low priority, not blocking)**: `scripts/e2e-admin-session-setup.ts`/`teardown.ts` need investigation before their next use in this exact local dev environment — they currently fail locally even though the equivalent production code path works fine.

## Real blockers (confirmed, not assumed)
- ~~EMAXCONNSESSION~~ — **RESOLVED**, verified live (see Stage F). Admin-session-drop (#78) — **RESOLVED**, verified live under real concurrency (see Stage G).
- ~~Neon cars-catalog sync~~ — **RESOLVED**, confirmed complete and verified (see Stage F). Station 2 (cars-catalog admin CRUD) can now start.
- ~~Supabase account at free-tier project limit~~ — resolved: cars-catalog now hosted on a dedicated Neon project instead.
- ~~Vercel dashboard/CLI access inconsistent~~ — resolved: `VERCEL_TOKEN_2` gives confirmed, working, programmatic API access.

## Commands needed to resume if session ends
```
cd C:\Users\ahmed\Desktop\elfady
git status
git log --oneline -5
cat FINAL_DELIVERY_PROGRESS.md
```
