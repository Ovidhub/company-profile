# Laravel Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React app's localStorage backend with a Laravel 12 REST API (SQLite + Sanctum) in `backend/`, with server-side order pricing, encrypted gateway secrets, and role-based admin auth.

**Architecture:** API-only Laravel app under `backend/`; React contexts keep their public interfaces but call the API via a small fetch client. Vite dev server proxies `/api` to `http://localhost:8000`. IDs are serialized as strings (categories by slug, orders by order_number) so existing frontend components don't change.

**Tech Stack:** Laravel 12, PHP 8.3, SQLite, Sanctum bearer tokens, Pest, React 19 + Vite 7.

**Spec:** `docs/superpowers/specs/2026-06-11-laravel-backend-design.md`

---

### Task 1: Scaffold Laravel app

**Files:** Create `backend/` (generated), modify `backend/.env`, `backend/bootstrap/app.php`, `.gitignore`.

- [ ] **Step 1:** `laravel new backend --pest --database=sqlite --no-interaction` (run from repo root). Fallback if installer flags unsupported: `composer create-project laravel/laravel backend` (then `composer require pestphp/pest pestphp/pest-plugin-laravel --dev -W` and `php artisan pest:install` inside `backend/`).
- [ ] **Step 2:** In `backend/`: `php artisan install:api --no-interaction` (publishes Sanctum, creates `routes/api.php`, registers it in `bootstrap/app.php`).
- [ ] **Step 3:** `.env`: confirm `DB_CONNECTION=sqlite`, set `SANCTUM_TOKEN_EXPIRATION` not needed — instead set `'expiration' => 480` in `config/sanctum.php` (8 h).
- [ ] **Step 4:** `php artisan migrate` then `php artisan test` — expect default tests pass.
- [ ] **Step 5:** Commit `feat(backend): scaffold Laravel 12 API app`.

### Task 2: Migrations and models

**Files:** Create migrations + models for: Category, Product, HeroSlide, Testimonial, Order, OrderItem, Message, PaymentMethod, SiteImage. Modify `users` migration (add `role`).

- [ ] **Step 1:** Add `role` enum to users: new migration `add_role_to_users_table` → `$table->string('role')->default('editor');`
- [ ] **Step 2:** One migration per table per spec schema. Key points:
  - `categories`: `slug` unique, `label`, `icon`, `description` nullable, `sort_order` int default 0, `active` bool default true.
  - `products`: `name`, `category_id` FK nullOnDelete, `price` decimal(10,2), `original_price` nullable, `image` text, `description` text, `features` json, `in_stock` bool, `rating` decimal(2,1) default 0, `reviews` int default 0, `badge` nullable.
  - `hero_slides`: `title`, `subtitle` text, `image` text, `tag`, `icon_name`, `sort_order`.
  - `testimonials`: `name`, `role`, `text` text, `rating` tinyint.
  - `orders`: `order_number` unique; customer_* (name,email,phone,address,city,state,zip,country); `subtotal`,`shipping`,`tax`,`total` decimal(10,2); `status` string default 'pending'; `payment_method`; `shipping_method`.
  - `order_items`: `order_id` FK cascade, `product_id` FK nullOnDelete nullable, `name`, `price` decimal(10,2), `quantity` int, `image` text.
  - `messages`: `name`,`email`,`phone` nullable,`subject`,`message` text,`read` bool default false.
  - `payment_methods`: `name`,`type`,`enabled` bool,`is_default` bool,`description` nullable,`icon` nullable, bank fields nullable (`bank_name`,`account_name`,`account_number`,`routing_number`,`swift_code`,`bank_address`), `public_key` nullable, `secret_key` text nullable, `cod_instructions` nullable, `custom_instructions` nullable, `sort_order`.
  - `site_images`: `key` unique, `url` text.
- [ ] **Step 3:** Models with `$fillable`, casts: `features => array`, `secret_key => encrypted`, booleans. `Category::getRouteKeyName() = 'slug'`; `Order::getRouteKeyName() = 'order_number'`. `Order hasMany OrderItem`; `Product belongsTo Category`.
- [ ] **Step 4:** `php artisan migrate:fresh` — expect success. Commit `feat(backend): schema and models`.

### Task 3: Seeders (port demo data)

**Files:** Create `backend/database/seeders/*Seeder.php`, modify `DatabaseSeeder.php`.

- [ ] **Step 1:** Port data verbatim from frontend sources: users (admin@de-ebrightmarn.com/admin123 role admin, editor@.../editor123 role editor, `Hash::make`), categories + products from `src/data/products.ts`, hero slides + testimonials + demo orders + demo messages from `src/context/AdminDataContext.tsx` defaults, payment methods from `src/data/paymentMethods.ts`, image registry from `src/data/images.ts`.
- [ ] **Step 2:** `php artisan migrate:fresh --seed` — expect success; `php artisan tinker --execute="echo Product::count();"` matches frontend product count.
- [ ] **Step 3:** Commit `feat(backend): seed demo data`.

### Task 4: Auth API

**Files:** Create `app/Http/Controllers/AuthController.php`, modify `routes/api.php`. Test `tests/Feature/AuthTest.php`.

- [ ] **Step 1:** Failing tests: login with valid creds returns token+user (role included); invalid creds → 422; 6th rapid attempt → 429; `GET /api/auth/me` with token returns user, without → 401; logout revokes token.
- [ ] **Step 2:** Implement:

```php
public function login(Request $request) {
    $data = $request->validate(['email' => 'required|email', 'password' => 'required']);
    $user = User::where('email', $data['email'])->first();
    if (!$user || !Hash::check($data['password'], $user->password)) {
        throw ValidationException::withMessages(['email' => ['Invalid email or password.']]);
    }
    $user->tokens()->delete();
    $token = $user->createToken('admin')->plainTextToken;
    return ['token' => $token, 'user' => $user->only('name', 'email', 'role')];
}
```

Routes: `Route::post('auth/login', ...)->middleware('throttle:5,1');` `auth/me`, `auth/logout` behind `auth:sanctum`.
- [ ] **Step 3:** Tests green. Commit `feat(backend): sanctum auth with throttled login`.

### Task 5: Public content + messages endpoints

**Files:** Create `ContentController.php`, `MessageController.php` (store), API Resources (`ProductResource`, `CategoryResource`, `PaymentMethodPublicResource`, …). Test `tests/Feature/PublicContentTest.php`.

- [ ] **Step 1:** Failing tests: `GET /api/content` returns hero_slides/testimonials/site_images/categories/products/payment_methods; payment_methods JSON contains **no** `secret_key` anywhere; disabled methods excluded; product `id` is a string; category `id` equals slug. `POST /api/messages` stores and is throttled (`throttle:10,1`); invalid email → 422.
- [ ] **Step 2:** Implement. Serialization rules: product → `{id:(string), name, category: slug|'other', categoryLabel, price:(float), originalPrice, image, description, features, inStock, rating, reviews, badge}` (camelCase to match frontend types); category → `{id: slug, label, icon, description, order, active}`; payment method public → omit `secret_key`, `public_key`; site_images → `{key: url}` map.
- [ ] **Step 3:** Tests green. Commit `feat(backend): public content and contact endpoints`.

### Task 6: Orders endpoint (server-side pricing)

**Files:** Create `OrderController.php` (store), `app/Services/OrderPricer.php`, FormRequest `StoreOrderRequest`. Test `tests/Feature/OrderTest.php`.

- [ ] **Step 1:** Failing tests: posting customer + `items:[{product_id, quantity}]` + `shipping_method:'std'|'exp'|'pck'` + `payment_method_id` creates order with totals computed from **DB** prices (assert exact subtotal/shipping/tax/total incl. free-shipping-over-500 rule, tax 8%); a request body containing a forged `price`/`total` field is ignored; quantity > 99 or unknown product → 422; out-of-stock product → 422; response includes `order_number` starting `DEE-`.
- [ ] **Step 2:** Implement pricing exactly as frontend constants:

```php
// OrderPricer: std => 25 free over 500, exp => 50, pck => 0; tax = 8% of subtotal
$subtotal = $items->sum(fn($i) => $i['product']->price * $i['quantity']);
$shipping = match ($method) { 'exp' => 50, 'pck' => 0, default => $subtotal > 500 ? 0 : 25 };
$tax = round($subtotal * 0.08, 2);
```

Order number: `'DEE-' . strtoupper(Str::random(8))` with uniqueness retry. Items snapshot product name/price/image. Payment label: PaymentMethod name (card details never accepted by API).
- [ ] **Step 3:** Tests green. Commit `feat(backend): order creation with server-side pricing`.

### Task 7: Admin CRUD + role authorization

**Files:** Create `app/Http/Middleware/EnsureRole.php`, controllers `Admin/{ProductController, CategoryController, HeroSlideController, TestimonialController, PaymentMethodController, OrderAdminController, MessageAdminController, SiteImageController}`. Tests `tests/Feature/AdminCrudTest.php`, `tests/Feature/AuthorizationTest.php`.

- [ ] **Step 1:** Failing tests: unauthenticated admin routes → 401; editor `DELETE /api/admin/products/{id}` → 403; editor `GET|POST /api/admin/payment-methods` → 403; admin can CRUD each resource; `PATCH /api/admin/orders/{order_number}` updates status (invalid status → 422); admin payment-method response masks `secret_key` (returns `has_secret_key: bool`, never plaintext); `PUT /api/admin/site-images/{key}` upserts.
- [ ] **Step 2:** Register middleware alias `role` in `bootstrap/app.php`; group: `Route::prefix('admin')->middleware('auth:sanctum')` with deletes + payment-methods additionally `->middleware('role:admin')`. FormRequest validation per resource mirroring frontend fields.
- [ ] **Step 3:** Tests green. Commit `feat(backend): admin CRUD with role-based authorization`.

### Task 8: Upload endpoint

**Files:** Create `Admin/UploadController.php`. Test `tests/Feature/UploadTest.php`.

- [ ] **Step 1:** Failing tests: authenticated multipart `image` upload (png/jpg/webp/gif ≤ 5 MB) returns `{url}`; SVG → 422; 6 MB file → 422; unauthenticated → 401. Use `Storage::fake('public')` + `UploadedFile::fake()->image(...)`.
- [ ] **Step 2:** `$request->validate(['image' => 'required|file|mimes:png,jpg,jpeg,webp,gif|max:5120'])`; store to `public/uploads`; return `['url' => Storage::url($path)]` (absolute via `asset()`). Run `php artisan storage:link`.
- [ ] **Step 3:** Tests green. Commit `feat(backend): validated image uploads`.

### Task 9: Frontend API client + Vite proxy

**Files:** Create `src/lib/api.ts`. Modify `vite.config.ts`.

- [ ] **Step 1:** `vite.config.ts` → `server: { proxy: { '/api': 'http://localhost:8000', '/storage': 'http://localhost:8000' } }`.
- [ ] **Step 2:** `api.ts`: `apiFetch(path, {method, body, auth})` — JSON headers, bearer token from `localStorage.getItem('admin_token')`, parses JSON, throws `ApiError {status, message, errors}` on non-2xx; helpers `api.get/post/patch/put/delete`; `setToken/clearToken`.
- [ ] **Step 3:** `npx tsc --noEmit` clean. Commit `feat(frontend): api client and dev proxy`.

### Task 10: Rewire AuthContext

**Files:** Modify `src/context/AuthContext.tsx`, `src/components/admin/AdminLogin.tsx` (only if messages change).

- [ ] **Step 1:** `login()` → `POST /api/auth/login`, stores token via `setToken`, sets user; maps 429 → lockout message, 422 → invalid creds. On mount: if token exists, `GET /api/auth/me` to validate (clears token on 401). `logout()` → `POST /api/auth/logout` then `clearToken()`. Remove client-side hashes/throttle (server owns these now). Keep `LoginResult` shape so AdminLogin is unchanged.
- [ ] **Step 2:** `npx tsc --noEmit` clean. Commit `feat(frontend): API-backed auth`.

### Task 11: Rewire AdminDataContext

**Files:** Modify `src/context/AdminDataContext.tsx`, `src/components/CheckoutPage.tsx`, `src/components/OrderConfirmationPage.tsx`, `src/hooks/useImageUpload.tsx`.

- [ ] **Step 1:** Context loads `GET /api/content` on mount → products/categories (map `icon` name → Lucide component via existing icon registry in `src/data/icons.ts` / `AVAILABLE_ICONS`)/heroSlides/testimonials/images/publicPaymentMethods. When `isAuthenticated`, additionally load `/api/admin/orders`, `/api/admin/messages`, `/api/admin/payment-methods`.
- [ ] **Step 2:** Each mutation calls the API and updates state from the response (same function names/signatures; remove localStorage persistence). `addOrder` becomes `placeOrder(payload): Promise<Order>` calling `POST /api/orders` (customer + `{product_id, quantity}` items + shipping_method + payment_method_id), stores result as `lastOrder` state.
- [ ] **Step 3:** CheckoutPage submits via `placeOrder`, navigates with returned `order_number`; card fields remain UI-only (never sent). OrderConfirmationPage reads `lastOrder` (fallback: admin `orders` list). ImageUploader posts file to `/api/admin/uploads` and calls `onChange(url)` instead of producing base64.
- [ ] **Step 4:** `npx tsc --noEmit` clean; `npm run build` succeeds. Commit `feat(frontend): API-backed admin data and checkout`.

### Task 12: End-to-end verification

- [ ] **Step 1:** `php artisan test` — all green.
- [ ] **Step 2:** Run `php artisan serve` + `npm run dev` (background). Verify with curl/Playwright: home page renders seeded content; place an order via checkout → appears in `GET /api/admin/orders`; contact form → message stored; admin login works; tampered localStorage grants nothing.
- [ ] **Step 3:** Update README/CLAUDE notes with run instructions. Final commit.

## Self-review notes

- Spec coverage: all spec sections map to Tasks 1–12. ✔
- Frontend `Order`/`Product` types keep string ids via serialization (Task 5/6). ✔
- Pricing constants identical to `CartContext`/`CheckoutPage` (25/50/0, free > 500, 8%). ✔
