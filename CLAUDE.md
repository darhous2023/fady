# Claude Entry Point

Start with `AGENTS.md`, then read `PROMPT.md`, `PROJECT_CONTEXT.md`, `STORE_IDENTITY_TEMPLATE.md`, `README.md`, and relevant `docs/` files.

Claude must work autonomously after reading the repository. Ask the user in Arabic for store identity once, then detect existing CLI authentication with `gh auth status`, `supabase projects list`, and `vercel whoami` or equivalents before requesting credentials.

Never request secrets in committed files. Prefer CLI login and ignored `.env.local`. If secrets are needed, ask once in a consolidated Arabic message and never echo values back.

Dynamic store data belongs in Supabase/Postgres and admin-managed tables. The admin dashboard is the owner interface for operational changes. Vercel production is the final acceptance target; localhost is only development.

To resume interrupted work, inspect Git status, latest commits, `docs/FINAL_HANDOFF.md`, `docs/verification/latest-results.md`, and current blockers before continuing.
