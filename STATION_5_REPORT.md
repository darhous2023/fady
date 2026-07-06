# Station 5 Report — Visual Implementation for /new and /used

Executes `STATION_3_PLAN.md`'s Batches A–D. Reuses Station 4's Playwright harness for testing (no new test infrastructure). **Home page and its hero video: untouched** — confirmed via `git diff`/`git status` before every commit in this station.

## Batch A — New-cars hero

**New settings keys** (free-form `settings` k/v table, no migration needed): `new_hero_video_url`, `new_hero_eyebrow_ar`, `new_hero_headline_ar`, `new_hero_subheadline_ar`.

**Files changed:**
- [`src/app/new/page.tsx`](src/app/new/page.tsx) — added `getNewHeroSettings()` (identical try/catch resilience pattern to `getUsedHeroSettings()` in `/used/page.tsx`), wired the already-built `NewCarsHero.tsx` in place of the previous plain static text block, passes real `makesCount` from `getPortalStats().publicBrandCount` (live DB data, not a settings fallback) and the real `whatsapp_number` setting. Added `id="finder"` around the quick-search/action block so the hero's "ابدأ البحث في الكتالوج" CTA has something to scroll to.
- [`src/components/admin/HomeContentForm.tsx`](src/components/admin/HomeContentForm.tsx) — new "هيرو صفحة السيارات الجديدة (/new)" section, same field layout as the existing used-hero section. Live at `/admin/home`.
- [`src/components/store/NewCarsHero.tsx`](src/components/store/NewCarsHero.tsx) — pre-existing, well-built component (Ken Burns video background, staggered framer-motion entrance, `prefers-reduced-motion` guard) that was simply never wired in before this station. No changes to the component itself, only to how it's consumed.

**Motion purpose statement:** the Ken Burns zoom and staggered text reveal exist to give `/new` visual parity with `/used`'s already-shipped cinematic hero treatment — not decoration for its own sake. Every animation already had a `prefers-reduced-motion` guard built into the component from whenever it was originally authored.

**On the hero video — what was attempted and why none was added this round:** Station 3's plan called for sourcing a licensed stock video (same discipline as the original homepage sourcing), never reusing the home page's own video. I searched Pexels for a car-dealership/showroom clip, found a plausible candidate, and tried to extract its direct CDN file URL two ways: fetching the video page directly (blocked, HTTP 403 — Pexels' anti-scraping), and probing ~15 common Pexels resolution/fps filename patterns against the CDN directly (`videos.pexels.com/video-files/{id}/...`) for two different candidate videos — all returned 403 (not a real file at that path). Rather than fabricate or guess a URL that might silently 404 in production, I left `new_hero_video_url` unset. The component's existing no-video fallback (plain dark background, full-strength scrims, fully readable text, no CLS) already handles this gracefully — the same state `used_hero_video_url` is in whenever an admin hasn't set a video. **The admin can add a real video at any time via the new `/admin/home` field — no code change needed.**

## Batch B — Used-cars hero decision

**Decision: keep `CinematicUsedHero.tsx` as-is.** No code changed for `/used`.

Compared both candidates directly in the code:
- `CinematicUsedHero.tsx` (currently active) has real, working brand quick-filter chips (`Link`s to `/used?brand=X`) and a correct `#used-grid` scroll anchor.
- `UsedCarsHero.tsx` (the alternate, unused) has a slightly more polished Ken-Burns/fade-in-on-load treatment, but **lacks the brand chips entirely** and has a confirmed dead scroll anchor (`document.getElementById("inventory")` — the real page uses `id="used-grid"`).

Swapping would have meant either losing the brand chips (a real navigation feature customers use) or porting them into `UsedCarsHero.tsx` first — extra work and swap risk for a visual polish gain that wasn't judged worth it. Per the plan's own instruction ("don't replace a component just because it exists — the choice must preserve the best complete experience"), `CinematicUsedHero.tsx` stays. `UsedCarsHero.tsx` remains in the repo, unused, available for a future revisit — its dead-anchor bug was **not** fixed since it isn't wired into any live page (fixing dead code in an unused file was out of this station's actual scope).

## Batch C — Targeted fixes from Station 3's audit

1. **`ProductGrid.tsx`'s shimmer now respects `prefers-reduced-motion`.** Moved the `animation: "pgShimmer 6s linear 1s infinite"` from an inline style (which CSS media queries can't target) to a CSS class (`.pg-title-shimmer`) with a `@media (prefers-reduced-motion: reduce)` override — the exact same pattern already used by `MarqueeTicker.tsx` elsewhere in this codebase, not a new pattern.
2. **`/new/compare`'s remove button** grew from 22×22px to a real 44×44px touch target. The original absolutely-positioned button overlapped the car-name link below it once enlarged, so the layout was restructured to a simple flex column (button, then name) — verified via `preview_inspect` that the rendered button is exactly 44×44px with no overlap.
3. **`CarDetailGallery.tsx`'s thumbnail `alt=""`** was flagged in Station 3 for verification. These 8 thumbnails are genuinely different photos of the same car (not decorative, not redundant) — a screen-reader user stepping through them previously heard "image" ×8 with no way to distinguish them. Now uses each image's own `altText` or a numbered fallback (`"{displayName} — صورة {n}"`). Verified live: a real car's thumbnails rendered `"AITO M5 2026 1.5T (272 Hp) Extended Range Hybrid — صورة 5"` etc. in the server-rendered HTML.

## Batch D — Design tokens

[`src/lib/designTokens.ts`](src/lib/designTokens.ts) — plain TS constants only, no Tailwind: `colors` (the site's existing palette — background/steel/off-white/alert/whatsapp, already-established hex values, just centralized), `spacing` (the 8px-based scale already in use), `motion` (the `[0.22,1,0.36,1]` ease curve already duplicated across `NewCarsHero.tsx`/`CinematicUsedHero.tsx`/`UsedCarsHero.tsx`, plus standard durations), and `touchTarget.comfortable = 44`. Used in `/new/compare/page.tsx` (the touch-target fix). Deliberately not used everywhere — this is not a sitewide refactor, only the two gateways' components going forward.

## How to edit the new-cars hero from the admin panel

`/admin/home` → "هيرو صفحة السيارات الجديدة (/new)" section (same layout/place as the existing used-cars hero section right above it): video URL, eyebrow text, headline, subheadline. Save applies immediately via the existing `/api/admin/settings` upsert endpoint — no deploy needed.

## Verification

**Desktop/mobile/RTL, live in a real browser (not just code review):**
- `/new`: hero renders with real `makesCount` (78+), WhatsApp CTA, and the "ابدأ البحث في الكتالوج" CTA correctly scrolls to `#finder`. No video configured → clean dark-background fallback, fully readable text, confirmed via screenshot.
- `/used`: unchanged, still renders `CinematicUsedHero.tsx` correctly (regression check, not a new feature).
- `/new/compare`: remove button confirmed 44×44px via `preview_inspect` (`boundingBox: {width: 44, height: 44}`), no overlap with the car name.
- `/new`, `/new/compare` at 360px mobile width: `scrollWidth === clientWidth` (no horizontal overflow), confirmed via direct DOM measurement.
- Console: zero errors on any tested page.

**Automated (`tests/e2e/station5-gateways.spec.ts`, 10 tests, reusing Station 4's harness):**
- Settings-driven hero text renders with graceful video fallback; zero `<video>` elements when no URL is configured.
- Real `makesCount` from the database appears in the stats row.
- `#finder` CTA scrolls correctly; `#used-grid` CTA (regression) still scrolls correctly.
- No horizontal overflow at 360px on `/new`, `/used`, and `/new/compare`.
- RTL (`document.dir === "rtl"`).
- `prefers-reduced-motion: reduce` disables the scroll-hint animation (`animationName: "none"`), verified via Playwright's `page.emulateMedia`.
- The compare page's remove button meets the 44×44 minimum, verified via `boundingBox()`.

**Results:**
- `npm run lint`: same pre-existing 25 errors / 19 warnings as before this station (verified line-by-line — none in any file this station touched or added).
- `npm test` (vitest): 27/27 passing.
- `npm run build`: clean, against the real environment.
- Playwright, locally against a **fresh isolated Neon-branch pair** (not the real DB — Station 4's harness): **12/12 passing**, including the Station 4 admin-login smoke test.
- Playwright, in **real GitHub Actions CI** (`.github/workflows/e2e-smoke.yml`, `workflow_dispatch`): see the run linked in this station's commit/PR history — triggered and watched to completion as part of this station's own verification, not just claimed.

## Problems found and fixed along the way

- **A local sanity run against `next dev` produced 9 spurious `ERR_ABORTED`/timeout failures** — traced to running Playwright against Turbopack dev mode (which recompiles per-request) while a separate browser-preview tool was also hitting the same dev server concurrently. Not a real bug: switched to testing against a real production build (`next build && next start`), which is also what the CI workflow and the isolated-harness verification both already do — all green afterward.
- **Two test-authoring bugs, not app bugs**, caught on the first real (production-build) run: a strict-mode locator ambiguity (the eyebrow text is a literal substring of the subheadline paragraph — fixed with `{ exact: true }`), and a race against the compare page's client-side data fetch (fixed by waiting for the loading text to clear before asserting on the button).

## Deferred to later stations

- Sourcing a real hero video for `/new` — needs either a different sourcing method (browser-based download rather than scripted CDN probing) or the admin's own footage; the settings field is ready whenever one exists.
- `UsedCarsHero.tsx`'s dead-anchor bug — not fixed, since the component isn't live; revisit only if a future station decides to actually swap it in.
- Full visual-regression (screenshot-diff) tests — Station 3's plan mentioned these; this station's tests are functional/structural (DOM state, computed styles, bounding boxes) rather than pixel-diff screenshots, which tend to be flakier against a settings-driven, video-optional hero. Can be added in Station 6 if wanted.
- `next/image` migration for either gateway — explicitly out of scope per the user's instructions this station.

## Confirmation: home page untouched

`git diff`/`git status` show zero changes to `src/app/page.tsx`, `src/components/store/CinematicHero.tsx`, `src/components/store/ShowroomVideoSection.tsx`, or any home-page-specific file across every commit in this station.
