# Production Acceptance

Completion requires:
- `npm install` succeeds.
- Lint succeeds or documented verified limitation exists.
- Typecheck succeeds or documented verified limitation exists.
- Tests succeed or documented verified limitation exists.
- `npm run build` succeeds.
- Secret scan is clean.
- ShahY production-reference scan is clean.
- Vercel deployment succeeds.
- Live URL is smoke tested.
- Admin login route is reachable.
- Database connectivity works from production.

The production Vercel deployment is the final acceptance environment. Localhost is never the final deliverable.
