# Station 3 — Visual Audit + Improvement Plan (New/Used Gateways Only)

**Date:** 2026-07-06
**Scope:** `/new*` (`/new`, `/new/browse`, `/new/search`, `/new/compare`, `/new/favorites`, `/new/car/[normalizedKey]`) and `/used` + `/products/[slug]`.
**Hard lock, respected throughout:** the home page and its hero video were not touched, redesigned, or even opened as a "reference" beyond what was already known from earlier sessions. Zero code was changed in this station — this document is a plan only.

**Verification method note:** live browser navigation in this environment's preview tool proved unreliable for this multi-page app during this session (client-side link clicks scrolled the homepage instead of navigating; `window.location` assignment silently no-opped) — the same limitation this project's own `.ai/` memory already documents from prior sessions. Rather than fight it, this audit is built on precise, verified source reads: exact hex colors, exact breakpoints, exact animation timings extracted directly from the component files (via a dedicated Explore pass covering all 13 relevant files), plus targeted `grep`/`curl` checks to confirm specific claims (e.g. the scroll-anchor bug below was confirmed by reading both files' actual `href`/`getElementById` calls, not inferred).

---

## 1. Skills actually used (verified real, on disk, before citing)

| Skill | Verified path | What I asked it | Where it fed this report |
|---|---|---|---|
| `accessibility` | `C:\Users\ahmed\.claude\skills\accessibility\SKILL.md` | Touch targets, contrast, keyboard nav, alt text, reduced-motion, RTL correctness for both gateways | §3, §4 — touch-target and alt-text findings, reduced-motion acceptance criteria |
| `performance` | `C:\Users\ahmed\.claude\skills\performance\SKILL.md` | Image loading strategy, CLS risk, video-hero loading pattern, Core Web Vitals budget | §3 — confirmed zero `next/image` usage sitewide; §5 acceptance criteria (LCP/CLS budgets) |
| `nextjs-app-router-patterns` | `C:\Users\ahmed\.claude\skills\nextjs-app-router-patterns\SKILL.md` | Server/client component boundary for a settings-driven, framer-motion hero | §5 — hero wiring plan (server fetch → client animated component) |
| `vercel-react-best-practices` | `C:\Users\ahmed\.claude\skills\vercel-react-best-practices\SKILL.md` | Image optimization patterns, `force-dynamic` implications, bundle-size for a new hero | §3, §5 — image/video loading recommendations |
| `tailwind-design-system` | `C:\Users\ahmed\.claude\skills\tailwind-design-system\SKILL.md` | Design-token *principles* (not Tailwind syntax — this repo stays inline-style) for a `designTokens.ts` | §5 — `src/lib/designTokens.ts` token categories |
| `ui-animation` *(already active this session)* | `C:\Users\ahmed\.claude\skills\ui-animation\SKILL.md` | Motion-purpose rules (no decorative-only animation), reduced-motion patterns | §4 — every animation change in §5 states its purpose |
| `framer-motion-animator` *(already active this session)* | `C:\Users\ahmed\.claude\skills\framer-motion-animator\SKILL.md` | Concrete framer-motion patterns for the hero components already using it | §3 — evaluating `NewCarsHero.tsx`/`CinematicUsedHero.tsx`/`UsedCarsHero.tsx`'s existing motion code |
| `frontend-design` *(already active this session)* | `C:\Users\ahmed\.claude\skills\frontend-design\SKILL.md` | Distinctive-identity judgment for the two gateways vs. generic template defaults | §4 — visual-identity recommendations |
| `ui-ux-pro-max` *(already active this session)* | `C:\Users\ahmed\.claude\plugins\cache\ui-ux-pro-max-skill\...\ui-ux-pro-max\SKILL.md` | Touch-target/contrast/style-consistency rule table | §3 — cross-checked against the accessibility skill's findings |

`playwright-cli` was **not** invoked here — it belongs to Station 4 (building the actual test harness), not this planning-only station.

---

## 2. Governing rules (pinned, not open for re-litigation)

- Home page + its hero video: completely off-limits.
- No Tailwind migration. A small `src/lib/designTokens.ts` (plain TS constants) is the only structural addition — everything else stays inline `style={{}}`.
- Any new hero video/poster is a new `settings` key, admin-editable, never hardcoded.
- Audit (this document) always precedes implementation (Station 5).
- Every animation in the implementation plan below states its purpose — no decorative-only motion added.

---

## 3. Per-gateway problem report

### 3.1 New-cars gateway (`/new*`)

**What's already good (preserve, don't touch):**
- `/new/browse`'s layout overflow bug and sort/brand-filter functionality are already fixed (Station 1) — no further functional work needed here.
- `CarDetailGallery.tsx`, `ImageLightbox.tsx`, and `Product360Viewer.tsx` all already respect `prefers-reduced-motion` via a real hook, have proper `role="dialog"`/`aria-modal`/keyboard support, and meet the 44px touch-target minimum on their controls.
- `NewCarsFinder.tsx` is gone (Station 1).

**Real problems found:**
1. **`/new`'s hero is a plain static text block** — no video, no motion, objectively weaker than the unused `NewCarsHero.tsx` sitting right next to it (which has a full Ken Burns video background, staggered framer-motion entrance, and a real `prefers-reduced-motion` CSS guard already built). This is the single biggest visual gap on this gateway.
2. **Zero settings infrastructure exists for a new-cars hero.** Confirmed via source read: `/used/page.tsx` already has `getUsedHeroSettings()` reading `used_hero_video_url`/`used_hero_eyebrow_ar`/`used_hero_headline_ar`/`used_hero_subheadline_ar` from the `settings` table, wired to `HomeContentForm.tsx` in the admin. `/new/page.tsx` has **no equivalent** — nothing to build on, has to be created from scratch (see §5).
3. **Comparison table's remove button is ~22×22px** — below the 44px comfortable touch target (and below even the 24px WCAG 2.2 AA minimum is close but the *comfortable* target matters more on a delete-adjacent control since a mis-tap has real consequence).
4. **`CarDetailGallery.tsx`'s thumbnail images have empty `alt=""`** — intentional-looking (avoiding redundant announcements) but not verified against the main image's `alt` to confirm no information is lost for screen-reader users stepping through thumbnails one at a time.
5. **No `next/image` usage anywhere in this gateway** (confirmed: zero `next/image` imports in the entire repo) — every car photo is a raw `<img>`. Given cars-catalog images are 88.5%-reliable hotlinked external URLs (Station 2 finding), there's no `next/image` remote-pattern allowlist risk today, but it also means zero automatic `srcset`/format-negotiation/blur-placeholder benefit on a page whose whole purpose is showing car photos.

### 3.2 Used-cars gateway (`/used`, `/products/[slug]`)

**What's already good (preserve, don't touch):**
- `CinematicUsedHero.tsx` (the currently active hero) is already a real settings-driven, framer-motion, `prefers-reduced-motion`-respecting cinematic hero with a working scroll anchor (`#used-grid`) and brand quick-filter chips. This gateway's hero is **not** a gap the way `/new`'s is.
- `ProductDetail.tsx`'s gallery (tilt-on-hover, zoom, 360 toggle, share menu) is genuinely sophisticated and already handles keyboard arrow-navigation and `Product360Viewer`'s full accessibility story (aria-label with frame counter, keyboard stepping, multi-touch protection).
- `ImageLightbox.tsx` is shared between both gateways and already reduced-motion-safe.

**Real problems found:**
1. **`UsedCarsHero.tsx` (the unused alternate hero) has a real, confirmed dead scroll-anchor bug**: it calls `document.getElementById("inventory")` but the actual page uses `id="used-grid"` (confirmed by reading both files directly). If this component is ever swapped in for `CinematicUsedHero.tsx` without fixing this, its "browse now" CTA would silently fail to scroll. Must be fixed as part of any swap, not after.
2. **`ProductGrid.tsx`'s section-header shimmer animation runs infinitely with no `prefers-reduced-motion` opt-out** — every other animation in this same file (and across both gateways) correctly guards for reduced motion; this one shimmer is the one exception.
3. **`ProductDetail.tsx`'s 3D tilt-on-hover gallery effect has no touch/keyboard equivalent** — it's a nice-to-have on desktop but silently does nothing on mobile/touch (not broken, just an inconsistent experience note — the image is still fully viewable and zoomable via tap, so this is low-severity).
4. **The animated gradient price text** (`WebkitBackgroundClip: text`) is a visual flourish that a screen reader will announce as a single opaque text node — functionally fine (the price text itself is still real text), flagged only because it's the kind of decorative-motion-on-critical-content pattern worth a second look during implementation, not because it's broken.
5. Same `next/image` gap as the new-cars gateway (zero usage sitewide).

### 3.3 Sitewide-but-gateway-relevant note

Zero `next/image` usage across the entire codebase is a real, verified fact (not a guess) — but a full sitewide migration is **not** proposed here; it's out of this station's scope (two gateways only). If Station 5 wants to try `next/image` on the two gateways specifically, that's a real option worth evaluating there, not decided here.

---

## 4. What must be preserved (explicit, so Station 5 doesn't accidentally regress it)

- Every existing `prefers-reduced-motion` guard (there are several, in `NewCarsHero.tsx`, `CinematicUsedHero.tsx`, `UsedCarsHero.tsx`, `ImageLightbox.tsx`, `Product360Viewer.tsx`) — all already correct, don't touch the pattern, just extend it consistently to the one gap found (`ProductGrid.tsx`'s shimmer).
- The already-fixed Station 1 overflow/sort/brand-filter behavior on `/new/browse`.
- `CinematicUsedHero.tsx`'s working `#used-grid` scroll anchor — if `UsedCarsHero.tsx` replaces it, the anchor bug must be fixed as part of the swap.
- All existing `aria-label`s, `role="dialog"`, keyboard handlers on `ImageLightbox.tsx` and `Product360Viewer.tsx`.

---

## 5. Batched implementation plan for Station 5 (not executed here)

**Batch A — New-cars hero (biggest single gap):**
1. Add 4 new settings keys mirroring the exact existing used-cars naming convention: `new_hero_video_url`, `new_hero_eyebrow_ar`, `new_hero_headline_ar`, `new_hero_subheadline_ar` (reuses the existing `whatsapp_number` key, no new key needed for that).
2. Add a `getNewHeroSettings()` server-side fetch in `/new/page.tsx`, mirroring `getUsedHeroSettings()`'s exact pattern (same try/catch resilience per the standing rule).
3. Extend `HomeContentForm.tsx` (or a dedicated small form) with the 4 new fields — same admin surface pattern as used-hero, not a new bespoke page.
4. Wire `NewCarsHero.tsx` into `/new/page.tsx` in place of the current static text block, passing the new settings + a real `makesCount` (already available server-side).
5. **Motion purpose statement** (per `ui-animation`'s rule that every animation states its purpose): the Ken Burns zoom and staggered text reveal exist to match the used-cars gateway's already-shipped cinematic treatment, giving the two gateways visual parity — not decoration for its own sake.
6. Source a licensed stock video for the new-cars hero (never reusing the home page's hero video, per the hard lock) — admin-swappable via the new setting from day one.

**Batch B — Used-cars hero decision:**
- Either keep `CinematicUsedHero.tsx` as-is (it's already solid), or swap to `UsedCarsHero.tsx` for its slightly more polished scrim/Ken-Burins treatment — **if swapping, the `#inventory` → `#used-grid` anchor bug must be fixed in the same commit**, and `CinematicUsedHero.tsx`'s brand quick-filter chips (which `UsedCarsHero.tsx` lacks) need a decision: port them over, or accept their loss.

**Batch C — Small, real fixes (no hero dependency, can happen anytime in Station 5):**
- Add a `prefers-reduced-motion` guard to `ProductGrid.tsx`'s section-header shimmer (the one gap found).
- Increase the comparison-table remove button's touch target on `/new/compare` toward 44px.
- Verify `CarDetailGallery.tsx`'s thumbnail `alt=""` choice is intentional (compare against the main image's alt behavior) and document the reasoning inline if kept.

**Batch D — Design tokens:**
- Create `src/lib/designTokens.ts` with the token categories a design-token system needs for this scope (per the `tailwind-design-system` skill's underlying principles, adapted to plain TS constants, not Tailwind theme syntax): a `color` object (background `#0A0A0A`, steel `#9BA3AA`, off-white `#F2F0EC`/`#F5F5F5`, red-alert `#A5342C`, WhatsApp green `#25D366` — all already-established site colors, just centralized), a `spacing` scale matching values already in use (8/10/12/16/20/24/32/40px), and a `motion` object (the shared `EASE = [0.22, 1, 0.36, 1]` curve already duplicated across 3 hero files, plus standard durations). Used only by the two gateways' components going forward — not a sitewide refactor.

### Objective acceptance criteria (per component touched in Station 5)

- No horizontal clipping/overflow at 360px viewport width.
- Hero text remains readable over video at every breakpoint (contrast-checked, not just "looks fine").
- Every video hero has a poster-frame fallback for when autoplay is blocked (a real, testable state, not assumed).
- No layout shift (CLS) introduced by the new hero — reserve space before the video/settings data resolves.
- `prefers-reduced-motion: reduce` fully respected on every new/changed animation, verified via DevTools emulation, not assumed.
- Every animation's purpose is stated in a code comment or PR description — no decorative-only motion.
- Build clean, unit tests green, `route-health-check` clean, before any commit.
