# Environment Variables

See `.env.example` for safe placeholders.

Public:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Server-only:
- `DATABASE_URL`
- `MIGRATION_DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- Email and OAuth secrets
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Never commit `.env.local` or real values.
