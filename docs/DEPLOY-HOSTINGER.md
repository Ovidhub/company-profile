# Deploying to Hostinger (de-ebrightmarn.com)

Single-domain layout: Laravel serves the API under `/api/*` and the compiled
React SPA (`backend/public/spa.html`) for every other path.

## Layout on the server

```
~/domains/de-ebrightmarn.com/
  app/            <- git clone of this repo (private files, NOT web-accessible)
  public_html/    <- contents of app/backend/public (web root)
```

`public_html/index.php` is edited to reference `../app/backend/` paths.

## One-time setup (over SSH)

```bash
cd ~/domains/de-ebrightmarn.com
git clone https://github.com/Ovidhub/company-profile.git app
cd app/backend
composer install --no-dev --optimize-autoloader   # composer is preinstalled on Hostinger
cp .env.production.example .env                   # then fill in DB credentials
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link
php artisan config:cache && php artisan route:cache

# web root
cd ~/domains/de-ebrightmarn.com
rm -rf public_html && cp -r app/backend/public public_html
# then edit public_html/index.php: change ../vendor and ../bootstrap to
# ../app/backend/vendor and ../app/backend/bootstrap
# and recreate the storage symlink:
ln -sfn ../app/backend/storage/app/public public_html/storage
```

## Updating after a new commit

```bash
cd ~/domains/de-ebrightmarn.com/app
git pull
cd backend && composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache && php artisan route:cache
cp public/spa.html ~/domains/de-ebrightmarn.com/public_html/spa.html
```

## Production checklist

- [ ] `APP_DEBUG=false`, `APP_ENV=production`, `APP_URL=https://de-ebrightmarn.com`
- [ ] MySQL credentials from hPanel in `.env`
- [ ] **Change the seeded admin/editor passwords** (`php artisan tinker`)
- [ ] SSL enabled in hPanel (auto Let's Encrypt)
- [ ] PHP version set to 8.2+ in hPanel
