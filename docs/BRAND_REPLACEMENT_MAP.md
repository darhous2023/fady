# Brand Replacement Map

| Area | Current Evidence | Future Replacement Method | Owner |
|---|---|---|---|
| Metadata | `src/app/layout.tsx`, `src/app/page.tsx` | Template identity update | Source/config |
| Store config | `src/app/api/store-config/route.ts` | DB settings | Admin/database |
| Manifest | `public/manifest.json` | Replace during identity setup | Static asset |
| Store header/footer | `src/components/store/*` | Use settings or template tokens | Source/database |
| Admin guide/handover | `src/app/admin/guide/*` | Regenerate for store | Documentation/source |
| AI prompt | `public/ai-image-prompt.md` | Store-specific generated prompt | Static doc |
