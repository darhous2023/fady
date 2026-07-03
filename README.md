# Store Master Template

**Store Master Template** هو أساس تجارة إلكترونية كامل وقابل لإعادة الاستخدام، مبني من معمارية ShahY Store بعد تدقيقها. هذا ليس starter فارغًا؛ المستودع يحتوي على storefront، لوحة إدارة، قاعدة بيانات، مصادقة، تخزين، ونظام تشغيل موثق لوكلاء الذكاء الاصطناعي.

> بيئة القبول النهائية هي Vercel production. تشغيل localhost لا يعني اكتمال المتجر.

## ماذا يوفر هذا المستودع؟

- Storefront مبني بـ Next.js App Router.
- Admin dashboard لإدارة المنتجات، الأقسام، الطلبات، الشحن، الخصومات، البانرات، العملاء، الإعدادات، والصلاحيات.
- Supabase/Postgres عبر Drizzle ORM.
- Better Auth للمصادقة.
- Supabase Storage لرفع الصور من مسارات server-only.
- Scripts لإنشاء متجر جديد، preflight، secret scan، ShahY reference scan، وproduction smoke test.
- وثائق تشغيل عربية ووثائق تقنية إنجليزية.

## الضمانات الأساسية

- البيانات الديناميكية تدار من قاعدة البيانات ولوحة الأدمن.
- المنتجات والأقسام ليست hardcoded في الإنتاج.
- كل متجر جديد يجب أن يستخدم GitHub/Supabase/Vercel معزولة.
- لا يتم commit للأسرار.
- لا يتم اعتبار العمل منتهيًا قبل نشر Vercel واختبار الرابط الحي.

## هيكل المستودع

```text
src/app/                 Next.js routes, storefront, admin, APIs
src/components/          Store and admin components
src/lib/db/drizzle/      Drizzle connection, schema, seed/storage helpers
src/lib/auth/            Auth helpers and client actions
drizzle/migrations/      Database migrations
scripts/                 PowerShell automation and validation
docs/                    Architecture, security, deployment, database, handoff
تعليمات التشغيل.md       دليل المستخدم العربي
AGENTS.md                تعليمات الوكلاء
PROMPT.md                prompt عام لإنشاء متجر جديد
PROJECT_CONTEXT.md       ذاكرة المشروع التقنية
```

## التقنية

تم التحقق من `package.json`:

- Next.js `^16.1.1`
- React `^19.2.0`
- TypeScript `5.9.3`
- Drizzle ORM `^0.45.1`
- Better Auth `^1.3.28`
- Supabase JS `^2.49.4`
- Tailwind CSS `^3.4.18`
- npm مع `package-lock.json`

## البداية السريعة للمستخدم

ابدأ من [تعليمات التشغيل.md](تعليمات%20التشغيل.md).

## البداية السريعة لوكيل AI

```text
Read AGENTS.md, PROMPT.md, PROJECT_CONTEXT.md, STORE_IDENTITY_TEMPLATE.md, README.md, and the relevant documents under docs/. Then execute the new-store workflow autonomously. Ask for store identity once and required credentials once. Do not treat localhost as completion.
```

## إنشاء متجر جديد

1. انسخ القالب إلى مجلد جديد عبر `scripts/new-store.ps1`.
2. أنشئ GitHub repo جديدًا.
3. أنشئ Supabase project جديدًا أو اربط مشروعًا معزولًا.
4. أنشئ Vercel project جديدًا.
5. املأ `.env.local` محليًا، ولا ترفعه.
6. طبّق الهوية، migrations، storage، وsettings.
7. شغّل validation.
8. انشر على Vercel واختبر الرابط الحي.

## الأوامر

```powershell
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
powershell -ExecutionPolicy Bypass -File scripts/check-secrets.ps1
powershell -ExecutionPolicy Bypass -File scripts/check-shahy-references.ps1
```

## البيئة والأسرار

راجع `.env.example` و[docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md). لا تضع service-role keys أو database URLs في ملفات committed.

## قاعدة البيانات وSupabase

راجع [docs/DATABASE_AND_SUPABASE.md](docs/DATABASE_AND_SUPABASE.md) و[docs/DATA_OWNERSHIP.md](docs/DATA_OWNERSHIP.md).

## لوحة الأدمن

راجع [docs/ADMIN_DASHBOARD.md](docs/ADMIN_DASHBOARD.md) و[docs/ADMIN_CAPABILITY_MATRIX.md](docs/ADMIN_CAPABILITY_MATRIX.md).

## الهوية والبراند

راجع [STORE_IDENTITY_TEMPLATE.md](STORE_IDENTITY_TEMPLATE.md)، [docs/BRAND_REPLACEMENT_MAP.md](docs/BRAND_REPLACEMENT_MAP.md)، و[docs/STORE_IDENTITY_SYSTEM.md](docs/STORE_IDENTITY_SYSTEM.md).

## Production

Vercel هو هدف الإنتاج النهائي. راجع [docs/DEPLOYMENT_AND_VERCEL.md](docs/DEPLOYMENT_AND_VERCEL.md) و[docs/PRODUCTION_ACCEPTANCE.md](docs/PRODUCTION_ACCEPTANCE.md).

## فهرس الوثائق

| Document | Purpose | Reader | When |
|---|---|---|---|
| `AGENTS.md` | Agent operating rules | AI agents | Always |
| `تعليمات التشغيل.md` | Arabic user guide | Store owner | Starting or operating |
| `docs/ARCHITECTURE.md` | System architecture | Engineers | Before code changes |
| `docs/DATA_OWNERSHIP.md` | Data source ownership | Agents/engineers | Before changing data flow |
| `docs/SECURITY_AND_SECRETS.md` | Security rules | Everyone | Before credentials/commit |
| `docs/FINAL_HANDOFF.md` | Latest resume point | Future agents | Resume work |

## Recovered Context

تم تلخيص السياق من source code، Git history، تقارير موجودة، ذاكرة Claude/Codex المرتبطة بالمشروع، وسلوك الإنتاج المطلوب تدقيقه. لا يمكن استرجاع أفكار نموذج مخفية أو محادثات غير محفوظة على القرص.

## License

لم تتم إضافة رخصة جديدة. الملف الأصلي `LICENSE` محفوظ كما وجد في المصدر.
