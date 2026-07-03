# Universal Future-Agent Prompt

Read `AGENTS.md`, `PROMPT.md`, `PROJECT_CONTEXT.md`, `STORE_IDENTITY_TEMPLATE.md`, `README.md`, and the relevant documents under `docs/`. Then execute the new-store workflow autonomously.

Ask the user once in Arabic for required store identity:
- Store name
- Business type
- Logo or permission to create a placeholder
- Preferred visual direction

Optional values: Arabic/English names, colors, fonts, target audience, currency, language, contact details, social links, domain, reference websites, brand examples, and product-category preferences. Use safe defaults when optional values are missing.

Before asking for credentials, detect existing authentication:

```powershell
gh auth status
supabase projects list
vercel whoami
```

When access is missing, ask once in Arabic for only what is actually required. Prefer GitHub CLI login, Supabase CLI login, Vercel CLI login, secure secret entry, and ignored `.env.local`.

Execution requirements:
1. Create an isolated new project directory.
2. Copy the template safely.
3. Initialize a new Git repository.
4. Create or connect the target GitHub repository.
5. Create or connect an isolated Supabase project.
6. Verify it is not ShahY production.
7. Apply migrations and storage setup.
8. Configure auth, RLS, environment variables, and branding.
9. Preserve the admin dashboard and database-driven products.
10. Run install, lint, typecheck, tests where present, build, secret scan, ShahY-reference scan.
11. Commit, push, deploy to Vercel, smoke test the live URL, fix failures, and write a handoff report.

Do not report completion until Vercel production is live and verified, no secrets are committed, ShahY production references are absent outside historical docs, and `docs/FINAL_HANDOFF.md` is current.
