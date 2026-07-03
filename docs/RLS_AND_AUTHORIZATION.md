# RLS and Authorization

Confirmed:
- Drizzle schema files define `pgPolicy` and `.enableRLS()` for multiple tables.
- `src/proxy.ts` protects `/admin/*` except `/admin/login` by requiring a Better Auth session.
- Admin API routes call `getSessionFromRequest` before mutations.

Important limitation:
- Several admin routes verify session presence. Role-level enforcement must be reviewed carefully before production handoff for a new store.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or `NEXT_PUBLIC_*` variables.
