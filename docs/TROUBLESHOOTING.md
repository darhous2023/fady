# Troubleshooting

- Build failure: run `npm run build`, fix first source error.
- Missing env: compare `.env.local` to `.env.example`.
- Supabase connection: verify isolated project URL and pooled `DATABASE_URL`.
- Images not loading: verify bucket and public URLs.
- Admin login failure: verify Better Auth env and `/admin/login`.
- Products absent: verify active products, category IDs, and images.
- Wrong Git remote: run `git remote -v` before push.
- ShahY reference detected: replace runtime reference or move it to documented historical context.
