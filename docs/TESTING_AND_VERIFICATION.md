# Testing and Verification

Commands to run:

```powershell
npm install
npm run lint
npm run typecheck
npm run build
powershell -ExecutionPolicy Bypass -File scripts/check-secrets.ps1
powershell -ExecutionPolicy Bypass -File scripts/check-shahy-references.ps1
```

Latest results are recorded in `docs/verification/latest-results.md`.
