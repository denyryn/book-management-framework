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
        $filters = [
            'search' => $request->input('search', ''),
            'author_id' => $request->input('author_id', ''),
            'publisher_id' => $request->input('publisher_id', ''),
            'category_id' => $request->input('category_id', ''),
            'start_date' => $request->input('start_date', ''),
            'end_date' => $request->input('end_date', ''),
        ];

        $books = Book::with('author', 'publisher', 'category')
            ->withFilters($filters)
            ->orderBy('title')
            ->get();

        $authors = Author::orderBy('name')->get();
        $categories = Category::orderBy('name')->get();
        $publishers = Publisher::orderBy('name')->get();

        $data = [
            'books' => $books,
            'authors' => $authors,
            'categories' => $categories,
            'publishers' => $publishers,
            'query' => $filters,
        ];

        return Inertia::render('home/index', compact('data'));
    }
}