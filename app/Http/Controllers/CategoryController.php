<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class CategoryController extends Controller
{
    private Category $category;
    private Collection $data;

    public function __construct(Category $category, Collection $data)
    {
        $this->category = $category;
        $this->data = $data;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('search', '');

        $categories = $this->category->query()
            ->when($query, fn($q) => $q->where('name', 'like', "%{$query}%"))
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('categories', [
            'data' => [
                'categories' => $categories,
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

        $category = $this->category->create($request->only('name'));

        return redirect()->back()->with(
            'success',
            'Category created successfully.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        if (!$request->input('name')) {
            return redirect()->back()->withErrors('Name is required.');
        }

        $category->update($request->only('name'));

        return redirect()->back()->with(
            'success',
            'Category updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category)
    {
        if ($request->input('ids')) {
            $ids = $request->input('ids', []);
            $this->category->whereIn('id', $ids)->delete();

            return redirect()->back()->with(
                'success',
                'Selected categories deleted successfully.'
            );
        }

        $category->delete();

        return redirect()->back()->with(
            'success',
            'Category deleted successfully.'
        );
    }
}
