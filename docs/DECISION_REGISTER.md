# Decision Register

| Decision | Reason | Evidence | Current Status | Alternatives Rejected | Impact |
|---|---|---|---|---|---|
| Preserve Next.js/Supabase/Drizzle/Better Auth/Vercel stack | Current source implements it | `package.json`, `src/lib/db`, `src/utils/auth.ts` | Active | Rebuild/change stack | Future stores inherit proven architecture |
| Treat Vercel as final acceptance | User specification requires it | `MASTER_EXECUTION_SPEC.md` | Active | Localhost-only delivery | Agents must deploy and smoke test |
| Keep dynamic products in DB/admin | Source uses DB queries | `src/app/page.tsx`, admin product APIs | Active | Static JSON/products | Protects owner control |
| Summarize raw Claude transcripts only | Privacy/security boundary | `docs/CLAUDE_MEMORY_RECOVERY.md` | Active | Commit raw transcripts | Avoids leaking private data |
