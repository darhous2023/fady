# 🛍️ ShahY Store — خطة المشروع الكاملة

> **الحالة:** ✅ **معتمدة** — بدأنا بالمرحلة 3 (التصميم).
> آخر تحديث: 2026-06-27.

متجر إلكتروني مصري **راقي جداً** لبيع المنتجات المستوردة (هاي-كوبي / ميرو / أورجنال):
شنط، بوكات/ساك (محافظ)، شوزات حريمي، + قسم منوّعات واحد.

---

## 1) المعمارية (Architecture)

ثلاث طبقات تشتغل مع بعض:

```
┌─────────────────────────────────────────────────────────────┐
│  العميل (Customer)                                          │
│        │                                                    │
│        ▼                                                    │
│  🎨 FRAMER  ──────  واجهة المتجر (Storefront)              │
│   - الصفحة الرئيسية، الأقسام، صفحة المنتج، السلة            │
│   - التصميم من Google Stitch → ينفّذ على Framer            │
│   - يعرض المنتجات من Framer CMS (متزامنة مع Supabase)      │
│        │  (الطلب)                                           │
│        ▼                                                    │
│  📱 واتساب / COD  ──  الطلب يتسجّل في Supabase + رسالة واتساب │
│                                                             │
│  ▲ مزامنة المنتجات          ▲ كتابة الطلبات                 │
│  │                          │                              │
│  ▼                          ▼                              │
│  ▲ VERCEL (Next.js)  ──  لوحة الأدمن + API                  │
│   - لوحة تحكم خارقة (CRUD، أرشفة، داشبورد مبيعات)          │
│   - API endpoints (الطلبات، المزامنة مع Framer)            │
│        │                                                    │
│        ▼                                                    │
│  🗄️ SUPABASE  ──  قاعدة البيانات + التخزين + الصلاحيات     │
│   - Postgres (كل المنتجات والطلبات)                        │
│   - Storage (صور المنتجات والبانرات)                       │
│   - Auth + RLS (حماية)                                     │
└─────────────────────────────────────────────────────────────┘
```

**ليه التقسيم ده؟**
- **Framer** أقوى حاجة لواجهة فاشن راقية + سهل التعديل بصرياً + تصميم من Stitch.
- **Vercel/Next.js** أنسب للوحة أدمن فيها جداول ورسوم بيانية ومنطق (مش شغل Framer).
- **Supabase** مصدر الحقيقة الوحيد للبيانات — التعامل معاه **عبر API** (REST/JS client).

---

## 2) سير العمل (Workflow) — مهم

1. **التصميم:** نعمل الشاشات على **Google Stitch** → نراجع ونعدّل → نعتمد.
2. **التنفيذ:** أنفّذ التصميم المعتمد على **Framer** (واجهة المتجر).
3. **البيانات:** المنتجات تتدار من **لوحة الأدمن** → تتخزّن في **Supabase** → تتزامن مع **Framer CMS**.
4. **المعاينة:** نشوف التعديلات **لايف** (Framer publish / Vercel deploy) — **مش على localhost**.
5. **النشر:** كل push على GitHub → Vercel يعمل deploy تلقائي.

---

## 3) المكدّس التقني (Tech Stack)

| الطبقة | التقنية |
|---|---|
| واجهة المتجر | Framer (External Agent — يتحكم فيه Claude) |
| التصميم | Google Stitch → Framer |
| لوحة الأدمن + API | Next.js 16 (App Router) + React 19 + Tailwind + shadcn |
| ORM / DB access | Drizzle ORM + Supabase JS Client (عبر API) |
| قاعدة البيانات | Supabase Postgres (eu-west-1) |
| التخزين | Supabase Storage |
| المصادقة | Better Auth + Supabase Auth |
| الاستضافة | Vercel (الأدمن/API) + Framer (المتجر) |
| الريبو | github.com/Darhous/ShahY-Store |
| الدفع | واتساب (`+201030002331`) + الدفع عند الاستلام (COD) |
| اللغة | عربي RTL بالكامل |

---

## 4) قاعدة البيانات (Database Schema)

> كل الجداول في Supabase، مع تفعيل **RLS**. الأدمن فقط يكتب؛ العام يقرأ المنتجات المنشورة بس.

### `categories` — الأقسام
| العمود | النوع | ملاحظات |
|---|---|---|
| id | uuid (PK) | |
| name_ar | text | اسم القسم |
| slug | text | فريد |
| sort_order | int | ترتيب العرض |
| is_active | bool | |

القيم المبدئية: شنط، بوكات (ساك)، شوزات حريمي، منوّعات.

### `products` — المنتجات
| العمود | النوع | ملاحظات |
|---|---|---|
| id | uuid (PK) | |
| name_ar | text | اسم المنتج |
| slug | text | فريد |
| description_ar | text | الوصف |
| category_id | uuid (FK) | |
| **quality_tier** | enum | `hi_copy` / `mirror` / `original` |
| price | numeric | السعر الحالي |
| compare_at_price | numeric | السعر قبل الخصم (اختياري) |
| is_featured | bool | منتج مميز بالرئيسية |
| status | enum | `active` / `draft` / `archived` |
| created_at / updated_at | timestamp | |

### `product_variants` — المقاسات/الألوان
| العمود | النوع | ملاحظات |
|---|---|---|
| id | uuid (PK) | |
| product_id | uuid (FK) | |
| color_ar | text | اللون |
| size | text | المقاس (للشوز) |
| sku | text | |
| stock | int | المخزون المتاح |
| price_override | numeric | سعر مختلف للـ variant (اختياري) |

### `product_images` — صور متعددة
| id | uuid | product_id (FK) | variant_id (FK, اختياري) | url (Supabase Storage) | alt_ar | sort_order |

### `orders` — الطلبات
| id | uuid | order_number | customer_id (FK, اختياري) | customer_name | phone | governorate | address | subtotal | shipping_cost | total | method (`whatsapp`/`cod`) | status (`pending`/`confirmed`/`shipped`/`delivered`/`cancelled`) | discount_code | notes | created_at |

### `order_items` — أصناف الطلب
| id | order_id (FK) | product_id | variant_id | product_name | quality_tier | qty | unit_price |

### `customers` — العملاء (مسجّلين + ضيوف)
| id | uuid | auth_user_id (اختياري) | name | phone | email | created_at |

### `admins` + `roles` — المستخدمون والصلاحيات
| admins: id | auth_user_id | name | role (`owner`/`manager`/`staff`) | is_active |
- `owner` كل الصلاحيات | `manager` منتجات+طلبات | `staff` طلبات بس.

### `discount_codes` — أكواد الخصم
| id | code | type (`percent`/`fixed`) | value | min_order | max_uses | used_count | expires_at | is_active |

### `shipping_zones` — الشحن حسب المحافظة
| id | governorate_ar | cost | is_active |
**القيم المبدئية (يعدّلها الأدمن):**
- بورسعيد = **0** (مجاني)
- القاهرة / الإسكندرية / محافظات بحري (الدلتا) = **50 ج**
- محافظات الصعيد = **100 ج**

### `reviews` — التقييمات
| id | product_id | customer_name | rating (1-5) | comment_ar | is_approved | created_at |

### `banners` — بانرات الرئيسية
| id | image_url | title_ar | link | sort_order | is_active |

### `settings` — إعدادات عامة
| key | value | — زي رقم الواتساب (`+201030002331`)، نصوص، روابط سوشيال (الأدمن يعدّلها). |

---

## 5) لوحة الأدمن الخارقة (`/admin` على Vercel)

- **🔐 دخول آمن** بصلاحيات (owner / manager / staff).
- **📊 داشبورد المبيعات:** إجمالي المبيعات، عدد الطلبات، الأكثر مبيعاً، رسم بياني للإيرادات (يومي/شهري)، طلبات قيد التنفيذ، تنبيه نفاد المخزون.
- **📦 المنتجات:** إضافة / تعديل / حذف / **أرشفة** + رفع صور متعددة + إدارة المقاسات والألوان والمخزون ودرجة الجودة والأسعار والخصم + تمييز (featured).
- **🧾 الطلبات:** عرض، تغيير الحالة، طباعة، فتح واتساب العميل مباشرة.
- **🏷️ الأقسام / أكواد الخصم / الشحن (حسب المحافظة) / البانرات / التقييمات (موافقة/حذف).**
- **👥 المستخدمون:** إضافة أدمن وتحديد دوره.
- **⚙️ الإعدادات:** رقم الواتساب، روابط السوشيال، نصوص.

---

## 6) واجهة المتجر (Framer)

- **الرئيسية:** بانر/سلايدر، الأقسام، منتجات مميزة، عروض، سوشيال.
- **الأقسام:** شبكة منتجات + فلترة (القسم، درجة الجودة، السعر، اللون، المقاس) + بحث + ترتيب.
- **صفحة المنتج:** معرض صور، اختيار اللون/المقاس، السعر قبل/بعد الخصم، badge الجودة، التقييمات، زر إضافة للسلة + زر طلب واتساب.
- **السلة + الـ Checkout:** اختيار المحافظة → حساب الشحن تلقائياً → إما **رسالة واتساب جاهزة** أو **طلب COD** يتسجّل في Supabase.
- **حساب العميل:** طلباتي + المفضلة (wishlist)، مع إمكانية الطلب كـ **ضيف**.
- **عربي RTL** + خط عربي راقي (Tajawal / IBM Plex Sans Arabic).

---

## 7) منطق الطلب والشحن

1. العميل يملأ السلة ويختار المحافظة.
2. النظام يحسب: `الإجمالي = مجموع المنتجات + شحن المحافظة - الخصم (لو فيه كود)`.
3. خياران:
   - **واتساب:** رسالة جاهزة فيها تفاصيل الطلب تتبعت لـ `+201030002331`، والطلب يتسجّل `pending`.
   - **COD:** الطلب يتسجّل في Supabase مباشرة بحالة `pending`، والأدمن يأكّده.
4. الأدمن يتابع ويغيّر الحالة من اللوحة.

---

## 8) محطات التنفيذ (Execution Milestones)

### ✅ المرحلة 0 — التأسيس (تمّت)
- [x] قالب أساس متنسخ ومرفوع على `Darhous/ShahY-Store`.
- [x] `.env.local` بكل مفاتيح Supabase + الواتساب (مستبعد من Git).
- [x] Framer External Agent متصل ومُصرّح.
- [x] الاعتماديات متثبتة، اتصال Pooler متأكد.

### 🟦 المرحلة 1 — قاعدة البيانات + الربط (Backend foundation)
- [ ] بناء كل جداول الـ schema بـ Drizzle + تفعيل RLS.
- [ ] إنشاء bucket في Supabase Storage للصور.
- [ ] seed الأقسام + مناطق الشحن + الإعدادات (رقم الواتساب).
- [ ] تنظيف القالب: إزالة Stripe والـ storefront الزائد (Framer هيغطّيه)، إبقاء الأدمن + API.

### 🟦 المرحلة 2 — لوحة الأدمن (Admin)
- [ ] دخول + صلاحيات.
- [ ] CRUD المنتجات + الأرشفة + رفع الصور + المقاسات/الألوان/المخزون.
- [ ] إدارة الأقسام.

### 🟦 المرحلة 3 — التصميم (Stitch → Framer)
- [ ] توليد الشاشات على Google Stitch (ببرومبت أجهّزه) → مراجعة واعتماد.
- [ ] تنفيذ الواجهة على Framer (RTL، الخطوط، الهوية).

### 🟦 المرحلة 4 — المتجر + المزامنة
- [ ] مزامنة منتجات Supabase → Framer CMS.
- [ ] صفحات المتجر (رئيسية، أقسام، منتج، فلترة، بحث).
- [ ] السلة + checkout (واتساب / COD) + حساب الشحن.

### 🟦 المرحلة 5 — الطلبات + الداشبورد
- [ ] API استقبال الطلبات وتسجيلها في Supabase.
- [ ] داشبورد المبيعات والإحصائيات.

### 🟦 المرحلة 6 — الإضافات
- [ ] أكواد الخصم + التقييمات + البانرات + الصلاحيات المتعددة.

### 🟦 المرحلة 7 — النشر والمعاينة اللايف
- [ ] ربط الريبو بـ Vercel + متغيرات البيئة + auto-deploy.
- [ ] Framer publish (staging → production) + ربط الدومين.
- [ ] مراجعة لايف نهائية.

---

## 9) البيئة والأسرار (Environment)

كل الأسرار في `.env.local` محلياً (مستبعد من Git) — ونفس القيم تتحط في **Vercel Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable)
- `SUPABASE_SERVICE_ROLE_KEY` (secret), `SUPABASE_JWKS_URL`
- `DATABASE_URL` (Transaction Pooler 6543) + `MIGRATION_DATABASE_URL` (Session Pooler 5432)
- `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER`

> ⚠️ القيم الفعلية مش مكتوبة هنا (الملف ده على الريبو) — موجودة في `.env.local` بس.

---

## 10) المخاطر والملاحظات

- **المنتجات الريبليكا + الدفع:** اخترنا واتساب + COD لتجنّب حظر بوابات الدفع العالمية. (سليم).
- **الدومين:** واجهة Framer تُنشر على Framer (أو دومين مخصص)؛ الأدمن على Vercel (مثلاً `admin.shahystore.com`). نحسم ربط الدومين في المرحلة 7.
- **الرخصة:** القالب الأساس عليه ملف LICENSE — هنراجعه للاستخدام التجاري.
- **المزامنة Supabase ↔ Framer CMS:** تتم عبر API endpoint على Vercel (push عند أي تعديل منتج).

---

## 11) القرارات المعتمدة ✅

1. **المعمارية:** Framer (متجر) + Vercel/Next.js (أدمن + API) + Supabase عبر API. ✅
2. **الدومين:** نبدأ بروابط مجانية (`shahystore.framer.website` للمتجر + `*.vercel.app` للأدمن)، ونشتري دومين لاحقاً ونربطه. ✅
3. **نبدأ بـ:** التصميم أولاً (Google Stitch → اعتماد → تنفيذ على Framer) — المرحلة 3. ✅

---

*المرجع ده حي — بنحدّثه مع كل مرحلة.*
