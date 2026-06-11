<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\HeroSlideController;
use App\Http\Controllers\Admin\MessageAdminController;
use App\Http\Controllers\Admin\OrderAdminController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SiteImageController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// === Public ===
Route::get('content', [ContentController::class, 'index']);
Route::post('messages', [MessageController::class, 'store'])->middleware('throttle:10,1');
Route::post('orders', [OrderController::class, 'store'])->middleware('throttle:10,1');

// === Auth ===
Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
});

// === Admin (admins and editors) ===
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{product}', [ProductController::class, 'update']);

    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::post('categories/reorder', [CategoryController::class, 'reorder']);

    Route::post('hero-slides', [HeroSlideController::class, 'store']);
    Route::put('hero-slides/{heroSlide}', [HeroSlideController::class, 'update']);

    Route::post('testimonials', [TestimonialController::class, 'store']);
    Route::put('testimonials/{testimonial}', [TestimonialController::class, 'update']);

    Route::get('orders', [OrderAdminController::class, 'index']);
    Route::patch('orders/{order}', [OrderAdminController::class, 'update']);

    Route::get('messages', [MessageAdminController::class, 'index']);
    Route::patch('messages/{message}', [MessageAdminController::class, 'update']);

    Route::put('site-images/{key}', [SiteImageController::class, 'update']);
    Route::post('uploads', [UploadController::class, 'store']);

    // === Admin role only: destructive operations and payment configuration ===
    Route::middleware('role:admin')->group(function () {
        Route::delete('products/{product}', [ProductController::class, 'destroy']);
        Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
        Route::delete('hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy']);
        Route::delete('testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
        Route::delete('orders/{order}', [OrderAdminController::class, 'destroy']);
        Route::delete('messages/{message}', [MessageAdminController::class, 'destroy']);

        Route::get('payment-methods', [PaymentMethodController::class, 'index']);
        Route::post('payment-methods', [PaymentMethodController::class, 'store']);
        Route::put('payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update']);
        Route::delete('payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy']);
    });
});
