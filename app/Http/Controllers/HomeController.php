<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Category;
use App\Models\Publisher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('query', '');
        $books = Book::with('author', 'publisher', 'category')
            ->when($query, fn($q) => $q->where('title', 'like', "%{$query}%"))
            ->get();

        $authors = Author::all();
        $categories = Category::all();
        $publishers = Publisher::all();

        return Inertia::render('home', [
            'data' => compact('books', 'authors', 'categories', 'publishers', 'query'),
        ]);
    }
}
