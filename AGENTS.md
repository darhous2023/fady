# Agent Operating Instructions

Read order for every coding agent:
1. `AGENTS.md`
2. `PROMPT.md`
3. `PROJECT_CONTEXT.md`
4. `STORE_IDENTITY_TEMPLATE.md`
5. `README.md`
6. Relevant files under `docs/`
7. `تعليمات التشغيل.md` when working with the Arabic user workflow

This repository is a full Store Master Template derived from the audited ShahY Store codebase. Preserve the existing Next.js, Supabase, Drizzle, Better Auth, and Vercel architecture unless source evidence proves a change is required.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Type check: `npm run typecheck`
- Build: `npm run build`
- DB generate: `npm run db:generate`
- DB migrate: `npm run db:migrate`
- DB seed: `npm run db:seed`
- Secret check: `powershell -ExecutionPolicy Bypass -File scripts/check-secrets.ps1`
- ShahY reference check: `powershell -ExecutionPolicy Bypass -File scripts/check-shahy-references.ps1`

## Non-negotiable Rules

- Do not rebuild from scratch.
- Do not hardcode production products, categories, prices, orders, customers, or dynamic store content.
- Do not remove admin dashboard functionality.
- Do not expose, print, log, commit, or document secret values.
- Do not connect a new store to ShahY production resources.
- Do not claim success until the live Vercel deployment is verified.
- Do not ask questions answerable from this repository.
- Ask for store identity once and missing credentials once.

The production Vercel deployment is the final acceptance environment. Localhost is never the final deliverable.

## Data Ownership

Products, categories, product images, variants, inventory, orders, shipping, discounts, banners, settings, customers, reviews, and dynamic storefront content are database/admin-managed. Static source files may contain framework defaults, seed/demo data, and template branding only.

## Evidence-based Completion

Every completion claim must link to evidence: command, exit code, source file, report, live URL, commit SHA, or scan output. Unknowns remain `UNKNOWN` until verified.
