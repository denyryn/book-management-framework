<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class AuthorController extends Controller
{
    private Author $author;
    private Collection $data;
    public function __construct(Author $author, Collection $data)
    {
        $this->author = $author;
        $this->data = $data;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('search', '');

        $authors = $this->author->query()
            ->when($query, fn($q) => $q->where('name', 'like', "%{$query}%"))
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('authors', [
            'data' => [
                'authors' => $authors,
                'query' => $query,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $author = $this->author->create($request->only('name'));

        return redirect()->back()->with(
            'success',
            'Author created successfully.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Author $author)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Author $author)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Author $author)
    {
        if (!$request->input('name')) {
            return redirect()->back()->withErrors('Name is required.');
        }

        $author->update($request->only('name'));

        return redirect()->back()->with(
            'success',
            'Author updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Author $author)
    {
        if ($request->input('ids')) {
            $ids = $request->input('ids', []);
            $this->author->whereIn('id', $ids)->delete();

            return redirect()->back()->with(
                'success',
                'Selected authors deleted successfully.'
            );
        }

        $author->delete();

        return redirect()->back()->with(
            'success',
            'Author deleted successfully.'
        );
    }
}
