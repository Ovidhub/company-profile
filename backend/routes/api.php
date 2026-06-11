<?php

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
