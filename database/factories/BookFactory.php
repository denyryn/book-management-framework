<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'publisher_id' => \App\Models\Publisher::factory(),
            'author_id' => \App\Models\Author::factory(),
            'category_id' => \App\Models\Category::factory(),
            'title' => $this->faker->sentence(),
            'slug' => $this->faker->slug(),
            'cover_image' => $this->faker->imageUrl(),
            'publication_date' => $this->faker->date(),
            'number_of_pages' => $this->faker->numberBetween(100, 1000),
        ];
    }
}
