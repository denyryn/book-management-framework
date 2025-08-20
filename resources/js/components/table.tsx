import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginatedResponse } from '@/types/pagination';
import { Pen, Trash2 } from 'lucide-react';
import React from 'react';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: PaginatedResponse<T>;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    checkedItems: (number | string)[];
    setCheckedItems: React.Dispatch<React.SetStateAction<(number | string)[]>>;
}

export function Table<T extends { id: number | string }>({ columns, data, onEdit, onDelete, checkedItems, setCheckedItems }: TableProps<T>) {
    // Toggle single row
    const handleCheck = (id: number | string) => {
        setCheckedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    // Toggle all rows on current page
    const handleCheckAll = () => {
        if (checkedItems.length === data.data.length) {
            setCheckedItems([]);
        } else {
            setCheckedItems(data.data.map((item) => item.id));
        }
    };

    return (
        <div className="relative w-full overflow-x-auto shadow-md">
            <table className="w-full border-separate border-spacing-0 rounded-xl border text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                        <th className="p-4">
                            <Checkbox checked={checkedItems.length === data.data.length} onCheckedChange={handleCheckAll} />
                        </th>
                        <th className="px-6 py-3">No</th>
                        {columns.map((col) => (
                            <th key={col.key as number | string} className="px-6 py-3">
                                {col.label}
                            </th>
                        ))}
                        {(onEdit || onDelete) && <th className="px-6 py-3">Action</th>}
                    </tr>
                </thead>

                <tbody>
                    {data.data.map((item, index) => (
                        <tr className="border-b odd:bg-accent/30" key={item.id}>
                            <td className="w-4 p-4">
                                <Checkbox checked={checkedItems.includes(item.id)} onCheckedChange={() => handleCheck(item.id)} />
                            </td>
                            <td className="px-6 py-4">{data.from! + index}</td>
                            {columns.map((col) => (
                                <td key={col.key as string} className="px-6 py-4">
                                    {col.render ? col.render(item) : String((item as T)[col.key as keyof T] ?? '')}
                                </td>
                            ))}
                            <td className="space-x-2 px-6 py-4">
                                {onEdit && (
                                    <Button variant="ghost" className="text-blue-500" onClick={() => onEdit(item)}>
                                        <Pen className="size-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button onClick={() => onDelete(item)} variant="ghost" className="text-red-500">
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <nav className="flex flex-col flex-wrap items-center justify-between pt-4 md:flex-row" aria-label="Table navigation">
                <span className="mb-4 block w-full text-sm font-normal text-gray-500 md:mb-0 md:inline md:w-auto dark:text-gray-400">
                    Showing{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {data.from}-{data.to}
                    </span>{' '}
                    of <span className="font-semibold text-gray-900 dark:text-white">{data.total}</span>
                </span>

                <ul className="inline-flex h-8 -space-x-px text-sm rtl:space-x-reverse">
                    {data.links.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`flex h-8 items-center justify-center border px-3 leading-tight ${
                                    link.active
                                        ? 'text-blue-600 hover:text-blue-700 dark:text-white'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                } ${index === 0 ? 'rounded-s-lg border-gray-300 dark:border-gray-700' : ''} ${
                                    index === data.links.length - 1
                                        ? 'rounded-e-lg border-gray-300 dark:border-gray-700'
                                        : 'border-gray-300 dark:border-gray-700'
                                }`}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
