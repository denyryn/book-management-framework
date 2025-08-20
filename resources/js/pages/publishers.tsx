import { Table } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse } from '@/types/pagination';
import { type Publisher } from '@/types/publisher';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/use-debounce';

export default function PublishersPage() {
    type PageProps = {
        data: {
            publishers: PaginatedResponse<Publisher>;
            query: string;
        };
    };

    const { data } = usePage<PageProps>().props;

    // State
    const [checkedItems, setCheckedItems] = useState<(number | string)[]>([]);
    const [query, setQuery] = useState<string>(data.query || '');
    const debouncedQuery = useDebounce(query, 500);

    const [form, setForm] = useState<{
        name: string;
        mode: 'create' | 'update' | null;
        id?: number | string;
    }>({ name: '', mode: null });

    const [deleteState, setDeleteState] = useState<{
        type: 'single' | 'bulk' | null;
        ids: (number | string)[];
    }>({ type: null, ids: [] });

    // Search handler
    const handleSearch = (q: string) => {
        router.get('/publishers', { search: debouncedQuery }, { preserveState: true, replace: true });
    };

    useEffect(() => {
        if (debouncedQuery === data.query) return;
        handleSearch(debouncedQuery);
    }, [debouncedQuery]);

    // Create / Update
    const openCreate = () => setForm({ name: '', mode: 'create' });
    const openUpdate = (publisher: Publisher) => setForm({ name: publisher.name, mode: 'update', id: publisher.id });
    const closeForm = () => setForm({ name: '', mode: null });

    const confirmForm = () => {
        switch (form.mode) {
            case 'create':
                router.post('/publishers', { name: form.name }, { onSuccess: closeForm });
                break;
            case 'update':
                if (form.id === undefined) return;
                router.put(`/publishers/${form.id}`, { name: form.name }, { onSuccess: closeForm });
                break;
        }
    };

    // Delete
    const openSingleDelete = (id: number | string) => setDeleteState({ type: 'single', ids: [id] });
    const openBulkDelete = () => {
        if (!checkedItems.length) return alert('No publishers selected.');
        setDeleteState({ type: 'bulk', ids: checkedItems });
    };
    const closeDelete = () => setDeleteState({ type: null, ids: [] });

    const confirmDelete = () => {
        if (deleteState.type === 'single') {
            router.delete(`/publishers/${deleteState.ids[0]}`);
        } else if (deleteState.type === 'bulk') {
            router.delete('/publishers', { data: { ids: deleteState.ids } });
            setCheckedItems([]);
        }
        closeDelete();
    };

    return (
        <>
            <Head title="Publishers" />
            <AppLayout>
                <div className="flex min-h-screen flex-col gap-4 p-4">
                    <div className="flex h-fit w-full flex-col items-start gap-4 rounded-xl border-1 p-4">
                        {/* Header */}
                        <div className="flex w-full items-center justify-between">
                            <h2 className="text-xl font-bold">Publishers</h2>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-2 size-5 -translate-y-1/2 transform text-gray-300" />
                                <Input
                                    className="my-4 ps-10 placeholder:text-gray-300 lg:min-w-xl"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search publisher"
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

                        {/* Table */}
                        <Table
                            data={data.publishers}
                            columns={[
                                { key: 'name', label: 'Name' },
                                { key: 'slug', label: 'Slug' },
                                { key: 'created_at', label: 'Created At' },
                                { key: 'updated_at', label: 'Updated At' },
                            ]}
                            onEdit={openUpdate}
                            onDelete={(publisher) => openSingleDelete(publisher.id)}
                            checkedItems={checkedItems}
                            setCheckedItems={setCheckedItems}
                        />
                    </div>
                </div>

                {/* Form Dialog (Create/Update) */}
                <Dialog open={form.mode !== null} onOpenChange={closeForm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{form.mode === 'create' ? 'Create Publisher' : 'Update Publisher'}</DialogTitle>
                            <DialogDescription>
                                Fill in the details to {form.mode === 'create' ? 'create' : 'update'} the publisher.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-4 *:mb-4 *:flex *:flex-col *:space-y-1">
                            <div>
                                <label htmlFor="name">Name</label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
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

                {/* Delete Dialog (Single/Bulk) */}
                <Dialog open={deleteState.type !== null} onOpenChange={closeDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{deleteState.type === 'single' ? 'Delete Publisher' : 'Delete Selected Publishers'}</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete{' '}
                                {deleteState.type === 'single' ? 'this publisher' : `${deleteState.ids.length} selected publishers`}? This action
                                cannot be undone.
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
