# New Store Playbook

1. Read `AGENTS.md`, `PROMPT.md`, `PROJECT_CONTEXT.md`, and `STORE_IDENTITY_TEMPLATE.md`.
2. Collect identity once.
3. Detect CLI authentication.
4. Copy the template with `scripts/new-store.ps1`.
5. Create isolated GitHub, Supabase, and Vercel resources.
6. Fill `.env.local` locally and Vercel env vars remotely.
7. Run migrations and storage setup.
8. Apply branding and database settings.
9. Run validation.
10. Commit, push, deploy, smoke test, and write handoff.
