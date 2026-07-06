# Station 8 Report — Monitoring, CI Gate, Final Cleanup, Runbook

Date: 2026-07-06

Last station of the "9/10 → 10/10" plan. Full scope: live 400/500 sanity check, Sentry error monitoring, a new scheduled synthetic-monitoring workflow (added mid-station per user request), GitHub Actions branch protection on `main`, a final dead-code sweep, `.ai/RUNBOOK.md`, and an `/admin/guide`+PDF content refresh.

## 1. Live 400/500 sanity check — 4 real bugs found and fixed

Before any new work, ran `scripts/route-health-check.ts` against production (63/63 clean) then hand-crafted probes with malformed input (NUL bytes, SQL-metacharacter strings, unencoded special characters) against every route accepting a free-text or ID-shaped param. Found 4 real, 100%-reproducible 500s, all sharing one root cause: a stray `%00` (NUL byte) in a query string reaching a raw `eq()`/`ilike()` Postgres comparison, which Postgres rejects outright.

Affected: `/api/search`, `/api/discounts/validate`, `/api/orders/track` (both `phone` and `number` params), `/api/new-cars/compare` (which also had **no try/catch at all** — a second, independent gap). Fixed with a new shared `src/lib/sanitizeInput.ts` (`stripControlChars`), applied at every point a raw `searchParams` string reaches a DB query, plus wrapping `/api/new-cars/compare` in try/catch to match the project's standing "public routes degrade to empty on DB failure" rule. All 4 verified fixed live (200/400 instead of 500) after deploy. Commit `f724ad4`.

## 2. Sentry integration

Added `@sentry/nextjs` (v10) using the current instrumentation-hook pattern (not the deprecated `sentry.*.config.ts` files, which the SDK itself now warns against): `src/instrumentation.ts` (server + edge `Sentry.init()` + `onRequestError` export via `captureRequestError`), `src/instrumentation-client.ts` (browser init + `onRouterTransitionStart` for navigation instrumentation), and `next.config.js` wrapped with `withSentryConfig` (org/project/auth-token read from env, source-map upload silently skipped without `SENTRY_AUTH_TOKEN`).

**Not yet configured** — same situation as Upstash in Station 7: `NEXT_PUBLIC_SENTRY_DSN` doesn't exist yet, and creating a Sentry account is something only the user can do. `Sentry.init({ dsn: undefined })` is a documented, safe no-op; the code is fully wired and will start capturing errors the moment a real DSN is added to Vercel's env vars, with zero further code changes. Session Replay was deliberately left off (this store handles real customer phone numbers/booking data — enabling it would mean re-litigating Station 7's privacy hardening for a nice-to-have).

## 3. Scheduled synthetic monitoring (added mid-station, user request)

The user asked, before starting this station, for something Sentry alone can't provide: proactive detection of a route/page that returns a controlled-but-wrong result or a silently-dead external asset, without waiting for a customer complaint (exactly how the Station 7 and Station 8 bugs were both originally found — by a human manually checking).

Built `.github/workflows/scheduled-monitoring.yml` — a daily (06:00 UTC) cron job requiring **zero secrets**: it runs `routes:check` (the existing static crawler) plus a new `scripts/image-url-health-check.ts`, which scrapes real rendered pages (`/new/browse` + 3 brand filters + `/used`) and HEAD-checks a sample of the actual `<img>` URLs they contain — every URL checked is one a real visitor's browser is already loading, so no database credentials are needed in CI at all. A failing run triggers GitHub's default workflow-failure email — no new infrastructure.

**This already caught something real on its first run**: `jetta.faw-vw.com` (the official source for the Jetta VS7's photo, adopted earlier today from Station 8's predecessor work) has split-horizon DNS — it resolves fine via some resolvers (confirmed via Google's DoH) but fails to resolve via others (confirmed via Cloudflare's DoH and this environment's own DNS), a known pattern for domestic Chinese CDNs accessed from outside China. This is genuinely unreliable for real customers depending on their ISP's DNS peering, not a false positive. **Flagging this to the user rather than silently re-touching the cars-catalog data again** — worth a decision on whether to accept the occasional monitoring alert or ask for that one image to be swapped for an `auto-data.net` fallback.

## 4. GitHub Actions branch protection on `main` — now live

Added a `pull_request` trigger to `e2e-smoke.yml` (previously `workflow_dispatch`-only) so the required check has something to report on PRs. Verified the exact required-check name (`smoke`, the job id) via a real throwaway probe PR (`#1`, closed without merging, branch deleted). Enabled branch protection via the GitHub API:

- Required status check: `smoke`, strict (branch must be up to date before merging).
- Required pull request before merging (0 required approvals — solo-maintainer repo, this blocks direct pushes without requiring a second reviewer).
- **`enforce_admins: true`** — applies to everyone, including the repo owner. No exceptions.
- Force-pushes and branch deletion blocked on `main`.

**This is a real, immediate workflow change, not just a config toggle**: every commit to this project, from this point forward — by the user or any future assistant session — must go through a pull request with the `smoke` check passing. Direct `git push origin main` (the pattern used for every single prior station in this entire project) **will now be rejected by GitHub**. This report itself was committed via a PR to prove the new flow works end-to-end, not pushed directly.

## 5. Final dead-code sweep

Found and removed a real, **visibly reachable** dead feature: `/admin/shipping` (a full CRUD page for shipping zones/rates) was still a live, clickable nav item ("الشحن") in the admin sidebar, despite `shipping_cost` having been hardcoded to `"0"` on every order since Phase 8's reframe from e-commerce checkout to viewing-bookings months ago — the admin UI managing shipping zones had zero actual effect on anything. Removed: the nav link, the admin page, all 3 related API routes (`/api/shipping`, `/api/admin/shipping`, `/api/admin/shipping/[id]`), and the now-pointless shipping-zones seed block in `src/lib/db/drizzle/seed.ts`. Left the `shippingZones`/`shippingRates` schema/table itself untouched (no migration) — low-value, non-zero-risk to drop a table for a purely cosmetic cleanup.

Also found and fixed: `.env.example` — referenced throughout `.ai/CLAUDE.md` and the new `RUNBOOK.md` as the onboarding template — had **never actually been committed to the repo**, caught by an overly broad `.env*` line in `.gitignore` that was clearly meant to only catch `.env*.local` variants. Added a `!.env.example` negation and committed it for real, along with the missing Upstash/Sentry placeholder variables it should have had since Station 7.

## 6. `.ai/RUNBOOK.md`

New file covering: local setup (with the `&`-in-connection-string `source` gotcha called out explicitly), env vars, migrations, seeding, tests, route/load health checks, rollback/recovery procedures (bad deploy, bad migration, bad data write, cars-catalog re-sync, full DB loss), creating a new admin (with the no-password-into-forms rule restated), handling a failed deploy, and the new monitoring stack. Explicitly documents the accepted gaps (no Backup/PITR, no hosting migration, Upstash/Sentry both code-complete but inert without user-supplied credentials) so a future session doesn't mistake these for oversights.

## 7. `/admin/guide` + PDF refresh

Added a new line to both `/admin/guide`'s interactive settings section and `/admin/guide/print`'s condensed version, documenting Station 7's rate-limit settings (a real, new admin-facing capability that had no guide coverage at all). While doing this, found the print/PDF version was **already missing two entire sections** (the image-prep prompt, and financing/installment) that existed in the interactive guide but were never ported over — added both.

**Clarification on "regenerate PDF with real screenshots":** the guide was deliberately built around illustrative mockup components (`MockShell`, a stylized fake-UI shell — see the guide's own code comment: "illustrative fake UI, not a real screenshot"), not actual screenshots, and the PDF itself isn't a stored file — `src/lib/guidePdf.ts` renders `/admin/guide/print` live in a hidden iframe and exports it client-side (jsPDF + html2canvas) every time the admin clicks the download button. There is nothing to "regenerate" as a static asset; the PDF the admin downloads always reflects whatever the guide's current content is, which is now up to date through Station 8.

## Verification

- `npm run build` clean, `npm run lint` clean on every new/touched file (pre-existing unrelated lint debt in `CartContext.tsx`/`useCarLists.ts` left untouched — not introduced this station).
- 63/63 routes green on live production after every deploy.
- All 4 NUL-byte bugs confirmed fixed live via direct `curl` against production.
- Branch protection confirmed live via `gh api` (not just "command succeeded" — read back the applied ruleset).
- Sentry/scheduled-monitoring both confirmed to compile and, for monitoring, actually run and produce a real finding (the Jetta DNS issue) before this report was written.

## What's NOT done / explicitly deferred

- **Sentry and Upstash rate limiting are both code-complete but inert** until the user creates the respective free-tier accounts and supplies `NEXT_PUBLIC_SENTRY_DSN` / `UPSTASH_REDIS_REST_URL`+`UPSTASH_REDIS_REST_TOKEN`. Not blockers for calling this plan "done" — both degrade safely by design.
- **The Jetta VS7 image's DNS reliability** — flagged above, needs a user decision (accept occasional alerts vs. swap the source image), not acted on unilaterally.
- Backup/PITR, hosting migration — out of scope per standing user instruction (see `DECISIONS.md`).

## The "9/10 → 10/10" plan is now fully complete

All 8 stations plus the inserted Codex cars-catalog review/adoption station are done. Remaining open items are all pre-existing, low-priority, and explicitly optional (see `.ai/TODO.md`'s "Older items, still open" section) — a real 360° photo shoot, minor touch-target polish, and a handful of hardcoded WhatsApp numbers on secondary pages.
