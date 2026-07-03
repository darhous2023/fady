# Architecture

Confirmed stack: Next.js 16 App Router, React 19, TypeScript, Drizzle ORM, Supabase/Postgres, Better Auth, Tailwind CSS, npm, Vercel.

Runtime layers:
- Storefront: `src/app/page.tsx`, public routes under `src/app/*`, store components under `src/components/store`.
- Admin dashboard: `src/app/admin/*`, admin components under `src/components/admin`.
- API routes: `src/app/api/*`.
- Database schema: `src/lib/db/drizzle/schema/*`.
- Database connection: `src/lib/db/drizzle/connection.ts`.
- Auth: `src/utils/auth.ts`, `src/lib/auth/*`, `src/proxy.ts`.
- Storage: `src/app/api/admin/upload/route.ts`, `src/app/api/account/avatar/route.ts`.

The production Vercel deployment is the final acceptance environment. Localhost is development only.
