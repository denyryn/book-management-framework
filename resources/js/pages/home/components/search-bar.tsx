import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
    return (
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
    );
}
