<?php

use Illuminate\Support\Facades\Route;

// The compiled React SPA (backend/public/spa.html) is served for every
// non-API path so BrowserRouter deep links (/shop, /admin, ...) work on a
// full page load. /api/*, /storage/* and /up never reach this route.
Route::get('/{any?}', function () {
    return response()->file(public_path('spa.html'));
})->where('any', '^(?!api/|storage/|up$).*');
