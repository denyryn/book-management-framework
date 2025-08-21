const BLANK_BOOK = 'blank_book_default.jpg';
import { useImage } from '@/hooks/use-image';
import { type Book } from '@/types/book';

export default function BookCard({ book, height = 'h-72', width = 'w-58' }: { book: Book; height?: string; width?: string }) {
    const blankImage = useImage(BLANK_BOOK);

    const coverImage = book.cover_image || blankImage;

    return (
        <div className="space-y-1 rounded-md border-1 border-transparent p-2 transition-colors hover:border-white/10">
            <img className={`${height} ${width} rounded-sm object-cover`} src={coverImage} alt={book.title} loading="lazy" />
            <h3 className="text-md line-clamp-1 w-40 truncate font-bold" title={book.title}>
                {book.title}
            </h3>
            <p className="text-sm text-gray-500">{book.author?.name}</p>
        </div>
    );
}
