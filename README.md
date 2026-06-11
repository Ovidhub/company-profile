# De-Ebrightmarn — React SPA + Laravel API

Multi-sector company site with shop, checkout, and admin panel. React 19 + Vite frontend (repo root) backed by a Laravel 13 REST API (`backend/`).

## Running locally

Two terminals:

```bash
# 1. API (http://localhost:8000)
cd backend
php artisan migrate:fresh --seed   # first run only
php artisan serve

# 2. Frontend (http://localhost:5173, proxies /api to :8000)
npm install                        # first run only
npm run dev
```

## Admin panel

Visit `/admin/login`. Seeded demo accounts:

| Account | Email | Password | Can |
|---|---|---|---|
| Admin | admin@de-ebrightmarn.com | admin123 | Everything incl. deletes and payment config |
| Editor | editor@de-ebrightmarn.com | editor123 | Create/update content only |

**Change these passwords before any real deployment** (`php artisan tinker`, update the `users` table).

## Architecture notes

- **Server-side pricing:** checkout sends only product IDs and quantities; the API computes subtotal/shipping/tax/total from database prices. Client-side prices are display-only.
- **Secrets:** payment gateway secret keys are encrypted at rest and never serialized to any API response (admins see a `hasSecretKey` flag; the key is write-only).
- **Auth:** Laravel Sanctum bearer tokens, 8-hour expiry, throttled login (5/min). Roles: `admin`, `editor` (enforced server-side via middleware).
- **Uploads:** `POST /api/admin/uploads` validates real MIME content (PNG/JPG/WebP/GIF ≤ 5 MB, SVG rejected) and stores to `backend/storage/app/public/uploads`.
- **Database:** SQLite by default (`backend/database/database.sqlite`); switch to MySQL via `backend/.env` for production.

## Tests

```bash
cd backend && php artisan test    # 41 feature tests
npx tsc --noEmit && npm run build # frontend type-check + build
```

## Docs

- Design spec: `docs/superpowers/specs/2026-06-11-laravel-backend-design.md`
- Implementation plan: `docs/superpowers/plans/2026-06-11-laravel-backend.md`
