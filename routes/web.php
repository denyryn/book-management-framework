<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    AuthorController,
    PublisherController,
    CategoryController,
    BookController,
    HomeController
};

Route::get('/', function () {
    return redirect()->route('home');
})->name('landing');

Route::get('/home', [HomeController::class, 'index'])->name('home');

Route::resource('books', BookController::class)->except(['show', 'edit', 'create']);

Route::resource('categories', CategoryController::class)->except(['show', 'edit', 'create']);

Route::resource('authors', AuthorController::class)->except(['show', 'edit', 'create']);

Route::resource('publishers', PublisherController::class)->except(['show', 'edit', 'create']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
