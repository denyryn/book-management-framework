import { Table } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { Author } from '@/types/author';
import { type Book } from '@/types/book';
import { Category } from '@/types/category';
import { PaginatedResponse } from '@/types/pagination';
import { Publisher } from '@/types/publisher';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BooksPage() {
    type PageProps = {
        data: {
            books: PaginatedResponse<Book>;
            authors: Author[];
            publishers: Publisher[];
            categories: Category[];
            query: string;
        };
    };

    const { data } = usePage<PageProps>().props;

    const [checkedItems, setCheckedItems] = useState<(number | string)[]>([]);
    const [query, setQuery] = useState<string>(data.query || '');
    const debouncedQuery = useDebounce(query, 500);

    const [form, setForm] = useState<{
        title: string;
        author_id: number | '';
        publisher_id: number | '';
        category_id: number | '';
        cover_image: string;
        publication_date: string;
        number_of_pages: number | '';
        mode: 'create' | 'update' | null;
        id?: number | string;
    }>({
        title: '',
        author_id: '',
        publisher_id: '',
        category_id: '',
        cover_image: '',
        publication_date: '',
        number_of_pages: '',
        mode: null,
    });

    const [deleteState, setDeleteState] = useState<{
        type: 'single' | 'bulk' | null;
        ids: (number | string)[];
    }>({ type: null, ids: [] });

    const handleSearch = (q: string) => {
        router.get('/books', { search: q }, { preserveState: true, replace: true });
    };

    useEffect(() => {
        if (debouncedQuery !== data.query) handleSearch(debouncedQuery);
    }, [debouncedQuery, data.query, handleSearch]);

    const openCreate = () =>
        setForm({
            title: '',
            author_id: '',
            publisher_id: '',
            category_id: '',
            cover_image: '',
            publication_date: '',
            number_of_pages: '',
            mode: 'create',
        });

    const openUpdate = (book: Book) =>
        setForm({
            title: book.title,
            author_id: book.author_id,
            publisher_id: book.publisher_id,
            category_id: book.category_id,
            cover_image: book.cover_image || '',
            publication_date: book.publication_date || '',
            number_of_pages: book.number_of_pages || '',
            mode: 'update',
            id: book.id,
        });

    const closeForm = () => setForm((prev) => ({ ...prev, mode: null }));

    const confirmForm = () => {
        const payload = {
            title: form.title,
            author_id: form.author_id,
            publisher_id: form.publisher_id,
            category_id: form.category_id,
            cover_image: form.cover_image,
            publication_date: form.publication_date,
            number_of_pages: form.number_of_pages,
        };

        if (form.mode === 'create') {
            router.post('/books', payload, { onSuccess: closeForm });
        } else if (form.mode === 'update' && form.id !== undefined) {
            router.put(`/books/${form.id}`, payload, { onSuccess: closeForm });
        }
    };

    const openSingleDelete = (id: number | string) => setDeleteState({ type: 'single', ids: [id] });
    const openBulkDelete = () => {
        if (!checkedItems.length) return alert('No books selected.');
        setDeleteState({ type: 'bulk', ids: checkedItems });
    };
    const closeDelete = () => setDeleteState({ type: null, ids: [] });

    const confirmDelete = () => {
        if (deleteState.type === 'single') {
            router.delete(`/books/${deleteState.ids[0]}`);
        } else if (deleteState.type === 'bulk') {
            router.delete('/books', { data: { ids: deleteState.ids } });
            setCheckedItems([]);
        }
        closeDelete();
    };

    return (
        <>
            <Head title="Books" />
            <AppLayout>
                <div className="flex min-h-screen flex-col gap-4 p-4">
                    <div className="flex h-fit w-full flex-col items-start gap-4 rounded-xl border-1 p-4">
                        <div className="flex w-full items-center justify-between">
                            <h2 className="text-xl font-bold">Books</h2>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-2 size-5 -translate-y-1/2 transform text-gray-300" />
                                <Input
                                    className="my-4 ps-10 placeholder:text-gray-300 lg:min-w-xl"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search book"
                                />
                            </div>
                            <div className="space-x-2">
                                <Button variant="outline" className="transition-colors duration-100 hover:bg-red-500" onClick={openBulkDelete}>
                                    <Trash2 />
                                </Button>
                                <Button variant="outline" className="transition-colors duration-100 hover:bg-red-500" onClick={openCreate}>
                                    <Plus />
                                </Button>
                            </div>
                        </div>

                        <Table
                            data={data.books}
                            columns={[
                                { key: 'title', label: 'Title' },
                                {
                                    key: 'cover_image',
                                    label: 'Cover Image',
                                    render: (book) => <img src={book.cover_image!} alt={book.title} className="h-12 w-12 object-cover" />,
                                },
                                { key: 'author.name', label: 'Author', render: (book) => book.author?.name },
                                { key: 'publisher.name', label: 'Publisher', render: (book) => book.publisher?.name },
                                { key: 'category.name', label: 'Category', render: (book) => book.category?.name },
                                { key: 'publication_date', label: 'Publication Date' },
                                { key: 'number_of_pages', label: 'Pages' },
                            ]}
                            onEdit={openUpdate}
                            onDelete={(book) => openSingleDelete(book.id)}
                            checkedItems={checkedItems}
                            setCheckedItems={setCheckedItems}
                        />
                    </div>
                </div>

                {/* Form Dialog */}
                <Dialog open={form.mode !== null} onOpenChange={closeForm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{form.mode === 'create' ? 'Create Book' : 'Update Book'}</DialogTitle>
                            <DialogDescription>Fill in the details to {form.mode === 'create' ? 'create' : 'update'} the book.</DialogDescription>
                        </DialogHeader>

                        {/* Author Select */}
                        <div>
                            <label htmlFor="author_id">Author</label>
                            <Select
                                value={form.author_id.toString()}
                                onValueChange={(value) => setForm((prev) => ({ ...prev, author_id: Number(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select author" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.authors.map((author) => (
                                        <SelectItem key={author.id} value={String(author.id)}>
                                            {author.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Publisher Select */}
                        <div>
                            <label htmlFor="publisher_id">Publisher</label>
                            <Select
                                value={form.publisher_id.toString()}
                                onValueChange={(value) => setForm((prev) => ({ ...prev, publisher_id: Number(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select publisher" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.publishers.map((publisher) => (
                                        <SelectItem key={publisher.id} value={String(publisher.id)}>
                                            {publisher.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category Select */}
                        <div>
                            <label htmlFor="category_id">Category</label>
                            <Select
                                value={form.category_id.toString()}
                                onValueChange={(value) => setForm((prev) => ({ ...prev, category_id: Number(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-4 *:mb-4 *:flex *:flex-col *:space-y-1">
                            <div>
                                <label htmlFor="title">Title</label>
                                <Input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={form.title}
                                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* You could add selects for author, publisher, category here */}
                            <div>
                                <label htmlFor="cover_image">Cover Image URL</label>
                                <Input
                                    type="text"
                                    name="cover_image"
                                    value={form.cover_image}
                                    onChange={(e) => setForm((prev) => ({ ...prev, cover_image: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label htmlFor="publication_date">Publication Date</label>
                                <Input
                                    type="date"
                                    name="publication_date"
                                    value={form.publication_date}
                                    onChange={(e) => setForm((prev) => ({ ...prev, publication_date: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label htmlFor="number_of_pages">Number of Pages</label>
                                <Input
                                    type="number"
                                    name="number_of_pages"
                                    value={form.number_of_pages}
                                    onChange={(e) => setForm((prev) => ({ ...prev, number_of_pages: Number(e.target.value) }))}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={closeForm}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmForm}>
                                {form.mode === 'create' ? 'Create' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deleteState.type !== null} onOpenChange={closeDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{deleteState.type === 'single' ? 'Delete Book' : 'Delete Selected Books'}</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                {deleteState.type === 'single' ? 'this book' : `${deleteState.ids.length} selected books`}? This action cannot be
                                undone.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button variant="outline" onClick={closeDelete}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </>
    );
}
