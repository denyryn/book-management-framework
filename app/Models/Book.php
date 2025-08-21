<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'publisher_id',
        'author_id',
        'category_id',
        'title',
        'slug',
        'cover_image',
        'publication_date',
        'number_of_pages',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($record) {
            $record->title = \Str::title($record->title);
            $record->slug = \Str::slug($record->title);
        });
    }

    public function scopeWithFilters($query, array $filters)
    {
        return $query->when($filters['search'] ?? null, function ($q) use ($filters) {
            $q->where(function ($query) use ($filters) {
                $query->where('title', 'like', "%{$filters['search']}%")
                    ->orWhereHas('author', function ($q) use ($filters) {
                        $q->where('name', 'like', "%{$filters['search']}%");
                    })
                    ->orWhereHas('publisher', function ($q) use ($filters) {
                        $q->where('name', 'like', "%{$filters['search']}%");
                    })
                    ->orWhereHas('category', function ($q) use ($filters) {
                        $q->where('name', 'like', "%{$filters['search']}%");
                    });
            });
        })
            ->when($filters['author_id'] ?? null, fn($q) => $q->where('author_id', $filters['author_id']))
            ->when($filters['publisher_id'] ?? null, fn($q) => $q->where('publisher_id', $filters['publisher_id']))
            ->when($filters['category_id'] ?? null, fn($q) => $q->where('category_id', $filters['category_id']));
    }

    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
    }

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
