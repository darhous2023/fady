# Admin Dashboard

Routes confirmed under `src/app/admin`:
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/create`
- `/admin/products/[id]/edit`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/reviews`
- `/admin/categories`
- `/admin/shipping`
- `/admin/discounts`
- `/admin/banners`
- `/admin/flash-deals`
- `/admin/customers`
- `/admin/admins`
- `/admin/settings`
- `/admin/guide`

Primary guard: `src/proxy.ts` and API `getSessionFromRequest` checks.
