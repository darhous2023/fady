# Migration Playbook

1. Create or select an isolated Supabase project.
2. Populate `.env.local` with server-only database URL and Supabase variables.
3. Verify the project is not ShahY production.
4. Run:

```powershell
npm run db:generate
npm run db:migrate
```

5. Configure storage buckets.
6. Seed only safe demo/initial data when appropriate.
7. Never run destructive migrations without backup and user approval.
