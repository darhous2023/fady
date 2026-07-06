# Station 7 Report — Upstash Redis Rate Limiting + Phone-Tracking Privacy

Per `TODO.md`'s locked spec: no in-memory pre-layer (Vercel serverless instances don't share memory), real limits live in Upstash Redis only. Per the user's explicit reminder at kickoff, every limit is admin-editable via `/admin/settings` rather than hardcoded — nothing in this station is a magic number baked into the code.

## Real bugs found and fixed before starting the rate-limit work

The user reported seeing "a lot of 400 and 500 errors" live. `scripts/route-health-check.ts` against production came back 63/63 clean (all expected static-route status codes), so the issue had to be in dynamic/mutation behavior. Targeted probing found two real, reproducible bugs:

1. **`/api/reviews?product_id=<non-uuid>` always 500s.** A malformed `product_id` (anything not shaped like a real UUID — e.g. a bot/scanner probing the endpoint with an arbitrary value) hit a raw Postgres type-cast error that surfaced as an unhandled 500 with no validation in front of it. Fixed: both `GET` and `POST` now check the shape first — a malformed `product_id` on `GET` returns an empty result (a fake product has zero reviews either way), and a malformed `product_id` on `POST` returns a clean 400.
2. **`/api/orders` POST could leave an orphaned order row in production.** The `orders` and `order_items` inserts were two separate, unwrapped statements — if the *second* insert failed (e.g., the same malformed-UUID class of bug, or any transient DB hiccup), the customer was told the booking failed, but a real `orders` row with zero items had already been committed. **Confirmed live**: a deliberate test probe against production with a malformed `product_id` created a real ghost order (`FADY-MR93FQY8`), which was found, verified, and deleted in the same turn. Fixed by wrapping both inserts in one `db.transaction(...)` — either both succeed or neither does — plus the same input-shape validation as above.

Both are exactly the kind of finding that would produce a steady trickle of real 400/500s in Vercel's monitoring from ordinary bot/scanner traffic hitting these two public endpoints, independent of any human customer ever hitting them. Fixed at the root rather than just noted.

## Rate limiting

**[`src/lib/rateLimit.ts`](src/lib/rateLimit.ts)** (new) — `@upstash/redis` + `@upstash/ratelimit` (sliding window), never `@vercel/kv` (confirmed dead in an earlier station). `isRateLimitConfigured` is a lazy boolean check on `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` — same pattern as `src/lib/cars/db.ts`: never throws at import time, and `checkRateLimit()` returns `{ limited: false }` (a safe no-op) both when Upstash isn't configured yet and on any internal error, so rate limiting can never itself break real customer traffic. `hashIdentifier()` (SHA-256, truncated) is used everywhere a phone number needs to become part of a Redis key — the raw digits are never stored or logged.

**Limits are admin-editable, not hardcoded.** Each rule reads its `max`/`windowSeconds` from `settings` (`ratelimit_<name>_max` / `ratelimit_<name>_window_sec`), cached in memory for 30s to avoid a settings read on every single rate-limited request, falling back to the built-in defaults below if unset or on a settings-read failure. New section in `/admin/settings` (`SettingsForm.tsx`): every rule's max + window is a plain editable field, with a visible warning banner if Upstash isn't configured yet.

| Rule | Default | Identifier | Where |
|---|---|---|---|
| `login` | 5 / 15 min | IP + username | `api/auth/[...all]` (sign-in-with-password only, wraps Better Auth's own catch-all handler) |
| `booking` | 3 / 10 min | IP + hashed phone | `api/orders` POST |
| `tracking` | 10 / 5 min | IP + hashed phone/order-number | `api/orders/track` GET |
| `search` | 60 / min | IP | `api/search` GET |
| `reviews` | 3 / hour | IP | `api/reviews` POST |
| `discount` | 10 / 10 min | IP | `api/discounts/validate` GET |
| `upload` | 10 / 10 min | admin session id | `api/admin/upload` POST |

**Client-side search hardening** (`SearchOverlay.tsx`): debounce widened from 250ms to 400ms (within the plan's 300–500ms range), and each keystroke now aborts the previous in-flight request via `AbortController` — closes the same class of out-of-order-response race fixed for the new-cars make/model picker in an earlier phase, and reduces real request volume against the new `search` limit.

**Upload hardening** (`api/admin/upload`): a 10MB size cap, and real magic-byte content sniffing (new [`src/lib/images/sniffImageType.ts`](src/lib/images/sniffImageType.ts)) replaces the previous filename-extension-only check — a renamed non-image file with a spoofed `.jpg` extension previously sailed straight through to Supabase Storage.

## Phone-tracking privacy hardening

**Decision (per the locked spec):** a lookup by phone number alone (which anyone who knows or guesses a phone number could attempt) now returns a **summary only** — order number, status, total, created-at, and the car items — never the customer's name, exact preferred date, or branch. Full detail is only ever returned for a lookup by the **specific order number** the customer was actually given at booking time, which is proof-of-knowledge that can't be guessed the way a phone number can.

- [`src/app/api/orders/track/route.ts`](src/app/api/orders/track/route.ts) — split into `FULL_ORDER_COLUMNS` (order-number lookup) and `SUMMARY_ORDER_COLUMNS` (phone lookup, drops `customer_name`/`branch`/`preferred_date`).
- [`src/app/track/page.tsx`](src/app/track/page.tsx) — these three fields are now optional on the client type; the info row only renders whichever are actually present, and a phone-only result shows a small hint pointing the customer at their order number for full detail.
- Full OTP/SMS verification remains explicitly out of scope for this pass (a bigger future change, per the locked spec) — this is the summary/full-detail split the plan called for.

## Verification

- `npm run build`: clean.
- `npx tsc --noEmit`: clean.
- `npm run lint`: same pre-existing 25 errors/19 warnings as before this station (`git stash` diff confirmed) — zero new lint errors.
- `npm run test` (vitest): 37 passed, 1 skipped — 10 new tests for `hashIdentifier` (never leaks the raw input, deterministic, collision-resistant across different inputs) and `sniffImageType` (all 4 real formats detected, a spoofed-extension non-image correctly rejected, a too-short buffer correctly rejected).
- Real orphaned-order bug: reproduced live against production, then the fix verified locally; the test row itself was deleted in the same turn it was created.

## What's still open / needs the user

**Upstash Redis is not yet configured.** `KV_REST_API_URL`/`KV_REST_API_TOKEN` exist in `.env.local` but are empty (the same dead `@vercel/kv` leftover documented in an earlier station) — there is no working Redis credential anywhere in this project yet. Provisioning a new third-party account is outside what I can do autonomously (this assistant does not create accounts or handle billing/OAuth flows on the user's behalf). All the code above is fully built and wired to degrade safely (rate limiting silently off, zero customer impact) until real credentials exist — once the user creates a free Upstash Redis database (a couple of minutes at upstash.com, no cost at this traffic volume) and supplies `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, rate limiting activates with zero further code changes.

## What's next

Per the user's explicit instruction this session, a **new station is inserted before Station 8**: review the branch Codex has been working on in a separate session (image cleanup + database changes for the cars catalog), and if it checks out, adopt that cleaned-up database. This is a review/decision step, not started yet. Station 8 (Sentry, GitHub Actions branch protection, final cleanup, `RUNBOOK.md`, admin guide + PDF refresh) remains last.
