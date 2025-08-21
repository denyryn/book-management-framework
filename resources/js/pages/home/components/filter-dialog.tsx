import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Author } from '@/types/author';
import { Category } from '@/types/category';
import { Publisher } from '@/types/publisher';
import { useState } from 'react';

type FilterDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    authors: Author[];
    publishers: Publisher[];
    categories: Category[];
    initialFilters?: {
        author_id?: number;
        publisher_id?: number;
        category_id?: number;
    };
    route: string;
    method?: 'GET' | 'POST';
};

export default function FilterDialog({
    open,
    onOpenChange,
    authors,
    publishers,
    categories,
    initialFilters = {},
    route,
    method = 'GET',
}: FilterDialogProps) {
    const [filters, setFilters] = useState({
        author_id: initialFilters.author_id,
        publisher_id: initialFilters.publisher_id,
        category_id: initialFilters.category_id,
    });

    const handleClear = () => {
        setFilters({ author_id: undefined, publisher_id: undefined, category_id: undefined });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter Books</DialogTitle>
                    <DialogDescription>Filter books by author, publisher, category, or title.</DialogDescription>
                </DialogHeader>

                <form action={route} method={method}>
                    {/* Author Filter */}
                    <div className="mb-4">
                        <label htmlFor="author_id">Author</label>
                        <Select
                            value={filters.author_id?.toString() || 'all'}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, author_id: value === 'all' ? undefined : Number(value) }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select author" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Authors</SelectItem>
                                {authors.map((author) => (
                                    <SelectItem key={author.id} value={String(author.id)}>
                                        {author.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="author_id" value={filters.author_id ?? ''} />
                    </div>

                    {/* Publisher Filter */}
                    <div className="mb-4">
                        <label htmlFor="publisher_id">Publisher</label>
                        <Select
                            value={filters.publisher_id?.toString() || 'all'}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, publisher_id: value === 'all' ? undefined : Number(value) }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select publisher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Publishers</SelectItem>
                                {publishers.map((publisher) => (
                                    <SelectItem key={publisher.id} value={String(publisher.id)}>
                                        {publisher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="publisher_id" value={filters.publisher_id ?? ''} />
                    </div>

                    {/* Category Filter */}
                    <div className="mb-4">
                        <label htmlFor="category_id">Category</label>
                        <Select
                            value={filters.category_id?.toString() || 'all'}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, category_id: value === 'all' ? undefined : Number(value) }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="category_id" value={filters.category_id ?? ''} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button type="submit" variant="default" className="bg-accent-foreground text-accent">
                            Apply Filters
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
