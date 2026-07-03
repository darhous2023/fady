# Data Ownership

| Data Domain | Authoritative Owner | Evidence |
|---|---|---|
| Products | Database + admin dashboard | `products` schema, `src/app/page.tsx`, admin product APIs |
| Product variants | Database + admin dashboard | `product_variants`, ProductForm variants manager |
| Product images | Database + Supabase Storage + admin dashboard | `product_images`, upload API |
| Categories | Database + admin dashboard | `categories` schema/API |
| Orders | Database + admin dashboard | `orders`, `order_items`, order APIs |
| Customers | Database + admin dashboard/account routes | `customers` schema |
| Shipping | Database + admin dashboard | `shipping` routes |
| Discounts | Database + admin dashboard | `discounts` routes |
| Homepage banners | Database + admin dashboard/storage | `banners`, home page query |
| Flash deals | Database settings + product flags | `settings`, `products.is_featured` |
| Store settings/contact/social | Database settings + environment fallback | `settings`, `/api/store-config` |
| Secrets | Environment variables | `.env.example`, `.gitignore` |
| Branding assets | Static public assets or generated replacements | `public/*`, docs brand map |
| Deployment | Vercel project env/config | docs deployment |

Forbidden production source: hardcoded product/category/order arrays or static JSON catalogs.
