# Admin Capability Matrix

| Capability | Admin Route | Component/API | Database Table | Mutation Method | Authorization | Status | Limitation |
|---|---|---|---|---|---|---|---|
| Products | `/admin/products` | `src/app/api/admin/products` | `products` | GET/POST/PATCH/DELETE via routes | Session required | Confirmed | Role-depth review needed |
| Variants | Product edit | `products/[id]/variants` | `product_variants` | POST/PATCH/DELETE | Session required | Confirmed |  |
| Images | Product edit | `products/[id]/images`, upload API | `product_images`, storage | POST/DELETE/upload | Session required | Confirmed | Bucket must exist |
| Categories | `/admin/categories` | `api/admin/categories` | `categories` | CRUD routes | Session required | Confirmed |  |
| Orders | `/admin/orders` | `api/admin/orders` | `orders`, `order_items` | Status/details/export | Session required | Confirmed | No real order testing here |
| Shipping | `/admin/shipping` | `api/admin/shipping` | `shipping` | CRUD routes | Session required | Confirmed |  |
| Discounts | `/admin/discounts` | `api/admin/discounts` | `discounts` | CRUD routes | Session required | Confirmed |  |
| Banners | `/admin/banners` | `api/admin/banners`, upload | `banners`, storage | CRUD/upload | Session required | Confirmed |  |
| Flash deals | `/admin/flash-deals` | settings + product flags | `settings`, `products` | POST settings/product update | Session required | Confirmed |  |
| Customers | `/admin/customers` | `api/admin/customers` | `customers` | GET/admin view | Session required | Confirmed | Mutation scope limited |
| Settings | `/admin/settings` | `api/admin/settings` | `settings` | GET/POST upsert | Session required | Confirmed | Some storefront fallbacks still exist |
| Admins/Roles | `/admin/admins` | `api/admin/admins`, users role API | `admins`, auth users | CRUD/role updates | Session required | Confirmed | Confirm role policy per deployment |
