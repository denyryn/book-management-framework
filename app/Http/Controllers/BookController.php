<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Author;
use App\Models\Publisher;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the books.
     */
    public function index(Request $request)
    {
        $query = $request->input('search', '');

        // Eager-load relations
        $books = Book::with(['author', 'publisher', 'category'])
            ->when($query, fn($q) => $q->where('title', 'like', "%{$query}%"))
            ->paginate(5)
            ->withQueryString();

        // Fetch authors, publishers, and categories for Select dropdowns
        $authors = Author::all();
        $publishers = Publisher::all();
        $categories = Category::all();

        return Inertia::render('books', [
            'data' => [
                'books' => $books,
                'authors' => $authors,
                'publishers' => $publishers,
                'categories' => $categories,
                'query' => $query,
            ],
        ]);
    }

    /**
     * Store a new book.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author_id' => 'required|exists:authors,id',
            'publisher_id' => 'required|exists:publishers,id',
            'category_id' => 'required|exists:categories,id',
            'cover_image' => 'nullable|url',
            'publication_date' => 'nullable|date',
            'number_of_pages' => 'nullable|integer|min:1',
        ]);

        Book::create($request->only([
            'title',
            'author_id',
            'publisher_id',
            'category_id',
            'cover_image',
            'publication_date',
            'number_of_pages',
        ]));

        return redirect()->back()->with('success', 'Book created successfully.');
    }

    /**
     * Update an existing book.
     */
    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author_id' => 'required|exists:authors,id',
            'publisher_id' => 'required|exists:publishers,id',
            'category_id' => 'required|exists:categories,id',
            'cover_image' => 'nullable|url',
            'publication_date' => 'nullable|date',
            'number_of_pages' => 'nullable|integer|min:1',
        ]);

        $book->update($request->only([
            'title',
            'author_id',
            'publisher_id',
            'category_id',
            'cover_image',
            'publication_date',
            'number_of_pages',
        ]));

        return redirect()->back()->with('success', 'Book updated successfully.');
    }

    /**
     * Delete single or multiple books.
     */
    public function destroy(Request $request, Book $book)
    {
        if ($request->input('ids')) {
            $ids = $request->input('ids', []);
            Book::whereIn('id', $ids)->delete();

            return redirect()->back()->with('success', 'Selected books deleted successfully.');
        }

        $book->delete();

        return redirect()->back()->with('success', 'Book deleted successfully.');
    }
}
