# Requirements Matrix

Source of truth: `MASTER_EXECUTION_SPEC.md`.

| Req ID | Source Section | Required Output | Target File/System | Status | Verification Method | Evidence Location | Final Result |
|---|---|---|---|---|---|---|---|
| R-001 | 1 | Preserve authoritative project paths, URLs, refs, and destination repository. | Docs, scripts, manifest | NOT STARTED | Compare against spec |  |  |
| R-002 | 2 | Produce reusable Store Factory enabling future agents to create/deploy stores. | Entire repository | NOT STARTED | Acceptance checklist and docs review |  |  |
| R-003 | 3.1 | Verify admin dashboard ownership and create capability matrix. | `docs/ADMIN_CAPABILITY_MATRIX.md` | NOT STARTED | Source evidence audit |  |  |
| R-004 | 3.2 | Define Vercel as final acceptance environment. | Root docs and production docs | NOT STARTED | Documentation review |  |  |
| R-005 | 3.3 | Ensure database/admin-managed dynamic store data; create data ownership map. | `docs/DATA_OWNERSHIP.md` | NOT STARTED | Source audit and scan |  |  |
| R-006 | 3.4 | Preserve existing system without rebuilding from scratch. | Project copy and docs | NOT STARTED | Diff/copy evidence |  |  |
| R-007 | 3.5 | Enforce isolated future stores and ShahY reference checks. | Scripts/docs | NOT STARTED | Script run and scan |  |  |
| R-008 | 4 | Execute autonomously and communicate in Arabic; batch credential requests. | Process/docs | NOT STARTED | Evidence log |  |  |
| R-009 | 5 | Protect original source, GitHub repo, Vercel deployment, and Supabase project. | Process/evidence | NOT STARTED | Read-only command audit |  |  |
| R-010 | 6 | Inspect destination and preserve user files/back up conflicts. | Destination | NOT STARTED | Inventory report |  |  |
| R-011 | 7 | Copy and sanitize project without original `.git`, build outputs, caches, active secrets. | Destination project | NOT STARTED | Inventory and scans |  |  |
| R-012 | 8 | Recover project-specific Claude and agent context safely. | Context docs | NOT STARTED | Search logs and privacy review |  |  |
| R-013 | 9 | Complete Git forensics and commit ledgers. | `docs/git/*`, report | NOT STARTED | Git command evidence |  |  |
| R-014 | 10 | Audit live production behavior safely. | Production audit docs | NOT STARTED | Browser/network evidence |  |  |
| R-015 | 11 | Document Supabase/database/RLS/storage architecture. | Database docs | NOT STARTED | Static and CLI audit |  |  |
| R-016 | 12 | Audit hardcoded data and brand references. | Brand/hardcode docs | NOT STARTED | Search evidence |  |  |
| R-017 | 13 | Secret and security audit; create `.env.example`. | Security docs, `.env.example` | NOT STARTED | Secret scan |  |  |
| R-018 | 14 | Create required root files. | Repository root | NOT STARTED | File existence and content review |  |  |
| R-019 | 15 | Create Arabic operations manual with required sections. | `تعليمات التشغيل.md` | NOT STARTED | Section checklist |  |  |
| R-020 | 16 | Create Arabic-first GitHub README. | `README.md` | NOT STARTED | Section/link review |  |  |
| R-021 | 17 | Create operational `AGENTS.md`. | `AGENTS.md` | NOT STARTED | Content review |  |  |
| R-022 | 18 | Create Claude-compatible `CLAUDE.md`. | `CLAUDE.md` | NOT STARTED | Content review |  |  |
| R-023 | 19 | Create durable `PROJECT_CONTEXT.md`. | `PROJECT_CONTEXT.md` | NOT STARTED | Evidence references |  |  |
| R-024 | 20 | Create universal future-agent `PROMPT.md`. | `PROMPT.md` | NOT STARTED | Content review |  |  |
| R-025 | 21 | Create store identity intake form. | `STORE_IDENTITY_TEMPLATE.md` | NOT STARTED | Content review |  |  |
| R-026 | 22 | Create complete documentation set. | `docs/*` | NOT STARTED | File checklist |  |  |
| R-027 | 23 | Create and test PowerShell automation scripts. | `scripts/*.ps1` | NOT STARTED | Script execution evidence |  |  |
| R-028 | 24 | Run install, lint, typecheck, tests, build, scans, route/doc checks. | Validation reports | NOT STARTED | Exit codes |  |  |
| R-029 | 25 | Create machine-readable manifest. | `MASTER_TEMPLATE_MANIFEST.json` | NOT STARTED | JSON validation |  |  |
| R-030 | 26 | Initialize clean Git repo, commit, push to Master Template. | Destination Git/GitHub | NOT STARTED | Git status/remote/commit/push evidence |  |  |
| R-031 | 27 | Create Master Template report. | `docs/MASTER_TEMPLATE_REPORT.md` | NOT STARTED | Content review |  |  |
| R-032 | 28 | Create final handoff. | `docs/FINAL_HANDOFF.md` | NOT STARTED | Content review |  |  |
| R-033 | 29 | Final Arabic user response with required evidence. | Chat response | NOT STARTED | Final evidence review |  |  |
| R-034 | 30 | Satisfy mandatory acceptance checklist. | `execution/FINAL_ACCEPTANCE.md` | NOT STARTED | Evidence-linked checklist |  |  |
| R-035 | 31 | Start with read-only original audit, then safe destination inspection, then execute. | Process | NOT STARTED | Evidence log order |  |  |
