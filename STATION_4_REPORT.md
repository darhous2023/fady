# Station 4 Report — Shared Playwright E2E Harness

Part of the "9/10 → 10/10" plan. Deliverable: **infra only** — a single shared Playwright harness (reused, not duplicated, by Station 5's visual-regression tests and Station 6's full functional suite), plus one smoke test proving the isolation is real. No product code changed.

## What was built

**Full database isolation — two Neon Postgres branches per run, never the real `DATABASE_URL`/`CARS_DATABASE_URL`:**

- **Cars catalog** → a copy-on-write branch of the real `fady-cars-catalog` Neon project (`late-rain-30574215`). Gets the real 1202-car dataset for realistic browsing tests, with zero risk to production data — branches are throwaway and deleted after every run.
- **Store schema** → a branch of a brand-new, dedicated Neon project, **`fady-store-test-harness`** (`super-fire-42038483`), created specifically to serve as an empty branch-off template. The store's real database is Supabase, which has no free-tier slot available for a second project (a previously-documented, still-current limit) — so a fresh Neon project stands in instead. This project holds no real data; every branch starts empty and gets the full schema rebuilt from scratch on each run.

**Why not the originally-planned "GitHub Actions Postgres service container" fallback:** that container is only reachable from *inside* the same CI job — a real Vercel Preview Deployment (a separate cloud service) could never connect to it. A second Neon project is a small pragmatic upgrade over the original plan: it's a real, independently-reachable Postgres, so the same harness could point an actual Vercel Preview at it later with no redesign, whereas the container approach could not.

**New scripts (`scripts/test-env-*.ts`):**
- `test-env-neon-branch.ts` — create/delete a throwaway branch on either Neon project via the Neon API; auto-provisions a compute endpoint and polls with a real `postgres-js` query (not a flat sleep) until the branch is genuinely connectable.
- `test-env-bootstrap-db.ts` — builds the store schema from scratch on a fresh branch. Notably, this **cannot** just call `drizzle-kit migrate`: real production history applied `scripts/better-auth-schema.sql` (creates `session`/`account`/`verification`) *between* migrations 0007 and 0008, but `drizzle-kit migrate` runs the whole batch as one all-or-nothing transaction, which fails on a genuinely fresh DB (`relation "session" does not exist`) and rolls back everything. This script replays the real historical order instead. It also creates the placeholder `anon`/`authenticated`/`service_role` NOLOGIN roles Supabase provides by convention, since the migrations' RLS policies reference them and plain Postgres/Neon don't have them built in.
- `test-env-seed-admin.ts` / `test-env-teardown-admin.ts` — create/delete a disposable `staff`-role admin. Playwright itself types this account's password into the real `/admin/login` form — the one deliberate carve-out of the project's "never type a password into the login form" rule, strictly scoped to this isolated environment (never Production).

**Playwright config + test:** `playwright.config.ts` (`PLAYWRIGHT_BASE_URL`-driven) and `tests/e2e/smoke.spec.ts` — two tests: the home page renders from the isolated store DB, and the disposable admin can log in through the real form and reach `/admin/dashboard`.

**CI workflow:** `.github/workflows/e2e-smoke.yml` — runs the whole flow (create branches → bootstrap schema → seed settings → build → start → seed admin → run Playwright → teardown → delete branches, `if: always()`) on manual `workflow_dispatch` for now. Station 8 wires this in as a required branch-protection check once Station 6's fuller suite exists.

## Verification

Verified twice, independently:
1. **Locally**, step by step: created both branches, bootstrapped the schema, seeded settings, built and started the real app against them, seeded the test admin, ran both Playwright tests green, then deleted both branches.
2. **In real GitHub Actions CI** — the actual target environment. Took 6 iterations to get green (see "Debugging journey" below); the final run passed all 18 workflow steps in ~3m21s, and a post-run check confirmed both ephemeral branches were genuinely deleted afterward (only each project's permanent base branch remained).

## Debugging journey (worth keeping — real lessons, not just a changelog)

The CI run failed 5 times before the actual bug was found, at the exact same "Seed baseline settings" step every time (`ECONNREFUSED`). Each earlier guess was plausible but wrong, and none reproduced locally:

1. **Guessed: Neon endpoint cold start.** Added a flat 5s sleep after branch creation → still failed.
2. **Guessed: the wrong client library's readiness probe.** Switched the probe from `pg` to `postgres-js` (matching what the app actually uses) → still failed, identical error.
3. **Guessed: GitHub Actions runners lack outbound IPv6, and `postgres-js`'s dual-stack connect was racing a dead IPv6 address.** Set `NODE_OPTIONS=--dns-result-order=ipv4first` → still failed, identical error.
4. **Guessed: a connection-establishment burst limit on the ephemeral branch's minimum-size compute.** Wrapped the DB-touching steps in a 3-attempt retry → still failed all 3 attempts, ruling out "intermittent."
5. **Actually checked the failing script's source.** `src/lib/db/drizzle/seed.ts` connects via **`MIGRATION_DATABASE_URL`**, not `DATABASE_URL`. The workflow only ever set `DATABASE_URL` from the branch-creation output — `MIGRATION_DATABASE_URL` was undefined in CI, so `postgres-js` silently fell back to a default localhost connection, which nothing was listening on. 100% reproducible (not a network fluke), and it never showed up locally because every local test session had manually set *both* variables to the same value.

**Fix:** also set `MIGRATION_DATABASE_URL` (same value as `DATABASE_URL`, since it's the same isolated store branch) in the CI environment. The three earlier speculative changes (IPv4-first DNS, configurable pool-size overrides added to `connection.ts`/`cars/db.ts`, the retry loops) were reverted — they didn't address the real bug and would have been unexplained noise left in shared production files.

**Lesson for future sessions:** when a script fails identically and immediately on every single attempt, check what env var the *failing script itself* actually reads before reaching for network/library-level theories — grep the script first, not the infrastructure around it.

## What this station did NOT do

- No visual regression tests yet (Station 5's job, once the visual work exists to test).
- No functional/write-path test suite yet (Station 6).
- The CI workflow is manual-trigger only — not yet wired into branch protection (Station 8, once Station 6's fuller suite exists to gate on).
- No real Vercel Preview Deployment integration yet — the app runs inside the CI job itself (`next start`) rather than on an actual Vercel Preview URL. This was already a known, documented tradeoff going in (the original plan's own Postgres-container fallback had the identical limitation), and the two-Neon-project design specifically leaves room to add real Vercel Preview integration later without a harness redesign.

## Skills used

None of the visual/animation/design skills applied — this station is pure test infrastructure. Followed `nextjs-app-router-patterns` and `vercel-react-best-practices` conventions already established in the codebase (e.g., lazy env checks, no module-scope throws) when writing the new scripts.
