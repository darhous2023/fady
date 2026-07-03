# STORE MASTER TEMPLATE — AUTONOMOUS STORE FACTORY, CONTEXT RECOVERY, DOCUMENTATION, SECURITY AND PRODUCTION BOOTSTRAP

You are operating as all of the following roles simultaneously:

* Principal Software Architect
* Senior Full-Stack Engineer
* Senior Next.js Engineer
* Supabase Database Architect
* PostgreSQL and RLS Specialist
* Vercel Production Engineer
* Git and Repository Forensics Specialist
* Application Security Reviewer
* E-commerce Systems Engineer
* Admin Dashboard Architect
* Visual Identity Systems Engineer
* Technical Documentation Lead
* AI-Agent Context and Memory Engineer
* Windows and PowerShell Automation Engineer
* Production QA Engineer

This is not a simple repository-copy task.

Your mission is to transform the existing ShahY Store production project into a secure, reusable, deeply documented, automation-ready **Store Master Template** that can serve as the permanent foundation for all future stores.

The resulting repository must allow Claude, Codex, Gravity, or another capable coding agent to open the repository, read its instructions, request only the minimum required identity and credentials from the user, and then create, configure, customize, deploy, test, and hand over a new production store with minimal user involvement.

Do not stop after analysis.

Do not return only a plan.

Do not create superficial generic documentation.

Inspect, recover, understand, copy, improve, document, automate, validate, commit, and push the complete Master Template.

---

# 1. AUTHORITATIVE PROJECT INFORMATION

## Original local project

```text
C:\Users\ahmed\Desktop\shahy store
```

## Original GitHub repository

```text
https://github.com/Darhous/ShahY-Store
```

## Original production website

```text
https://shah-y-store.vercel.app/
```

## Original Supabase project dashboard

```text
https://supabase.com/dashboard/project/pggmpvhyuxfetifzesws
```

## Original Supabase project reference

```text
pggmpvhyuxfetifzesws
```

## Master Template destination

```text
D:\Store-Master-Template
```

## Master Template GitHub repository

```text
https://github.com/Darhous/Store-Master-Template
```

The destination folder and GitHub repository have already been created by the user.

---

# 2. FINAL OBJECTIVE

The completed repository must become an internal commercial **Store Factory**.

A future AI agent must be able to:

1. Clone or open the Master Template.
2. Read the repository instructions automatically.
3. Understand the full system architecture.
4. Understand the historical decisions behind the architecture.
5. Understand how the database, dashboard, storefront, authentication, storage, and deployment work.
6. Ask the user for the identity of the new store in one concise request.
7. Ask for all required API access or authentication in one consolidated request.
8. Create isolated resources for the new store.
9. Change the store identity and branding.
10. Preserve all existing e-commerce capabilities.
11. Configure the database and storage.
12. Preserve full admin-dashboard control.
13. Deploy the final store to Vercel.
14. verify the live Vercel deployment.
15. Fix production failures automatically.
16. Provide a complete final handoff report.

The user should not need to explain the architecture again.

The user should not need to repeatedly tell the agent how the project works.

The user should not need to manage routine technical decisions.

The repository documentation must replace the lost context of previous conversations as far as that context can be recovered from verifiable local and repository evidence.

---

# 3. NON-NEGOTIABLE PROJECT PRINCIPLES

These principles must be verified in the implementation and written clearly into:

```text
AGENTS.md
CLAUDE.md
PROMPT.md
PROJECT_CONTEXT.md
README.md
تعليمات التشغيل.md
docs/NEW_STORE_PLAYBOOK.md
docs/ADMIN_DASHBOARD.md
docs/DATA_OWNERSHIP.md
``

This document must map every important data domain to its authoritative owner:

* Database
* Admin dashboard
* Environment variable
* Static source configuration
* Build-time branding token
* Static public asset
* Deployment platform

## 3.4 Preserve the existing system

ShahY Store is the functional foundation.

Do not rebuild the project from scratch.

Do not replace working systems with simpler alternatives.

Do not remove features to make the template easier.

Do not replace the backend with mock data.

Do not change the framework, package manager, database provider, authentication approach, or deployment platform without a proven technical requirement.

Do not silently introduce unrelated architecture.

Prefer the established patterns already used in the project.

## 3.5 Isolated future stores

Every future store must use isolated resources unless the user explicitly requests otherwise.

A future store must not accidentally connect to:

* ShahY production Supabase
* ShahY production database
* ShahY storage buckets
* ShahY Vercel project
* ShahY production domain
* ShahY GitHub repository
* ShahY private credentials
* ShahY customer or order data

Add automated checks that reject accidental use of:

```text
pggmpvhyuxfetifzesws
https://shah-y-store.vercel.app/
https://github.com/Darhous/ShahY-Store
```

inside a newly generated store, except where they appear in historical or migration documentation.

---

# 4. AUTONOMOUS EXECUTION RULES

Work autonomously.

Do not ask questions that can be answered by examining:

* Source code
* Git history
* Commit diffs
* Branches
* Tags
* Stashes
* Reflog
* Existing documentation
* Environment variable names
* Package configuration
* Database migrations
* Generated database types
* Supabase configuration
* Vercel configuration
* GitHub metadata
* Existing reports
* Existing Claude files
* Existing Codex files
* Existing planning files
* Existing scripts
* The live production website

Ask the user only when blocked by:

1. Missing authentication or credentials.
2. A store-identity decision that cannot be inferred.
3. An irreversible destructive operation.
4. A potentially chargeable operation.
5. A required external resource only the user can authorize.

When information is required:

* Ask once.
* Group all required items.
* Separate required from optional.
* Explain exactly why each item is needed.
* Never ask for information already supplied.
* Continue automatically after it is provided.

Communicate with the user in Arabic.

Write durable technical documentation in professional English, except:

```text
تعليمات التشغيل.md
```

which must be written in clear, practical Arabic for the user.

The GitHub `README.md` must be Arabic-first and may include English technical terms and commands where appropriate.

---

# 5. STRICT SOURCE PROTECTION

Treat the original project as read-only.

Do not modify:

```text
C:\Users\ahmed\Desktop\shahy store
```

Do not modify:

```text
https://github.com/Darhous/ShahY-Store
```

Do not modify:

```text
https://shah-y-store.vercel.app/
```

Do not modify the Supabase project:

```text
pggmpvhyuxfetifzesws
```

Forbidden actions against the original project include:

* Editing source files
* Deleting files
* Renaming files
* Formatting files in place
* Changing Git remotes
* Committing
* Pushing
* Rewriting Git history
* Running destructive cleanup
* Resetting branches
* Applying database migrations
* Changing production data
* Changing Vercel environment variables
* Triggering an unauthorized production deployment
* Uploading or deleting storage assets
* Creating test orders
* Changing admin accounts
* Rotating credentials

All changes must be made inside:

```text
D:\Store-Master-Template
```

---

# 6. DESTINATION SAFETY

Before writing, inspect:

```text
D:\Store-Master-Template
```

If it contains files:

1. Inventory all files.
2. Determine whether any were created by the user.
3. Preserve user-created files.
4. Create a timestamped backup directory when replacing conflicting content.
5. Never silently delete unknown data.

Suggested backup location:

```text
D:\Store-Master-Template-Backup-YYYYMMDD-HHMMSS
```

Only back up when needed.

Do not create unnecessary duplicate copies.

---

# 7. COPY AND SANITIZATION STRATEGY

Create a clean Master Template copy without copying the original `.git` history into the destination.

Preserve all required files, including:

* Application source
* Admin dashboard
* Storefront
* Public assets
* Styles
* Design tokens
* Components
* API routes
* Server actions
* Middleware
* Authentication
* Authorization
* Database migrations
* Database schema
* Generated types where legitimately tracked
* Supabase configuration
* Storage integration
* Tests
* Scripts
* Package manifest
* Lockfile
* Vercel configuration
* Build configuration
* Deployment configuration
* Existing relevant documentation

Exclude generated and machine-specific files where applicable:

```text
.git
node_modules
.next
dist
build
coverage
.cache
.turbo
.vercel
logs
tmp
temp
*.log
Thumbs.db
.DS_Store
editor caches
operating-system caches
local build output
```

Do not transfer active secret files.

Inspect secret files only to determine:

* Required variable names
* Integration structure
* Client/server boundaries
* Deployment requirements

Create safe placeholders instead.

---

# 8. COMPLETE CLAUDE MEMORY AND REPORT RECOVERY

Recover every project-specific Claude artifact that is verifiably stored locally or in Git history.

You cannot recover private hidden model reasoning that was never saved to disk.

Do not claim that hidden Claude thoughts or deleted remote conversations were recovered unless there is a real local artifact.

Recover and synthesize all available evidence.

## 8.1 Search inside the original project

Search recursively for files and directories such as:

```text
CLAUDE.md
AGENTS.md
PROMPT.md
MEMORY.md
memory.md
CONTEXT.md
context.md
HANDOFF.md
handoff.md
CHECKPOINT.md
checkpoint.md
REPORT.md
report.md
AUDIT.md
audit.md
PLAN.md
plan.md
TASKS.md
tasks.md
TODO.md
CHANGELOG.md
README.md
README.*
.claude
.codex
.agent
.agents
.ai
memory
memories
reports
docs
notes
handoffs
checkpoints
audits
plans
tasks
backups
archive
```

Search all relevant:

* Markdown files
* Text files
* JSON files
* JSONL files
* YAML files
* TOML files
* Log files
* PowerShell scripts
* Shell scripts
* GitHub workflow files
* Configuration files
* Source comments
* Commit messages

Search for project identifiers:

```text
ShahY
Shahy
shahy store
ShahY-Store
shah-y-store
pggmpvhyuxfetifzesws
https://shah-y-store.vercel.app/
https://github.com/Darhous/ShahY-Store
C:\Users\ahmed\Desktop\shahy store
```

## 8.2 Search project-specific Claude Code storage

Inspect project-related Claude Code storage when available, including:

```text
%USERPROFILE%\.claude
%USERPROFILE%\.claude\projects
%USERPROFILE%\.claude\plans
%USERPROFILE%\.claude\todos
%USERPROFILE%\.claude\memory
```

Also inspect project-local `.claude` directories.

Search for directories or records whose metadata or contents explicitly reference:

```text
C:\Users\ahmed\Desktop\shahy store
ShahY-Store
shah-y-store.vercel.app
pggmpvhyuxfetifzesws
```

Important privacy boundary:

* Inspect only artifacts connected to ShahY Store.
* Do not collect unrelated Claude conversations.
* Do not copy unrelated personal data.
* Do not publish raw private conversation logs to GitHub.
* Do not publish credentials.
* Do not publish personal customer data.
* Do not publish hidden system prompts.
* Do not publish unrelated project context.

If project-specific Claude transcripts or JSONL session files exist, extract only durable project knowledge such as:

* Requirements
* Decisions
* Completed work
* Rejected approaches
* Architecture explanations
* Deployment fixes
* Supabase changes
* Vercel changes
* Dashboard capabilities
* User preferences
* Known issues
* Pending work
* Testing outcomes
* File paths
* Commands
* Important warnings

Summarize this knowledge instead of committing raw transcripts.

## 8.3 Search other project-specific agent artifacts

Inspect project-related artifacts for:

* Codex
* Claude Code
* Gravity
* Cursor
* Windsurf
* Copilot
* Cline
* Roo Code
* Continue

Only inspect files clearly linked to this project.

Potential locations may include project-local hidden directories and user-level project indexes.

Do not scan or expose unrelated projects.

## 8.4 Recover deleted context through Git

Inspect deleted, renamed, and historical files that may contain:

* Claude reports
* Project memory
* Implementation summaries
* Handoffs
* Deployment notes
* Audit reports
* Bug-fix notes
* Feature checklists
* Architecture decisions

Use Git history to recover the meaningful content of those files.

Do not restore outdated instructions as current truth without checking the present code.

## 8.5 Produce a context evidence system

Create:

```text
docs/AI_CONTEXT_INDEX.md
docs/CLAUDE_MEMORY_RECOVERY.md
docs/CONTEXT_EVIDENCE_LEDGER.md
docs/DECISION_REGISTER.md
docs/KNOWN_ISSUES.md
docs/HISTORICAL_TIMELINE.md
```

### `docs/AI_CONTEXT_INDEX.md`

Provide a navigable index of:

* Active instruction files
* Recovered Claude context
* Git-derived context
* Current architecture documents
* Deployment documents
* Database documents
* Dashboard documents
* Branding documents
* Operational guides

### `docs/CLAUDE_MEMORY_RECOVERY.md`

Document:

* Locations inspected
* Project-specific artifacts found
* Types of artifacts found
* Durable information recovered
* Conflicts discovered
* Obsolete instructions found
* Information that could not be recovered
* Privacy filtering performed
* Confirmation that raw private conversations were not committed

### `docs/CONTEXT_EVIDENCE_LEDGER.md`

For every major recovered claim, include:

* Claim
* Confidence level
* Evidence type
* Evidence location
* Current validity
* Related document

Use the confidence levels:

```text
Confirmed
Strongly inferred
Historical only
Unknown
```

### `docs/DECISION_REGISTER.md`

Record major technical and business decisions:

* Decision
* Reason
* Source evidence
* Current status
* Alternatives rejected
* Impact on future stores

Do not fabricate reasons.

If the reason cannot be recovered, write:

```text
Reason not explicitly recorded; current implementation confirms the decision.
```

---

# 9. COMPLETE GIT FORENSICS

Inspect the complete original repository history in read-only mode.

Run and analyze, where applicable:

```powershell
git status
git remote -v
git branch -a -vv
git tag --list
git stash list
git log --all --graph --decorate --date=iso
git shortlog -sne --all
git reflog --all
git fsck --full --no-reflogs
```

Use targeted analysis with:

```powershell
git show
git log --stat
git log --name-status
git log --follow
git log --diff-filter=D
git log --diff-filter=R
git log -S
git log -G
git blame
git diff
```

## 9.1 Every commit must be accounted for

Create:

```text
docs/git/commit-ledger.csv
docs/git/commit-ledger.json
docs/GIT_FORENSICS_REPORT.md
```

Every reachable commit must appear in the commit ledger with:

* Full SHA
* Short SHA
* Date
* Author
* Commit message
* Parent commit or commits
* Changed-file count
* Added-line count
* Deleted-line count
* Main affected areas
* Classification
* Significance
* Whether deep review was required
* Related recovered decision

Classify commits such as:

* Initial setup
* Feature
* Database
* Admin dashboard
* Authentication
* Security
* UI or branding
* Deployment
* Bug fix
* Performance
* Documentation
* Refactor
* Revert
* Emergency fix
* Unknown

Inspect metadata and changed-file lists for every commit.

Deeply inspect the full diff of all commits relevant to:

* Architecture
* Database
* Supabase
* RLS
* Authentication
* Admin dashboard
* Products
* Orders
* Content management
* Storage
* Vercel
* Environment variables
* Security
* Production fixes
* Major visual systems
* Reverts
* Regressions
* Lost documentation

Do not falsely state that all commits were deeply reviewed if only metadata was inspected.

State the exact review method in the report.

## 9.2 Branches, tags, stashes and reflog

Document:

* Local branches
* Remote branches
* Merged branches
* Unmerged branches
* Diverged branches
* Tags
* Stashes
* Reflog-only commits
* Dangling commits
* Relevant unreachable objects
* Work that exists outside `main`

Do not automatically merge old branches into the Master Template.

Recover knowledge and useful implementation only after validating it against the current system.

## 9.3 Remote GitHub context

If GitHub CLI authentication exists, inspect:

* Repository branches
* Pull requests
* Closed pull requests
* Issues
* Releases
* GitHub Actions
* Failed workflows
* Successful workflows
* Deployment-related checks
* Repository metadata

Do not modify the original repository.

If authentication is required, finish all local work first, then request GitHub authentication once.

---

# 10. LIVE PRODUCTION AUDIT

Inspect:

```text
https://shah-y-store.vercel.app/
```

Use the production site as evidence of the current user experience.

Safely inspect, where available:

* Homepage
* Header
* Navigation
* Search
* Product listings
* Product cards
* Product details
* Categories
* Collections
* Cart
* Checkout entry
* Authentication entry
* Responsive layouts
* Loading states
* Empty states
* Error states
* Metadata
* Favicon
* Images
* Fonts
* Console errors
* Network failures
* Broken links

Do not:

* Place a real order
* Create a fake customer
* Change data
* Upload files
* Modify admin content
* Trigger destructive actions

Create:

```text
docs/PRODUCTION_BEHAVIOR.md
docs/PRODUCTION_AUDIT.md
```

Document any differences between:

* Local source
* GitHub source
* Git history
* Live Vercel behavior
* Master Template behavior

---

# 11. SUPABASE AND DATABASE FORENSICS

Inspect how Supabase is used before requesting any credential.

Find and document:

* Supabase client creation
* Browser client
* Server client
* Admin client
* Middleware
* Authentication
* Session handling
* Role handling
* Admin authorization
* Database tables
* Views
* Functions
* Triggers
* RPC calls
* Migrations
* RLS policies
* Storage buckets
* Storage policies
* Generated TypeScript types
* Edge Functions
* Server actions
* API routes
* Product queries
* Category queries
* Inventory logic
* Order logic
* Store settings
* Dashboard mutations
* Audit logging
* Seed operations

Create:

```text
docs/DATABASE_AND_SUPABASE.md
docs/DATABASE_SCHEMA_REFERENCE.md
docs/RLS_AND_AUTHORIZATION.md
docs/STORAGE_ARCHITECTURE.md
docs/MIGRATION_PLAYBOOK.md
```

Generate or preserve a safe schema representation without production customer data.

Never commit:

* Real database passwords
* Real access tokens
* Real service-role keys
* Customer data
* Order data
* Authentication records
* Private storage objects

If authenticated Supabase CLI or MCP is already available, use it safely.

If credentials are required, request only the minimum required credentials in one message.

Potential values may include, only when needed:

```text
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
SUPABASE_DB_PASSWORD
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Never expose a privileged key in browser code.

Never place a service-role key in a variable beginning with:

```text
NEXT_PUBLIC_
```

---

# 12. HARDCODED-DATA AND BRAND AUDIT

Search the entire project for:

* ShahY
* Shah Y
* Store name
* Logos
* Favicons
* Brand colors
* Font names
* Phone numbers
* WhatsApp numbers
* Email addresses
* Physical addresses
* Social links
* Product definitions
* Product prices
* Category definitions
* Shipping prices
* Payment instructions
* Footer content
* Homepage content
* SEO metadata
* Domains
* Supabase project references
* Vercel URLs
* GitHub URLs

Classify each occurrence as:

1. Reusable framework code
2. Database-managed data
3. Dashboard-managed data
4. Environment-managed configuration
5. Brand token
6. Static visual asset
7. Test fixture
8. Development fixture
9. Seed data
10. Historical documentation
11. Incorrect production hardcoding
12. Secret or security risk

Create:

```text
docs/BRAND_REPLACEMENT_MAP.md
docs/HARDCODED_DATA_AUDIT.md
docs/STORE_IDENTITY_SYSTEM.md
```

The brand replacement map must identify:

* Exact file
* Exact field or component
* Current purpose
* Future replacement method
* Whether managed by code, database, dashboard, environment, or asset
* Required verification

---

# 13. SECRET AND SECURITY AUDIT

Scan the destination before committing.

Check for:

* `.env`
* `.env.local`
* `.env.production`
* `.env.development`
* Database passwords
* Service-role keys
* Supabase access tokens
* GitHub tokens
* Vercel tokens
* SMTP credentials
* Payment secrets
* JWT secrets
* Private keys
* Authorization headers
* Embedded credentials
* Private connection strings
* Hardcoded passwords
* Sensitive customer data
* Sensitive order data

Use reputable secret scanners if installed.

Perform manual validation of findings.

Do not print complete secrets.

Redact findings.

Create:

```text
docs/SECURITY_AND_SECRETS.md
docs/SECRET_AUDIT_REPORT.md
.env.example
```

The `.env.example` file must contain:

* Required variable names
* Safe placeholder values
* Brief descriptions
* Client-visible versus server-only classification
* Development versus production usage
* Where the value is obtained
* Whether it is required or optional

Never include real values.

Ensure `.gitignore` excludes all active secret files.

If a production secret appears to have been committed historically:

* Do not reveal it.
* Do not copy it.
* Record the category only.
* Recommend rotation.
* Do not rotate without authorization.

---

# 14. REQUIRED ROOT FILES

The root of:

```text
D:\Store-Master-Template
```

must contain:

```text
AGENTS.md
CLAUDE.md
PROMPT.md
PROJECT_CONTEXT.md
STORE_IDENTITY_TEMPLATE.md
README.md
تعليمات التشغيل.md
.env.example
.gitignore
```

Also create when useful:

```text
MASTER_TEMPLATE_MANIFEST.json
CHANGELOG.md
CONTRIBUTING.md
```

Do not create empty decorative files.

Every file must have a practical purpose.

---

# 15. `تعليمات التشغيل.md` — USER OPERATIONS MANUAL

Create exactly:

```text
D:\Store-Master-Template\تعليمات التشغيل.md
```

The exact filename must be:

```text
تعليمات التشغيل.md
```

Write it entirely in clear Arabic suitable for the user.

It must be a complete step-by-step operations guide.

It must not assume deep technical knowledge.

It must include the following sections.

## 15.1 ما هو المشروع؟

Explain:

* What the Master Template is
* What it contains
* Why it exists
* What it preserves from ShahY Store
* What an AI agent can do with it
* What remains under the user’s control

## 15.2 أسرع طريقة لإنشاء متجر جديد

Provide an exact ready-to-follow workflow:

1. Create a new empty folder.
2. Create a private GitHub repository.
3. Open the Master Template with Claude, Codex, or Gravity.
4. Give the agent the new-store command.
5. Provide store identity.
6. Authenticate GitHub.
7. Authenticate Supabase.
8. Authenticate Vercel.
9. Allow the agent to complete creation.
10. Verify the live Vercel URL.
11. Open the admin dashboard.
12. Add or edit products.

Include the exact prompts the user should copy.

## 15.3 البرومبت الجاهز لبدء متجر جديد

Include a short copy-ready prompt such as:

```text
اقرأ AGENTS.md وPROMPT.md وPROJECT_CONTEXT.md وملف تعليمات التشغيل.md بالكامل. ابدأ إنشاء متجر جديد من الـMaster Template. اسألني أولًا عن هوية المتجر في رسالة واحدة، ثم اطلب مني كل الصلاحيات الناقصة في رسالة واحدة، وبعد استلامها نفّذ المشروع كاملًا حتى النشر على Vercel واختبار النسخة الحية. لا تعتبر localhost نتيجة نهائية.
```

Create an English equivalent for agents that perform better with English instructions.

## 15.4 البيانات التي سيطلبها الـAgent

Explain the store-identity information in simple Arabic:

* Store name
* Logo
* Colors
* Fonts
* Business category
* Target audience
* Language
* Currency
* Contact details
* Social links
* Domain
* Reference websites

Separate:

* Required
* Optional
* Values that receive safe defaults

## 15.5 صلاحيات GitHub

Explain:

* Why GitHub access is required
* Recommended GitHub CLI authentication
* How the user signs in
* Repository naming
* Private versus public
* How to verify the remote
* How to confirm that no secrets were pushed

Provide exact PowerShell commands based on available tools.

## 15.6 صلاحيات Supabase

Explain:

* Why Supabase access is required
* Which values may be requested
* Where to find them
* Which values are public
* Which values are private
* Why the service-role key must never be exposed
* How to use Supabase CLI authentication where supported
* How to place values in `.env.local`
* How to verify the connection
* How to ensure the new store does not point to ShahY production

Do not include real credentials.

## 15.7 صلاحيات Vercel

Explain:

* Why Vercel is required
* How to authenticate
* How the project is connected
* How environment variables are configured
* How to deploy
* How to inspect logs
* How to verify the live URL

## 15.8 تشغيل المشروع محليًا

Provide the actual verified commands:

* Install
* Development server
* Lint
* Type check
* Tests
* Production build

Do not invent commands.

Use the package manager found in the project.

## 15.9 النشر على Vercel

Provide the full verified deployment procedure.

State clearly:

```text
نجاح localhost لا يعني اكتمال المتجر. النتيجة النهائية هي رابط Vercel الحي بعد اختباره.
```

## 15.10 استخدام لوحة التحكم

Explain:

* How the admin dashboard is accessed
* Authentication requirements
* What can be managed
* How to manage products
* How to manage categories
* How to manage images
* How to manage store content
* How to verify changes on the live store

Do not include real admin passwords.

## 15.11 أين توجد البيانات؟

Explain simply:

* Products are in the database.
* Categories are in the database.
* Orders are in the database.
* Dynamic content is managed through the dashboard/database.
* Secrets are in environment variables.
* Branding assets have documented locations.
* Production data must never be replaced with hardcoded arrays.

## 15.12 تحديث الهوية فقط

Provide a copy-ready prompt for changing only:

* Name
* Logo
* Colors
* Fonts
* Images
* Brand tone
* Metadata

The prompt must explicitly prohibit changing business functionality.

## 15.13 استكمال عمل متوقف

Provide a resume prompt requiring the agent to:

* Read current Git status
* Read latest commit
* Read active reports
* Read handoff
* Verify live production
* Continue without repeating completed work

## 15.14 فحص متجر موجود

Provide a prompt to audit:

* GitHub
* Supabase
* Vercel
* Admin dashboard
* Live store
* Security
* Data ownership

## 15.15 حل المشكلات

Include practical troubleshooting for:

* Build failure
* Missing environment variable
* Supabase connection error
* Vercel deployment failure
* Images not loading
* Admin authentication failure
* Products not appearing
* RLS error
* Git push error
* Wrong Git remote
* Accidental ShahY project reference
* Secrets detected before push

## 15.16 النسخ الاحتياطي والاسترجاع

Explain:

* When to create a backup
* How to preserve the database
* How to preserve storage
* How to preserve Git history
* How to roll back a deployment
* How to avoid destructive commands

## 15.17 قائمة فحص قبل اعتماد المتجر

Provide a user-friendly checklist covering:

* Identity
* Products
* Categories
* Admin
* Database
* Storage
* Mobile
* Desktop
* SEO
* Vercel
* Domain
* Security
* GitHub
* Live testing

## 15.18 ممنوعات مهمة

Clearly warn the user and future agents:

* Do not commit `.env`.
* Do not expose service-role keys.
* Do not treat localhost as final.
* Do not hardcode products.
* Do not connect a new store to ShahY production.
* Do not run destructive migrations without backup.
* Do not delete the admin dashboard.
* Do not rebuild the store from scratch unnecessarily.

The operations guide must be sufficiently complete that the user can operate the repository without returning to the original conversation.

---

# 16. README.MD — COMPLETE GITHUB DOCUMENTATION

Rewrite or create the root `README.md` as a polished GitHub landing page.

The README must be Arabic-first and professionally structured.

It must explain the repository fully.

Required sections:

## 16.1 Project title and summary

Include:

```text
Store Master Template
```

Explain that it is a reusable e-commerce foundation derived from the audited ShahY Store architecture.

Do not market it as an empty starter.

Explain that it contains a complete working architecture.

## 16.2 What this repository provides

Describe:

* Storefront
* Admin dashboard
* Database integration
* Supabase integration
* Authentication
* Authorization
* Storage
* Product management
* Category management
* Order handling
* Content management
* Branding system
* Vercel deployment
* Agent instructions
* Automation scripts
* Testing and validation

Only claim features verified in the code.

## 16.3 Core guarantees

Highlight:

* Admin controls dynamic data.
* Products are database-driven.
* New stores use isolated resources.
* Production is verified on Vercel.
* Secrets are never committed.
* Existing architecture is preserved.
* Future agents follow documented workflows.

## 16.4 Repository architecture

Include a clear tree showing major folders and important documentation files.

Explain the purpose of each major directory.

## 16.5 Technology stack

List actual verified technologies and versions where available.

Do not guess.

## 16.6 Quick start for users

Provide a short path for non-technical users linking to:

```text
تعليمات التشغيل.md
```

## 16.7 Quick start for AI agents

Provide an exact copy-ready command:

```text
Read AGENTS.md, PROMPT.md, PROJECT_CONTEXT.md, STORE_IDENTITY_TEMPLATE.md, README.md, and the relevant documents under docs/. Then execute the new-store workflow autonomously. Ask for store identity once and required credentials once. Do not treat localhost as completion.
```

## 16.8 Create a new store

Explain:

* Copy template
* New directory
* New GitHub repo
* New Supabase project
* New Vercel project
* Branding intake
* Database migration
* Environment setup
* Deployment
* Verification

## 16.9 Credentials and authentication

Explain required access safely without exposing values.

## 16.10 Environment variables

Link to:

```text
.env.example
docs/ENVIRONMENT_VARIABLES.md
```

## 16.11 Database and Supabase

Explain the data ownership model.

Link to relevant documentation.

## 16.12 Admin dashboard

Explain verified capabilities and link to:

```text
docs/ADMIN_DASHBOARD.md
docs/ADMIN_CAPABILITY_MATRIX.md
```

## 16.13 Branding

Explain how identity changes work and link to:

```text
STORE_IDENTITY_TEMPLATE.md
docs/BRAND_REPLACEMENT_MAP.md
docs/STORE_IDENTITY_SYSTEM.md
```

## 16.14 Development commands

Include actual commands for:

* Install
* Run
* Lint
* Type check
* Test
* Build

## 16.15 Production deployment

Explain that Vercel is the final production target.

## 16.16 Validation and Definition of Done

Explain all required acceptance gates.

## 16.17 Security

Link to secret and security documents.

## 16.18 Documentation index

Create a table containing:

* Document
* Purpose
* Intended reader
* When to use it

## 16.19 Recovered project context

Explain that the repository contains synthesized context recovered from:

* Source code
* Git history
* Existing reports
* Existing Claude artifacts
* Production behavior

Clearly state that hidden model thoughts not stored on disk cannot be recovered.

## 16.20 Troubleshooting

Provide common issues and links to the complete guide.

## 16.21 Contribution and maintenance

Explain:

* How architecture changes must be documented
* How new migrations are added
* How agent context remains current
* How reports are updated
* How secrets are protected

## 16.22 License and repository visibility

Do not invent a license.

If no license exists, state that no license was added unless the user requests one.

The README must render correctly on GitHub.

Use working relative links.

Avoid fake badges.

Avoid unverified claims.

---

# 17. AGENTS.MD

Create a concise but authoritative operational entry point.

It must instruct every coding agent to read in this order:

1. `AGENTS.md`
2. `PROMPT.md`
3. `PROJECT_CONTEXT.md`
4. `STORE_IDENTITY_TEMPLATE.md`
5. `README.md`
6. Relevant documents under `docs/`
7. `تعليمات التشغيل.md` when working with the user-facing workflow

It must include:

* Actual project commands
* Architecture constraints
* Data ownership rules
* Admin-dashboard rules
* Vercel acceptance rules
* Secret-handling rules
* New-store isolation rules
* Documentation maintenance rules
* Verification requirements
* Question-batching rules
* Evidence-based completion rules

It must prohibit:

* Rebuilding from scratch
* Hardcoding products
* Removing admin functionality
* Exposing secrets
* Connecting new stores to ShahY production
* Claiming success without live verification
* Asking questions answerable from the repository

---

# 18. CLAUDE.MD

Create `CLAUDE.md` as the Claude-compatible memory and instruction entry point.

It must:

* Reference `AGENTS.md`
* Reference `PROMPT.md`
* Reference `PROJECT_CONTEXT.md`
* Reference recovered context documents
* Explain the read order
* Explain the non-negotiable rules
* Explain how to ask for credentials
* Explain that credentials must be requested in one consolidated message
* Explain how to continue autonomously
* Explain Vercel production acceptance
* Explain that dynamic data belongs in the database
* Explain documentation update requirements
* Explain how to resume interrupted work

Do not copy the full architecture into this file.

Keep it highly actionable.

---

# 19. PROJECT_CONTEXT.MD

Create a durable project memory covering:

* Business purpose
* Technical purpose
* Current architecture
* Technology stack
* Folder map
* Routing
* Authentication
* Authorization
* Database
* Supabase
* RLS
* Storage
* Products
* Categories
* Orders
* Admin dashboard
* Storefront
* Branding
* Environment variables
* Vercel
* Testing
* Deployment
* Important conventions
* Historical decisions
* Rejected approaches
* Known issues
* Confirmed limitations
* Production behavior
* New-store rules
* Source-of-truth documents

Separate clearly:

```text
Confirmed facts
Strongly inferred facts
Historical information
Unknown information
```

Every important technical statement should include a relevant file path or evidence reference where useful.

---

# 20. PROMPT.MD — UNIVERSAL FUTURE-AGENT PROMPT

Create `PROMPT.md` as a self-contained execution prompt.

It must work when sent to:

* Claude
* Codex
* Gravity
* Cursor agents
* Other capable coding agents

It must not require access to the current conversation.

## 20.1 Mandatory startup protocol

The future agent must:

1. Read all instruction files.
2. Inspect Git status.
3. Inspect latest commits.
4. Read the most recent handoff and reports.
5. Inspect architecture.
6. Inspect environment requirements.
7. Confirm the source project and target project.
8. Determine missing identity information.
9. Determine missing credentials.
10. Ask the user only once for identity.
11. Ask the user only once for credentials.
12. Continue autonomously.

## 20.2 Identity intake

The agent must request the store identity in one concise Arabic message.

It must accept informal answers.

It must ask for:

### Required

* Store name
* Business type
* Logo or instruction to create a placeholder
* Preferred visual direction

### Optional

* Arabic name
* English name
* Colors
* Fonts
* Target audience
* Currency
* Language
* Contact details
* Social links
* Domain
* Reference websites
* Brand examples
* Product-category preferences

Optional omissions must not block progress.

Use safe defaults.

## 20.3 Credential discovery before requesting secrets

The future agent must first detect available secure authentication:

```text
gh auth status
supabase projects list
vercel whoami
```

or equivalent commands.

Do not request tokens already available through authenticated CLI sessions.

When access is missing, ask in one consolidated Arabic message.

Prefer:

* GitHub CLI login
* Supabase CLI login
* Vercel CLI login
* Secure secret entry
* Ignored `.env.local`

Do not request that the user paste secrets into committed files.

## 20.4 Credential request

Depending on the actual workflow, possible requirements include:

### GitHub

```text
GitHub authentication
Target account or organization
Repository name
Repository visibility
```

### Supabase

```text
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
SUPABASE_DB_PASSWORD
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Vercel

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Ask only for values actually required.

Never echo secret values.

## 20.5 Automatic execution

After receiving identity and access, the agent must:

1. Create a new isolated project directory.
2. Copy the Master Template safely.
3. Remove template Git metadata.
4. Initialize the new repository.
5. Create or connect the GitHub repository.
6. Create or connect a new isolated Supabase project.
7. Verify that it is not ShahY production.
8. Apply database migrations.
9. Configure authentication.
10. Configure RLS.
11. Configure storage.
12. Configure database functions and triggers.
13. Configure environment variables.
14. Apply the visual identity.
15. Replace logos and assets.
16. Update metadata.
17. Update database-managed store content.
18. Preserve the admin dashboard.
19. Preserve database-driven products.
20. Run validation.
21. Commit.
22. Push.
23. Create or connect Vercel.
24. Configure production environment variables.
25. Deploy.
26. Test the live URL.
27. Fix failures.
28. Update documentation.
29. Create a final handoff report.

## 20.6 Completion rules

The agent must not report completion until:

* Branding is applied consistently.
* ShahY identity is removed from the new store.
* The new store uses isolated resources.
* Dynamic data remains in the database.
* Admin functionality is operational.
* Build succeeds.
* Vercel deployment succeeds.
* Live URL is verified.
* Critical routes are tested.
* No secrets are committed.
* GitHub contains the final work.
* Documentation is updated.
* A handoff report is produced.

## 20.7 Prohibitions

The future agent must not:

* Rebuild the project from scratch.
* Hardcode products.
* Hardcode production categories.
* Replace the database with JSON.
* Remove dashboard features.
* Connect to ShahY production.
* Expose privileged keys.
* Commit environment files.
* Treat localhost as final.
* Skip production testing.
* Ask repetitive questions.
* Request information already in the repository.
* Change the framework without evidence.
* Change the package manager without evidence.
* Run destructive database operations without backup and authorization.
* Claim success without proof.

---

# 21. STORE_IDENTITY_TEMPLATE.MD

Create a clear identity intake form.

Use checkboxes and fillable sections.

Separate:

* Required identity
* Optional identity
* Agent-generated defaults
* Existing assets
* New assets
* Contact information
* SEO information
* Social links
* Domain
* Language
* Currency
* Shipping
* Payment
* Legal policies
* Admin details
* GitHub choice
* Supabase choice
* Vercel choice

The form must support:

* New empty store
* Store migrated from another platform
* Branding-only replacement
* Existing Supabase project
* New Supabase project
* Existing Vercel project
* New Vercel project

---

# 22. COMPLETE DOCUMENTATION SET

Create and populate, where applicable:

```text
docs/ARCHITECTURE.md
docs/PROJECT_MAP.md
docs/AI_CONTEXT_INDEX.md
docs/CLAUDE_MEMORY_RECOVERY.md
docs/CONTEXT_EVIDENCE_LEDGER.md
docs/DECISION_REGISTER.md
docs/HISTORICAL_TIMELINE.md
docs/GIT_FORENSICS_REPORT.md
docs/PRODUCTION_BEHAVIOR.md
docs/PRODUCTION_AUDIT.md
docs/DATABASE_AND_SUPABASE.md
docs/DATABASE_SCHEMA_REFERENCE.md
docs/RLS_AND_AUTHORIZATION.md
docs/STORAGE_ARCHITECTURE.md
docs/MIGRATION_PLAYBOOK.md
docs/ADMIN_DASHBOARD.md
docs/ADMIN_CAPABILITY_MATRIX.md
docs/DATA_OWNERSHIP.md
docs/BRANDING_SYSTEM.md
docs/BRAND_REPLACEMENT_MAP.md
docs/HARDCODED_DATA_AUDIT.md
docs/STORE_IDENTITY_SYSTEM.md
docs/ENVIRONMENT_VARIABLES.md
docs/DEPLOYMENT_AND_VERCEL.md
docs/PRODUCTION_ACCEPTANCE.md
docs/NEW_STORE_PLAYBOOK.md
docs/SECURITY_AND_SECRETS.md
docs/SECRET_AUDIT_REPORT.md
docs/TESTING_AND_VERIFICATION.md
docs/TROUBLESHOOTING.md
docs/KNOWN_ISSUES.md
docs/MASTER_TEMPLATE_REPORT.md
docs/FINAL_HANDOFF.md
```

Avoid unnecessary duplication.

Cross-link documents.

Every document must reflect the real project.

---

# 23. AUTOMATION SCRIPTS

Create reliable PowerShell scripts where compatible with the project.

Recommended scripts:

```text
scripts/new-store.ps1
scripts/preflight.ps1
scripts/verify-template.ps1
scripts/check-secrets.ps1
scripts/check-shahy-references.ps1
scripts/validate-environment.ps1
scripts/production-smoke-test.ps1
scripts/generate-context-report.ps1
scripts/resume-work.ps1
```

## 23.1 `scripts/new-store.ps1`

The script should:

* Accept a destination directory
* Accept a new store name
* Copy the template
* Exclude `.git`
* Exclude secrets
* Exclude build output
* Initialize Git
* Prepare `.env.local` from `.env.example`
* Detect ShahY production references
* Print safe next steps
* Never copy production credentials

## 23.2 `scripts/preflight.ps1`

The script should verify:

* Required tools
* Node/runtime version
* Package manager
* Git
* GitHub CLI
* Supabase CLI
* Vercel CLI
* Required files
* Environment placeholders
* Correct working directory

## 23.3 `scripts/verify-template.ps1`

The script should:

* Verify documentation exists
* Verify links
* Verify commands
* Run lint
* Run type checks
* Run tests
* Run build
* Check secrets
* Check ShahY references
* Verify Git remote

## 23.4 `scripts/check-shahy-references.ps1`

Detect accidental references to:

```text
pggmpvhyuxfetifzesws
shah-y-store.vercel.app
Darhous/ShahY-Store
```

Allow them only in explicitly historical documentation.

## 23.5 `scripts/production-smoke-test.ps1`

Accept a Vercel URL and test safe critical routes.

Do not modify production data.

## 23.6 `scripts/resume-work.ps1`

Produce a concise resume report containing:

* Git branch
* Git status
* Latest commits
* Pending changes
* Latest handoff
* Build status
* Known blockers
* Production URL

Only create scripts that are tested and functional.

---

# 24. TESTING AND QUALITY GATES

Detect the actual package manager.

Use the tracked lockfile.

Run every applicable existing validation:

* Dependency installation
* Formatting verification
* Lint
* Type checking
* Unit tests
* Integration tests
* Production build
* Secret scan
* ShahY-reference scan
* Environment validation
* Safe route verification
* Documentation link validation

Do not weaken validation.

Forbidden shortcuts include:

* Disabling TypeScript errors
* Using broad `any` merely to silence errors
* Deleting failing tests
* Disabling lint globally
* Replacing real code with mocks
* Ignoring production build failures
* Claiming pre-existing errors without proving them

For every failure:

1. Reproduce it.
2. Determine whether it exists in the source.
3. Record evidence.
4. Fix safely in the Master Template.
5. Retest.
6. Document unresolved limitations honestly.

Create:

```text
docs/TESTING_AND_VERIFICATION.md
docs/verification/latest-results.md
```

Include command, date, exit code, and summarized result.

Do not include secrets in command output.

---

# 25. MASTER TEMPLATE MANIFEST

Create:

```text
MASTER_TEMPLATE_MANIFEST.json
```

It should include machine-readable information such as:

* Template name
* Template version
* Source repository
* Source commit inspected
* Destination repository
* Framework
* Package manager
* Runtime version
* Required documentation
* Required scripts
* Required environment variables by name
* Validation commands
* Production platform
* Database platform
* Forbidden production references
* Last audit date
* Last validation status

Do not place secrets in the manifest.

---

# 26. CLEAN GIT REPOSITORY AND PUSH

After completing the Master Template:

1. Confirm the original `.git` was not copied.
2. Confirm no secrets are present.
3. Confirm no ShahY production credential is present.
4. Initialize a new Git repository.
5. Use `main` unless the target repository requires otherwise.
6. Set the remote to:

```text
https://github.com/Darhous/Store-Master-Template
```

7. Confirm the original ShahY remote is absent.
8. Stage files.
9. Run secret scanning against staged files.
10. Create the initial commit.
11. Push to the new repository.
12. Verify the remote commit exists.
13. Verify the GitHub README renders correctly.
14. Verify Arabic filenames and links render correctly.
15. Verify `تعليمات التشغيل.md` is accessible from the README.

Do not force-push unless absolutely necessary and safe.

Do not push to the original ShahY repository.

Suggested commit message:

```text
Initialize audited Store Master Template with autonomous agent workflow
```

Use an accurate final message.

---

# 27. MASTER TEMPLATE REPORT

Create:

```text
docs/MASTER_TEMPLATE_REPORT.md
```

Include:

* Source path
* Destination path
* Source repository
* Destination repository
* Source commit
* Number of commits indexed
* Number of commits deeply reviewed
* Branches found
* Tags found
* Stashes found
* Reflog availability
* Dangling or unreachable relevant commits
* Claude project artifacts found
* Claude artifacts synthesized
* Reports found
* Historical documents recovered
* Architecture summary
* Admin capability summary
* Database ownership summary
* Supabase summary
* Vercel summary
* Security findings
* Secret-scan result
* Hardcoded-data findings
* ShahY-reference scan
* Files created
* Scripts created
* Commands run
* Tests run
* Build result
* Git result
* Push result
* Final commit SHA
* Remaining risks
* Items not recoverable
* User actions still required

Never include secret values.

---

# 28. FINAL_HANDOFF.MD

Create:

```text
docs/FINAL_HANDOFF.md
```

This must be the latest resume point for any future agent.

It must contain:

* Current repository state
* Current branch
* Latest commit
* Validation result
* Production status
* Completed work
* Remaining work
* Known limitations
* Next recommended action
* Relevant documents
* Exact resume instructions

Update it immediately before the final commit.

---

# 29. FINAL USER RESPONSE

Your final response to the user must be in Arabic.

Do not merely say “done.”

Include:

* What was completed
* Destination path
* GitHub repository
* Final branch
* Final commit SHA
* Whether the original project was modified
* Whether ShahY production was modified
* Number of commits reviewed
* Claude-memory artifacts found
* Reports recovered
* Build result
* Test result
* Secret-scan result
* ShahY-reference scan result
* Documents created
* Automation scripts created
* Any unresolved limitation
* Exact command or prompt the user should use for the next store

Do not reveal internal chain-of-thought.

Do not expose credentials.

Provide verifiable evidence.

---

# 30. MANDATORY ACCEPTANCE CHECKLIST

Do not report completion until all applicable items are verified:

```text
[ ] Original source folder was not modified
[ ] Original GitHub repository was not modified
[ ] Original Supabase production project was not modified
[ ] Original Vercel production deployment was not modified
[ ] Destination folder contains the complete Master Template
[ ] Destination does not contain the original .git directory
[ ] All reachable commits are indexed
[ ] Relevant commits are deeply reviewed
[ ] Branches are reviewed
[ ] Tags are reviewed
[ ] Stashes are reviewed
[ ] Reflog is inspected where available
[ ] Deleted and renamed documents are investigated
[ ] Project-specific Claude storage is inspected
[ ] Project-specific Claude reports are synthesized
[ ] Unrelated Claude data is not copied
[ ] Raw private conversations are not committed
[ ] AGENTS.md exists
[ ] CLAUDE.md exists
[ ] PROMPT.md exists
[ ] PROJECT_CONTEXT.md exists
[ ] STORE_IDENTITY_TEMPLATE.md exists
[ ] README.md is complete
[ ] تعليمات التشغيل.md exists in the repository root
[ ] README links to تعليمات التشغيل.md
[ ] Architecture documentation exists
[ ] Database documentation exists
[ ] Supabase documentation exists
[ ] Admin-dashboard documentation exists
[ ] Admin capability matrix exists
[ ] Data ownership documentation exists
[ ] Branding replacement map exists
[ ] Vercel documentation exists
[ ] Production acceptance rules exist
[ ] New-store playbook exists
[ ] Troubleshooting documentation exists
[ ] Security documentation exists
[ ] .env.example is complete and contains no real secrets
[ ] .gitignore protects secret files
[ ] Products remain database-driven
[ ] Categories remain database-driven
[ ] Dynamic store data remains admin/database-managed
[ ] Admin-dashboard capabilities are preserved
[ ] Vercel is defined as the final acceptance environment
[ ] New stores are isolated from ShahY production
[ ] Automation scripts are tested
[ ] Install succeeds
[ ] Lint succeeds or verified limitations are documented
[ ] Type checking succeeds or verified limitations are documented
[ ] Tests succeed or verified limitations are documented
[ ] Production build succeeds
[ ] Secret scan is clean
[ ] ShahY production-reference scan is clean
[ ] New Git remote is correct
[ ] Original Git remote is absent from destination
[ ] Final commit is created
[ ] Final commit is pushed
[ ] README renders correctly on GitHub
[ ] Arabic operating guide opens correctly on GitHub
[ ] MASTER_TEMPLATE_REPORT.md contains evidence
[ ] FINAL_HANDOFF.md is current
```

---

# 31. START EXECUTION NOW

Begin with a read-only audit of:

```text
C:\Users\ahmed\Desktop\shahy store
```

Then inspect safely:

```text
D:\Store-Master-Template
```

Build an internal execution plan and perform it.

Do not ask the user to repeat information already provided.

Do not return with only recommendations.

Do not stop after documentation.

Do not stop after copying files.

Do not stop before validation.

Do not stop before committing and pushing unless external authentication is genuinely missing.

If authentication is missing:

1. Complete all work that does not require it.
2. Preserve the completed work.
3. Request all missing authentication in one concise Arabic message.
4. Explain the safest authentication method.
5. Continue after access is provided.

The final result must be a secure, validated, documented, pushed, production-oriented and fully AI-agent-ready Store Master Template.
docs/PRODUCTION_ACCEPTANCE.md
```

## 3.1 Admin dashboard ownership

The store owner must be able to manage all operational and dynamic store data through the admin dashboard.

The admin dashboard is the primary management interface.

The agent must inspect and verify the actual implementation, including every relevant:

* Admin page
* Dashboard component
* Server action
* API route
* Supabase query
* Database mutation
* Authentication guard
* Authorization rule
* Storage upload flow
* Database table
* Database view
* Trigger
* Function
* RLS policy
* Generated database type

The dashboard must manage every supported dynamic capability, including where applicable:

* Products
* Product variants
* Product images
* Product galleries
* Product prices
* Discounts
* Offers
* Categories
* Collections
* Inventory
* Stock status
* Orders
* Order status
* Customers
* Homepage sections
* Homepage hero
* Banners
* Promotional sections
* Navigation menus
* Footer sections
* Store contact information
* Social-media links
* WhatsApp details
* Shipping settings
* Payment settings
* Store policies
* SEO metadata
* Store settings
* Visual assets
* Other dynamic content already supported by the existing system

Do not merely state that the admin can control everything.

Verify it with source evidence.

Create a detailed capability matrix showing:

* Capability
* Admin route
* Component
* Database table
* Mutation method
* Authorization requirement
* Verification status
* Any discovered limitation

Create this file:

```text
docs/ADMIN_CAPABILITY_MATRIX.md
```

If an expected dashboard capability is missing but can be safely added by following the current architecture, add it only inside the Master Template.

Never modify ShahY Store production.

## 3.2 Production means Vercel

Localhost is a development environment only.

The authoritative final store is the live Vercel deployment.

No future agent may claim completion because the application runs on localhost.

Completion requires:

* Successful dependency installation
* Successful lint
* Successful type checking
* Successful tests
* Successful production build
* Correct production environment variables
* Successful Vercel deployment
* Successful database connectivity from production
* Successful image and storage delivery
* Successful authentication behavior
* Successful public-route smoke tests
* Successful admin-route verification
* No critical browser console errors
* No critical production network failures
* Verified live URL

The documentation must repeatedly make clear:

> The production Vercel deployment is the final acceptance environment. Localhost is never the final deliverable.

## 3.3 Database-driven store data

Products and all operational store data must come from the database and admin-managed systems.

Do not use production hardcoding for:

* Products
* Categories
* Collections
* Prices
* Inventory
* Offers
* Homepage dynamic content
* Contact information
* Social links
* Shipping configuration
* Payment configuration
* Dynamic navigation
* Dynamic footer content
* Store settings
* Order data
* Customer data

Forbidden production sources include:

* Hardcoded JavaScript arrays
* Hardcoded TypeScript arrays
* Hardcoded JSX product cards
* Static JSON catalogs acting as the production backend
* Mock objects acting as real products
* Local test fixtures used by production
* Static product files bypassing the dashboard

Fixtures and seed files are allowed only for:

* Tests
* Development
* Demonstration
* Initial database seeding

They must never become the runtime production source of truth.

Create:

```text
docs/DATA_OWNERSHIP.md
