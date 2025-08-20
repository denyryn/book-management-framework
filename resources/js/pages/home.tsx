import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import { Author } from '@/types/author';
import { Book } from '@/types/book';
import { Category } from '@/types/category';
import { Publisher } from '@/types/publisher';
import { Head, usePage } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

type PageProps = {
    data: {
        books: Book[];
        authors: Author[];
        publishers: Publisher[];
        categories: Category[];
        query: string;
    };
};

// Reusable Book Card
function BookCard({ book, height = 'h-72', width = 'w-48' }: { book: Book; height?: string; width?: string }) {
    return (
        <div className="space-y-1">
            <img
                className={`${height} ${width} rounded-sm object-cover`}
                src={book.cover_image || 'https://lpmneraca.com/wp-content/uploads/2023/07/phsykologi-of-money.jpg'}
                alt={book.title}
            />
            <h3 className="text-md line-clamp-1 w-40 truncate font-bold">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author?.name}</p>
        </div>
    );
}

export default function Homepage() {
    const { data } = usePage<PageProps>().props;

    const [searchQuery, setSearchQuery] = useState(data.query || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Filter books based on search and categories
    const filteredBooks = data.books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategories.length === 0 || (book.category && selectedCategories.includes(book.category.name))),
    );

    return (
        <>
            <Head title="Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <AppLayout>
                <div className="flex min-h-screen flex-col gap-4 p-4">
                    {/* Recommended Section */}
                    <div className="flex h-fit w-full flex-col items-start gap-4 rounded-xl border-1 p-4">
                        <div className="flex w-full items-center justify-between">
                            <h2 className="text-xl font-bold">Recommended</h2>
                        </div>

                        <div className="hide-scrollbar flex w-full items-center gap-8 overflow-x-scroll">
                            {data.books.slice(0, 5).map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className="flex h-fit w-full flex-col items-start gap-4 rounded-xl border-1 p-4">
                        <div className="flex w-full items-center justify-between">
                            <h2 className="text-xl font-bold">Categories</h2>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-2 size-5 -translate-y-1/2 transform text-gray-300" />
                                <input
                                    className="my-4 rounded-md border-1 p-2 ps-10 placeholder:text-gray-300 lg:max-w-xl"
                                    type="text"
                                    placeholder="Search your favorite books"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="ghost" className="border-1">
                                <Filter className="size-4 stroke-3" />
                            </Button>
                        </div>

                        <div className="hide-scrollbar flex w-full items-center space-x-3 overflow-x-scroll">
                            {data.categories.map((category) => (
                                <Toggle
                                    key={category.id}
                                    variant="outline"
                                    className="whitespace-nowrap"
                                    pressed={selectedCategories.includes(category.name)}
                                    onClick={() =>
                                        setSelectedCategories((prev) =>
                                            prev.includes(category.name) ? prev.filter((c) => c !== category.name) : [...prev, category.name],
                                        )
                                    }
                                >
                                    {category.name}
                                </Toggle>
                            ))}
                        </div>

                        <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filteredBooks.map((book) => (
                                <BookCard key={book.id} book={book} height="h-60" width="w-40" />
                            ))}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
