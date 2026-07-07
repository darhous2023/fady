# Storage Architecture

Confirmed storage flows:
- Product/admin uploads: `src/app/api/admin/upload/route.ts` uploads to Supabase Storage bucket `products`.
- Account avatar uploads: `src/app/api/account/avatar/route.ts` uses server-side storage calls.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Future stores must create their own buckets and policies.
