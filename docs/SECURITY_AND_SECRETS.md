# Security and Secrets

Rules:
- Never commit `.env`, `.env.local`, `.env.production`, or real credentials.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or `NEXT_PUBLIC_*`.
- Prefer CLI auth over pasted tokens.
- Redact secrets in reports.
- Rotate any secret suspected to have been committed historically.

Checks:
- `scripts/check-secrets.ps1`
- `scripts/check-shahy-references.ps1`
