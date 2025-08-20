<?php

namespace App\Http\Controllers;

use App\Models\Publisher;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class PublisherController extends Controller
{
    private Publisher $publisher;
    private Collection $data;

    public function __construct(Publisher $publisher, Collection $data)
    {
        $this->publisher = $publisher;
        $this->data = $data;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('search', '');

        $publishers = $this->publisher->query()
            ->when($query, fn($q) => $q->where('name', 'like', "%{$query}%"))
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('publishers', [
            'data' => [
                'publishers' => $publishers,
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

        $publisher = $this->publisher->create($request->only('name'));

        return redirect()->back()->with(
            'success',
            'Publisher created successfully.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Publisher $publisher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publisher $publisher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Publisher $publisher)
    {
        if (!$request->input('name')) {
            return redirect()->back()->withErrors('Name is required.');
        }

        $publisher->update($request->only('name'));

        return redirect()->back()->with(
            'success',
            'Publisher updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Publisher $publisher)
    {
        if ($request->input('ids')) {
            $ids = $request->input('ids', []);
            $this->publisher->whereIn('id', $ids)->delete();

            return redirect()->back()->with(
                'success',
                'Selected publishers deleted successfully.'
            );
        }

        $publisher->delete();

        return redirect()->back()->with(
            'success',
            'Publisher deleted successfully.'
        );
    }
}
