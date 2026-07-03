# Task Ledger

Status values: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `DONE`, `FAILED`, `NOT APPLICABLE`.

| ID | Task | Status | Evidence |
|---:|---|---|---|
| 0.1 | Capture the complete MASTER SPECIFICATION verbatim in `MASTER_EXECUTION_SPEC.md`. | DONE | `MASTER_EXECUTION_SPEC.md`; `execution/EVIDENCE_LOG.md` |
| 0.2 | Verify beginning, ending, paths, URLs, mandatory checklist, and no truncation. | DONE | `Select-String` found sections 1, 30, and 31; `execution/EVIDENCE_LOG.md` |
| 0.3 | Create execution control files. | DONE | `execution/*`; `Get-ChildItem .\execution` |
| 1.1 | Use shared durable memory startup/context retrieval. | DONE | `D:\Claude-Brain\codex-memory-launch.ps1`; `D:\Claude-Brain\01-Projects\ShahY-Store.md`; `execution/EVIDENCE_LOG.md` |
| 1.2 | Inspect original source path in read-only mode. | DONE | Source exists; Git status clean on `main...origin/main`; remote `https://github.com/Darhous/ShahY-Store.git`; `execution/EVIDENCE_LOG.md` |
| 1.3 | Inspect destination contents and preserve user-created files. | IN PROGRESS | Destination contains empty `.git`, empty `.agents`, `MASTER_EXECUTION_SPEC.md`, `execution/`; `execution/EVIDENCE_LOG.md` |
| 2.1 | Inventory original project source/config/docs/tests/scripts. | IN PROGRESS |  |
| 2.2 | Identify secret-bearing files without copying active secrets. | NOT STARTED |  |
| 3.1 | Run required Git forensic commands against original repository. | NOT STARTED |  |
| 3.2 | Create `docs/git/commit-ledger.csv`. | NOT STARTED |  |
| 3.3 | Create `docs/git/commit-ledger.json`. | NOT STARTED |  |
| 3.4 | Create `docs/GIT_FORENSICS_REPORT.md`. | NOT STARTED |  |
| 4.1 | Search project-specific Claude artifacts. | NOT STARTED |  |
| 4.2 | Search project-specific Codex/agent artifacts. | NOT STARTED |  |
| 4.3 | Synthesize recovered context without raw private transcripts. | NOT STARTED |  |
| 5.1 | Audit admin pages/components/actions/API routes. | NOT STARTED |  |
| 5.2 | Audit Supabase clients, migrations, RLS, storage, auth, generated types. | NOT STARTED |  |
| 5.3 | Audit hardcoded data and brand references. | NOT STARTED |  |
| 6.1 | Copy source safely into destination excluding `.git`, build artifacts, caches, and secrets. | NOT STARTED |  |
| 6.2 | Confirm original source was not modified. | NOT STARTED |  |
| 7.1 | Create required root instruction files. | NOT STARTED |  |
| 7.2 | Create complete documentation set under `docs/`. | NOT STARTED |  |
| 7.3 | Create Arabic user operations manual. | NOT STARTED |  |
| 7.4 | Create `.env.example` and safe `.gitignore`. | NOT STARTED |  |
| 7.5 | Create `MASTER_TEMPLATE_MANIFEST.json`. | NOT STARTED |  |
| 8.1 | Create and test required PowerShell scripts. | NOT STARTED |  |
| 9.1 | Run secret scan and manual security audit. | NOT STARTED |  |
| 9.2 | Run ShahY production reference scan. | NOT STARTED |  |
| 10.1 | Install dependencies using tracked package manager. | NOT STARTED |  |
| 10.2 | Run lint. | NOT STARTED |  |
| 10.3 | Run type checking. | NOT STARTED |  |
| 10.4 | Run tests. | NOT STARTED |  |
| 10.5 | Run production build. | NOT STARTED |  |
| 11.1 | Initialize clean Git repository in destination. | NOT STARTED |  |
| 11.2 | Set and verify Master Template remote. | NOT STARTED |  |
| 11.3 | Commit final work. | NOT STARTED |  |
| 11.4 | Push final work and verify remote commit. | NOT STARTED |  |
| 12.1 | Update `docs/MASTER_TEMPLATE_REPORT.md`. | NOT STARTED |  |
| 12.2 | Update `docs/FINAL_HANDOFF.md`. | NOT STARTED |  |
| 12.3 | Complete `execution/FINAL_ACCEPTANCE.md`. | NOT STARTED |  |
| 12.4 | Provide Arabic final response with required evidence. | NOT STARTED |  |
