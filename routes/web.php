<?php

use App\Http\Controllers\GoogleAuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\StockController;

Route::get('/', function () {
    return view('welcome');
})->middleware(['verify.shopify'])->name('home');

// Storefront routes
Route::post('/api/settings/storefront', [SettingsController::class, 'getSettingsForStorefront'])->name('settings.storefront');
Route::post('/api/product/{productId}/low-stock', [StockController::class, 'getProductStock'])->name('product-low-stock');
Route::get('/api/google/user-info', [GoogleAuthController::class, 'getGoogleUserInfo'])->name('api.google.user-info');


Route::middleware(['web'])->group(function () {
    // Google OAuth routes
    Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
    Route::get('/auth/google/user', [GoogleAuthController::class, 'getGoogleUser'])->name('auth.google.user');
    Route::post('/auth/google/disconnect', [GoogleAuthController::class, 'disconnectGoogle'])->name('auth.google.disconnect');
    Route::post('/auth/google/refresh', [GoogleAuthController::class, 'refreshGoogleToken'])->name('auth.google.refresh');
});
