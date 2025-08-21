import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Author } from '@/types/author';
import { Book } from '@/types/book';
import { Category } from '@/types/category';
import { Publisher } from '@/types/publisher';
import { Head, router, usePage } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useCallback, useState } from 'react';
import BookCard from './components/book-card';
import FilterDialog from './components/filter-dialog';
import SearchBar from './components/search-bar';

type PageProps = {
    data: {
        books: Book[];
        authors: Author[];
        publishers: Publisher[];
        categories: Category[];
        query: FilterQuery;
    };
};

type FilterQuery = {
    search?: string;
    author_id?: number;
    publisher_id?: number;
    category_id?: number;
};

export default function Homepage() {
    const { data } = usePage<PageProps>().props;

    // Safely access query properties with fallbacks
    const initialQuery = data.query || {};
    const [filterQuery, setFilterQuery] = useState<FilterQuery>({
        search: initialQuery.search || '',
        author_id: initialQuery.author_id || undefined,
        publisher_id: initialQuery.publisher_id || undefined,
        category_id: initialQuery.category_id || undefined,
    });

    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    // Handle search query change
    const handleSearchQueryChange = useCallback(
        (search: string) => {
            const newFilters = { ...filterQuery, search };
            setFilterQuery(newFilters);
            router.get('/home', newFilters, { preserveState: true, replace: true });
        },
        [filterQuery],
    );

    // Handle filter changes from dialog
    const handleFilterChange = useCallback(
        (filters: FilterQuery) => {
            const newFilters = { ...filterQuery, ...filters };
            setFilterQuery(newFilters);
            router.get('/home', newFilters, { preserveState: true, replace: true });
        },
        [filterQuery],
    );

    // Check if any filters are active
    const hasActiveFilters = Object.values(filterQuery).some((value) => value !== undefined && value !== '' && value !== null);

    // Safely get initial filter values for the dialog
    const initialFilters = {
        author_id: data.query?.author_id || undefined,
        publisher_id: data.query?.publisher_id || undefined,
        category_id: data.query?.category_id || undefined,
    };

    return (
        <>
            <Head title="Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <AppLayout headerChildren={<SearchBar searchQuery={filterQuery.search || ''} setSearchQuery={handleSearchQueryChange} />}>
                <div className="flex min-h-screen flex-col gap-4 bg-background p-4">
                    {/* Recommended Section - Only show when no filters are active */}
                    {!hasActiveFilters && (
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
                    )}

                    {/* Books Section */}
                    <div className="flex h-fit w-full flex-col items-start gap-4 rounded-xl border-1 p-4">
                        <div className="flex w-full items-center justify-between">
                            <h2 className="text-xl font-bold">Books</h2>
                            <Button variant="ghost" className="border-1" onClick={() => setFilterDialogOpen(true)}>
                                <Filter className="size-4 stroke-3" />
                            </Button>
                        </div>

                        <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {data.books.length === 0 ? (
                                <p className="col-span-full text-center text-muted-foreground">No books found matching your criteria.</p>
                            ) : (
                                data.books.map((book) => <BookCard key={book.id} book={book} height="h-60" width="w-40" />)
                            )}
                        </div>
                    </div>
                </div>

                <FilterDialog
                    open={filterDialogOpen}
                    onOpenChange={setFilterDialogOpen}
                    authors={data.authors}
                    publishers={data.publishers}
                    categories={data.categories}
                    route="/home"
                    method="GET"
                    initialFilters={initialFilters}
                />
            </AppLayout>
        </>
    );
}
