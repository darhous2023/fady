# Execution Plan

Source of truth: `MASTER_EXECUTION_SPEC.md`.

Classification rules before commands:
- READ ONLY: source inspection and audits only.
- DESTINATION WRITE: writes only inside `D:\Store-Master-Template`.
- EXTERNAL WRITE: GitHub/Vercel/Supabase writes only after target verification.
- DESTRUCTIVE: requires explicit authorization unless safely confined and required.

## Phase 0 - Specification Capture and Control Setup

Objective: Preserve the full MASTER SPECIFICATION and create execution controls.
Inputs: User specification, `MASTER_EXECUTION_SPEC.md`.
Read-only sources: `MASTER_EXECUTION_SPEC.md`.
Files allowed to change: `execution/*`.
Files forbidden to change: Original ShahY source, original GitHub repo, original Supabase project, original Vercel deployment.
Commands expected: PowerShell file verification, text searches.
Validation required: Beginning, ending, required paths, URLs, and mandatory checklist present.
Completion gate: Control files exist and reference the captured specification.
Dependencies: Complete MASTER SPECIFICATION.
Risks: Truncated specification; malformed Markdown fence from split message.

## Phase 1 - Safety and Destination Inspection

Objective: Inspect destination and source without modifying protected systems.
Inputs: Source path, destination path.
Read-only sources: `C:\Users\ahmed\Desktop\shahy store`, destination inventory, shared memory records.
Files allowed to change: `execution/*`, evidence reports.
Files forbidden to change: Original source and production services.
Commands expected: `Get-ChildItem`, `git status`, `rg --files`.
Validation required: Destination inventory, user-created/conflicting files identified.
Completion gate: Safe copy strategy selected and recorded.
Dependencies: Phase 0.
Risks: Existing destination files requiring preservation.

## Phase 2 - Read-only Source Inventory

Objective: Inventory application source, docs, configs, tests, scripts, and secret-bearing files by name only where sensitive.
Inputs: Original local project.
Read-only sources: Original source tree.
Files allowed to change: Execution evidence and docs in destination.
Files forbidden to change: Original source.
Commands expected: `rg --files`, `Get-ChildItem`, targeted `Select-String`.
Validation required: Source map and sensitive-file handling plan.
Completion gate: Required copy/exclude list finalized.
Dependencies: Phase 1.
Risks: Accidentally logging secret values.

## Phase 3 - Git and Historical-context Forensics

Objective: Account for reachable commits, branches, tags, stashes, reflog, deleted and renamed documentation.
Inputs: Original Git repository.
Read-only sources: Original `.git`.
Files allowed to change: `docs/git/*`, forensic reports, execution controls.
Files forbidden to change: Original Git repo.
Commands expected: `git status`, `git log`, `git show`, `git reflog`, `git fsck`, `git diff`.
Validation required: Commit ledger CSV/JSON, report states metadata vs deep review.
Completion gate: Every reachable commit indexed.
Dependencies: Phase 2.
Risks: Large history; unavailable reflog/stash.

## Phase 4 - Claude and Agent-memory Recovery

Objective: Recover project-specific durable context from local/project agent artifacts while preserving privacy.
Inputs: Original project artifacts, approved shared memory, project-specific Claude/Codex records.
Read-only sources: Project-local agent dirs, user-level project-specific records only.
Files allowed to change: Context docs and evidence logs.
Files forbidden to change: Agent-owned source records, unrelated private records.
Commands expected: Targeted `rg`, path-filtered `Get-ChildItem`.
Validation required: Raw transcripts not committed; claims classified.
Completion gate: Context index, recovery report, evidence ledger drafted.
Dependencies: Phase 1.
Risks: Privacy boundary; unrelated artifacts.

## Phase 5 - Architecture and Data-ownership Audit

Objective: Verify application architecture, admin dashboard, Supabase, data ownership, storage, auth, RLS, dynamic data sources.
Inputs: Source code, migrations, generated types, config.
Read-only sources: Original source.
Files allowed to change: Documentation and execution controls.
Files forbidden to change: Original source.
Commands expected: `rg`, file reads, static analysis.
Validation required: Admin capability matrix and data ownership evidence.
Completion gate: Verified capability and limitation reports.
Dependencies: Phase 2.
Risks: Unsupported capability claims.

## Phase 6 - Secure Project Copy and Sanitization

Objective: Copy ShahY Store into the Master Template without `.git`, build artifacts, machine caches, or active secrets.
Inputs: Copy/exclude list, destination inventory.
Read-only sources: Original source.
Files allowed to change: Destination project files.
Files forbidden to change: Original source.
Commands expected: Safe PowerShell copy with explicit exclusions, inventory check.
Validation required: No original `.git`; no active secret files copied.
Completion gate: Destination contains sanitized working project.
Dependencies: Phases 1, 2.
Risks: Copying secrets or build artifacts.

## Phase 7 - Master Template Transformation

Objective: Add template identity safeguards, agent instructions, docs, scripts, examples, and safe placeholders while preserving architecture.
Inputs: Audit findings, copied project.
Read-only sources: Captured spec, evidence reports.
Files allowed to change: Destination project files required by spec.
Files forbidden to change: Original source and production systems.
Commands expected: `apply_patch`, formatting when configured.
Validation required: Requirements mapped to changed files.
Completion gate: Required root files, docs, scripts, manifest exist and are substantive.
Dependencies: Phases 5, 6.
Risks: Over-documenting unsupported claims.

## Phase 8 - Documentation Generation

Objective: Produce complete English technical docs and Arabic user operations guide.
Inputs: Verified evidence, context recovery, architecture audit.
Read-only sources: Source evidence and reports.
Files allowed to change: `README.md`, Arabic guide, `docs/*`.
Files forbidden to change: Source project.
Commands expected: Documentation edits, link checks.
Validation required: Cross-links and required sections verified.
Completion gate: Documentation set complete.
Dependencies: Phases 3, 4, 5, 7.
Risks: Duplicated or stale docs.

## Phase 9 - Automation-script Creation

Objective: Create and test PowerShell scripts for new store creation, checks, validation, smoke testing, and resume.
Inputs: Project commands, package manager, docs requirements.
Read-only sources: Project configs.
Files allowed to change: `scripts/*.ps1`.
Files forbidden to change: Original source.
Commands expected: Script execution in safe modes.
Validation required: Scripts run without secrets and report clear results.
Completion gate: Script test evidence recorded.
Dependencies: Phase 7.
Risks: Scripts too broad or destructive.

## Phase 10 - Security and Secret Validation

Objective: Ensure no active secrets or ShahY production credentials are committed.
Inputs: Destination project.
Read-only sources: Destination files.
Files allowed to change: Security docs, `.gitignore`, `.env.example`, fixes.
Files forbidden to change: Secret values.
Commands expected: Secret scan, manual grep, ShahY reference scan.
Validation required: Clean or documented redacted findings.
Completion gate: Secret report complete and clean for commit.
Dependencies: Phases 6-9.
Risks: False positives; historical references allowed only in docs.

## Phase 11 - Build, Lint, Type-check and Tests

Objective: Run all applicable validation without weakening checks.
Inputs: Destination project.
Read-only sources: Package manifests and config.
Files allowed to change: Fixes required by verified failures, validation reports.
Files forbidden to change: Original source.
Commands expected: Install, lint, typecheck, tests, build.
Validation required: Exit codes and summaries captured.
Completion gate: Success or verified limitations documented.
Dependencies: Phases 7-10.
Risks: Missing credentials; pre-existing failures.

## Phase 12 - Git Initialization and Remote Verification

Objective: Initialize clean destination Git repo and verify safe remote.
Inputs: Destination project.
Read-only sources: Destination files.
Files allowed to change: `.git` in destination.
Files forbidden to change: Original Git repo.
Commands expected: `git init`, `git remote add`, `git status`, staged diff checks.
Validation required: Original ShahY remote absent; new remote correct.
Completion gate: Clean staged set ready for commit.
Dependencies: Phase 10, 11.
Risks: Wrong remote.

## Phase 13 - Commit and Push

Objective: Commit and push to the Master Template repository.
Inputs: Validated staged files.
Read-only sources: Destination Git state.
Files allowed to change: Destination Git history.
Files forbidden to change: Original GitHub repo.
Commands expected: `git commit`, `git push`, remote verification.
Validation required: Remote commit exists.
Completion gate: Push succeeded or authentication blocker recorded.
Dependencies: Phase 12.
Risks: Missing GitHub auth.

## Phase 14 - Final Audit and Handoff

Objective: Re-read acceptance criteria, update final handoff/report, and produce Arabic final response.
Inputs: All execution controls and docs.
Read-only sources: `MASTER_EXECUTION_SPEC.md`, acceptance files, evidence.
Files allowed to change: Final reports before final commit if needed.
Files forbidden to change: Original systems.
Commands expected: Final scans and status checks.
Validation required: `FINAL_ACCEPTANCE.md` evidence-linked.
Completion gate: All applicable acceptance items DONE or blocked with evidence.
Dependencies: Phases 0-13.
Risks: External authentication or production deployment blockers.
