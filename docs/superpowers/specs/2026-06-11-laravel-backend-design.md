# Laravel Backend for De-Ebrightmarn Site — Design

**Date:** 2026-06-11
**Status:** Approved by user

## Goal

Replace the frontend's localStorage-based "backend" (auth sessions, orders, messages, catalog content) with a real Laravel API, fixing the security limitations a client-only app cannot solve: forgeable admin sessions, client-computed order prices, and gateway secret keys shipped to the browser.

## Decisions (confirmed with user)

- **Database:** SQLite (dev default; production can switch to MySQL via `.env`)
- **Location:** `backend/` subfolder of this repo
- **Payments:** Demo orders only — payment method is recorded, no real gateway charge. Gateway config stored server-side for later integration.
- **Approach:** API-only Laravel backend; React app keeps its UI and swaps context internals to API calls.

## Stack

Laravel 12, PHP 8.3, SQLite, Laravel Sanctum (bearer token auth), Pest for tests.

## Database schema

| Table | Key columns |
|---|---|
| `users` | name, email (unique), password (bcrypt), role (`admin`\|`editor`) |
| `categories` | slug (unique), label, icon (lucide name), description, sort_order, active |
| `products` | name, category_id FK (nullable, null = uncategorized), price (decimal), original_price, image, description, features (JSON), in_stock, rating, reviews, badge |
| `hero_slides` | title, subtitle, image, tag, icon_name, sort_order |
| `testimonials` | name, role, text, rating (1–5) |
| `orders` | order_number (unique, `DEE-XXXXXXXX`), customer name/email/phone/address/city/state/zip/country, subtotal, shipping, tax, total, status enum, payment_method label, shipping_method |
| `order_items` | order_id FK, product_id FK (nullable — products may be deleted later), name snapshot, price snapshot, quantity, image snapshot |
| `messages` | name, email, phone (nullable), subject, message, read (bool) |
| `payment_methods` | name, type enum, enabled, is_default, description, icon, bank fields, public_key, secret_key (**encrypted cast**), cod_instructions, custom_instructions, sort_order |
| `site_images` | key (unique, e.g. `heroAgriculture`), url |

Order items snapshot name/price/image at purchase time so deleting a product later doesn't corrupt order history.

## API surface

All routes under `/api`. Public reads, two public writes, everything else behind `auth:sanctum`.

### Public

- `GET /api/content` — single bundle: hero slides, testimonials, site images, categories, products, sanitized payment methods (no secret_key, no public_key for disabled methods). One round-trip for first paint.
- `POST /api/orders` — body: customer fields, `items: [{product_id, quantity}]`, `shipping_method`, `payment_method_id`. **Server recomputes subtotal/shipping/tax/total from DB prices** (tax 8%, shipping: std $25 free over $500 / exp $50 / pck $0). Returns the created order incl. order_number. Card numbers are never sent or accepted.
- `POST /api/messages` — contact form. Rate-limited (`throttle:10,1`).

### Auth

- `POST /api/auth/login` — email + password, throttled (5/min). Returns Sanctum token + user.
- `POST /api/auth/logout`, `GET /api/auth/me` (auth required).

### Admin (auth:sanctum)

- CRUD: `products`, `categories`, `hero-slides`, `testimonials`, `payment-methods` (admin sees full record incl. masked secret indicator; secret only writable, never returned in plaintext).
- `orders`: list, show, `PATCH status`, delete. `messages`: list, `PATCH read`, delete.
- `site-images`: list, `PUT /{key}`.
- `POST /api/admin/uploads` — multipart image upload; server-side MIME validation (png/jpg/webp/gif, 5 MB); stored in `storage/app/public/uploads`, returns public URL.
- **Role rule:** `editor` can create/update content but cannot delete anything, cannot manage payment methods, cannot delete orders. Enforced via policy/middleware.

## Frontend changes

- New `src/lib/api.ts` — small fetch wrapper: base `/api`, JSON, attaches `Authorization: Bearer <token>` from localStorage, throws typed errors.
- `AuthContext` — login/logout/me hit the API; token + user cached in localStorage but **the server is the authority** (me() validates on load).
- `AdminDataContext` — loads `/api/content` on mount (plus admin-only data after login); mutation functions call the API and update local state optimistically/refetch. Public interface (function names/shapes) stays the same so components are untouched except where types shift (numeric ids).
- `CartContext` — unchanged (cart is legitimately client-side) except checkout submits product IDs + quantities only.
- Vite dev proxy: `/api` → `http://localhost:8000` in [vite.config.ts](../../vite.config.ts).
- Image upload component posts to `/api/admin/uploads` instead of producing base64 data URLs.

## Security model

- Bcrypt passwords, Sanctum tokens (8 h expiry), login throttling server-side.
- All input through FormRequest validation.
- Order totals computed server-side — client prices are display-only.
- `secret_key` encrypted at rest (Eloquent `encrypted` cast), excluded from all public serialization.
- Upload endpoint validates real MIME (not extension), rejects SVG.
- Editor/admin authorization on every admin route.

## Seeding

`DatabaseSeeder` ports the current demo data: 2 users (admin/editor with existing demo passwords), 7 categories, all products from `src/data/products.ts`, 7 hero slides, 5 testimonials, 5 payment methods, image registry, 3 demo orders, 3 demo messages. First run looks identical to the localStorage version.

## Testing

Pest feature tests: login success/failure/throttle; order creation with server-computed totals (incl. tampered-price attempt); public endpoints exclude secrets; editor forbidden from deletes; upload rejects non-images. Run via `php artisan test`.

## Out of scope

Real payment gateway charging, email sending, customer accounts, deployment config.
