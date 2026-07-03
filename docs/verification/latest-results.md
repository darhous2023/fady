# Latest Verification Results

Date: 2026-06-29

| Command | Exit Code | Result |
|---|---:|---|
| `npm install` | 0 | Succeeded after rerun. Reported 49 dependency vulnerabilities and one cleanup warning. |
| `powershell -File scripts/check-shahy-references.ps1` | 0 | Succeeded on final run. 63 allowed historical/script references, 0 blocked. |
| `powershell -File scripts/check-secrets.ps1` | 0 | Succeeded. No active secret patterns detected. |
| `npm run typecheck` | 0 | Succeeded on final run after changing `drizzle-orm` to `^0.44.7`, because `0.45.1` package install lacked expected `.d.ts` files. |
| `npm run build` | 0 | Succeeded. Warnings: Better Auth default secret in local env, stale Browserslist data, metadata `themeColor` warnings. |
| `npm run lint` | timed out/nonzero | Failed with 90 errors and 9 warnings, mostly pre-existing React/Next lint rules in guide/storefront components. Not disabled. |
| `scripts/production-smoke-test.ps1 -Url https://shah-y-store.vercel.app` | 1 | Failed due PowerShell receive/TLS error. Separate web fetch confirmed homepage content. |

Tests: no `test` script exists in `package.json`.
