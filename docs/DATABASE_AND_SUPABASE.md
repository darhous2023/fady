# Database and Supabase

Database access:
- Drizzle connection: `src/lib/db/drizzle/connection.ts`
- `DATABASE_URL` is required server-side.
- Migrations: `drizzle/migrations`.
- Schema modules: `src/lib/db/drizzle/schema/*`.

Main tables confirmed from schema files:
- `products`, `product_variants`, `product_images`
- `categories`
- `orders`, `order_items`
- `customers`
- `settings`
- `reviews`
- `shipping`
- `discounts`
- `banners`
- `admins`
- `cart`, `wishlist`

Supabase:
- Public URL/anon key are used by Supabase clients.
- Service-role key is used only in server routes/helpers for storage upload.
- New stores must use isolated Supabase projects and must not reference `pggmpvhyuxfetifzesws`.
